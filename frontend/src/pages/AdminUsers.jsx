import { useState, useEffect } from 'react';
import api from '../services/api';
import { LuUsersRound } from "react-icons/lu";
const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users', { params: { search } });
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => u.role !== 'admin');

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-4xl font-bold text-[#f1f7fa] mb-1">Users</h2>
          <p className="text-[#8295a1] text-base">Manage registered users</p>
        </div>
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#050e17] border border-[#172936] rounded-lg text-[#f1f7fa] placeholder-[#8295a1] focus:outline-none focus:border-[#00aeef] focus:bg-[#071521] transition-all text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00aeef]"></div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-[#08131d] border border-[#172936] rounded-2xl p-12  flex flex-col justify-center items-center gap-10">
          <span className="text-4xl"><LuUsersRound size={40}/></span>
          <p className="text-[#8295a1] text-base">No users found</p>
        </div>
      ) : (
        <div className="bg-[#08131d] border border-[#172936] rounded-2xl overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#172936]">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#8295a1]">Name</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#8295a1]">Email</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#8295a1]">Registered</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#8295a1]">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-[#172936]/50 hover:bg-[#050e17] transition-colors">
                    <td className="px-6 py-4 text-[#f1f7fa] font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-[#8295a1]">{user.email}</td>
                    <td className="px-6 py-4 text-[#8295a1] text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        user.quizCompleted
                          ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {user.quizCompleted ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-[#172936]/50">
            {filteredUsers.map((user) => (
              <div key={user._id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-[#f1f7fa] font-medium">{user.name}</div>
                    <div className="text-[#8295a1] text-sm">{user.email}</div>
                  </div>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    user.quizCompleted
                      ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                      : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {user.quizCompleted ? 'Completed' : 'Pending'}
                  </span>
                </div>
                <div className="text-xs text-[#8295a1]">
                  Registered: {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
