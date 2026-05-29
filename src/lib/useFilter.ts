import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { normalizeOutput, type Entity } from './entities';

export type ModelStatus = 'idle' | 'loading' | 'ready' | 'inferring' | 'error';

export interface ProgressInfo {
  status?: string;
  name?: string;
  file?: string;
  progress?: number;
  loaded?: number;
  total?: number;
}

export interface FilterState {
  status: ModelStatus;
  device: 'webgpu' | 'wasm' | null;
  progress: Map<string, ProgressInfo>;
  error: string | null;
  entities: Entity[];
  inferenceMs: number | null;
  load: () => void;
  run: (text: string) => Promise<Entity[]>;
  runBatch: (texts: string[]) => Promise<Entity[][]>;
  clear: () => void;
}

let workerSingleton: Worker | null = null;
function getWorker(): Worker {
  if (!workerSingleton) {
    workerSingleton = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
  }
  return workerSingleton;
}

export function useFilter(): FilterState {
  const [status, setStatus] = useState<ModelStatus>('idle');
  const [device, setDevice] = useState<'webgpu' | 'wasm' | null>(null);
  const [progress, setProgress] = useState<Map<string, ProgressInfo>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [inferenceMs, setInferenceMs] = useState<number | null>(null);
  const pending = useRef<Map<string, { resolve: (e: Entity[]) => void; reject: (err: Error) => void; text: string }>>(new Map());
  const pendingBatch = useRef<Map<string, { resolve: (e: Entity[][]) => void; reject: (err: Error) => void; texts: string[] }>>(new Map());

  useEffect(() => {
    const worker = getWorker();
    const onMessage = (e: MessageEvent) => {
      const d = e.data as {
        type: string;
        status?: ModelStatus;
        device?: 'webgpu' | 'wasm';
        progress?: ProgressInfo;
        error?: string;
        id?: string;
        result?: Parameters<typeof normalizeOutput>[0];
        results?: Parameters<typeof normalizeOutput>[0][];
        ms?: number;
      };
      if (d.type === 'status') {
        if (d.status) setStatus(d.status);
        if (d.device) setDevice(d.device);
        if (d.error) setError(d.error);
      } else if (d.type === 'progress' && d.progress) {
        const key = d.progress.file || d.progress.name || 'model';
        setProgress((m) => {
          const next = new Map(m);
          next.set(key, d.progress!);
          return next;
        });
      } else if (d.type === 'result' && d.id && d.result) {
        const job = pending.current.get(d.id);
        if (job) {
          const ents = normalizeOutput(d.result, job.text);
          setEntities(ents);
          setInferenceMs(d.ms ?? null);
          job.resolve(ents);
          pending.current.delete(d.id);
        }
      } else if (d.type === 'batchResult' && d.id && d.results) {
        const job = pendingBatch.current.get(d.id);
        if (job) {
          const ents = d.results.map((raw, i) => normalizeOutput(raw, job.texts[i] ?? ''));
          job.resolve(ents);
          pendingBatch.current.delete(d.id);
        }
      } else if (d.type === 'error' && d.id) {
        const job = pending.current.get(d.id);
        if (job) {
          job.reject(new Error(d.error || 'Inference failed'));
          pending.current.delete(d.id);
        }
        const batchJob = pendingBatch.current.get(d.id);
        if (batchJob) {
          batchJob.reject(new Error(d.error || 'Inference failed'));
          pendingBatch.current.delete(d.id);
        }
        setError(d.error || 'Inference failed');
      }
    };
    worker.addEventListener('message', onMessage);
    return () => worker.removeEventListener('message', onMessage);
  }, []);

  const load = useCallback(() => {
    getWorker().postMessage({ type: 'load' });
  }, []);

  const run = useCallback((text: string) => {
    return new Promise<Entity[]>((resolve, reject) => {
      const id = Math.random().toString(36).slice(2);
      pending.current.set(id, { resolve, reject, text });
      getWorker().postMessage({ type: 'infer', id, text });
    });
  }, []);

  const runBatch = useCallback((texts: string[]) => {
    return new Promise<Entity[][]>((resolve, reject) => {
      const id = Math.random().toString(36).slice(2);
      pendingBatch.current.set(id, { resolve, reject, texts });
      getWorker().postMessage({ type: 'inferBatch', id, texts });
    });
  }, []);

  const clear = useCallback(() => {
    setEntities([]);
    setInferenceMs(null);
  }, []);

  return useMemo(
    () => ({ status, device, progress, error, entities, inferenceMs, load, run, runBatch, clear }),
    [status, device, progress, error, entities, inferenceMs, load, run, runBatch, clear],
  );
}
