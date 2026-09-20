import { useState, useEffect } from 'react';
import api from '../services/api';
import { LuUsersRound } from "react-icons/lu";
import { MdOutlineQuestionMark } from "react-icons/md";
import { FaPaperPlane } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/statistics');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00aeef]"></div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: <LuUsersRound size={32}/>,
      color: 'from-blue-500/20 to-blue-600/20',
      border: 'border-blue-500/30',
    },
    {
      label: 'Quiz Submissions',
      value: stats?.totalSubmissions || 0,
      icon: <FaPaperPlane />,
      color: 'from-green-500/20 to-green-600/20',
      border: 'border-green-500/30',
    },
    {
      label: 'Total Questions',
      value: stats?.totalQuestions || 0,
      icon: <MdOutlineQuestionMark size={32}/>,
      color: 'from-purple-500/20 to-purple-600/20',
      border: 'border-purple-500/30',
    },
    {
      label: 'Completed',
      value: stats?.completedCount || 0,
      icon: <FaCheckCircle />,
      color: 'from-[#00aeef]/20 to-[#21b9ef]/20',
      border: 'border-[#00aeef]/30',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-[#f1f7fa] mb-2">Dashboard</h2>
        <p className="text-[#8295a1] text-lg">Overview of your quiz application</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div
            key={card.label}
            className={`bg-gradient-to-br ${card.color} border ${card.border} rounded-2xl p-6 animate-slideUp`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{card.icon}</span>
            </div>
            <div className="text-3xl font-bold text-[#f1f7fa] mb-1">
              {card.value}
            </div>
            <div className="text-sm text-[#8295a1] font-medium">
              {card.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
