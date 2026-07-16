import UpperNavbar from './UpperNavbar'
import BottomNavbar from './BottomNavbar'
import { List } from 'lucide-react'

export default function FoodList() {
  return (
    <div className="flex flex-col h-screen bg-[#eff6ff] dark:bg-[#05070d] transition-colors">
      <UpperNavbar />
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <List className="w-16 h-16 text-gray-300 dark:text-white/20 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Daftar Makanan</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">Daftar makanan akan muncul di sini.</p>
      </div>
      <BottomNavbar />
    </div>
  )
}
