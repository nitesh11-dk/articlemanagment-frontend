import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, ArrowLeft, Loader2 } from 'lucide-react';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { API_URL } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/articles/${id}`);
        setArticle(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, API_URL]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">{error || 'Article not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:underline"
          >
            Go back to articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to articles
        </button>

        <article className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-6 text-sm text-zinc-500 mb-8 pb-8 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{article.createdBy.name || 'Author'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(article.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div 
            className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-text-primary prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-zinc-600"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </div>
    </div>
  );
};

export default ArticleDetail;
