import { useState, useRef, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { scanReceipt } from '../utils/gemini';
import { formatCurrency } from '../utils/finance';
import { Plus, Trash2, Tag, Calendar, IndianRupee, Camera, LoaderPinwheel, Upload, X } from 'lucide-react';

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

  // --- File Upload Scanner ---
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

  // --- Live Camera Scanner ---
  const startCamera = async () => {
      setShowCamera(true);
      try {
          // We request the environment camera (rear camera on mobile, standard on laptop)
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

  // Cleanup camera on unmount
  useEffect(() => {
      return () => stopCamera();
  }, []);

  // --- Common Processing Logic ---
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
    <div className="space-y-6 relative">
      <header className="mb-8">
        <h1 className="text-3xl font-light text-slate-100 mb-2 mt-4 md:mt-0">
          Transactions
        </h1>
        <p className="text-sm text-slate-400">Add and manage your income streams and expenses.</p>
      </header>

      {/* Live Camera Modal Overlay */}
      {showCamera && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-slate-900 border border-slate-700 p-4 rounded-3xl shadow-2xl w-full max-w-lg">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <Camera className="w-5 h-5 text-indigo-400"/> Scan Live Receipt
                      </h3>
                      <button onClick={stopCamera} className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  
                  <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                     <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        className="w-full h-full object-cover"
                     ></video>
                     {/* Scanner target overlay */}
                     <div className="absolute inset-0 border-[3px] border-indigo-500/50 m-8 rounded-xl pointer-events-none"></div>
                  </div>

                  <div className="mt-6 flex justify-center">
                      <button 
                          onClick={capturePhoto}
                          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2"
                      >
                          <Camera className="w-5 h-5" />
                          Snap Photo
                      </button>
                  </div>
              </div>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="glass rounded-2xl p-6 lg:col-span-1 border border-brand-500/20 h-fit">
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-200 whitespace-nowrap">
                <Plus className="w-5 h-5 text-brand-400" />
                Add New
              </h2>
              
              {/* Receipt Scanner Buttons */}
              <div className="flex gap-2 w-full xl:w-auto">
                  <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleFileUpload} 
                  />
                  <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isScanning}
                      className="flex-1 xl:flex-none text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-lg border border-slate-700 flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                      title="Upload Image"
                  >
                      {isScanning ? <LoaderPinwheel className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      Upload
                  </button>
                  <button 
                      onClick={startCamera}
                      disabled={isScanning}
                      className="flex-1 xl:flex-none text-xs bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 px-3 py-2 rounded-lg border border-indigo-500/30 flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                      title="Take Photo"
                  >
                      {isScanning ? <LoaderPinwheel className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                      Camera
                  </button>
              </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'expense' })}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                    formData.type === 'expense' 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : 'bg-slate-800/50 text-slate-400 cursor-pointer'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'income' })}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                    formData.type === 'income' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-slate-800/50 text-slate-400 cursor-pointer'
                  }`}
                >
                  Income
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Title</label>
              <input
                type="text"
                required
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-brand-500/50"
                placeholder="E.g. Groceries"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Amount (₹)</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-brand-500/50"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1 flex items-center gap-1"><Tag className="w-3 h-3"/> Category</label>
                <select
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-brand-500/50"
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
              </div>
              
              <div>
                <label className="block text-sm text-slate-400 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> Date</label>
                <input
                  type="date"
                  required
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-brand-500/50"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-brand-600 hover:bg-brand-500 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-brand-500/20"
            >
              Add {formData.type === 'expense' ? 'Expense' : 'Income'}
            </button>
          </form>
        </div>

        {/* Transaction List */}
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-6 text-slate-200">All History</h2>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {allTransactions.length === 0 ? (
               <div className="text-center py-10 text-slate-500">
                 <Calendar className="w-10 h-10 mx-auto mb-3 opacity-50" />
                 <p>No transactions yet.</p>
               </div>
            ) : (
              allTransactions.map(t => (
                <div key={t.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/60 transition-colors group">
                  <div className="flex gap-4 items-center">
                    <div className={`p-3 rounded-xl ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-brand-500/10 text-brand-400'}`}>
                      {t.type === 'income' ? <IndianRupee className="w-5 h-5" /> : <Tag className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-200">{t.title}</h4>
                      <p className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString()} &bull; {t.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`font-semibold ${t.type === 'income' ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </span>
                    <button 
                      onClick={() => t.type === 'expense' ? removeExpense(t.id) : removeIncome(t.id)}
                      className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-slate-900/50 rounded-lg hover:bg-red-500/10"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
