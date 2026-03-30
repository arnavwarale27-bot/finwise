import { NavLink, Outlet } from 'react-router-dom';
import { 
  Home, 
  Receipt, 
  PieChart, 
  Target, 
  MessageSquare, 
  Wallet,
  Rocket
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Overview', icon: Home },
  { path: '/expenses', label: 'Expenses', icon: Receipt },
  { path: '/analysis', label: 'Analysis', icon: PieChart },
  { path: '/saving-plan', label: 'Saving Plan', icon: Target },
  { path: '/finbot', label: 'FinBot Chat', icon: MessageSquare },
  { path: '/time-machine', label: 'Time Machine', icon: Rocket },
];

export default function Layout() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-900 text-slate-50 dark">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 glass border-r border-slate-800 shrink-0 md:min-h-screen z-10 sticky top-0 md:fixed md:left-0 md:bottom-0">
        <div className="p-6 flex items-center justify-between md:flex-col md:items-start md:mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-600 rounded-xl">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">
              FinWise
            </h1>
          </div>
        </div>
        
        <nav className="flex-1 px-4 overflow-x-auto md:overflow-visible flex md:flex-col gap-2 pb-4 md:pb-0 hide-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap min-w-max md:min-w-0 ${
                  isActive 
                    ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 flex flex-col min-h-[calc(100vh-80px)] md:min-h-screen overflow-x-hidden relative">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-600/20 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 -left-40 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-[120px]" />
        </div>
        
        <div className="flex-1 p-4 md:p-8 md:pt-10 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
