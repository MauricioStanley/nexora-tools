import { exposeTask } from '@/lib/workers/expose';
import { removePdfPages, type RemovePagesPayload, type RemovePagesResult } from './logic';

exposeTask<RemovePagesPayload, RemovePagesResult>(async (payload, ctx) => {
  const result = await removePdfPages(payload, (value) => ctx.progress(value));
  return { result, transfer: [result.bytes.buffer as ArrayBuffer] };
});
