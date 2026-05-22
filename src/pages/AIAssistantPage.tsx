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
  const [showKeySetup, setShowKeySetup] = useState(false);
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

  // Sync temp key when apiKey state changes
  useEffect(() => {
    if (apiKey) {
      setTempKey(apiKey);
    }
  }, [apiKey]);

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
    setShowKeySetup(false);
    toast.success('Cognitive Analytics Assistant activated successfully!');
  };

  const handleClearKey = () => {
    localStorage.removeItem('UPYOG_GEMINI_API_KEY');
    setApiKey('');
    setTempKey('');
    setShowKeySetup(true);
    toast.success('Saved API Key cleared successfully!');
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
    <div className="flex flex-col h-[calc(100vh-100px)] max-h-[850px] space-y-5">
      {/* AI Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-border)] pb-5 shrink-0 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3 text-[var(--color-text-primary)] tracking-tight">
            <BrainCircuit className="w-8 h-8 text-indigo-500 animate-pulse" />
            UPYOG Cognitive Assistant
          </h1>
          <p className="text-sm sm:text-[15.5px] mt-1.5 text-[var(--color-text-secondary)] font-medium tracking-wide">
            Ask natural language questions about your property records, municipal taxes, and municipal approvals
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => setShowKeySetup(!showKeySetup)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-all border cursor-pointer ${
              showKeySetup || !isKeyConfigured
                ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20'
                : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/20'
            }`}
          >
            <Key className="w-4 h-4" />
            {showKeySetup ? 'Close Key Setup' : isKeyConfigured ? 'Configure API Key' : 'Setup API Key'}
          </button>
          <div className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-500 text-[13px] font-bold tracking-wide">
            <Sparkles className="w-4 h-4" />
            Active Municipal Audit Mode
          </div>
        </div>
      </div>

      {/* Messages Window */}
      <div className="flex-1 min-h-0 overflow-y-auto py-4 space-y-6 pr-1 scrollbar-thin">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isAI = msg.role === 'assistant';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-4 max-w-[88%] ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar Icon */}
                <div className={`w-11 h-11 rounded-full shrink-0 flex items-center justify-center border shadow-sm ${
                  isAI
                    ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                    : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                }`}>
                  {isAI ? <BrainCircuit className="w-5.5 h-5.5" /> : <User className="w-5.5 h-5.5" />}
                </div>

                {/* Message Content Bubble */}
                <div className={`p-6 sm:p-7 rounded-2xl shadow-sm border leading-relaxed tracking-wide ${
                  isAI
                    ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] border-[var(--color-border)] rounded-tl-sm'
                    : 'bg-indigo-600 text-white border-indigo-600/10 rounded-tr-sm shadow-md shadow-indigo-600/10'
                }`}>
                  {isAI ? (
                    <article className="max-w-none text-[var(--color-text-primary)]">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-4 text-[16px] sm:text-[17.5px] leading-relaxed text-[var(--color-text-primary)] font-normal last:mb-0">{children}</p>,
                          li: ({ children }) => <li className="mb-2 text-[16px] sm:text-[17.5px] leading-relaxed text-[var(--color-text-primary)] font-normal list-disc ml-5">{children}</li>,
                          ul: ({ children }) => <ul className="mb-4 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="mb-4 space-y-1 list-decimal ml-5">{children}</ol>,
                          h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-2 text-[var(--color-text-primary)]">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-xl font-bold mb-3 mt-2 text-[var(--color-text-primary)]">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-lg font-bold mb-2 mt-2 text-[var(--color-text-primary)]">{children}</h3>,
                          strong: ({ children }) => <strong className="font-bold text-indigo-600 dark:text-indigo-400">{children}</strong>,
                          em: ({ children }) => <em className="italic text-[var(--color-text-secondary)]">{children}</em>,
                          table: ({ children }) => (
                            <div className="overflow-x-auto my-5 rounded-xl border border-[var(--color-border)] shadow-sm">
                              <table className="min-w-full divide-y divide-[var(--color-border)] bg-[var(--color-surface)]">{children}</table>
                            </div>
                          ),
                          thead: ({ children }) => <thead className="bg-[var(--color-surface-secondary)]">{children}</thead>,
                          tbody: ({ children }) => <tbody className="divide-y divide-[var(--color-border)]">{children}</tbody>,
                          tr: ({ children }) => <tr className="hover:bg-indigo-500/[0.01] transition-colors">{children}</tr>,
                          th: ({ children }) => <th className="px-5 py-3.5 text-left text-xs sm:text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider bg-[var(--color-surface-tertiary)]/50">{children}</th>,
                          td: ({ children }) => <td className="px-5 py-3.5 text-sm text-[var(--color-text-primary)] font-medium whitespace-nowrap">{children}</td>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </article>
                  ) : (
                    <p className="whitespace-pre-line leading-relaxed font-semibold text-[16px] sm:text-[17.5px]">{msg.content}</p>
                  )}
                  <p className={`text-[10.5px] sm:text-xs mt-3.5 text-right font-medium ${isAI ? 'text-[var(--color-text-tertiary)]' : 'text-indigo-200'}`}>
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
            className="flex gap-4 max-w-[80%] mr-auto"
          >
            <div className="w-11 h-11 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center">
              <BrainCircuit className="w-5.5 h-5.5 animate-spin" />
            </div>
            <div className="p-6 rounded-2xl bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-tl-sm shadow-sm flex items-center gap-3 text-[16px] sm:text-[17px] font-medium tracking-wide">
              <span className="text-[var(--color-text-secondary)]">Cognitive Assistant is analyzing municipal data</span>
              <span className="flex items-center gap-0.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-[var(--color-text-tertiary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-[var(--color-text-tertiary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-[var(--color-text-tertiary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </motion.div>
        )}

        {/* Dynamic Inline Key Activation Setup Card */}
        {(!isKeyConfigured || showKeySetup) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 sm:p-7 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 border border-indigo-500/20 rounded-2xl space-y-4 max-w-xl mx-auto my-6 shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20 shrink-0">
                <Key className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base text-[var(--color-text-primary)] tracking-wide">Configure Analytics Engine Key</h3>
                <p className="text-xs sm:text-sm text-[var(--color-text-tertiary)] leading-relaxed">
                  Provide your API Access Key to unlock advanced generative capabilities. If left offline, UPYOG Cognitive Assistant automatically routes your questions through our high-speed local analytics engine.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="password"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="Enter API access key..."
                  className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-3 px-4 text-sm text-[var(--color-text-primary)] outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/60"
                />
                <div className="flex gap-2.5 shrink-0">
                  <button
                    onClick={handleSaveKey}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-600/15 cursor-pointer active:scale-95"
                  >
                    {apiKey ? 'Update Key' : 'Activate Key'}
                  </button>
                  {apiKey && (
                    <button
                      onClick={handleClearKey}
                      className="px-5 py-3 rounded-xl bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/20 font-bold text-sm transition-all cursor-pointer active:scale-95"
                    >
                      Clear Key
                    </button>
                  )}
                </div>
              </div>
              <p className="text-[11px] sm:text-xs text-[var(--color-text-tertiary)] leading-relaxed">
                Need a key? You can generate one in your Google AI Studio console. Keys are stored strictly and securely inside your browser's local storage.
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
              disabled={isLoading}
              onClick={() => handleSendMessage(prompt)}
              className="px-6 py-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-secondary)] text-[14px] sm:text-[15px] font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] shadow-sm transition-all whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about UPYOG property registrations, collections, or pending reviews..."
            className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl h-[64px] pl-6 pr-18 text-[16px] sm:text-[17.5px] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/70 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500/80 shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 w-12 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-all cursor-pointer shadow-md shadow-indigo-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5.5 h-5.5" />
          </button>
        </form>

        {/* API Info Disclaimer */}
        <div className="flex items-center gap-1.5 justify-center text-xs sm:text-sm text-[var(--color-text-tertiary)] font-medium tracking-wide">
          <AlertCircle className="w-4 h-4 text-indigo-500" />
          <span>Assistant responses are based on database snapshots. Verify critical metrics independently.</span>
        </div>
      </div>
    </div>
  );
}
