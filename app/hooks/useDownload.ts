import {displayToast} from '~/components/ui/toast';

export function useDownload() {
  const handleDownload = async ({
    url,
    headers,
  }: {
    url: string;
    headers?: HeadersInit;
  }) => {
    try {
      const response = await fetch(url, {headers});

      if (!response.ok) {
        throw new Error(`Failed to fetch the file. Status: ${response.status}`);
      }

      const contentDisposition = response.headers.get('Content-Disposition');
      const matches = contentDisposition?.match(/filename=(.*)/);
      const suggestedFilename = matches ? matches[1] : 'downloaded-file';

      const blob = await response.blob();

      if (blob) {
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
      }
    } catch (error) {
      if (error instanceof Error) {
        displayToast({message: error.message, type: 'error'});
      }
      displayToast({message: 'Failed to download the file', type: 'error'});
    }
  };
  return {handleDownload};
}
