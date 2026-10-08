import { exposeTask } from '@/lib/workers/expose';
import { imagesToPdf, type ImagesToPdfPayload, type ImagesToPdfResult } from './logic';

exposeTask<ImagesToPdfPayload, ImagesToPdfResult>(async (payload, ctx) => {
  const result = await imagesToPdf(payload, (value) => ctx.progress(value));
  return { result, transfer: [result.bytes.buffer as ArrayBuffer] };
});
