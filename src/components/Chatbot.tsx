import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useChatbot } from '../contexts/ChatbotContext';
import { motion, AnimatePresence } from 'framer-motion';

function Chatbot() {
  const { messages, sendMessage, isChatOpen, toggleChat } = useChatbot();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg z-40 transition-all duration-300"
      >
        {isChatOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-96 md:w-[480px] bg-white rounded-lg shadow-xl overflow-hidden z-40 flex flex-col max-h-[70vh]"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-primary-600 text-white p-4">
              <h3 className="font-display text-xl">Chat with Inesta Mode</h3>
              <p className="text-sm text-white/80">We typically reply within minutes</p>
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-gray-50" style={{ maxHeight: 'calc(70vh - 180px)' }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 ${
                    msg.sender === 'user' ? 'ml-auto' : 'mr-auto'
                  } max-w-[80%]`}
                >
                  <div
                    className={`p-4 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-primary-600 text-white rounded-tr-none'
                        : 'bg-white shadow-md rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      msg.sender === 'user' ? 'text-right' : ''
                    } text-gray-500`}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-lg"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Chatbot;