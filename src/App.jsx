function App() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600">
          Tailwind Berhasil! 🎉
        </h1>
        <p className="mt-2 text-gray-500">
          Kalau tulisan ini berwarna biru dan ada bayangan (shadow) di kotaknya, berarti Tailwind sudah jalan.
        </p>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Klik Saya
        </button>
      </div>
    </div>
  )
}

export default App