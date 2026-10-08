import { useEffect, useState } from 'react';
import type { InputFileTypeId } from '@/lib/files/types';
import { Icon } from './Icon';

/** Skip thumbnails for very large images: decoding them just for a 44px preview wastes memory. */
const MAX_PREVIEW_BYTES = 12 * 1024 * 1024;

interface FilePreviewProps {
  file: File;
  type: InputFileTypeId;
}

/** Thumbnail for images, icon for documents. Object URLs are revoked on unmount. */
export function FilePreview({ file, type }: FilePreviewProps) {
  const [url, setUrl] = useState<string | null>(null);
  const isImage = type !== 'pdf';

  useEffect(() => {
    if (!isImage || file.size > MAX_PREVIEW_BYTES) return;
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
      setUrl(null);
    };
  }, [file, isImage]);

  if (url) return <img src={url} alt="" loading="lazy" decoding="async" width={44} height={44} />;
  return <Icon name={isImage ? 'image' : 'file-pdf'} />;
}
