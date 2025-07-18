import React, { useState, useRef, useImperativeHandle, forwardRef, useCallback, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface EditorProps {
  value?: string;
  onChange?: (content: string, delta: any, source: any, editor: any) => void;
}

interface EditorRef {
  getEditorContent: () => string;
}

const CustomToolbar = () => (
  <div id="toolbar">
    <select className="ql-header" defaultValue="" onChange={(e) => e.persist()}>
      <option value="1"></option>
      <option value="2"></option>
      <option value=""></option>
    </select>
    <button className="ql-bold"></button>
    <button className="ql-italic"></button>
    <button className="ql-underline"></button>
    <button className="ql-strike"></button>
    <button className="ql-blockquote"></button>
    <button className="ql-link"></button>
    <button className="ql-image"></button>
    <button className="ql-video"></button>
    <button className="ql-insertImageURL">URL</button>
  </div>
);

const Editor = forwardRef<EditorRef, EditorProps>((props, ref) => {
  const [editorHtml, setEditorHtml] = useState(props.value || '');
  const quillRef = useRef<ReactQuill>(null);

  useImperativeHandle(ref, () => ({
    getEditorContent: () => quillRef.current?.getEditor().getText() || '',
  }));

  const insertImageURL = useCallback(() => {
    const url = prompt('Enter the image URL');
    if (url && quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      if (range) {
        quill.insertEmbed(range.index, 'image', url);
      }
    }
  }, []);

  const modules = {
    toolbar: {
      container: "#toolbar",
      handlers: {
        'insertImageURL': insertImageURL,
      },
    },
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

  const handleChange = (content: string, delta: any, source: any, editor: any) => {
    setEditorHtml(content);
    if (props.onChange) {
      props.onChange(content, delta, source, editor);
    }
  };

  useEffect(() => {
    if (!quillRef.current) return;
    const quill = quillRef.current.getEditor();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        }
      });
    });

    observer.observe(quill.root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div>
      <CustomToolbar />
      <ReactQuill
        ref={quillRef}
        value={editorHtml}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        style={{ height: '400px' }}
        {...props}
      />
    </div>
  );
});

Editor.displayName = 'Editor';

export default Editor;
