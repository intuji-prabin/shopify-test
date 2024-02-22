/**
 * @description Cookie base implementation for toast message
 */

import {Session, createCookieSessionStorage} from '@shopify/remix-oxygen';
import {TOAST_MESSAGE_SECRET} from '~/lib/constants/auth.constent';

export type ToastMessage = {message: string; type: 'success' | 'error'};

export const {commitSession: messageCommitSession, getSession} =
  createCookieSessionStorage({
    cookie: {
      name: '__message',
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secrets: [TOAST_MESSAGE_SECRET],
      secure: true,
    },
  });

export function setSuccessMessage(session: Session, message: string) {
  session.flash('toastMessage', {message, type: 'success'} as ToastMessage);
}

export function setErrorMessage(session: Session, message: string) {
  session.flash('toastMessage', {message, type: 'error'} as ToastMessage);
}

export function getMessageSession(request: Request) {
  const cookie = request.headers.get('cookie');
  return getSession(cookie);
}
