import { exposeTask } from '@/lib/workers/expose';
import { splitPdf, type SplitPayload, type SplitResult } from './logic';

exposeTask<SplitPayload, SplitResult>(async (payload, ctx) => {
  const result = await splitPdf(payload, (value) => ctx.progress(value));
  const transfer: Transferable[] = result.files.map((f) => f.bytes.buffer as ArrayBuffer);
  if (result.zip) transfer.push(result.zip.buffer as ArrayBuffer);
  return { result, transfer };
});
