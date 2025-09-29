
import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 justify-start">
        <div className="w-8 h-8 rounded-full bg-fuchsia-500 flex items-center justify-center font-bold text-sm mr-1 flex-shrink-0">
          AI
        </div>
        <div className="flex items-center space-x-1 p-3 bg-slate-700 rounded-2xl">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
        </div>
    </div>
  );
};

export default TypingIndicator;
