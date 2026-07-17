import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { User, ArrowRight, Lightbulb, Calendar } from 'lucide-react'
import UpperNavbar from './UpperNavbar'
import BottomNavbar from './BottomNavbar'

export default function Dashboard() {
  const navigate = useNavigate()
  const [userName, setUserName] = useState('User')
  const [avatarUrl, setAvatarUrl] = useState(null) // profile photo state — fetched from the profiles table; default null = default icon
  const [latestResult, setLatestResult] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { navigate('/login'); return }
      setUserName(session.user.user_metadata?.name || 'User')

      // Fetch profile photo from the profiles table — avatar_url is set when the user uploads via the Profile page
      const { data: profile } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', session.user.id)
        .maybeSingle()

      if (profile?.avatar_url) setAvatarUrl(profile.avatar_url) // if a photo exists, save it to state; if null, render the default icon

      const { data } = await supabase
        .from('macro_targets')
        .select('calorie_target, protein_g, carbs_g, fat_g, fiber_g, sugar_max_g, created_at')
        .eq('profile_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (data) setLatestResult(data)
    })
  }, [navigate])

  const greetingTime = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 15) return 'Good afternoon'
    if (hour < 18) return 'Good evening'
    return 'Good night'
  }

  const fmt = (val) => {
    if (val == null) return '0'
    const num = Number(val)
    if (Number.isInteger(num)) return num.toLocaleString('en-US')
    return num.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  }

  const dailyTips = [
    { title: 'Drink Enough Water', body: 'Drink at least 8 glasses of water every day to keep your body hydrated.' },
    { title: "Don't Skip Breakfast", body: 'A nutritious breakfast helps provide energy to start your activities.' },
    { title: 'Get Quality Sleep', body: "Aim for 7–9 hours of sleep every night to maintain your body's health." },
    { title: 'Eat More Fruit', body: 'Fruit contains vitamins and antioxidants that are good for your immune system.' },
    { title: 'Eat Vegetables Every Day', body: 'Complete every meal with vegetables to meet your fiber needs.' },
    { title: 'Reduce Sugar Intake', body: 'Limit sugary foods and drinks to help maintain healthy blood sugar levels.' },
    { title: 'Limit Excess Salt', body: 'Reducing salt intake can help keep your blood pressure normal.' },
    { title: 'Stay Physically Active', body: 'Moving or exercising for 30 minutes a day helps maintain your fitness.' },
    { title: 'Rest Your Eyes', body: 'Look away from the screen every 20 minutes to reduce eye strain.' },
    { title: 'Keep Your Hands Clean', body: 'Make it a habit to wash your hands with soap before eating and after activities.' },
    { title: 'Get Enough Protein', body: 'Protein helps repair body tissue and maintain muscle mass.' },
    { title: 'Cut Down on Fast Food', body: 'Choose fresh, nutritious food over processed food.' },
    { title: 'Eat Regularly', body: "Don't delay meals so your body always has enough energy." },
    { title: 'Choose Healthy Fats', body: 'Get healthy fats from fish, avocado, or nuts.' },
    { title: 'Manage Stress Well', body: 'Take time to relax so your mind stays calm and healthy.' },
    { title: 'Maintain Good Posture', body: 'Sitting and standing correctly can reduce the risk of back pain.' },
    { title: 'Limit Soft Drinks', body: 'Replace soft drinks with water or sugar-free beverages.' },
    { title: 'Get Regular Health Checkups', body: 'Routine checkups help detect health issues early.' },
    { title: 'Keep Your Environment Clean', body: 'A clean environment can help prevent the spread of disease.' },
    { title: 'Start with Small Habits', body: 'Small changes made consistently will bring big benefits to your health.' },
  ]

  const todaysTip = () => {
    const start = new Date('2025-01-01')
    const today = new Date()
    const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24))
    return dailyTips[diff % dailyTips.length]
  }

  const dailyNeeds = latestResult ? [
    { label: 'Calories', value: `${fmt(latestResult.calorie_target)} kcal`, bg: 'bg-green-50', text: 'text-green-700' },
    { label: 'Protein', value: `${fmt(latestResult.protein_g)} g`, bg: 'bg-blue-50', text: 'text-blue-700' },
    { label: 'Carbs', value: `${fmt(latestResult.carbs_g)} g`, bg: 'bg-orange-50', text: 'text-orange-700' },
    { label: 'Fat', value: `${fmt(latestResult.fat_g)} g`, bg: 'bg-yellow-50', text: 'text-yellow-700' },
    { label: 'Sugar', value: `${fmt(latestResult.sugar_max_g)} g`, bg: 'bg-red-50', text: 'text-red-700' },
    { label: 'Fiber', value: `${fmt(latestResult.fiber_g)} g`, bg: 'bg-purple-50', text: 'text-purple-700' },
  ] : []

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-[#F6F9FF] dark:bg-[#05070d] transition-colors">

      <UpperNavbar />

      <div className="flex-1 overflow-y-auto pb-24">

        <div className="px-5 py-5">
          <div className="page-enter-up flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-[#6B7280] dark:text-gray-400 font-medium">{greetingTime()},</p>
              <h2 className="text-2xl font-bold text-[#1F2937] dark:text-cyan-300">Hello, {userName}!</h2>
            </div>
            {/* Profile photo (top-right corner). Wrapped in a Link to /profile so it's clickable.
                - If avatarUrl is set → render an <img> with object-cover to keep it proportional.
                - If null (not uploaded yet) → render the default User icon in a gray circle. */}
            <Link to="/profile">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Foto profil" className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-white/10 shadow-sm" />
              ) : (
                <div className="w-12 h-12 bg-gray-300 dark:bg-white/10 rounded-full flex items-center justify-center border-2 border-white dark:border-white/10 shadow-sm">
                  <User className="w-6 h-6 text-gray-500 dark:text-gray-300" />
                </div>
              )}
            </Link>
          </div>

          <div className="page-enter-up bg-gradient-to-br from-[#EAF2FF] to-white dark:from-[#0e1522] dark:to-[#0b0f17] border border-[#E5E7EB] dark:border-cyan-400/20 rounded-3xl p-5 mb-5 shadow-sm relative overflow-hidden" style={{ animationDelay: '100ms' }}>
            <div className="relative z-10 w-2/3">
              <h3 className="text-lg font-bold text-[#1F2937] dark:text-white mb-2 leading-tight">
                Daily Health<br/>Check
              </h3>
              <p className="text-xs text-[#6B7280] dark:text-gray-400 mb-4 leading-relaxed">
                Monitor your body's condition today for a healthier, more energetic life.
              </p>
              <Link to="/asesmen">
                <button className="bg-[#2563EB] hover:bg-blue-800 dark:bg-gradient-to-r dark:from-cyan-400 dark:to-blue-500 dark:hover:opacity-90 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-colors">
                  Start Health Assessment
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-200/50 dark:bg-cyan-400/10 rounded-full blur-2xl"></div>
          </div>

          {/* Today's Tip */}
          <div className="page-enter-up mb-5 bg-white dark:bg-[#0b0f17] border border-[#E5E7EB] dark:border-white/10 rounded-2xl p-5 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300" style={{ animationDelay: '200ms' }}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#EAF2FF] dark:bg-cyan-400/10 rounded-xl flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5 text-[#2563EB] dark:text-cyan-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-[#1F2937] dark:text-white mb-1">Today's Tip</h3>
                <p className="text-xs font-medium text-[#2563EB] dark:text-cyan-300 mb-1">{todaysTip().title}</p>
                <p className="text-xs text-[#6B7280] dark:text-gray-400 leading-relaxed">
                  {todaysTip().body}
                </p>
              </div>
            </div>
          </div>

          {/* Latest Result */}
          {latestResult && (
            <div className="page-enter-up mb-5 bg-white dark:bg-[#0b0f17] border border-[#E5E7EB] dark:border-white/10 rounded-2xl p-5 shadow-sm" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#1F2937] dark:text-white">Latest Result</h3>
                <div className="flex items-center gap-1.5 text-[10px] text-[#6B7280] dark:text-gray-400 font-medium">
                  <Calendar className="w-3 h-3" />
                  {new Date(latestResult.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <div className="space-y-3">
                {dailyNeeds.map((item, index) => (
                  <div
                    key={index}
                    className={`${item.bg} dark:bg-white/5 rounded-xl px-4 py-3 flex items-center justify-between hover:scale-[1.02] transition-all duration-300 stagger-item`}
                    style={{ animationDelay: `${350 + index * 60}ms` }}
                  >
                    <span className="text-sm font-semibold text-[#1F2937] dark:text-gray-200">{item.label}</span>
                    <span className={`text-sm font-bold ${item.text} dark:text-white/80`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <BottomNavbar />

    </div>
  )
}
  