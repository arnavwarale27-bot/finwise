import { useState, useRef, useEffect } from 'react';
import { createFinBotChatSession } from '../utils/gemini';
import { Send, Bot, User, AlertCircle } from 'lucide-react';

export default function FinBot() {
  const [messages, setMessages] = useState([
    { id: '1', role: 'model', content: "Hello! I am FinBot, your personal financial assistant. How can I help you manage your money today?" }
  ]);
  const [input, setInput] = useState('');
  const [chatSession, setChatSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize chat session once on mount
    const session = createFinBotChatSession();
    if (session) {
       setChatSession(session);
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom on new message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !chatSession) return;
    
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString() + 'u', role: 'user', content: userMessage }]);
    setLoading(true);

    try {
       const result = await chatSession.sendMessage(userMessage);
       const responseText = result.response.text();
       
       setMessages(prev => [...prev, { id: Date.now().toString() + 'm', role: 'model', content: responseText }]);
    } catch (error) {
       setMessages(prev => [...prev, { id: Date.now().toString() + 'e', role: 'model', content: "I encountered an error trying to respond. Please check your API key."}]);
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)]">
      <header className="mb-6 shrink-0 mt-4 md:mt-0">
        <h1 className="text-3xl font-light text-slate-100 mb-2">
          FinBot
        </h1>
        <p className="text-sm text-slate-400">Ask any financial question 24/7.</p>
      </header>

      <div className="flex-1 glass rounded-2xl border border-brand-500/20 overflow-hidden flex flex-col h-full">
         {!chatSession && (
             <div className="p-4 bg-red-500/10 border-b border-red-500/20 text-red-400 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>API Key missing. Please set VITE_GEMINI_API_KEY in your .env file.</span>
             </div>
         )}
         
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
          {messages.map((m) => (
             <div key={m.id} className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-brand-600' : 'bg-slate-700'}`}>
                   {m.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-brand-300" />}
                </div>
                <div className={`p-4 rounded-2xl ${m.role === 'user' ? 'bg-brand-600/20 text-slate-200 border border-brand-500/30 rounded-tr-none' : 'bg-slate-800/60 text-slate-300 border border-slate-700/50 rounded-tl-none'}`}>
                   {m.content}
                </div>
             </div>
          ))}
          
          {loading && (
             <div className="flex gap-4 max-w-[85%]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-700 shrink-0">
                   <Bot className="w-5 h-5 text-brand-300" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/60 text-slate-300 border border-slate-700/50 rounded-tl-none flex items-center gap-1">
                   <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                   <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                   <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
             </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 pb-4 bg-slate-900 border-t border-slate-800/50 shrink-0">
          <form onSubmit={handleSend} className="relative max-w-4xl mx-auto flex items-center">
             <input 
               type="text"
               value={input}
               disabled={!chatSession || loading}
               onChange={e => setInput(e.target.value)}
               placeholder="How do I save taxes effectively?"
               className="w-full bg-slate-800 border border-slate-700/50 rounded-full pl-6 pr-14 py-4 text-slate-200 focus:outline-none focus:border-brand-500/50 disabled:opacity-50"
             />
             <button
               type="submit"
               disabled={!input.trim() || !chatSession || loading}
               className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-600 hover:bg-brand-500 flex items-center justify-center text-white transition-colors disabled:opacity-50 disabled:hover:bg-brand-600"
             >
               <Send className="w-5 h-5 ml-0.5" />
             </button>
          </form>
        </div>
      </div>
    </div>
  );
}
