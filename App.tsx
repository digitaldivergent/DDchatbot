import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, LeadData } from './types';
import { GREETING_MESSAGE, QUESTIONS } from './constants';
import { getServiceRecommendation } from './services/geminiService';
import ChatBubble from './components/ChatBubble';
import TypingIndicator from './components/TypingIndicator';
import EmailForm from './components/EmailForm';

const App: React.FC = () => {
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isAwaitingAnswer, setIsAwaitingAnswer] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [isChatEnded, setIsChatEnded] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsBotTyping(true);
    setTimeout(() => {
      setConversation([{ sender: 'bot', text: GREETING_MESSAGE }]);
      setTimeout(() => {
        setConversation(prev => [...prev, { sender: 'bot', text: QUESTIONS[0] }]);
        setIsBotTyping(false);
        setIsAwaitingAnswer(true);
      }, 1000);
    }, 1200);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, isBotTyping]);
  
  const handleSendMessage = async () => {
    if (!userInput.trim() || !isAwaitingAnswer || isChatEnded) return;

    const newUserMessage: ChatMessage = { sender: 'user', text: userInput };
    setConversation(prev => [...prev, newUserMessage]);
    
    const updatedAnswers = [...userAnswers, userInput];
    setUserAnswers(updatedAnswers);
    setUserInput('');
    setIsAwaitingAnswer(false);
    setIsBotTyping(true);

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < QUESTIONS.length) {
      askNextQuestion(nextQuestionIndex);
    } else {
      generateRecommendation(updatedAnswers);
    }
  };
  
  const askNextQuestion = (index: number) => {
      setTimeout(() => {
        const nextQuestion = QUESTIONS[index];
        setConversation(prev => [...prev, { sender: 'bot', text: nextQuestion }]);
        setCurrentQuestionIndex(index);
        setIsBotTyping(false);
        setIsAwaitingAnswer(true);
      }, 1500);
  }

  const generateRecommendation = async (finalAnswers: string[]) => {
      try {
        const recommendation = await getServiceRecommendation(finalAnswers);
        setConversation(prev => [...prev, { sender: 'bot', text: recommendation }]);
        
        const finalLeadData: LeadData = {
            nameOrBusiness: finalAnswers[0],
            industry: finalAnswers[1],
            answers: finalAnswers.slice(2),
            recommendation,
            submittedAt: new Date().toISOString()
        };
        setLeadData(finalLeadData);
        
        setShowEmailForm(true);
      } catch (error) {
        console.error("Error getting recommendation:", error);
        const errorMessage = "Whoops, my circuits are a bit fried. Couldn't process that. Try refreshing.";
        setConversation(prev => [...prev, { sender: 'bot', text: errorMessage }]);
      } finally {
        setIsBotTyping(false);
      }
  }

  const handleEmailSubmit = (contactInfo: {email: string, phone: string}) => {
    console.log("Contact info submitted:", contactInfo);
    setLeadData(prev => prev ? { ...prev, email: contactInfo.email, phone: contactInfo.phone } : null);
    setShowEmailForm(false);
    setEmailSubmitted(true);
    setIsBotTyping(true);
    setTimeout(() => {
        const confirmationMessage = "Solid. Your custom proposal video is being generated. We'll hit your inbox in the next 24 hours. Get ready to level up.";
        setConversation(prev => [...prev, { sender: 'bot', text: confirmationMessage }]);
        setIsBotTyping(false);
    }, 1500);
  };
  
  const handleDownloadData = () => {
    if (!leadData) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(leadData, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `lead-data-${new Date().getTime()}.json`;
    link.click();
  }

  const handleEndChat = () => {
    setIsChatEnded(true);
    setShowEmailForm(false);
    setIsAwaitingAnswer(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white font-sans items-center justify-center p-4">
        <div className="w-full max-w-2xl h-full flex flex-col bg-slate-900 shadow-2xl rounded-lg border border-fuchsia-500/30">
            <header className="p-4 border-b border-slate-700 flex justify-between items-center">
                <div className="text-left">
                  <h1 className="text-xl font-bold text-fuchsia-400">Digital Divergent</h1>
                  <p className="text-sm text-slate-400">AI Lead Qualifier</p>
                </div>
                <button
                  onClick={handleEndChat}
                  className="text-slate-500 hover:text-white transition-colors"
                  aria-label="Close chat"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
            </header>
            
            <main className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                    {conversation.map((msg, index) => (
                        <ChatBubble key={index} sender={msg.sender} message={msg.text} />
                    ))}
                    {isBotTyping && <TypingIndicator />}
                    {isChatEnded && !emailSubmitted && (
                      <div className="text-center p-4 text-slate-500 italic">
                          <p>This chat has been ended.</p>
                      </div>
                    )}
                    {emailSubmitted && leadData && (
                        <div className="text-center p-4">
                             <button
                                onClick={handleDownloadData}
                                className="bg-slate-700 text-fuchsia-400 font-bold rounded-md py-2 px-6 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-fuchsia-500"
                              >
                                Download Lead Data
                              </button>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            </main>

            {showEmailForm && (
                <div className="p-4 bg-slate-800/50">
                    <EmailForm onSubmit={handleEmailSubmit} />
                </div>
            )}
            
            <footer className="p-4 border-t border-slate-700">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder={isAwaitingAnswer ? "Type your answer..." : isChatEnded ? "Chat ended." : "..."}
                        className="flex-1 bg-slate-700 border border-slate-600 rounded-full py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 disabled:opacity-50"
                        disabled={!isAwaitingAnswer || showEmailForm || emailSubmitted || isChatEnded}
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-fuchsia-600 text-white rounded-full p-3 hover:bg-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!isAwaitingAnswer || !userInput.trim() || showEmailForm || emailSubmitted || isChatEnded}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </div>
            </footer>
        </div>
    </div>
  );
};

export default App;