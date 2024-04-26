import { pdfjs } from 'react-pdf';
 pdfjs.GlobalWorkerOptions.workerSrc = new URL(  'pdfjs-dist/legacy/build/pdf.worker.min.js',
   import.meta.url,
 ).toString