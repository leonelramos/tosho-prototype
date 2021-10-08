import { BrowserWindow, contextBridge, dialog, ipcRenderer } from 'electron';
import path from 'path';
import { isDevelopment } from '@/shared/scripts/environment-variables';
import renderBook from '@/preload/scripts/book/renderers/book-renderer'
import { importBooksAsync } from '@/preload/scripts/book/library-loader';

window.onload = init;

function init() {
	console.log("app preload")
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
	rendererPath: path.resolve(__dirname, 'renderer')
});

contextBridge.exposeInMainWorld('envApi', {
	isDevelopment: isDevelopment
});

contextBridge.exposeInMainWorld('bookApi', {
	render(url: string) {
		renderBook(url);
	},
	async importFolder(url: string) {
		return await importBooksAsync(url);
	}
});

contextBridge.exposeInMainWorld('systemApi', {
	async getDialogFolderUrl() {
		return await ipcRenderer.invoke('show-dialog-folder');
	}
});



