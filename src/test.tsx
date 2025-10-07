import React from 'react';
import { createRoot } from 'react-dom/client';

const TestApp = () => {
  return (
    <div>
      <h1>React Test</h1>
      <p>This is a test!</p>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<TestApp />);






