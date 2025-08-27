import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { geminiService } from '../services/geminiAPI';

const ScriptBreakdown = () => {
  const [script, setScript] = useState('');
  const [breakdownElements, setBreakdownElements] = useState({
    props: [],
    wardrobe: [],
    cast: [],
    locations: [],
    sfx: [],
    vehicles: [],
    animals: [],
    stunts: [],
    makeup: [],
    equipment: [],
    extras: []
  });
  const [selectedText, setSelectedText] = useState('');
  const [elementType, setElementType] = useState('props');
  const [tagPopupPosition, setTagPopupPosition] = useState({ x: 0, y: 0 });
  const [showTagPopup, setShowTagPopup] = useState(false);
  const [activeTab, setActiveTab] = useState('script');
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const quillRef = useRef(null);

  const elementColors = {
    props: '#FFD700',       // Gold
    wardrobe: '#FF69B4',    // Hot Pink
    cast: '#4169E1',        // Royal Blue
    locations: '#228B22',   // Forest Green
    sfx: '#FF4500',         // Orange Red
    vehicles: '#4682B4',    // Steel Blue
    animals: '#8B4513',     // Saddle Brown
    stunts: '#DC143C',      // Crimson
    makeup: '#BA55D3',      // Medium Orchid
    equipment: '#2F4F4F',   // Dark Slate Gray
    extras: '#808080'       // Gray
  };

  const elementIcons = {
    props: '🏺',
    wardrobe: '👕',
    cast: '🎭',
    locations: '🏠',
    sfx: '💥',
    vehicles: '🚗',
    animals: '🐾',
    stunts: '🤸',
    makeup: '💄',
    equipment: '🎥',
    extras: '👥'
  };

  useEffect(() => {
    // Create custom formats for the breakdown elements
    if (quillRef.current) {
      const Quill = quillRef.current.getEditor().constructor;
      
      Object.keys(breakdownElements).forEach(type => {
        const className = `breakdown-${type}`;
        
        const BlockBlot = Quill.import('blots/block');
        class BreakdownBlot extends BlockBlot {}
        BreakdownBlot.blotName = className;
        BreakdownBlot.tagName = 'DIV';
        BreakdownBlot.className = className;
        
        Quill.register(BreakdownBlot);
      });
    }
  }, []);

  const handleScriptSelection = () => {
    const editor = quillRef.current.getEditor();
    const range = editor.getSelection();
    
    if (range && range.length > 0) {
      const selected = editor.getText(range.index, range.length);
      setSelectedText(selected);
      
      const bounds = editor.getBounds(range.index);
      setTagPopupPosition({
        x: bounds.left,
        y: bounds.bottom + window.scrollY
      });
      
      setShowTagPopup(true);
    } else {
      setShowTagPopup(false);
    }
  };

  const tagElement = () => {
    if (!selectedText || !elementType) return;

    // Add to breakdown elements
    setBreakdownElements(prev => ({
      ...prev,
      [elementType]: [...prev[elementType], selectedText.trim()]
    }));

    // Apply formatting to the selected text in the editor
    const editor = quillRef.current.getEditor();
    const range = editor.getSelection();
    
    if (range) {
      editor.formatText(range.index, range.length, {
        'background': elementColors[elementType],
        'color': '#000000'
      });
    }
    
    setShowTagPopup(false);
  };

  const runAiBreakdown = async () => {
    if (!script.trim()) return;
    
    setLoading(true);
    
    try {
      const response = await geminiService.analyzeScriptBreakdown(script);
      if (response.success) {
        setAiSuggestions(response.analysis);
        setActiveTab('ai-suggestions');
      }
    } catch (error) {
      console.error('Failed to analyze script:', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptAiSuggestion = (category, item) => {
    setBreakdownElements(prev => ({
      ...prev,
      [category]: [...prev[category], item]
    }));
  };

  const exportBreakdown = () => {
    const element = document.createElement('a');
    
    // Format the breakdown as CSV
    let csvContent = 'Category,Element\n';
    
    Object.entries(breakdownElements).forEach(([category, items]) => {
      items.forEach(item => {
        csvContent += `${category},"${item.replace(/"/g, '""')}"\n`;
      });
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    element.setAttribute('href', url);
    element.setAttribute('download', 'script_breakdown.csv');
    element.style.display = 'none';
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const importFountainScript = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setScript(content);
      
      // Process Fountain format - simplified for this example
      // In a real implementation, you would use a proper Fountain parser
    };
    reader.readAsText(file);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'align': [] }],
      ['clean']
    ]
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'align',
    'background', 'color'
  ];

  return (
    <div className="component script-breakdown">
      <h2>🎬 Script Breakdown</h2>
      
      <div className="script-tabs">
        <button 
          className={`tab-btn ${activeTab === 'script' ? 'active' : ''}`}
          onClick={() => setActiveTab('script')}
        >
          📝 Script Editor
        </button>
        <button 
          className={`tab-btn ${activeTab === 'breakdown' ? 'active' : ''}`}
          onClick={() => setActiveTab('breakdown')}
        >
          🔍 Breakdown Sheet
        </button>
        <button 
          className={`tab-btn ${activeTab === 'ai-suggestions' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai-suggestions')}
          disabled={!aiSuggestions}
        >
          🤖 AI Suggestions
        </button>
      </div>
      
      {activeTab === 'script' && (
        <div className="script-editor-tab">
          <div className="script-controls">
            <div className="script-buttons">
              <label className="file-input-label">
                <span>Import Fountain Script</span>
                <input 
                  type="file" 
                  accept=".fountain,.txt" 
                  onChange={importFountainScript} 
                  style={{ display: 'none' }}
                />
              </label>
              <button 
                className="button"
                onClick={runAiBreakdown}
                disabled={loading || !script.trim()}
              >
                {loading ? 'Analyzing...' : '🤖 AI Breakdown Analysis'}
              </button>
            </div>
            
            <div className="element-legend">
              <h4>Breakdown Legend:</h4>
              <div className="legend-items">
                {Object.entries(elementColors).map(([type, color]) => (
                  <div key={type} className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: color }}></span>
                    <span className="legend-label">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="script-textarea-container">
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={script}
              onChange={setScript}
              onBlur={handleScriptSelection}
              modules={modules}
              formats={formats}
              placeholder="Paste your screenplay or write directly here. Select text to tag production elements..."
              className="script-textarea"
            />
            
            {showTagPopup && (
              <div 
                className="tag-popup"
                style={{
                  position: 'absolute',
                  left: tagPopupPosition.x,
                  top: tagPopupPosition.y,
                  zIndex: 1000
                }}
              >
                <h4>Tag "{selectedText.substring(0, 20)}{selectedText.length > 20 ? '...' : ''}"</h4>
                <div className="tag-controls">
                  <select 
                    value={elementType} 
                    onChange={(e) => setElementType(e.target.value)}
                    className="element-select"
                  >
                    {Object.keys(breakdownElements).map(type => (
                      <option key={type} value={type}>
                        {elementIcons[type]} {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                  <button onClick={tagElement} className="tag-btn">
                    Add to Breakdown
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'breakdown' && (
        <div className="breakdown-sheet-tab">
          <div className="breakdown-header">
            <h3>Production Breakdown Sheet</h3>
            <button onClick={exportBreakdown} className="button">
              📥 Export Breakdown
            </button>
          </div>
          
          <div className="breakdown-categories">
            {Object.entries(breakdownElements).map(([category, items]) => (
              <div key={category} className="breakdown-category">
                <h4 style={{ color: elementColors[category] }}>
                  {elementIcons[category]} {category.charAt(0).toUpperCase() + category.slice(1)} ({items.length})
                </h4>
                {items.length === 0 ? (
                  <p className="no-items">No {category} tagged yet</p>
                ) : (
                  <ul className="breakdown-items">
                    {items.map((item, index) => (
                      <li key={index} className="breakdown-item">
                        <span>{item}</span>
                        <button 
                          className="remove-item"
                          onClick={() => {
                            setBreakdownElements(prev => ({
                              ...prev,
                              [category]: prev[category].filter((_, i) => i !== index)
                            }));
                          }}
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'ai-suggestions' && aiSuggestions && (
        <div className="ai-suggestions-tab">
          <div className="suggestions-header">
            <h3>AI-Suggested Breakdown Elements</h3>
            <p className="suggestions-info">
              Review these AI-detected elements and click to add them to your breakdown.
            </p>
          </div>
          
          <div className="suggestions-categories">
            {Object.entries(aiSuggestions).map(([category, items]) => (
              <div key={category} className="suggestion-category">
                <h4 style={{ color: elementColors[category] }}>
                  {elementIcons[category]} {category.charAt(0).toUpperCase() + category.slice(1)} ({items.length})
                </h4>
                {items.length === 0 ? (
                  <p className="no-items">No {category} detected</p>
                ) : (
                  <ul className="suggestion-items">
                    {items.map((item, index) => (
                      <li 
                        key={index} 
                        className="suggestion-item"
                        onClick={() => acceptAiSuggestion(category, item)}
                      >
                        <span>{item}</span>
                        <button className="add-item">+</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptBreakdown;