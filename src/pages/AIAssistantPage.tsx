import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useFilteredProperties } from '@/hooks/useFilteredProperties';
import { generateAIResponse } from '@/ai/gemini';
import { generateContext } from '@/ai/context';
import { SUGGESTED_PROMPTS } from '@/constants/navigation';
import { BrainCircuit, Send, User, Sparkles, AlertCircle, Key } from 'lucide-react';
import type { ChatMessage } from '@/types/property';
import toast from 'react-hot-toast';

export default function AIAssistantPage() {
  const properties = useFilteredProperties();
  const [apiKey, setApiKey] = useState<string>(
    localStorage.getItem('UPYOG_GEMINI_API_KEY') || ''
  );
  const [tempKey, setTempKey] = useState('');
  const isKeyConfigured = !!import.meta.env.VITE_GEMINI_API_KEY || !!apiKey;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am your UPYOG Cognitive Analytics Assistant. 

I have indexed all property records, municipal registrations, and tax collections across our ten cities. Ask me anything about property distributions, revenue bottlenecks, municipality comparisons, or ward audits!

For example:
* *Which city has the highest property tax collection rate?*
* *How do Delhi and Mumbai compare in terms of property volume and pending approvals?*
* *Summarize the ward-wise revenue collection profile.*`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSaveKey = () => {
    if (!tempKey.trim()) {
      toast.error('Please enter a valid API access key.');
      return;
    }
    localStorage.setItem('UPYOG_GEMINI_API_KEY', tempKey.trim());
    setApiKey(tempKey.trim());
    toast.success('Cognitive Analytics Assistant activated successfully!');
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build compressed system data context
      const contextString = generateContext(properties);
      // Query Gemini
      const aiReply = await generateAIResponse(text, contextString);

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiReply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an issue querying the analytics service: ${err.message || 'Unknown error'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-h-[850px] space-y-4">
      {/* AI Page Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-[var(--color-text-primary)]">
            <BrainCircuit className="w-6.5 h-6.5 text-indigo-500 animate-pulse" />
            UPYOG Cognitive Assistant
          </h1>
          <p className="text-sm mt-1 text-[var(--color-text-tertiary)] tracking-wide">
            Ask natural language questions about your property records, municipal taxes, and municipal approvals
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          Active Municipal Audit Mode
        </div>
      </div>

      {/* Messages Window */}
      <div className="flex-1 min-h-0 overflow-y-auto py-4 space-y-5 pr-1 scrollbar-thin">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isAI = msg.role === 'assistant';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3.5 max-w-[85%] ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar Icon */}
                <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center border shadow-sm ${
                  isAI
                    ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                    : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                }`}>
                  {isAI ? <BrainCircuit className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
                </div>

                {/* Message Content Bubble */}
                <div className={`p-4.5 rounded-2xl shadow-sm text-[13.5px] sm:text-sm border leading-relaxed tracking-wide ${
                  isAI
                    ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] border-[var(--color-border)] rounded-tl-sm'
                    : 'bg-indigo-500 text-white border-indigo-500/10 rounded-tr-sm'
                }`}>
                  {isAI ? (
                    <article className="prose dark:prose-invert prose-sm max-w-none text-[var(--color-text-primary)] prose-headings:font-bold prose-headings:text-[var(--color-text-primary)] prose-strong:text-indigo-500 dark:prose-strong:text-indigo-400 prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5 space-y-2.5 text-[13.5px] sm:text-sm leading-relaxed tracking-wide">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </article>
                  ) : (
                    <p className="whitespace-pre-line leading-relaxed font-medium">{msg.content}</p>
                  )}
                  <p className={`text-[10px] sm:text-xs mt-2.5 text-right ${isAI ? 'text-[var(--color-text-tertiary)]' : 'text-indigo-200'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3.5 max-w-[80%] mr-auto"
          >
            <div className="w-9 h-9 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center">
              <BrainCircuit className="w-4.5 h-4.5 animate-spin" />
            </div>
            <div className="p-4.5 rounded-2xl bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-tl-sm shadow-sm flex items-center gap-2 text-[13.5px] sm:text-sm tracking-wide">
              <span className="text-[var(--color-text-secondary)]">Cognitive Assistant is analyzing municipal data</span>
              <span className="flex items-center gap-0.5 mt-0.5">
                <span className="w-1 h-1 bg-[var(--color-text-tertiary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-1 bg-[var(--color-text-tertiary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-1 bg-[var(--color-text-tertiary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </motion.div>
        )}

        {/* Dynamic Inline Key Activation Setup Card */}
        {!isKeyConfigured && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 border border-indigo-500/20 rounded-2xl space-y-4 max-w-xl mx-auto my-6 shadow-md"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20 shrink-0">
                <Key className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-[var(--color-text-primary)] tracking-wide">Configure Analytics Engine Key</h3>
                <p className="text-xs text-[var(--color-text-tertiary)] leading-relaxed">
                  To audit collections and chat with your database records, provide a valid API access key.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="password"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="Enter API access key..."
                  className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-2.5 px-4 text-xs text-[var(--color-text-primary)] outline-none focus:ring-1 focus:ring-indigo-500/55 focus:border-indigo-500/55"
                />
                <button
                  onClick={handleSaveKey}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow cursor-pointer active:scale-95 shrink-0"
                >
                  Activate Assistant
                </button>
              </div>
              <p className="text-[10.5px] text-[var(--color-text-tertiary)] leading-relaxed">
                Need a key? You can request an API access key from your municipal system administrator or generate one in your Cognitive Analytics Engine console. Keys are stored strictly and securely inside your browser's local storage.
              </p>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input panel & Suggested Prompts */}
      <div className="mt-4 pt-4 border-t border-[var(--color-border)] shrink-0 space-y-4">
        {/* Suggested Prompts Grid */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              disabled={isLoading || !isKeyConfigured}
              onClick={() => handleSendMessage(prompt)}
              className="px-4 py-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-secondary)] text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Text Input Row */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex gap-2 relative"
        >
          <input
            type="text"
            value={input}
            disabled={isLoading || !isKeyConfigured}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isKeyConfigured
                ? "Ask anything about UPYOG property registrations, collections, or pending reviews..."
                : "Analytics Assistant offline. Activate using the setup panel above."
            }
            className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl py-3.5 pl-4 pr-14 text-[13.5px] sm:text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || !isKeyConfigured}
            className="absolute right-2.5 top-1.5 w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-all cursor-pointer shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {/* API Info Disclaimer */}
        <div className="flex items-center gap-1.5 justify-center text-xs text-[var(--color-text-tertiary)] tracking-wide">
          <AlertCircle className="w-4 h-4" />
          <span>Assistant responses are based on database snapshots. Verify critical metrics independently.</span>
        </div>
      </div>
    </div>
  );
}
