import { exposeTask } from '@/lib/workers/expose';
import { addPageNumbers, type PageNumbersPayload, type PageNumbersResult } from './logic';

exposeTask<PageNumbersPayload, PageNumbersResult>(async (payload, ctx) => {
  const result = await addPageNumbers(payload, (value) => ctx.progress(value));
  return { result, transfer: [result.bytes.buffer as ArrayBuffer] };
});
