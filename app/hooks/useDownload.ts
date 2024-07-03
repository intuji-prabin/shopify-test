import {displayToast} from '~/components/ui/toast';

type CustomHeaders = HeadersInit & {
  callEncrypted?: string;
};
export function useDownload() {
  const handleDownload = async ({
    url,
    headers,
  }: {
    url: string;
    headers?: CustomHeaders;
  }) => {
    try {
      headers && (headers.callEncrypted = 'true');
      const response = await fetch(url, {headers});

      if (!response.ok) {
        const responseData = (await response.json()) as any;
        throw new Error(`${responseData?.message}`);
      }

      const contentDisposition = response.headers.get('Content-Disposition');
      const matches = contentDisposition?.match(/filename=(.*)/);
      const suggestedFilename = matches ? matches[1] : 'downloaded-file';

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
      } else {
        throw new Error('No access');
      }
    } catch (error) {
      let message = 'Failed to download the file';
      if (error instanceof Error) {
        message = error.message;
      }
      displayToast({message, type: 'error'});
    }
  };
  return {handleDownload};
}

function isBlob(obj: any) {
  return obj instanceof Blob;
}
