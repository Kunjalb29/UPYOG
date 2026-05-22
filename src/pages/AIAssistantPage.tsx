import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useFilteredProperties } from '@/hooks/useFilteredProperties';
import { generateAIResponse } from '@/ai/gemini';
import { generateContext } from '@/ai/context';
import { SUGGESTED_PROMPTS } from '@/constants/navigation';
import { BrainCircuit, Send, User, Sparkles, AlertCircle } from 'lucide-react';
import type { ChatMessage } from '@/types/property';

export default function AIAssistantPage() {
  const properties = useFilteredProperties();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am your UPYOG AI Assistant. 

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
        content: `Sorry, I encountered an issue querying the AI service: ${err.message || 'Unknown error'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-h-[850px]">
      {/* AI Page Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-[var(--color-text-primary)]">
            <BrainCircuit className="w-6 h-6 text-indigo-500 animate-pulse" />
            UPYOG AI Assistant
          </h1>
          <p className="text-sm mt-0.5 text-[var(--color-text-tertiary)]">
            Ask natural language questions about your property records, municipal taxes, and municipal approvals
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          Powered by Gemini 1.5 Flash
        </div>
      </div>

      {/* Messages Window */}
      <div className="flex-1 min-h-0 overflow-y-auto py-4 space-y-4 pr-1 scrollbar-thin">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isAI = msg.role === 'assistant';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 max-w-[85%] ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar Icon */}
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border shadow-sm ${
                  isAI
                    ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                    : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                }`}>
                  {isAI ? <BrainCircuit className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Content Bubble */}
                <div className={`p-4 rounded-2xl shadow-sm text-xs border ${
                  isAI
                    ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] border-[var(--color-border)] rounded-tl-sm'
                    : 'bg-indigo-500 text-white border-indigo-500/10 rounded-tr-sm'
                }`}>
                  {isAI ? (
                    <article className="prose dark:prose-invert prose-xs max-w-none text-[var(--color-text-primary)] prose-headings:font-bold prose-headings:text-[var(--color-text-primary)] prose-strong:text-indigo-500 dark:prose-strong:text-indigo-400 prose-ul:list-disc prose-ul:pl-4 prose-ol:list-decimal prose-ol:pl-4 space-y-2">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </article>
                  ) : (
                    <p className="whitespace-pre-line leading-relaxed font-medium">{msg.content}</p>
                  )}
                  <p className={`text-[9px] mt-2 text-right ${isAI ? 'text-[var(--color-text-tertiary)]' : 'text-indigo-200'}`}>
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
            className="flex gap-3 max-w-[80%] mr-auto"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center">
              <BrainCircuit className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-tl-sm shadow-sm flex items-center gap-1.5 text-xs">
              <span className="text-[var(--color-text-secondary)]">UPYOG AI is analyzing municipal data</span>
              <span className="flex items-center gap-0.5 mt-0.5">
                <span className="w-1 h-1 bg-[var(--color-text-tertiary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-1 bg-[var(--color-text-tertiary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-1 bg-[var(--color-text-tertiary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input panel & Suggested Prompts */}
      <div className="mt-4 pt-4 border-t border-[var(--color-border)] shrink-0 space-y-3.5">
        {/* Suggested Prompts Grid */}
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              disabled={isLoading}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-secondary)] text-[10px] font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all whitespace-nowrap cursor-pointer disabled:opacity-50"
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
            placeholder="Ask AI anything about UPYOG property registrations or taxes..."
            className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl py-3 pl-4 pr-12 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2.5 top-1.5 w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-all cursor-pointer shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>

        {/* API Info Disclaimer */}
        <div className="flex items-center gap-1.5 justify-center text-[10px] text-[var(--color-text-tertiary)]">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>AI answers based on platform database snapshot. Verify critical metrics independently.</span>
        </div>
      </div>
    </div>
  );
}
