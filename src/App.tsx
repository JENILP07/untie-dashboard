import { useState } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  FileText, 
  Settings, 
  Search, 
  Bell, 
  DollarSign, 
  UserCheck, 
  CheckSquare, 
  Percent, 
  Sparkles, 
  Menu, 
  X, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from 'recharts';
import AIChatPanel from './components/AIChatPanel';

// Mock data for Line Chart
const monthlyRevenueData = [
  { month: 'Jan', 'Current Year': 8100, 'Previous Year': 6100 },
  { month: 'Feb', 'Current Year': 8900, 'Previous Year': 6400 },
  { month: 'Mar', 'Current Year': 9200, 'Previous Year': 7200 },
  { month: 'Apr', 'Current Year': 9900, 'Previous Year': 7800 },
  { month: 'May', 'Current Year': 10400, 'Previous Year': 8100 },
  { month: 'Jun', 'Current Year': 10800, 'Previous Year': 8500 },
  { month: 'Jul', 'Current Year': 11100, 'Previous Year': 9200 },
  { month: 'Aug', 'Current Year': 10900, 'Previous Year': 8900 },
  { month: 'Sep', 'Current Year': 11500, 'Previous Year': 9800 },
  { month: 'Oct', 'Current Year': 12200, 'Previous Year': 10100 },
  { month: 'Nov', 'Current Year': 12800, 'Previous Year': 10500 },
  { month: 'Dec', 'Current Year': 13700, 'Previous Year': 11000 },
];

// Mock data for Recent Activities
const recentActivities = [
  {
    id: 1,
    user: 'Sarah Jenkins',
    action: 'Upgraded subscription to Enterprise Plan',
    timestamp: '10 minutes ago',
    status: 'Success',
    statusStyle: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  },
  {
    id: 2,
    user: 'Marcus Vance',
    action: 'Reported a technical integration issue',
    timestamp: '1 hour ago',
    status: 'In Progress',
    statusStyle: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  },
  {
    id: 3,
    user: 'Elena Rostova',
    action: 'Requested custom export for Q2 Reports',
    timestamp: '3 hours ago',
    status: 'Completed',
    statusStyle: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  },
  {
    id: 4,
    user: 'David Kim',
    action: 'Failed payment attempt on billing cycle',
    timestamp: '5 hours ago',
    status: 'Failed',
    statusStyle: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
  },
  {
    id: 5,
    user: 'Alex Rivera',
    action: 'Registered a new client account: Vertex Inc',
    timestamp: 'Yesterday',
    status: 'Success',
    statusStyle: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  },
];

