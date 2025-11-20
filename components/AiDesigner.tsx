import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { getDesignAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';

export const AiDesigner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am your AI Design Assistant. Ask me about curtain fabrics, color matching, or blinds styles!' }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await getDesignAdvice(userMsg);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-brand-gold text-white p-4 rounded-full shadow-2xl hover:bg-brand-dark transition-all transform hover:scale-105 flex items-center gap-2 group"
        >
          <Sparkles className="w-6 h-6 group-hover:animate-spin" />
          <span className="font-semibold pr-2">Ask Designer</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-xl shadow-2xl w-80 sm:w-96 border border-gray-100 overflow-hidden flex flex-col h-[500px]">
          {/* Header */}
          <div className="bg-brand-dark text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
               <Sparkles className="w-5 h-5 text-brand-gold" />
               <h3 className="font-serif font-semibold">Design Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-gray-300">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                  msg.role === 'user' 
                    ? 'bg-brand-dark text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none animate-pulse text-xs text-gray-500">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about fabrics..."
                className="flex-1 text-sm border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-brand-gold"
              />
              <button 
                onClick={handleSend}
                disabled={loading}
                className="bg-brand-gold text-white p-2 rounded-md hover:bg-brand-dark transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};