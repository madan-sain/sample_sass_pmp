import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { BottomMobileNav } from './components/BottomMobileNav';
import { ToastContainer } from './components/ui/Toast';

// Pages
import { LandingPage } from './pages/LandingPage';
import { Auth } from './pages/Auth';
import { WorkspaceSelect } from './pages/WorkspaceSelect';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetails } from './pages/ProjectDetails';
import { Tasks } from './pages/Tasks';
import { Team } from './pages/Team';
import { Analytics } from './pages/Analytics';
import { Billing } from './pages/Billing';
import { Messages } from './pages/Messages';
import { FileManager } from './pages/FileManager';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { AdminDashboard } from './pages/AdminDashboard';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();

  // Render full screen pages (Marketing & Authentication)
  if (currentPage === 'landing') {
    return <LandingPage />;
  }

  if (currentPage === 'login' || currentPage === 'register') {
    return <Auth />;
  }

  if (currentPage === 'workspace-select') {
    return <WorkspaceSelect />;
  }

  // Render authenticated application frame
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      
      {/* Collapsible Sidebar Left */}
      <Sidebar />

      {/* Main Panel Content Right */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative pb-16 md:pb-0">
        
        {/* Top Navbar */}
        <TopNavbar />

        {/* Scrollable Page Outlet Container */}
        <main className="flex-1 overflow-hidden relative flex flex-col">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'projects' && <Projects />}
          {currentPage === 'project-details' && <ProjectDetails />}
          {currentPage === 'tasks' && <Tasks />}
          {currentPage === 'team' && <Team />}
          {currentPage === 'analytics' && <Analytics />}
          {currentPage === 'billing' && <Billing />}
          {currentPage === 'messages' && <Messages />}
          {currentPage === 'files' && <FileManager />}
          {currentPage === 'profile' && <Profile />}
          {currentPage === 'settings' && <Settings />}
          {currentPage === 'admin' && <AdminDashboard />}
        </main>

        {/* Mobile bottom nav layout */}
        <BottomMobileNav />
      </div>

      {/* Floating Toast Notifier Container */}
      <ToastContainer />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
