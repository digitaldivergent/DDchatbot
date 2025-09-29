import React from 'react';
import type { MessageSender } from '../types';

interface ChatBubbleProps {
  sender: MessageSender;
  message: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ sender, message }) => {
  const isBot = sender === 'bot';

  const bubbleClasses = isBot
    ? 'bg-slate-700 text-left'
    : 'bg-fuchsia-600 text-right ml-auto';
  
  const wrapperClasses = isBot ? 'justify-start' : 'justify-end';

  return (
    <div className={`flex items-end ${wrapperClasses}`}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-fuchsia-500 flex items-center justify-center font-bold text-sm mr-3 flex-shrink-0">
          AI
        </div>
      )}
      <div
        className={`max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-md whitespace-pre-wrap ${bubbleClasses}`}
      >
        <p className="text-sm font-semibold text-gray-100">{message}</p>
      </div>
    </div>
  );
};

export default ChatBubble;