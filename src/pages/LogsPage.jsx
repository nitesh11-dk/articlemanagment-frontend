import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, History, AlertCircle, Clock, Tag, FileText, User as UserIcon } from 'lucide-react';

const LogsPage = () => {
  const { API_URL, user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/logs`);
        // Filter logs: Editor sees only their own, Admin sees all
        if (user.role === 'editor') {
          setLogs(res.data.data.filter(log => log.userId?._id === user.id));
        } else {
          setLogs(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch logs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [API_URL, user.id, user.role]);

  const getActionStyles = (action) => {
    switch (action) {
      case 'CREATE_ARTICLE': return 'bg-emerald-100 text-emerald-700';
      case 'PUBLISH_ARTICLE': return 'bg-sky-100 text-sky-700';
      case 'DELETE_ARTICLE': return 'bg-rose-100 text-rose-700';
      default: return 'bg-zinc-100 text-zinc-700';
    }
  };

  if (user.role === 'viewer') {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertCircle className="w-16 h-16 text-danger mb-4" />
        <h2 className="text-2xl font-bold text-text-primary">Access Denied</h2>
        <p className="text-text-secondary max-w-sm">You do not have permission to view the system audit logs.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-text-primary mb-2 flex items-center gap-3">
          <History className="w-8 h-8 text-primary" />
          Audit Log History
        </h1>
      </div>

      <div className="glass rounded-3xl border border-zinc-200 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Action Type</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Performed By</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Entity (Article)</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-24 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                    <span className="text-sm font-medium text-zinc-400">Loading audit records...</span>
                  </td>
                </tr>
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getActionStyles(log.action)}`}>
                        {log.action.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-text-primary">{log.userId?.name}</span>
                          <span className="text-[10px] text-zinc-400 font-medium uppercase">{log.userId?.role}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-zinc-500">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm font-medium italic">{log.articleId?.title || 'System Resource'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-24 text-center text-zinc-400 italic">
                    No activity logs recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LogsPage;
