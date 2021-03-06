import epub from 'epubjs'
import { RenditionOptions } from 'epubjs/types/rendition';

export default function (url: string) {
    const renderArea = document.getElementById('book-render-area');
    if (renderArea) {
        const book = epub(url);
        const renditionOptions: RenditionOptions = {
            manager: "continuous",
            flow: "scrolled",
            width: '100%',
            height: '100%'
        }
        const rendition = book.renderTo(renderArea, renditionOptions);
        const displayed = rendition.display();
    } else {
        throw (`Error! Render area is null!`);
    }
}

