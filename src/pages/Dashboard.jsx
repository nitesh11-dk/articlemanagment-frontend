import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, Info, FileText, User, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { user, API_URL } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/articles`);
      // Filter to show only published articles on homepage
      setArticles(res.data.data.filter(article => article.status === 'published'));
    } catch (err) {
      console.error('Failed to fetch articles', err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Filter articles based on search term (client-side only, no API call)
  const searchTerm = searchParams.get('search') || '';
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        article.title?.toLowerCase().includes(searchLower) ||
        article.content?.toLowerCase().includes(searchLower)
      );
    });
  }, [articles, searchTerm]);

  const getExcerpt = (htmlContent) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    const words = text.split(' ');
    if (words.length <= 30) return text;
    return words.slice(0, 30).join(' ') + '...';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight mb-2">Published Articles</h1>
        
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-400 gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="font-medium">Loading articles...</p>
        </div>
      ) : filteredArticles.length > 0 ? (
        <div className="space-y-3">
          {filteredArticles.map(article => (
            <div
              key={article._id}
              onClick={() => navigate(`/article/${article._id}`)}
              className="glass rounded-xl border border-zinc-200 p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-text-primary mb-1 hover:text-primary transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-zinc-500 text-sm mb-2 line-clamp-1">
                    {getExcerpt(article.content)}
                  </p>
                  <div className="flex items-center gap-6 text-xs text-zinc-500">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5" />
                      <span>{article.createdBy?.name || 'Author'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <FileText className="w-10 h-10 text-zinc-300 flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-zinc-300" />
          </div>
          <h2 className="text-xl font-bold text-zinc-400 mb-1">No published articles</h2>
          <p className="text-sm text-zinc-400">Check back later for new content.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
