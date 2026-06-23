import React from 'react';
import { 
  BookOpen, 
  LayoutDashboard, 
  BookMarked, 
  Sparkles, 
  Users, 
  Settings, 
  Sun, 
  Moon 
} from 'lucide-react';

function Sidebar({ activeTab, setActiveTab, darkMode, toggleDarkMode }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'library', label: 'My Library', icon: BookMarked },
    { id: 'additions', label: 'New Additions', icon: Sparkles },
    { id: 'authors', label: 'Authors', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <BookOpen size={28} className="sidebar-logo-icon" />
        <h1>The Reader's Shelf</h1>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <li 
              key={item.id}
              className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <IconComponent size={20} />
              <span>{item.label}</span>
            </li>
          );
        })}
      </ul>

      <div className="sidebar-footer">
        <button className="theme-toggle-btn" onClick={toggleDarkMode}>
          {darkMode ? (
            <>
              <Sun size={18} />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon size={18} />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
