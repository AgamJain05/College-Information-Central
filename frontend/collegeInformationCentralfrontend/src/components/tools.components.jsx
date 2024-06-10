import Header from '@editorjs/header';
import LinkTool from '@editorjs/link';
import Quote from '@editorjs/quote';
import raw from "@editorjs/raw";
import ImageTool from '@editorjs/image';
import SimpleImage from "@editorjs/simple-image";
import List from "@editorjs/list";

const fetchLinkData = (url) => {
    return new Promise((resolve, reject) => {
        // Fetch the link data from the server
        // This is just a placeholder, replace it with your actual code
        fetch(url)
            .then(response => response.json())
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
};
const Tools = {
    header: {
        class: Header,
        config: {
          placeholder: 'Enter a header',
          levels: [2, 3, 4],
          defaultLevel: 3
        }
      },
      linkTool: {
        class: LinkTool,
        config: {
          fetch: fetchLinkData, // Your backend endpoint for url data fetching,
        }
      },
    list: {
      class: List,
      inlineToolbar: true,
      config: {
        defaultStyle: 'unordered'
      },
      quote: {
        class: Quote,
        inlineToolbar: true,
        shortcut: 'CMD+SHIFT+O',
        config: {
          quotePlaceholder: 'Enter a quote',
          captionPlaceholder: 'Quote\'s author',
        },
      },
    raw: raw,
    image: {
        class: ImageTool,
        config: {
          endpoints: { // Your backend file uploader endpoint
             // Your endpoint that provides uploading by Url
          }
        }
      }
}
}
export default Tools;