type NavItem = 'Dashboard' | 'Analytics' | 'Clients' | 'Reports' | 'Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavItem>('Dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigationItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Analytics', icon: TrendingUp },
    { name: 'Clients', icon: Users },
    { name: 'Reports', icon: FileText },
    { name: 'Settings', icon: Settings },
  ] as const;

  // Render correct content per tab or simple mockup view
  const renderHeaderTitle = () => {
    switch (activeTab) {
      case 'Dashboard': return 'Overview';
      case 'Analytics': return 'Analytics Deep-Dive';
      case 'Clients': return 'Client Directory';
      case 'Reports': return 'System Reports';
      case 'Settings': return 'Account Settings';
      default: return 'Overview';
    }
  };

  // Filter activities based on search bar
  const filteredActivities = recentActivities.filter(activity => 
    activity.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
    activity.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
    activity.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-bg-dark text-slate-100 font-sans antialiased overflow-x-hidden selection:bg-accent-blue/30 selection:text-white">
      
      {/* 1. FIXED LEFT SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex flex-col w-[240px] bg-sidebar-dark border-r border-slate-800 shrink-0 h-screen sticky top-0">
        {/* Logo Section */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-blue to-cyan-400 flex items-center justify-center shadow-lg shadow-accent-blue/20">
            <span className="font-black text-white text-base">U</span>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white m-0 leading-none">Untie</h1>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Analytics Suite</span>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition duration-200 group ${
                  isActive 
                    ? 'bg-accent-blue text-white shadow-md shadow-accent-blue/10' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'
                }`} />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Footer/Logout Area */}
        <div className="p-4 border-t border-slate-800 space-y-1">
          <a href="#" className="flex items-center gap-3.5 px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition">
            <HelpCircle className="w-4 h-4" />
            Support Docs
          </a>
          <button className="w-full flex items-center gap-3.5 px-4 py-2 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition">
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </aside>

      {/* MOBILE SIDEBAR DRAWERNESS */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex">
          <div className="w-[240px] bg-sidebar-dark flex flex-col h-full animate-in slide-in-from-left duration-250">
            {/* Logo */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-blue to-cyan-400 flex items-center justify-center shadow-md shadow-accent-blue/15">
                  <span className="font-black text-white text-base">U</span>
                </div>
                <h1 className="text-base font-bold text-white m-0">Untie</h1>
              </div>
              <button 
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 py-6 space-y-1.5">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActiveTab(item.name);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition group ${
                      isActive 
                        ? 'bg-accent-blue text-white shadow-md shadow-accent-blue/15' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.name}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800 space-y-1">
              <button className="w-full flex items-center gap-3.5 px-4 py-2 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/10 transition">
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          </div>
          {/* Backdrop Closer */}
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* MAIN CONTAINER WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* 2. TOP HEADER BAR */}
        <header className="h-[70px] bg-sidebar-dark/40 backdrop-blur-md border-b border-slate-800/60 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3.5">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white m-0">{renderHeaderTitle()}</h2>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">Welcome back, Admin</p>
            </div>
          </div>

          {/* Search bar & Avatar */}
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative w-44 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search events, clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/20 transition-all duration-200"
              />
            </div>

            {/* Notification trigger */}
            <button className="relative p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
            </button>

            {/* User Avatar */}
            <div className="flex items-center gap-2.5 border-l border-slate-850 pl-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
                alt="User Avatar"
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-slate-850 shadow-md shrink-0"
              />
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-200 leading-tight">Sarah Jenkins</p>
                <p className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">Enterprise Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* 3. MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-[1600px] w-full mx-auto">
          
          {/* Active view conditional mockup messages */}
          {activeTab !== 'Dashboard' && (
            <div className="bg-gradient-to-r from-accent-blue/10 to-indigo-500/5 border border-accent-blue/20 rounded-2xl p-6 mb-2">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-5 h-5 text-accent-blue animate-pulse-glow" />
                <h3 className="text-sm font-bold text-white">Tab Feature Integration</h3>
              </div>
              <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                You are currently viewing the <span className="text-slate-200 font-semibold">{activeTab}</span> component module. In the production deployment, this area handles granular data and action hooks relevant to {activeTab.toLowerCase()}. Let's head back to the <button onClick={() => setActiveTab('Dashboard')} className="text-accent-blue hover:underline font-semibold focus:outline-none">Dashboard Overview</button> to review SaaS metrics.
              </p>
            </div>
          )}

          {/* Row of 4 KPI Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Card 1: Total Revenue */}
            <div className="bg-card-dark border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 group hover:-translate-y-0.5">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl bg-accent-blue/10 border border-accent-blue/20 text-accent-blue group-hover:scale-110 transition duration-300">
                  <DollarSign className="w-5 h-5" />
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +12.5%
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mb-1">Total Revenue</p>
              <h3 className="text-2xl font-black text-white tracking-tight">$124,500</h3>
            </div>

            {/* Card 2: Active Users */}
            <div className="bg-card-dark border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 group hover:-translate-y-0.5">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 transition duration-300">
                  <UserCheck className="w-5 h-5" />
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +8.2%
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mb-1">Active Users</p>
              <h3 className="text-2xl font-black text-white tracking-tight">3,842</h3>
            </div>

            {/* Card 3: Open Tasks */}
            <div className="bg-card-dark border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 group hover:-translate-y-0.5">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition duration-300">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  -4.3%
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mb-1">Open Tasks</p>
              <h3 className="text-2xl font-black text-white tracking-tight">47</h3>
            </div>

            {/* Card 4: Conversion Rate */}
            <div className="bg-card-dark border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 group hover:-translate-y-0.5">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-110 transition duration-300">
                  <Percent className="w-5 h-5" />
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +1.7%
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mb-1">Conversion Rate</p>
              <h3 className="text-2xl font-black text-white tracking-tight">6.8%</h3>
            </div>
          </section>

          {/* Full-width Line Chart Section */}
          <section className="bg-card-dark border border-slate-800/80 rounded-2xl p-5 sm:p-6 hover:shadow-2xl hover:shadow-black/5 transition duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">Monthly Revenue Trend</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Historical comparison between Current and Previous Year cycles</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent-blue" />
                  <span className="text-[11px] font-semibold text-slate-300">Current Year</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                  <span className="text-[11px] font-semibold text-slate-300">Previous Year</span>
                </div>
              </div>
            </div>

            {/* Revenue Chart Container */}
            <div className="h-[300px] w-full mt-2 text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#232836" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#5a607c" 
                    tickLine={false} 
                    axisLine={false}
                    dy={10}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <YAxis 
                    stroke="#5a607c" 
                    tickLine={false} 
                    axisLine={false}
                    dx={-5}
                    tickFormatter={(value) => value === 0 ? '$0' : `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1a1d27',
                      borderColor: '#2e3244',
                      borderRadius: '8px',
                      color: '#f3f4f6'
                    }}
                    itemStyle={{ color: '#f3f4f6' }}
                    labelStyle={{ color: '#9ca3af', fontWeight: 'bold' }}
                    formatter={(value) => [`$${value}`, '']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Current Year" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 1 }}
                    activeDot={{ r: 6, fill: '#3b82f6' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Previous Year" 
                    stroke="#5a607c" 
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ fill: '#5a607c', strokeWidth: 1 }}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Recent Activity List */}
          <section className="bg-card-dark border border-slate-800/80 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5 border-b border-slate-800/60 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">Recent Activity Log</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Real-time update of system events and member updates</p>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {filteredActivities.length} Events Showing
              </span>
            </div>

            {/* List */}
            <div className="space-y-3">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity) => (
                  <div 
                    key={activity.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-800/30 bg-slate-900/10 hover:bg-slate-900/30 transition-all duration-200"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 font-bold text-xs text-slate-300">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-200">
                          {activity.user}
                          <span className="text-slate-400 font-normal ml-1.5">{activity.action}</span>
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">{activity.timestamp}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activity.statusStyle}`}>
                        {activity.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-650 hidden sm:block" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-xs text-slate-500">No recent activities match your search queries.</p>
                </div>
              )}
            </div>
          </section>

        </main>
      </div>

      {/* 5. RENDER AIChatPanel BESIDE MAIN CONTENT */}
      {aiOpen && (
        <aside className="fixed inset-y-0 right-0 z-40 lg:relative flex h-screen animate-in slide-in-from-right duration-300 shrink-0">
          {/* Overlay to dim backdrop on mobile */}
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 lg:hidden" onClick={() => setAiOpen(false)} />
          <div className="relative z-40 h-full">
            <AIChatPanel onClose={() => setAiOpen(false)} />
          </div>
        </aside>
      )}

      {/* 4. FLOATING "ASK AI" BUTTON */}
      {!aiOpen && (
        <button
          onClick={() => setAiOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-accent-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-xs px-4 py-3 rounded-full shadow-lg shadow-accent-blue/30 border border-accent-blue/30 hover:shadow-accent-blue/45 transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse-glow hover:animate-none"
        >
          <Sparkles className="w-4 h-4 text-white" />
          Ask AI
        </button>
      )}

    </div>
  );
}
