import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {getAccessToken, isImpersonating} from './auth-session.server';
import {AppLoadContext} from '@remix-run/server-runtime';

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
  context: AppLoadContext;
  request: Request;
};

export async function fileUpload({
  context,
  request,
  file,
  customerId,
}: FileUploadParams) {
  const formData = new FormData();

  const formatCustomerId = customerId.split('/').pop();

  formData.append('image', file);

  const url = `${ENDPOINT.FILE.POST}/${formatCustomerId}`;
  const accessTocken = (await getAccessToken(context)) as string;
  const isImpersonatingCheck = await isImpersonating(request);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: accessTocken,
      'Impersonate-Enable': isImpersonatingCheck,
    },
  });

  const results = (await response.json()) as ImageUploadResponse;

  return results;
}
