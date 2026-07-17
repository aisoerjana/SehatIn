import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ChefHat, Clock, Utensils, Lightbulb, Sparkles, AlertCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import UpperNavbar from './UpperNavbar';
import BottomNavbar from './BottomNavbar';

function renderBoldText(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

const suggestions = [
  'I have chicken breast, broccoli, and tofu. I want to bulk, what should I cook?',
  "I have tempeh, eggs, and water spinach at home. What's a good menu for cutting?",
  'I have mackerel, brown rice, and spinach. A simple recipe for lunch?',
  'Ingredients I have: potatoes, carrots, and beef. I want to make a warm dinner.',
];

export default function Ask() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hi! I'm **SehatIn** — your virtual chef. Tell me what ingredients you have and your goal (bulking/cutting/maintain), and I'll help you create a recipe!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);



  const sendMessage = async (text) => {
    const userText = text || input;
    if (!userText.trim() || loading) return;

    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('gemini-proxy', {
        body: { mode: 'ask', prompt: userText },
      });

      if (invokeError) throw new Error(invokeError.message);
      if (data?.error) throw new Error(data.error);

      const recipe = data.judul
        ? data
        : { judul: 'Recipe', bahan: [], langkah: [], estimasi_kalori: 0 };

      setMessages((prev) => [...prev, { role: 'bot', recipe }]);
    } catch (err) {
      setError(err.message);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: `Sorry, an error occurred: ${err.message}. Please try again.` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="page-enter flex flex-col h-screen w-full max-w-md mx-auto bg-[#F6F9FF] dark:bg-[#05070d] transition-colors">
      <UpperNavbar />

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="navbar-enter-down flex items-center gap-3 py-4 border-b border-gray-100 dark:border-white/10 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-md">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">SehatIn</h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Ask for recipes from ingredients you have</p>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-4 mb-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={msg.role === 'user' ? 'slide-in-right' : 'page-enter-up'}>
                {msg.role === 'user' ? (
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-blue-600 dark:bg-gradient-to-r dark:from-cyan-400 dark:to-blue-500 text-white rounded-2xl rounded-br-sm px-4 py-3 max-w-[85%] shadow-sm">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                      <User className="w-4 h-4 text-blue-600 dark:text-cyan-300" />
                    </div>
                  </div>
                ) : msg.recipe ? (
                  <RecipeCard recipe={msg.recipe} />
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white dark:bg-[#0b0f17] border border-gray-100 dark:border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[85%] shadow-sm">
                      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {renderBoldText(msg.text)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="page-enter-up flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white dark:bg-[#0b0f17] border border-gray-100 dark:border-white/10 rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="grid grid-cols-1 gap-2 mb-4">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  disabled={loading}
                  style={{ animationDelay: `${i * 70}ms` }}
                  className="stagger-item text-left bg-white dark:bg-[#0b0f17] border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-gray-600 dark:text-gray-400 hover:border-blue-200 dark:hover:border-cyan-400/30 hover:bg-blue-50/50 dark:hover:bg-white/5 transition-all shadow-sm"
                >
                  <Sparkles className="w-3 h-3 inline mr-1.5 text-cyan-400" />
                  {s}
                </button>
              ))}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-xl px-4 py-3 mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 pb-3 bg-gradient-to-t from-[#F6F9FF] dark:from-[#05070d] via-[#F6F9FF]/80 dark:via-[#05070d]/80 to-transparent pt-4">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="flex items-end gap-2 bg-white dark:bg-[#0b0f17] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-2 shadow-sm">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. I have chicken breast, tofu, broccoli..."
              disabled={loading}
              className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 py-2 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-9 h-9 bg-blue-600 dark:bg-gradient-to-br dark:from-cyan-400 dark:to-blue-500 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </form>
      </div>

      <BottomNavbar />
    </div>
  );
}

function RecipeCard({ recipe }) {
  return (
    <div className="page-enter-up flex items-start gap-3">
      <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shrink-0 mt-1">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white dark:bg-[#0b0f17] border border-gray-100 dark:border-white/10 rounded-2xl rounded-bl-sm p-4 max-w-[85%] shadow-sm flex-1">
        <h3 className="font-bold text-gray-900 dark:text-white text-base mb-2">{recipe.judul}</h3>

        <div className="flex flex-wrap gap-3 mb-3">
          {recipe.porsi && (
            <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
              <Utensils className="w-3.5 h-3.5" />
              {recipe.porsi}
            </div>
          )}
          {recipe.waktu_masak && (
            <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              {recipe.waktu_masak}
            </div>
          )}
          {recipe.estimasi_kalori && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-cyan-300">
              ~{recipe.estimasi_kalori} kkal
            </div>
          )}
        </div>

        {/* Ingredients */}
        {recipe.bahan?.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Ingredients:</p>
            <ul className="space-y-1">
              {recipe.bahan.map((b, i) => (
                <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Steps */}
        {recipe.langkah?.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">How to cook:</p>
            <ol className="space-y-1.5">
              {recipe.langkah.map((l, i) => (
                <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                  <span className="font-bold text-blue-600 dark:text-cyan-300 min-w-[18px]">{i + 1}.</span>
                  {l}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Tips */}
        {recipe.tips && (
          <div className="flex items-start gap-2 bg-yellow-50 dark:bg-yellow-500/10 rounded-xl px-3 py-2 mt-2">
            <Lightbulb className="w-4 h-4 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-700 dark:text-yellow-300">{recipe.tips}</p>
          </div>
        )}

        {/* Nutrition */}
        {(recipe.estimasi_protein_g || recipe.estimasi_carbs_g || recipe.estimasi_lemak_g) && (
          <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-white/10">
            {recipe.estimasi_protein_g && (
              <span className="text-[10px] font-medium text-red-600 dark:text-red-400">P {recipe.estimasi_protein_g}g</span>
            )}
            {recipe.estimasi_carbs_g && (
              <span className="text-[10px] font-medium text-yellow-600 dark:text-yellow-400">C {recipe.estimasi_carbs_g}g</span>
            )}
            {recipe.estimasi_lemak_g && (
              <span className="text-[10px] font-medium text-orange-600 dark:text-orange-400">F {recipe.estimasi_lemak_g}g</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
