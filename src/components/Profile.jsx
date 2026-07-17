import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import UpperNavbar from './UpperNavbar'
import BottomNavbar from './BottomNavbar'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

const LIGHT_C = {
  primary: "#2563EB",
  primaryDark: "#1E40AF",
  primarySoft: "#DBEAFE",
  accent: "#F5A97F",
  danger: "#C0392B",
  dangerSoft: "#FBEAEA",
  bg: "#EEF2F6",
  surface: "#FFFFFF",
  field: "#EDF2F9",
  border: "#D7E0EC",
  text: "#1F2937",
  textMuted: "#6B7280",
  page: "#eff6ff",
};

const DARK_C = {
  primary: "#22d3ee",
  primaryDark: "#67e8f9",
  primarySoft: "rgba(34,211,238,0.12)",
  accent: "#F5A97F",
  danger: "#f87171",
  dangerSoft: "rgba(248,113,113,0.12)",
  bg: "#05070d",
  surface: "#0e131d",
  field: "rgba(255,255,255,0.05)",
  border: "rgba(255,255,255,0.1)",
  text: "#e5e7eb",
  textMuted: "#94a3b8",
  page: "#05070d",
};

/* mutated per-render by Profile based on the active theme; Card/MenuRow read this
   same module binding when React calls them during the same render pass */
let C = LIGHT_C;

const Icon = {
  leaf: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M5 19c8 1 14-5 14-13-8 0-14 5-14 13Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M5 19c2-5 6-9 10-11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  user: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 19.5c1.2-3 4-4.5 7-4.5s5.8 1.5 7 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  edit: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 20h4l11-11-4-4L4 16v4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  logout: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M14 4H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 12h10m0 0-3-3m3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chevron: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  camera: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 8h3l1.5-2h7L17 8h3v11H4V8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
};

function Card({ children, style }) {
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function MenuRow({ icon: Ic, label, hint, danger, last, onClick }) {
  const color = danger ? C.danger : C.text;
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        padding: "14px 16px",
        background: "transparent",
        border: "none",
        borderBottom: last ? "none" : `1px solid ${C.border}`,
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "inherit",
      }}
    >
      <span
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          display: "grid",
          placeItems: "center",
          background: danger ? C.dangerSoft : C.primarySoft,
          color: danger ? C.danger : C.primary,
          flexShrink: 0,
        }}
      >
        <Ic width={18} height={18} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 14.5, fontWeight: 600, color }}>{label}</span>
        {hint && (
          <span style={{ display: "block", fontSize: 12.5, color: C.textMuted, marginTop: 1 }}>{hint}</span>
        )}
      </span>
      {!danger && <Icon.chevron width={18} height={18} style={{ color: "#9AA5B1", flexShrink: 0 }} />}
    </button>
  );
}

export default function Profile() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  C = theme === "dark" ? DARK_C : LIGHT_C;
  const [profile, setProfile] = useState({
    name: 'Pengguna',
    email: '',
    tinggi: '-',
    berat: '-',
    umur: '-',
  })
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { navigate('/login'); return }
      const { data } = await supabase
        .from('profiles')
        .select('name, weight_kg, height_cm, age, avatar_url')
        .eq('id', session.user.id)
        .single()
      setProfile({
        name: session.user.user_metadata?.name || data?.name || 'Pengguna',
        email: session.user.email || '',
        tinggi: data?.height_cm ?? '-',
        berat: data?.weight_kg ?? '-',
        umur: data?.age ?? '-',
      })
      if (data?.avatar_url) setAvatarUrl(data.avatar_url)
    })
  }, [navigate])

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    setUploading(true)
    const ext = file.name.split('.').pop()
    const filePath = `${session.user.id}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      alert('Gagal upload foto: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    setAvatarUrl(publicUrl)

    await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', session.user.id)

    setUploading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "0 auto",
        height: "100vh",
        background: C.page,
        fontFamily: "'Inter', -apple-system, 'Segoe UI', sans-serif",
        color: C.text,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "background-color 0.2s ease, color 0.2s ease",
      }}
    >
      <UpperNavbar />
      <main style={{ flex: 1, overflowY: "auto" }}>

        <div style={{ padding: "16px 16px 24px" }}>
          <Card style={{ padding: 20, textAlign: "center" }}>
            <div style={{ position: "relative", width: 84, height: 84, margin: "0 auto" }}>
              <div
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: "50%",
                  background: avatarUrl ? 'none' : `linear-gradient(135deg, ${C.primarySoft}, #CFEBDD)`,
                  display: "grid",
                  placeItems: "center",
                  color: C.primary,
                  border: `2px solid ${C.primary}`,
                  overflow: "hidden",
                }}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Foto profil"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <Icon.user width={40} height={40} />
                )}
              </div>
              <button
                aria-label="Ubah foto profil"
                onClick={handleFileSelect}
                disabled={uploading}
                style={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: C.primary,
                  color: "#fff",
                  border: "2px solid #fff",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  opacity: uploading ? 0.6 : 1,
                }}
              >
                <Icon.camera width={15} height={15} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
            </div>

            <h2 style={{ margin: "12px 0 2px", fontSize: 19, fontWeight: 800, color: C.primaryDark }}>
              {profile.name}
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: C.textMuted }}>{profile.email}</p>
          </Card>

          <p
            style={{
              margin: "20px 4px 8px",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.2,
              color: C.textMuted,
              textTransform: "uppercase",
            }}
          >
            Data Kesehatan
          </p>
          <Card style={{ padding: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                { label: "Tinggi", value: profile.tinggi, unit: "cm" },
                { label: "Berat", value: profile.berat, unit: "kg" },
                { label: "Umur", value: profile.umur, unit: "Tahun" },
              ].map((d) => (
                <div
                  key={d.label}
                  style={{
                    background: C.field,
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    padding: "12px 8px",
                    textAlign: "center",
                  }}
                >
                  <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>{d.label}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 800, color: C.primaryDark }}>
                    {d.value}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 11.5,
                      fontWeight: 500,
                      color: C.textMuted,
                    }}
                  >
                    {d.unit}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              marginTop: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  display: "grid",
                  placeItems: "center",
                  background: C.primarySoft,
                  color: C.primary,
                  flexShrink: 0,
                }}
              >
                {theme === 'dark' ? <Moon width={18} height={18} /> : <Sun width={18} height={18} />}
              </span>
              <span style={{ fontSize: 14.5, fontWeight: 600, color: C.text }}>
                Mode Gelap
              </span>
            </div>
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              style={{
                width: 48,
                height: 26,
                borderRadius: 13,
                border: "none",
                cursor: "pointer",
                position: "relative",
                background: theme === 'dark' ? C.primary : C.border,
                transition: "background 0.2s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  left: theme === 'dark' ? 24 : 3,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              />
            </button>
          </Card>

          <p
            style={{
              margin: "20px 4px 8px",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.2,
              color: C.textMuted,
              textTransform: "uppercase",
            }}
          >
            Lainnya
          </p>
          <Card>
            <MenuRow icon={Icon.logout} label="Keluar" danger last onClick={handleLogout} />
          </Card>

        </div>
      </main>

      <BottomNavbar />
    </div>
  );
}