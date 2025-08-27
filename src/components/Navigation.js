import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../img/lexicraft.png';

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('lexicraft');

  const themes = [
    { value: 'lexicraft', label: 'Lexicraft (Default)' },
    { value: 'monochrome', label: 'Monochrome' },
    { value: 'parchment', label: 'Parchment (Light)' },
    { value: 'veridian', label: 'Veridian (Forest)' }
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'lexicraft';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  const navItems = [
    { path: '/', label: 'Writer\'s Flow', icon: '›' },
    { path: '/enhanced-paraphraser', label: 'Literary Paraphraser', icon: '›' },
    { path: '/grammar-checker', label: 'Grammar Pro', icon: '›' },
    { path: '/character-assistant', label: 'Character Dev', icon: '›' },
    { path: '/plot-analyzer', label: 'Plot Structure', icon: '›' },
    { path: '/manuscript-manager', label: 'Manuscript Manager', icon: '›' },
    { path: '/scene-builder', label: 'Scene Builder', icon: '›' },
    { path: '/readability-optimizer', label: 'Readability', icon: '›' },
    { path: '/script-breakdown', label: 'Script Breakdown', icon: '›' },
    { path: '/shot-list-manager', label: 'Shot List', icon: '›' },
    { path: '/summarizer', label: 'Summarizer', icon: '›' },
    { path: '/tone-analyzer', label: 'Tone Analyzer', icon: '›' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <button 
        className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation menu"
      >
        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Mobile Overlay */}
      <div 
        className={`mobile-nav-overlay ${isMobileMenuOpen ? 'show' : ''}`}
        onClick={closeMobileMenu}
      ></div>

      {/* Navigation */}
      <nav className={`navigation ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="nav-brand">
          <Link to="/" onClick={closeMobileMenu}>
            <img src={logo} alt="LexiconAI Logo" className="nav-logo" />
          </Link>
        </div>
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={location.pathname === item.path ? 'active' : ''}
                onClick={closeMobileMenu}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="theme-selector">
          <label htmlFor="theme-select">Theme:</label>
          <select id="theme-select" value={theme} onChange={handleThemeChange}>
            {themes.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </nav>
    </>
  );
};

export default Navigation;