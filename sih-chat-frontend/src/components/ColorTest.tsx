import React from 'react';

const ColorTest: React.FC = () => {
  return (
    <div className=\"p-4 space-y-4\">
      <h2 className=\"text-lg font-bold\">Color Test</h2>
      <div className=\"grid grid-cols-4 gap-2\">
        <div className=\"bg-primary-500 text-white p-2 rounded text-xs\">Primary 500</div>
        <div className=\"bg-secondary-500 text-white p-2 rounded text-xs\">Secondary 500</div>
        <div className=\"bg-accent-500 text-white p-2 rounded text-xs\">Accent 500</div>
        <div className=\"bg-success-500 text-white p-2 rounded text-xs\">Success 500</div>
        <div className=\"bg-primary-100 text-primary-800 p-2 rounded text-xs\">Primary 100</div>
        <div className=\"bg-secondary-100 text-secondary-800 p-2 rounded text-xs\">Secondary 100</div>
        <div className=\"bg-accent-100 text-accent-800 p-2 rounded text-xs\">Accent 100</div>
        <div className=\"bg-success-100 text-success-800 p-2 rounded text-xs\">Success 100</div>
      </div>
      <div className=\"shadow-elegant p-4 bg-white rounded-lg\">
        <p className=\"text-primary-600\">Elegant Shadow Test</p>
      </div>
      <div className=\"shadow-professional p-4 bg-white rounded-lg\">
        <p className=\"text-secondary-700\">Professional Shadow Test</p>
      </div>
    </div>
  );
};

export default ColorTest;