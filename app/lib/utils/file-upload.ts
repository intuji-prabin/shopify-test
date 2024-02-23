import {ENDPOINT} from '~/lib/constants/endpoint.constant';

type ImageUploadResponse = {
  status: boolean;
  message: string;
  payload: {
    image_url: string;
  }[];
};

type FileUploadParams = {
  file: File;
  customerId: string;
};

export async function fileUpload({file, customerId}: FileUploadParams) {
  const formData = new FormData();

  const formatCustomerId = customerId.split('/').pop();

  formData.append('image', file);

  const url = `${ENDPOINT.FILE.POST}/${formatCustomerId}`;

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  const results = (await response.json()) as ImageUploadResponse;

  return results;
}
