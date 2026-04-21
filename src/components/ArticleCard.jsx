import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, Trash2, Send, Clock, CheckCircle, Edit3 } from 'lucide-react';

const ArticleCard = ({ article, onPublish, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isOwner = user && (String(article.createdBy._id) === String(user.id) || String(article.createdBy) === String(user.id));
  const isAdmin = user?.role === 'admin';
  const isEditor = user?.role === 'editor';

  // Permission Logic
  const canPublish = article.status === 'draft' && (isAdmin || (isEditor && isOwner));
  const canDelete = isAdmin || (isEditor && isOwner);
  const canEdit = isAdmin || (isEditor && isOwner);

  // Extract text from HTML content and create excerpt
  const getExcerpt = (htmlContent) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    const words = text.split(' ');
    if (words.length <= 30) return text;
    return words.slice(0, 30).join(' ') + '...';
  };

  const handleCardClick = () => {
    navigate(`/article/${article._id}`);
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  return (
    <div 
      className="glass group p-5 rounded-xl border border-zinc-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
          article.status === 'published' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-amber-100 text-amber-700'
        }`}>
          {article.status === 'published' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
          {article.status}
        </span>
        <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-medium uppercase">
          <Calendar className="w-3 h-3" />
          {new Date(article.createdAt).toLocaleDateString()}
        </div>
      </div>

      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
        {article.title}
      </h3>
      
      <p className="text-zinc-500 text-sm mb-4 line-clamp-3 flex-grow leading-relaxed">
        {getExcerpt(article.content)}
      </p>

      <div className="pt-3 border-t border-zinc-100 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-text-primary">{article.createdBy.name || 'Author'}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {canEdit && onEdit && (
            <button 
              onClick={(e) => handleActionClick(e, () => onEdit(article))}
              className="p-1.5 rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-all"
              title="Edit"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
          {canPublish && (
            <button 
              onClick={(e) => handleActionClick(e, () => onPublish(article._id))}
              className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
              title="Publish"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          )}
          {canDelete && (
            <button 
              onClick={(e) => handleActionClick(e, () => onDelete(article._id))}
              className="p-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger hover:text-white transition-all"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
