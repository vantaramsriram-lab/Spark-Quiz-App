import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from "../assets/logo.png"
const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const navLinks = [
    { to: '/admin', label: 'Dashboard', end: true },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/questions', label: 'Questions' },
    { to: '/admin/results', label: 'Results' },
  ];

  return (
    <div className="min-h-screen bg-[#030910]">
      {/* Header */}
      <header className="bg-[#08131d] border-b border-[#172936] min-h-20 w-[100vw] flex items-center">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-5">
              <img src={logo} alt="logo" className='w-15 h-15'/>
              <h1 className="text-2xl font-bold text-[#f1f7fa]">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-8">
              <span className="text-[#8295a1] hidden sm:block">
                Welcome, <span className="text-[#f1f7fa] font-medium">{user?.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-base font-medium text-[#f1f7fa] bg-[#172936] hover:bg-[#315568] rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-base transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#00aeef] text-[#031018]'
                    : 'bg-[#08131d] text-[#8295a1] hover:bg-[#172936] hover:text-[#f1f7fa]'
                }`
              }
            >
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Content */}
        <div className="animate-fadeIn">
          <Outlet />
        </div>
        {/* footer */}
        <div className="flex flex-col items-center mt-6 mt-40">
          <p className="
            text-sm
            font-medium
            tracking-[0.25em]
            text-[var(--muted)]
          ">
            SPARK
          </p>

          <p className="
            mt-1
            text-[12px]
            text-[var(--muted)]
            opacity-60
          ">
            2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
