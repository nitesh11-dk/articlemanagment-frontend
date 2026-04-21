import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, UserPlus, Shield, ShieldAlert, Loader2, Search, Edit3, Trash2 } from 'lucide-react';

const UsersPage = () => {
  const { user, API_URL } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [changingRole, setChangingRole] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/users`);
      setUsers(res.data.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [API_URL]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      setChangingRole(userId);
      await axios.patch(`${API_URL}/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      console.error('Failed to update role', err);
      alert(err.response?.data?.message || 'Failed to update role');
    } finally {
      setChangingRole(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8 glass rounded-3xl border border-red-200">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
          <p className="text-gray-600">Only administrators can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight mb-2">User Management</h1>
          <p className="text-text-secondary flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Manage permissions and account roles
          </p>
        </div>
      </div>

      <div className="glass rounded-3xl overflow-hidden border border-zinc-200 shadow-xl bg-white/50 backdrop-blur-xl">
        <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row gap-4 justify-between bg-zinc-50/50">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input 
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-12 pr-4 rounded-xl bg-white border border-zinc-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold text-text-secondary px-2">
            <Users className="w-4 h-4" />
            {filteredUsers.length} Users Total
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 text-text-secondary text-xs uppercase tracking-wider font-bold">
                <th className="px-8 py-4">User</th>
                <th className="px-8 py-4">Current Role</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-8 py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary mb-4" />
                    <p className="text-zinc-400 font-medium">Retrieving user directory...</p>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map(u => (
                  <tr key={u._id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 font-bold">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-text-primary text-base">{u.name} {u._id === user.id && <span className="text-primary text-[10px] ml-1">(You)</span>}</p>
                          <p className="text-xs text-text-secondary">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-zinc-100 text-zinc-500'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {u._id !== user.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <select 
                            value={u.role}
                            disabled={changingRole === u._id}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            className="bg-white border border-zinc-200 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                          >
                            <option value="editor">Set as Editor</option>
                            <option value="admin">Set as Admin</option>
                          </select>
                          {changingRole === u._id && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                        </div>
                      ) : (
                        <span className="text-xs italic text-text-secondary">Self management disabled</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-8 py-20 text-center text-zinc-400">
                    No users found matching your search.
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

export default UsersPage;
