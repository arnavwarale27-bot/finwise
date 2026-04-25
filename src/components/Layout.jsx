import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Receipt, 
  PieChart, 
  Target, 
  MessageSquare, 
  Wallet,
  Rocket,
  ChevronRight,
  Bell,
  Search,
  User,
  Settings
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Overview', icon: Home },
  { path: '/expenses', label: 'Expenses', icon: Receipt },
  { path: '/analysis', label: 'Analysis', icon: PieChart },
  { path: '/saving-plan', label: 'Saving Plan', icon: Target },
  { path: '/finbot', label: 'FinBot Chat', icon: MessageSquare },
  { path: '/time-machine', label: 'Time Machine', icon: Rocket },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#020617] text-slate-50 font-['Outfit'] overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-brand-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-indigo-600/15 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-accent-600/10 rounded-full blur-[80px]" />
      </div>

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 glass border-r border-white/5 shrink-0 md:min-h-screen z-20 sticky top-0 md:fixed md:left-0 md:bottom-0 flex flex-col">
        <div className="p-8 flex items-center justify-between md:flex-col md:items-start md:gap-10">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="p-2.5 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-2xl shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform duration-300">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              FinWise
            </h1>
          </div>
          
          <div className="hidden md:flex flex-col gap-1 w-full">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 px-4 mb-2">Main Menu</p>
            <nav className="flex flex-col gap-1.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                      isActive 
                        ? 'bg-white/5 text-white border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.02)]' 
                        : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3.5">
                        <item.icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-brand-400' : 'group-hover:text-slate-300'}`} />
                        <span className="font-semibold text-[15px] tracking-wide">{item.label}</span>
                      </div>
                      {isActive && (
                        <motion.div layoutId="activeNav" className="w-1.5 h-1.5 rounded-full bg-brand-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Nav */}
        <nav className="md:hidden flex-1 px-4 overflow-x-auto flex gap-2 pb-4 hide-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-5 py-3 rounded-2xl transition-all duration-200 whitespace-nowrap ${
                  isActive 
                    ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-semibold text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex mt-auto p-6 border-t border-white/5">
          <NavLink 
            to="/settings"
            className={({ isActive }) => 
              `flex items-center gap-4 w-full p-3 rounded-2xl hover:bg-white/5 transition-all group cursor-pointer ${
                isActive ? 'bg-white/5 border border-white/10' : ''
              }`
            }
          >
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-white/5 group-hover:border-white/10">
              <User className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-200 truncate">Arnav Warale</p>
              <p className="text-[11px] font-medium text-slate-500">Premium Plan</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:translate-x-0.5 transition-transform" />
          </NavLink>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:pl-72 flex flex-col min-h-screen relative z-10">
        {/* Top Header Bar */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4 bg-white/5 border border-white/5 px-4 py-2 rounded-2xl w-full max-w-md group focus-within:border-brand-500/50 transition-all">
            <Search className="w-4 h-4 text-slate-500 group-focus-within:text-brand-400" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              className="bg-transparent border-none focus:ring-0 text-sm text-slate-200 w-full placeholder:text-slate-600"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent-500 rounded-full border-2 border-[#020617]" />
            </button>
            <div className="h-8 w-[1px] bg-white/5 mx-2" />
            <NavLink to="/expenses">
              <button className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-brand-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
                Add Expense
              </button>
            </NavLink>
          </div>
        </header>

        <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

