import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Trophy, LogOut, Terminal, Home, LogIn, UserPlus } from 'lucide-react';
import { Button } from './common/Button';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const brandHomePath = '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Candidate navigation items
  const allNavItems = [
    { label: 'Home', path: '/', icon: Home, role: 'public' },
    { label: 'Synopsis', path: '/synopsis', icon: FileText, role: 'candidate' },
    { label: 'Hackathon', path: '/hackathon', icon: Terminal, role: 'candidate' },
    { label: 'Results', path: '/results', icon: Trophy, role: 'public' },
  ];

  const visibleNavItems = allNavItems.filter((item) => {
    if (item.role === 'public') return true;
    if (!isAuthenticated) return false;
    return true;
  });

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="relative w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Section */}
        <div className="flex items-center gap-3.5 shrink-0 z-10">
          <a
            href="https://www.contata.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group transition-transform hover:scale-[1.03]"
            title="Visit Contata Solutions Official Website"
          >
            <img
              src="/contata-logo.png"
              alt="Contata Solutions"
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </a>

          <Link
            to={brandHomePath}
            className="hidden sm:flex flex-col justify-center border-l border-slate-700/80 pl-3.5 py-0.5 group transition-transform hover:scale-[1.02]"
            title="Go to Home"
          >
            <span className="font-extrabold text-sm tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-orange-200 to-slate-300 leading-tight">
              Xathon<span className="text-orange-500">Portal</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase leading-tight mt-0.5 group-hover:text-slate-200 transition-colors">
              Contata Hackathon 2026
            </span>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/60 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
          {visibleNavItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-md shadow-orange-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Action */}
        <div className="flex items-center gap-3 z-10">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-semibold text-slate-200">{user?.fullName || user?.name || 'Candidate'}</span>
                <span className="text-[10px] font-mono text-orange-400">
                  {user?.submissionId || user?.email}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} icon={LogOut} title="Log out">
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : isAuthPage ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button
                  variant={location.pathname === '/login' ? 'primary' : 'ghost'}
                  size="sm"
                  icon={LogIn}
                  className={location.pathname === '/login' ? 'bg-orange-600 hover:bg-orange-500 text-white font-bold' : 'text-slate-300 hover:text-white font-semibold'}
                >
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  variant={location.pathname === '/register' ? 'primary' : 'outline'}
                  size="sm"
                  icon={UserPlus}
                  className={location.pathname === '/register' ? 'bg-orange-600 hover:bg-orange-500 text-white font-bold' : 'border-orange-500/50 text-orange-400 hover:bg-orange-950/40 font-semibold'}
                >
                  Register
                </Button>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
