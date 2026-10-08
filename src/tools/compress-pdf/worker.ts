import { exposeTask } from '@/lib/workers/expose';
import { optimizePdf, type OptimizePayload, type OptimizeResult } from './logic';
import { browserRecoder } from './recoder';

exposeTask<OptimizePayload, OptimizeResult>(async (payload, ctx) => {
  const result = await optimizePdf(payload, browserRecoder, (value, stage, current, total) =>
    ctx.progress(value, stage === 'images' ? `images:${current}:${total}` : 'structure'),
  );
  return { result, transfer: [result.bytes.buffer as ArrayBuffer] };
});
