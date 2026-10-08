/**
 * Single import point for pdf-lib.
 *
 * pdf-lib 1.17.1 is stable and widely deployed but no longer actively maintained upstream.
 * Every tool imports from this module, so migrating to a maintained fork
 * (e.g. @cantoo/pdf-lib, API-compatible) is a one-file change.
 */
export {
  PDFArray,
  PDFBool,
  PDFDict,
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFObject,
  PDFRawStream,
  PDFRef,
  PDFStream,
  PDFContext,
  EncryptedPDFError,
  degrees,
} from 'pdf-lib';
