import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createFinBotChatSession } from '../utils/gemini';
import { Send, Bot, User, AlertCircle, Sparkles, BrainCircuit } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function FinBot() {
  const [messages, setMessages] = useState([
    { id: '1', role: 'model', content: "Hello! I am FinBot, your personal financial assistant. How can I help you manage your money today?" }
  ]);
  const [input, setInput] = useState('');
  const [chatSession, setChatSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const session = createFinBotChatSession();
    if (session) {
       setChatSession(session);
    }
  }, []);

  useEffect(() => {
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
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] space-y-8"
    >
      <header className="shrink-0">
        <motion.h1 variants={item} className="text-4xl font-bold text-white mb-2 tracking-tight">
          FinBot Neural Chat
        </motion.h1>
        <motion.p variants={item} className="text-slate-400 font-medium">
          Real-time financial advisory powered by <span className="text-brand-400">Gemini Neural Matrix</span>.
        </motion.p>
      </header>

      <motion.div variants={item} className="flex-1 glass-card rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.3)] relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
         
         {!chatSession && (
             <div className="p-4 bg-rose-500/10 border-b border-rose-500/10 text-rose-400 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest relative z-10">
                <AlertCircle className="w-4 h-4" />
                <span>Neural connection offline. Verify API configuration.</span>
             </div>
         )}
         
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 hide-scrollbar relative z-10">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
               <motion.div 
                key={m.id} 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-5 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
               >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                    m.role === 'user' ? 'bg-brand-600 shadow-brand-600/20' : 'bg-slate-800 shadow-black/20'
                  }`}>
                     {m.role === 'user' ? <User className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-brand-400" />}
                  </div>
                  <div className={`p-6 rounded-[1.5rem] text-[15px] font-medium leading-relaxed shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-brand-600/10 text-slate-100 border border-brand-500/20 rounded-tr-none' 
                      : 'bg-white/5 text-slate-300 border border-white/5 rounded-tl-none'
                  }`}>
                     {m.content}
                  </div>
               </motion.div>
            ))}
          </AnimatePresence>
          
          {loading && (
             <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-5 max-w-[85%]"
             >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-800 shrink-0 shadow-lg shadow-black/20">
                   <Bot className="w-6 h-6 text-brand-400" />
                </div>
                <div className="p-6 rounded-[1.5rem] bg-white/5 text-slate-300 border border-white/5 rounded-tl-none flex items-center gap-2">
                   <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 rounded-full bg-brand-400" />
                   <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 rounded-full bg-brand-400" />
                   <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 rounded-full bg-brand-400" />
                </div>
             </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 md:p-8 border-t border-white/5 shrink-0 relative z-10 backdrop-blur-md">
          <form onSubmit={handleSend} className="relative max-w-5xl mx-auto flex items-center group">
             <div className="absolute left-6 text-brand-400 opacity-50 group-focus-within:opacity-100 transition-opacity">
               <Sparkles className="w-5 h-5" />
             </div>
             <input 
               type="text"
               value={input}
               disabled={!chatSession || loading}
               onChange={e => setInput(e.target.value)}
               placeholder="How do I optimize my portfolio for the next quarter?"
               className="w-full bg-white/5 border border-white/5 rounded-[1.5rem] pl-16 pr-16 py-5 text-sm font-bold text-white focus:border-brand-500/50 outline-none transition-all placeholder:text-slate-700 disabled:opacity-50"
             />
             <button
               type="submit"
               disabled={!input.trim() || !chatSession || loading}
               className="absolute right-3 w-12 h-12 rounded-2xl bg-brand-600 hover:bg-brand-500 flex items-center justify-center text-white transition-all shadow-lg shadow-brand-600/20 disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
             >
               <Send className="w-5 h-5 ml-0.5" />
             </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

