import UpperNavbar from './UpperNavbar'
import BottomNavbar from './BottomNavbar'
import { List } from 'lucide-react'

export default function FoodList() {
  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC]">
      <UpperNavbar />
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <List className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Daftar Makanan</h2>
        <p className="text-sm text-gray-500 max-w-xs">Daftar makanan akan muncul di sini.</p>
      </div>
      <BottomNavbar />
    </div>
  )
}
