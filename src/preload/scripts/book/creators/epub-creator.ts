import { BookInfo, BookModel } from "@/shared/models/book";
import { BookCreator } from "@/preload/scripts/book/creators/book-creator-interface";
import { FPEpubModule } from "@/preload/scripts/book/epub/modules/futurepress-epub-module";
import { FileInfo } from "@/shared/models/file";
import path from "path";
import { FileTypes } from "@/preload/scripts/book/file-types-enum";

export class EpubCreator implements BookCreator {
	async createBookAsync(url: string): Promise<BookModel> {
		const epubModule = new FPEpubModule();
		await epubModule.initAsync(url);

		const metadata = epubModule.getMetadata();

		const bookInfo: BookInfo = {
			isbn: metadata.id,
			title: metadata.title,
			author: metadata.creator ? metadata.creator : "",
			description: metadata.description ? metadata.description : "",
			publishedDate: metadata.publishedDate ? metadata.publishedDate : ""
		}
		const fileInfo: FileInfo = {
			url: url,
			name: path.basename(url),
			type: "epub",
			ext: FileTypes.EPUB,
			dateCreated: "",
			size: ""
		}
		return new BookModel(metadata.id, epubModule.getCoverUrl(), epubModule.getCoverRelativePath(), bookInfo, fileInfo);
	}
}


