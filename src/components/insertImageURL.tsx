interface QuillRef {
  current: {
    getEditor: () => {
      getSelection: () => { index: number };
      insertEmbed: (index: number, type: string, url: string) => void;
    };
  };
}

const insertImageURL = async (quillRef: QuillRef) => {
  const url = prompt('Enter the image URL');
  if (url) {
    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (data.imageUrl) {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', data.imageUrl);
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    }
  } else {
    alert('No URL entered');
  }
};
