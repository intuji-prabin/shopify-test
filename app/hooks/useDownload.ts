import {useState} from 'react';
import {displayToast} from '~/components/ui/toast';
import {
  DOWNLOAD_ERROR_MSG,
  NO_ACCESS_MSG,
  DOWNLOAD_SUCCESS_MSG,
} from '~/lib/constants/downloadMessage.constants';

type CustomHeaders = HeadersInit & {
  callEncrypted?: string;
};
export function useDownload() {
  const [loading, setLoading] = useState(false);

  const handleDownload = async ({
    url,
    headers,
  }: {
    url: string;
    headers?: CustomHeaders;
  }) => {
    try {
      setLoading(true);
      headers && (headers.callEncrypted = 'true');
      const response = await fetch(url, {headers});

      if (!response.ok) {
        const responseData = (await response.json()) as any;
        throw new Error(`${responseData?.message}`);
      }

      const contentDisposition = response.headers.get('Content-Disposition');
      const matches = contentDisposition?.match(/filename=(.*)/);
      const suggestedFilename = matches
        ? matches[1]
        : url.split('/').pop() ?? 'download-file';

      const blob = await response.blob();
      if (isBlob(blob) && blob.size > 0) {
        const _url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');

        a.href = _url;

        /**
         * Removing quotes "" from the filename as Chrome also appends
           them as &quot; in the filename
         */
        a.download = suggestedFilename.replace(/['"]+/g, '');

        a.style.display = 'none';

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        window.URL.revokeObjectURL(_url);
        displayToast({message: DOWNLOAD_SUCCESS_MSG, type: 'success'});
      } else {
        throw new Error(NO_ACCESS_MSG);
      }
    } catch (error) {
      let message = DOWNLOAD_ERROR_MSG;
      if (error instanceof Error) {
        message = error.message;
      }
      displayToast({message, type: 'error'});
    } finally {
      setLoading(false);
    }
  };
  return {handleDownload, loading};
}

function isBlob(obj: any) {
  return obj instanceof Blob;
}
