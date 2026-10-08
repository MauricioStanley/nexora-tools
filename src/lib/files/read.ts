/** Read a Blob/File fully into memory. */
export async function readBytes(blob: Blob): Promise<Uint8Array> {
  return new Uint8Array(await blob.arrayBuffer());
}

/** Yield to the event loop so the UI can paint between heavy steps. */
export function yieldToMain(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Copy a Uint8Array into a standalone ArrayBuffer (safe to transfer to a worker).
 * `Blob.arrayBuffer()` already returns a fresh buffer, so this is only needed for views.
 */
export function toTransferable(bytes: Uint8Array): ArrayBuffer {
  if (bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength && bytes.buffer instanceof ArrayBuffer) {
    return bytes.buffer;
  }
  return bytes.slice().buffer as ArrayBuffer;
}

/** Wrap bytes as a Blob. */
export function bytesToBlob(bytes: Uint8Array, type: string): Blob {
  return new Blob([bytes as Uint8Array<ArrayBuffer>], { type });
}
