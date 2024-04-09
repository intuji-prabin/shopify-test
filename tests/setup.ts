import {afterEach} from 'vitest';
import {cleanup} from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import {JSDOM} from 'jsdom';

afterEach(() => {
  cleanup();
});

// Workaround: For some reason FormData is not set to jsdom's by default
const jsdom = new JSDOM(`<!doctype html>`);
const {FormData} = jsdom.window;
window.FormData = FormData;
global.FormData = FormData;
