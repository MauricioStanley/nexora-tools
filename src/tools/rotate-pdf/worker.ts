import { exposeTask } from '@/lib/workers/expose';
import { rotatePdf, type RotatePayload, type RotateResult } from './logic';

exposeTask<RotatePayload, RotateResult>(async (payload, ctx) => {
  const result = await rotatePdf(payload, (value) => ctx.progress(value));
  return { result, transfer: [result.bytes.buffer as ArrayBuffer] };
});
