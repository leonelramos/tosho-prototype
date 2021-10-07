import { contextBridge } from 'electron';
import path from 'path';
import { isDevelopment } from '@/shared/scripts/environment-variables';
import renderBook from '@/preload/scripts/book-renderer'
import { getBooksAsync } from '@/preload/scripts/book-creator';
import { BookModel } from '@/shared/models/BookModel';

window.onload = init;

function init() {
  console.log("reader preload")
  const renderAreaId = 'book-render-area';
  const renderArea = document.createElement('div');
  renderArea.id = renderAreaId;
  document.body.appendChild(renderArea);
};

contextBridge.exposeInMainWorld('pathApi', {
  resolve(url: string, ...pathArgs: string[]) {
    return path.resolve(url, ...pathArgs);
  },
  join(url: string, ...pathArgs: string[]) {
    return path.join(url, ...pathArgs);
  },
  rendererPath: path.resolve(__dirname, '..', 'renderer')
});

contextBridge.exposeInMainWorld('envApi', {
  isDevelopment: isDevelopment
});

contextBridge.exposeInMainWorld('bookApi', {
  render(url: string) {
    renderBook(url);
  },
  async getBooks(url: string) {
    return await getBooksAsync(url);
  }
})


