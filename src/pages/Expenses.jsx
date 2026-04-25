import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import { scanReceipt } from '../utils/gemini';
import { formatCurrency } from '../utils/finance';
import { 
  Plus, 
  Trash2, 
  Tag, 
  Calendar, 
  IndianRupee, 
  Camera, 
  LoaderPinwheel, 
  Upload, 
  X,
  History,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronDown
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function Expenses() {
  const { expenses, incomes, addExpense, addIncome, removeExpense, removeIncome } = useFinance();
  
  const [formData, setFormData] = useState({
    title: '', amount: '', category: 'Food', type: 'expense', date: new Date().toISOString().split('T')[0]
  });

  const [isScanning, setIsScanning] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const allTransactions = [...expenses, ...incomes].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    if (formData.type === 'expense') {
      addExpense(formData);
    } else {
      addIncome(formData);
    }

    setFormData({ ...formData, title: '', amount: '' });
  };

  const handleFileUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setIsScanning(true);

      const reader = new FileReader();
      reader.onloadend = async () => {
          const base64Data = reader.result; 
          await processReceiptData(base64Data, file.type);
          if (fileInputRef.current) fileInputRef.current.value = "";
      };
      reader.readAsDataURL(file);
  };

  const startCamera = async () => {
      setShowCamera(true);
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          streamRef.current = stream;
          if (videoRef.current) {
              videoRef.current.srcObject = stream;
          }
      } catch (err) {
          console.error("Camera access denied", err);
          alert("Camera access denied or unavailable on this device.");
          setShowCamera(false);
      }
  };

  const stopCamera = () => {
      if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
      }
      setShowCamera(false);
  };

  const capturePhoto = async () => {
      if (!videoRef.current) return;
      
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      
      const base64Data = canvas.toDataURL('image/jpeg');
      stopCamera();
      
      setIsScanning(true);
      await processReceiptData(base64Data, 'image/jpeg');
  };

  useEffect(() => {
      return () => stopCamera();
  }, []);

  const processReceiptData = async (base64Data, mimeType) => {
      try {
         const parsedData = await scanReceipt(base64Data, mimeType);
         setFormData(prev => ({
             ...prev,
             title: parsedData.title || prev.title,
             amount: parsedData.amount ? parsedData.amount.toString() : prev.amount,
             category: parsedData.category || prev.category,
             type: 'expense'
         }));
      } catch (err) {
          console.error(err);
          alert("Scanner failed. Please fill manually or check API limits.");
      } finally {
          setIsScanning(false);
      }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10 pb-10"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1 variants={item} className="text-4xl font-bold text-white mb-2 tracking-tight">
            Transactions
          </motion.h1>
          <motion.p variants={item} className="text-slate-400 font-medium">
            Keep track of your digital and physical financial activity.
          </motion.p>
        </div>
        <motion.div variants={item} className="flex gap-3">
          <div className="flex bg-white/5 border border-white/5 p-1 rounded-2xl">
            <button className="px-4 py-2 rounded-xl bg-white/10 text-xs font-bold text-white shadow-lg">All</button>
            <button className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors">Expenses</button>
            <button className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors">Incomes</button>
          </div>
        </motion.div>
      </header>

      {/* Live Camera Modal */}
      <AnimatePresence>
        {showCamera && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0f172a] border border-white/10 p-6 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
                    <Camera className="w-5 h-5"/>
                  </div>
                  <h3 className="text-xl font-bold text-white">Live Scanner</h3>
                </div>
                <button onClick={stopCamera} className="text-slate-500 hover:text-white bg-white/5 p-2 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="relative rounded-[2rem] overflow-hidden bg-black aspect-video flex items-center justify-center border border-white/5">
                 <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                 <div className="absolute inset-0 border-[2px] border-dashed border-indigo-500/50 m-12 rounded-2xl pointer-events-none animate-pulse"></div>
              </div>

              <div className="mt-8 flex justify-center">
                <button 
                  onClick={capturePhoto}
                  className="px-10 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-bold shadow-xl shadow-brand-600/20 transition-all flex items-center gap-3 hover:-translate-y-1 active:translate-y-0"
                >
                  <Camera className="w-5 h-5" />
                  Capture & Analyze
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Input Form */}
        <motion.div variants={item} className="lg:col-span-1">
          <div className="glass-card rounded-[2.5rem] p-8 border border-white/5 sticky top-28">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-brand-500/20 rounded-xl text-brand-400">
                  <Plus className="w-5 h-5" />
                </div>
                New Entry
              </h2>
              
              <div className="flex gap-2">
                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isScanning}
                  className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl border border-white/5 transition-all disabled:opacity-50"
                  title="Upload Receipt"
                >
                  {isScanning ? <LoaderPinwheel className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                </button>
                <button 
                  onClick={startCamera}
                  disabled={isScanning}
                  className="p-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/20 transition-all disabled:opacity-50"
                  title="Scan with Camera"
                >
                  {isScanning ? <LoaderPinwheel className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex bg-white/5 border border-white/5 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'expense' })}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    formData.type === 'expense' 
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'income' })}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    formData.type === 'income' 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Income
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Label</label>
                <input
                  type="text"
                  required
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:border-brand-500/50 outline-none transition-all placeholder:text-slate-700"
                  placeholder="E.g. Netflix Subscription"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Amount</label>
                <div className="relative">
                  <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-5 py-4 text-lg font-black text-white focus:border-brand-500/50 outline-none transition-all placeholder:text-slate-700"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Category</label>
                  <div className="relative">
                    <select
                      className="w-full bg-white/5 border border-white/5 rounded-2xl pl-4 pr-10 py-4 text-xs font-bold text-slate-200 focus:border-brand-500/50 outline-none transition-all appearance-none cursor-pointer"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Food">Food</option>
                      <option value="Transport">Transport</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Housing">Housing</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Salary">Salary</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Date</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-4 text-xs font-bold text-slate-200 focus:border-brand-500/50 outline-none transition-all"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-brand-600/10 hover:-translate-y-1 active:translate-y-0"
              >
                Log {formData.type === 'expense' ? 'Expense' : 'Income'}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Transaction History */}
        <motion.div variants={item} className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-xl text-slate-400">
                <History className="w-5 h-5" />
              </div>
              Chronicle
            </h2>
            <button className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
              <Filter className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-3">
            {allTransactions.length === 0 ? (
               <div className="glass-card rounded-[2.5rem] p-20 text-center border border-white/5">
                 <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Calendar className="w-10 h-10 text-slate-700" />
                 </div>
                 <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">No entries found in history.</p>
               </div>
            ) : (
              allTransactions.map((t, idx) => (
                <motion.div 
                  key={t.id} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-card p-5 rounded-[1.5rem] flex items-center justify-between group hover:border-white/10"
                >
                  <div className="flex gap-5 items-center">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {t.type === 'income' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100 text-base">{t.title}</h4>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">
                        {new Date(t.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })} &bull; {t.category}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <span className={`text-lg font-black tabular-nums ${t.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </span>
                    <button 
                      onClick={() => t.type === 'expense' ? removeExpense(t.id) : removeIncome(t.id)}
                      className="text-slate-600 hover:text-rose-400 p-2.5 bg-white/5 rounded-xl hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                      title="Erase"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

