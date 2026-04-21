import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ArticleModal from '../components/ArticleModal';
import { Loader2, Info, FileText, ShieldAlert, Edit3, Trash2, Send, Clock, CheckCircle, User } from 'lucide-react';

const AdminArticles = () => {
  const { user, API_URL } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/articles`);
      // Admin sees all articles
      setArticles(res.data.data);
    } catch (err) {
      console.error('Failed to fetch articles', err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleEditArticle = async (formData) => {
    try {
      setSubmitting(true);
      if (editingArticle) {
        await axios.put(`${API_URL}/articles/${editingArticle._id}`, formData);
      }
      setModalOpen(false);
      setEditingArticle(null);
      fetchArticles();
    } catch (err) {
      console.error('Failed to save article', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      await axios.patch(`${API_URL}/articles/${id}/publish`);
      fetchArticles();
    } catch (err) {
      console.error('Failed to publish article', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await axios.delete(`${API_URL}/articles/${id}`);
        fetchArticles();
      } catch (err) {
        console.error('Failed to delete article', err);
      }
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingArticle(null);
  };

  const getExcerpt = (htmlContent) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    const words = text.split(' ');
    if (words.length <= 30) return text;
    return words.slice(0, 30).join(' ') + '...';
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ShieldAlert className="w-16 h-16 text-danger mb-4" />
        <h2 className="text-2xl font-bold text-text-primary">Access Denied</h2>
        <p className="text-text-secondary max-w-sm">Only Admins can access this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight mb-2">Manage All Articles</h1>
        <p className="text-text-secondary flex items-center gap-2">
          <Info className="w-4 h-4" />
          View, edit, publish, and delete all articles
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-400 gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="font-medium">Loading articles...</p>
        </div>
      ) : articles.length > 0 ? (
        <div className="glass rounded-2xl border border-zinc-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Title</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Author</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Date</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {articles.map(article => (
                  <tr key={article._id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-text-primary">{article.title}</p>
                        <p className="text-sm text-zinc-500 mt-1">{getExcerpt(article.content)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-text-primary">{article.createdBy?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit ${
                        article.status === 'published' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {article.status === 'published' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-zinc-500 text-sm">
                        <Clock className="w-4 h-4" />
                        {new Date(article.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(article)}
                          className="p-2 rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-all"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {article.status === 'draft' && (
                          <button
                            onClick={() => handlePublish(article._id)}
                            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                            title="Publish"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(article._id)}
                          className="p-2 rounded-lg bg-danger/10 text-danger hover:bg-danger hover:text-white transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-24 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-zinc-300" />
          </div>
          <h2 className="text-xl font-bold text-zinc-400 mb-1">No articles found</h2>
          <p className="text-sm text-zinc-400">No articles have been created yet.</p>
        </div>
      )}

      <ArticleModal 
        isOpen={modalOpen} 
        onClose={handleCloseModal}
        onSubmit={handleEditArticle}
        loading={submitting}
        editingArticle={editingArticle}
      />
    </div>
  );
};

export default AdminArticles;
