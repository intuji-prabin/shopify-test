import {Link, NavLink} from '@remix-run/react';
import React, {useMemo} from 'react';
import {Document, Page} from 'react-pdf';
import {pdfjs} from 'react-pdf';
import {PDF} from '~/lib/constants/pdf.constent';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export function PDFViewer({pdfURL}: {pdfURL: string}) {
  const [width, setWidth] = React.useState<number>();

  const options = useMemo(
    () => ({
      httpHeaders: {
        'x-api-key': PDF.SECRET_KEY,
      },
    }),
    [],
  );

  React.useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.target.clientWidth * 0.95);
      }
    });

    resizeObserver.observe(pdfWrapperRef.current as unknown as Element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const pdfWrapperRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <div className="center" ref={pdfWrapperRef}>
      <Document
        renderMode="canvas"
        loading={<Loading />}
        error={<Loading />}
        file={pdfURL}
        options={options}
      >
        <Page pageNumber={1} width={width || undefined} />
      </Document>
    </div>
  );
}

function Loading() {
  return (
    <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-slate-700 h-10 w-10"></div>
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 bg-slate-700 rounded"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-slate-700 rounded col-span-2"></div>
              <div className="h-2 bg-slate-700 rounded col-span-1"></div>
            </div>
            <div className="h-2 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Error() {
  return (
    <div className="h-60 flex items-center justify-center">
      <div className="text-semantic-danger-500 font-semibold text-xl">
        Opps, Failed to load the PDF
      </div>
    </div>
  );
}
