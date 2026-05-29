import type { ModelStatus, ProgressInfo } from '../lib/useFilter';

interface Props {
  status: ModelStatus;
  device: 'webgpu' | 'wasm' | null;
  progress: Map<string, ProgressInfo>;
}

function formatBytes(n?: number): string {
  if (n == null) return '';
  if (n < 1024) return `${n}B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)}KB`;
  return `${(n / 1024 / 1024).toFixed(1)}MB`;
}

export function StatusPill({ status, device, progress }: Props) {
  let dotClass = 'bg-[color:var(--color-text-dim)]';
  let label = 'Idle';
  let detail = '';

  const downloadEntries = Array.from(progress.values()).filter((p) => p.status === 'progress' && p.progress != null);
  const totalProgress = downloadEntries.length
    ? downloadEntries.reduce((acc, p) => acc + (p.progress ?? 0), 0) / downloadEntries.length
    : null;

  if (status === 'loading') {
    dotClass = 'bg-amber-400 animate-pulse';
    label = totalProgress != null ? `Loading model · ${totalProgress.toFixed(0)}%` : 'Loading model';
    const latest = downloadEntries[downloadEntries.length - 1];
    if (latest?.loaded) detail = `${formatBytes(latest.loaded)}${latest.total ? ` / ${formatBytes(latest.total)}` : ''}`;
  } else if (status === 'ready') {
    dotClass = 'bg-[color:var(--color-accent)]';
    label = 'Ready';
    detail = device === 'webgpu' ? 'WebGPU · q4f16' : 'WASM · q4';
  } else if (status === 'inferring') {
    dotClass = 'bg-[color:var(--color-accent)] animate-pulse';
    label = 'Analyzing';
    detail = device === 'webgpu' ? 'WebGPU' : 'WASM';
  } else if (status === 'error') {
    dotClass = 'bg-red-500';
    label = 'Error';
  }

  return (
    <div className="inline-flex items-center gap-2.5 h-8 px-3 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]">
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      <span className="font-mono text-[11px] text-[color:var(--color-text)]">{label}</span>
      {detail && <span className="font-mono text-[10.5px] text-[color:var(--color-text-muted)]">· {detail}</span>}
    </div>
  );
}
