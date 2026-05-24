import { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles, Bot, User, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatPanelProps {
  onClose: () => void;
}

export default function AIChatPanel({ onClose }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm your Untie SaaS Assistant. I can help analyze your dashboard's revenue, active users, open tasks, or conversion rates. What would you like to explore today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const suggestedPrompts = [
    "Analyze conversion rate",
    "Summarize revenue trend",
    "Are we on track?"
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey === 'placeholder') {
      // Return a simulated response if no valid API key is present, but notify the user
      setTimeout(() => {
        let simulatedReply = "";
        const lowerText = textToSend.toLowerCase();

        if (lowerText.includes('conversion')) {
          simulatedReply = "Your conversion rate is currently at 6.8%, which is up 1.7% from last week. This indicates strong user onboarding flows and effective checkout page optimization. To push this past 7%, I recommend running an A/B test on your primary CTA buttons.";
        } else if (lowerText.includes('revenue') || lowerText.includes('trend')) {
          simulatedReply = "Total revenue stands at $124,500 (+12.5% YoY). Monthly trend data shows continuous growth in the current year, starting from $8,000 in January to $15,000 in December, consistently outperforming the previous year's values by about 20-30%.";
        } else if (lowerText.includes('track') || lowerText.includes('status')) {
          simulatedReply = "Yes, you are firmly on track! Active users are up to 3,842 (+8.2%), and revenue has increased by 12.5%. While you have 47 open tasks, this is down 4.3% from last week, showing excellent completion velocity.";
        } else {
          simulatedReply = `I received your message about "${textToSend}". Since the VITE_GEMINI_API_KEY environment variable is currently using a placeholder, I am running in simulation mode. Your active metrics look solid: $124,500 Revenue, 3,842 Active Users, 47 Tasks, and 6.8% Conversion Rate!`;
        }

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: simulatedReply,
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
      }, 1200);
      return;
    }

    try {
      // Map message state to Gemini format: user content has role 'user' and assistant has role 'model'
      const apiContents = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));
      
      apiContents.push({
        role: 'user',
        parts: [{ text: textToSend }]
      });

      const systemPrompt = `You are a professional SaaS Analytics Assistant for the 'Untie' dashboard. 
You have real-time access to the following current metrics:
- Total Revenue: $124,500 (up +12.5% compared to previous year)
- Active Users: 3,842 (up +8.2% compared to last month)
- Open Tasks: 47 (down -4.3% compared to last week)
- Conversion Rate: 6.8% (up +1.7% compared to last week)

The monthly revenue trend from January to December shows steady growth in the current year (starting at $8k and peaking at $15k in December), consistently beating the previous year (which peaked at $11k in December).

Analyze these metrics or answer user questions about them. Keep your answers concise, clear, and actionable. Frame your response as a professional business analyst. Avoid generic advice, refer back to the specific figures where appropriate.`;

      // Try sequential fallback in case a model is retired or not supported on this account's tier
      const modelsToTry = [
        selectedModel,
        'gemini-2.0-flash',
        'gemini-2.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-1.5-flash',
        'gemini-1.5-pro'
      ];
      
      const uniqueModels = Array.from(new Set(modelsToTry));
      let success = false;
      let replyText = "";
      let lastErrorMsg = "";

      for (const modelName of uniqueModels) {
        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: apiContents,
              systemInstruction: {
                parts: [{ text: systemPrompt }]
              },
              generationConfig: {
                maxOutputTokens: 300,
              },
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errMsg = errorData.error?.message || `API error: ${response.status}`;
            
            // If model not found or not supported, log it and try next
            if (response.status === 404 || errMsg.toLowerCase().includes('not found') || errMsg.toLowerCase().includes('not supported')) {
              lastErrorMsg = errMsg;
              continue;
            }
            throw new Error(errMsg);
          }

          const data = await response.json();
          replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
          
          if (replyText) {
            success = true;
            setSelectedModel(modelName); // Keep the model that succeeded
            break;
          }
        } catch (err: any) {
          console.warn(`Attempt with ${modelName} failed:`, err);
          lastErrorMsg = err.message || err;
        }
      }

      if (!success) {
        throw new Error(lastErrorMsg || "All selected models failed to process the request.");
      }

      const botMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: replyText,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Error fetching Gemini API:', err);
      setError(err.message || 'Failed to connect to the Gemini Assistant.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-full w-[320px] bg-sidebar-dark border-l border-slate-800 shadow-2xl z-40 transition-all duration-300">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-card-dark border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-blue animate-pulse-glow" />
          <div className="text-left">
            <h2 className="text-xs font-bold tracking-wide text-slate-200">AI Assistant</h2>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="text-[9px] text-slate-400 bg-slate-900 border border-slate-800 rounded px-1 py-0.5 focus:outline-none focus:border-accent-blue cursor-pointer"
            >
              <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
              <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
              <option value="gemini-1.5-flash-latest">Gemini 1.5 Flash</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            </select>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-accent-blue" />
              </div>
            )}
            <div 
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-accent-blue text-white rounded-tr-none'
                  : 'bg-card-dark text-slate-300 border border-slate-800/80 rounded-tl-none'
              }`}
            >
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-slate-300" />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-start gap-2.5 justify-start">
            <div className="w-8 h-8 rounded-lg bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-accent-blue" />
            </div>
            <div className="bg-card-dark border border-slate-800/80 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}

        {/* Error box */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-950/20 border border-red-800/40 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <div>
              <p className="font-semibold">Connection failed</p>
              <p className="opacity-90">{error}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips (only shown on first load / when there's only the welcome message) */}
      {messages.length === 1 && !isLoading && (
        <div className="px-4 py-2 space-y-2 border-t border-slate-800/50 bg-slate-900/30">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Suggestions</p>
          <div className="flex flex-col gap-1.5">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="text-left w-full text-[11px] text-slate-300 bg-card-dark border border-slate-800 hover:border-accent-blue/40 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition truncate"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Field */}
      <div className="p-3 bg-card-dark border-t border-slate-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask AI about metrics..."
            className="flex-1 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30 transition"
          />
          <button
            onClick={() => handleSendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="p-1.5 bg-accent-blue hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-600 rounded-lg text-white transition flex items-center justify-center shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        {import.meta.env.VITE_GEMINI_API_KEY === 'placeholder' && (
          <div className="mt-2 text-center text-[10px] text-yellow-500/80 flex items-center justify-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Simulation mode (key is placeholder)
          </div>
        )}
      </div>
    </div>
  );
}
