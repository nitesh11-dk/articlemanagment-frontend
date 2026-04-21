import React, { useState, useEffect } from 'react';
import { X, Save, FileText, Bold, Italic } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const ArticleModal = ({ isOpen, onClose, onSubmit, loading, editingArticle }) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('draft');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: true,
        italic: true,
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        code: false,
        strike: false,
        horizontalRule: false,
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[200px] max-h-[400px] overflow-y-auto',
      },
    },
  });

  useEffect(() => {
    if (editingArticle) {
      setTitle(editingArticle.title);
      setStatus(editingArticle.status || 'draft');
      editor?.commands.setContent(editingArticle.content || '');
    } else {
      setTitle('');
      setStatus('draft');
      editor?.commands.setContent('');
    }
  }, [editingArticle, editor, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      content: editor?.getHTML() || '',
      status,
    });
    setTitle('');
    setStatus('draft');
    editor?.commands.setContent('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="glass w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-scale-up">
        <div className="px-6 py-4 flex items-center justify-between border-b border-border">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {editingArticle ? 'Edit Article' : 'Create New Article'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-text-secondary ml-1">Article Title</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-zinc-400" />
              <input 
                autoFocus
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="Enter a compelling title..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-text-secondary ml-1">Content</label>
            <div className="border border-border rounded-xl overflow-hidden bg-white">
              <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-zinc-50">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`p-2 rounded hover:bg-zinc-200 transition-colors ${editor?.isActive('bold') ? 'bg-zinc-200' : ''}`}
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded hover:bg-zinc-200 transition-colors ${editor?.isActive('italic') ? 'bg-zinc-200' : ''}`}
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
              </div>
              <EditorContent editor={editor} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-text-secondary ml-1">Status</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm font-medium">Draft</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={status === 'published'}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm font-medium">Published</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-border font-bold hover:bg-zinc-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all flex items-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {status === 'published' ? 'Publish Article' : 'Save Draft'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleModal;
