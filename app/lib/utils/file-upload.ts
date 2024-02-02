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
  formData.append('image', file);
  formData.append('owner_id', customerId);

  const response = await fetch(ENDPOINT.FILE.POST, {
    method: 'POST',
    body: formData,
  });

  const results = (await response.json()) as ImageUploadResponse;

  return results;
}
