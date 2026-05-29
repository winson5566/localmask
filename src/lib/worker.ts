/// <reference lib="webworker" />
import { pipeline, env, type TokenClassificationPipeline } from '@huggingface/transformers';

// Allow remote model fetch; cache locally via Cache API.
env.allowLocalModels = false;
env.useBrowserCache = true;

type Status = 'idle' | 'loading' | 'ready' | 'inferring' | 'error';

let classifier: TokenClassificationPipeline | null = null;
let status: Status = 'idle';
let device: 'webgpu' | 'wasm' = 'wasm';

function post(msg: unknown) {
  (self as unknown as Worker).postMessage(msg);
}

async function detectDevice(): Promise<'webgpu' | 'wasm'> {
  const nav = (self as unknown as { navigator?: { gpu?: unknown } }).navigator;
  if (nav && 'gpu' in nav && nav.gpu) return 'webgpu';
  return 'wasm';
}

async function load() {
  if (classifier || status === 'loading') return;
  status = 'loading';
  device = await detectDevice();
  post({ type: 'status', status, device });
  try {
    classifier = (await pipeline('token-classification', 'openai/privacy-filter', {
      device,
      dtype: device === 'webgpu' ? 'q4f16' : 'q4',
      progress_callback: (p: unknown) => {
        const prog = p as { status?: string; name?: string; file?: string; progress?: number; loaded?: number; total?: number };
        post({ type: 'progress', progress: prog });
      },
    })) as TokenClassificationPipeline;
    status = 'ready';
    post({ type: 'status', status, device });
  } catch (err) {
    status = 'error';
    post({ type: 'status', status, device, error: (err as Error).message });
  }
}

async function infer(id: string, text: string) {
  if (!classifier) {
    await load();
  }
  if (!classifier) {
    post({ type: 'error', id, error: 'Model failed to load.' });
    return;
  }
  status = 'inferring';
  post({ type: 'status', status, device });
  try {
    const t0 = performance.now();
    const result = await classifier(text, { aggregation_strategy: 'simple' });
    const dt = performance.now() - t0;
    post({ type: 'result', id, result, ms: Math.round(dt) });
  } catch (err) {
    post({ type: 'error', id, error: (err as Error).message });
  } finally {
    status = 'ready';
    post({ type: 'status', status, device });
  }
}

async function inferBatch(id: string, texts: string[]) {
  if (!classifier) {
    await load();
  }
  if (!classifier) {
    post({ type: 'error', id, error: 'Model failed to load.' });
    return;
  }
  status = 'inferring';
  post({ type: 'status', status, device });
  try {
    const t0 = performance.now();
    // Run each segment individually so offsets stay relative to that segment.
    const results: unknown[] = [];
    for (const text of texts) {
      if (!text || !text.trim()) {
        results.push([]);
        continue;
      }
      results.push(await classifier(text, { aggregation_strategy: 'simple' }));
    }
    const dt = performance.now() - t0;
    post({ type: 'batchResult', id, results, ms: Math.round(dt) });
  } catch (err) {
    post({ type: 'error', id, error: (err as Error).message });
  } finally {
    status = 'ready';
    post({ type: 'status', status, device });
  }
}

self.onmessage = (e: MessageEvent) => {
  const data = e.data as { type: string; id?: string; text?: string; texts?: string[] };
  if (data.type === 'load') void load();
  else if (data.type === 'infer' && data.id && data.text != null) void infer(data.id, data.text);
  else if (data.type === 'inferBatch' && data.id && data.texts) void inferBatch(data.id, data.texts);
};
