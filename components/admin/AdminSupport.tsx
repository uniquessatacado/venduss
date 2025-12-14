
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageCircle, Send, ShieldCheck } from 'lucide-react';

const AdminSupport: React.FC = () => {
  const { supportMessages, sendSupportMessage, user, markMessagesAsRead } = useStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Constants
  const SUPER_ADMIN_ID = 'super-admin-1'; 

  // Filter messages for this user (Tenant Admin)
  const myMessages = user ? supportMessages.filter(
      m => (m.senderId === user.id && m.receiverId === SUPER_ADMIN_ID) || 
           (m.senderId === SUPER_ADMIN_ID && m.receiverId === user.id)
  ) : [];

  // Scroll to bottom and Mark as read on mount/update
  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      if (user) {
          markMessagesAsRead(user.id, SUPER_ADMIN_ID);
      }
  }, [supportMessages, user]);

  const handleSend = () => {
      if (!input.trim() || !user) return;
      sendSupportMessage(input, user.id, SUPER_ADMIN_ID);
      setInput('');
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
            <MessageCircle size={32} className="text-purple-500" />
            <div>
                <h2 className="text-2xl font-bold text-white">Suporte Venduss</h2>
                <p className="text-sm text-zinc-400">Canal direto com a administração da plataforma.</p>
            </div>
        </div>

        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
            {/* Header Chat */}
            <div className="bg-zinc-950 p-4 border-b border-zinc-800 flex items-center gap-3">
                <div className="bg-purple-600/20 p-2 rounded-full border border-purple-500/30">
                    <ShieldCheck className="text-purple-400" size={20} />
                </div>
                <div>
                    <p className="text-sm font-bold text-white">Atendimento Oficial</p>
                    <p className="text-[10px] text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online agora</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
                {myMessages.length === 0 && (
                    <div className="text-center py-20 opacity-50">
                        <MessageCircle size={48} className="mx-auto mb-2 text-zinc-600"/>
                        <p className="text-zinc-500">Envie uma mensagem para iniciar o atendimento.</p>
                    </div>
                )}
                
                {myMessages.map((msg, idx) => {
                    const isMe = msg.senderId === user?.id;
                    return (
                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] md:max-w-[60%] p-3 rounded-2xl text-sm shadow-md ${
                                isMe 
                                ? 'bg-purple-600 text-white rounded-br-none' 
                                : 'bg-zinc-800 text-zinc-200 rounded-bl-none border border-zinc-700'
                            }`}>
                                <p>{msg.text}</p>
                                <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-purple-300' : 'text-zinc-500'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-zinc-950 border-t border-zinc-800">
                <div className="flex gap-2">
                    <input 
                        className="flex-1 bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors"
                        placeholder="Digite sua mensagem..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSend()}
                    />
                    <button 
                        onClick={handleSend}
                        className="bg-white text-black p-3 rounded-xl hover:bg-zinc-200 transition-colors shadow-lg active:scale-95"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AdminSupport;
