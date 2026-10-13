import { exposeTask } from '@/lib/workers/expose';
import { watermarkPdf, type WatermarkPayload, type WatermarkResult } from './logic';

exposeTask<WatermarkPayload, WatermarkResult>(async (payload, ctx) => {
  const result = await watermarkPdf(payload, (value) => ctx.progress(value));
  return { result, transfer: [result.bytes.buffer as ArrayBuffer] };
});
