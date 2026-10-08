import { exposeTask } from '@/lib/workers/expose';
import { mergePdfs, type MergePayload, type MergeResult } from './logic';

exposeTask<MergePayload, MergeResult>(async (payload, ctx) => {
  const result = await mergePdfs(payload, (value) => ctx.progress(value));
  return { result, transfer: [result.bytes.buffer as ArrayBuffer] };
});
