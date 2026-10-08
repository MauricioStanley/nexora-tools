import { exposeTask } from '@/lib/workers/expose';
import { inspectBuffers, type InspectPayload, type PdfInspection } from './inspect-core';

exposeTask<InspectPayload, PdfInspection[]>(async (payload) => ({
  result: await inspectBuffers(payload.files),
}));
