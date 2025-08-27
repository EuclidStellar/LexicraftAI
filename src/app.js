import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import MainEditor from './components/MainEditor';
import Paraphraser from './components/Paraphraser';
import EnhancedParaphraser from './components/EnhancedParaphraser';
import Summarizer from './components/Summarizer';
import ToneAnalyzer from './components/ToneAnalyzer';
import GrammarChecker from './components/GrammarChecker';
import CharacterAssistant from './components/CharacterAssistant';
import PlotAnalyzer from './components/PlotAnalyzer';
import ManuscriptManager from './components/ManuscriptManager';
import SceneBuilder from './components/SceneBuilder';
import ReadabilityOptimizer from './components/ReadabilityOptimizer';
import ScriptBreakdown from './components/ScriptBreakdown';
import ShotListManager from './components/ShotListManager';
import Navigation from './components/Navigation';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<MainEditor />} />
            <Route path="/paraphraser" element={<Paraphraser />} />
            <Route path="/enhanced-paraphraser" element={<EnhancedParaphraser />} />
            <Route path="/summarizer" element={<Summarizer />} />
            <Route path="/tone-analyzer" element={<ToneAnalyzer />} />
            <Route path="/grammar-checker" element={<GrammarChecker />} />
            <Route path="/character-assistant" element={<CharacterAssistant />} />
            <Route path="/plot-analyzer" element={<PlotAnalyzer />} />
            <Route path="/manuscript-manager" element={<ManuscriptManager />} />
            <Route path="/scene-builder" element={<SceneBuilder />} />
            <Route path="/readability-optimizer" element={<ReadabilityOptimizer />} />
            <Route path="/script-breakdown" element={<ScriptBreakdown />} />
            <Route path="/shot-list-manager" element={<ShotListManager />} />
          </Routes>
        </main>
      </div>
      <Analytics />
    </Router>
  );
};

export default App;