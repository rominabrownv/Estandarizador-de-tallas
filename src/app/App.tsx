import React, { useState, useEffect } from "react"
import {
  ArrowLeft,
  Search,
  Plus,
  User,
  Bell,
  ChevronRight,
  X,
  Check,
  Shirt,
  Home,
  LogOut,
  Ruler,
  Settings,
  SlidersHorizontal,
} from "lucide-react"

// ---- Types ----
type Screen =
  | "splash"
  | "onboarding"
  | "auth"
  | "home"
  | "garments"
  | "add-garment"
  | "search"
  | "result"
  | "profile"
  | "edit-measurements"
  | "edit-garment"
  | "notifications"

interface Garment {
  id: string
  name: string
  brand: string
  size: string
  type: string
  model?: string
  photo?: string
  refActive: boolean
}

// ---- Auth & Storage ----
interface UserAccount {
  email: string
  password: string
  name: string
  garments: Garment[]
  measurements: { pecho: string; cintura: string; cadera: string; hombros: string; manga: string; entrepierna: string }
}

const STORAGE_KEYS = {
  accounts: "unisize_accounts",
  session: "unisize_session",
}

function loadAccounts(): UserAccount[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.accounts) ?? "[]") } catch { return [] }
}

function saveAccounts(accounts: UserAccount[]) {
  localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(accounts))
}

function loadSession(): string | null {
  return localStorage.getItem(STORAGE_KEYS.session)
}

function saveSession(email: string) {
  localStorage.setItem(STORAGE_KEYS.session, email)
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.session)
}

// ---- Data ----
const BRANDS = [
  "Zara",
  "H&M",
  "Nike",
  "Adidas",
  "Levi's",
  "Mango",
  "Massimo Dutti",
  "Pull&Bear",
  "Stradivarius",
  "Bershka",
]

const GARMENT_TYPES = [
  "Camiseta",
  "Pantalón",
  "Vestido",
  "Chaqueta",
  "Camisa",
  "Sudadera",
]

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"]
const JEANS_SIZES = ["28", "30", "32", "34", "36", "38"]

const MATERIALS = [
  "Algodón",
  "Lino Premium",
  "Poliéster",
  "Denim",
  "Lana",
  "Seda",
  "Mezcla sintética",
]

const SEASONS = [
  "Primavera 2024",
  "Verano 2024",
  "Otoño 2024",
  "Invierno 2024",
  "Sin temporada",
]

const COLORS = [
  { name: "Blanco", hex: "#FFFFFF" },
  { name: "Negro", hex: "#111111" },
  { name: "Gris", hex: "#9CA3AF" },
  { name: "Azul marino", hex: "#1E3A8A" },
  { name: "Beige", hex: "#D4B896" },
  { name: "Verde", hex: "#16A34A" },
]

interface BrandModel {
  id: string
  brand: string
  name: string
  type: string
  material: string
  season: string
  fit: string
}

const BRAND_MODELS: BrandModel[] = [
  { id: "z1", brand: "Zara", name: "Blusa Lino Premium", type: "Blusa", material: "Lino", season: "Verano 2024", fit: "Regular" },
  { id: "z2", brand: "Zara", name: "Camisa Oxford Oversize", type: "Camisa", material: "Algodón", season: "Primavera 2024", fit: "Oversize" },
  { id: "z3", brand: "Zara", name: "Vestido Midi Satén", type: "Vestido", material: "Satén", season: "Verano 2024", fit: "Slim" },
  { id: "z4", brand: "Zara", name: "Blazer Estructurado", type: "Chaqueta", material: "Mezcla", season: "Otoño 2024", fit: "Estructurado" },
  { id: "z5", brand: "Zara", name: "Jeans Mom Fit", type: "Pantalón", material: "Denim", season: "Sin temporada", fit: "Mom" },
  { id: "z6", brand: "Zara", name: "Top Crop Punto", type: "Camiseta", material: "Algodón", season: "Verano 2024", fit: "Crop" },
  { id: "h1", brand: "H&M", name: "Blusa Fruncida Viscosa", type: "Blusa", material: "Viscosa", season: "Verano 2024", fit: "Regular" },
  { id: "h2", brand: "H&M", name: "Camisa Básica Algodón", type: "Camisa", material: "Algodón", season: "Sin temporada", fit: "Regular" },
  { id: "h3", brand: "H&M", name: "Vestido Camisero Lino", type: "Vestido", material: "Lino", season: "Primavera 2024", fit: "Regular" },
  { id: "h4", brand: "H&M", name: "Sudadera Crop Fleece", type: "Sudadera", material: "Mezcla sintética", season: "Otoño 2024", fit: "Crop" },
  { id: "n1", brand: "Nike", name: "Club Tee Premium", type: "Camiseta", material: "Algodón", season: "Sin temporada", fit: "Regular" },
  { id: "n2", brand: "Nike", name: "Sportswear Essential Tee", type: "Camiseta", material: "Poliéster", season: "Sin temporada", fit: "Slim" },
  { id: "n3", brand: "Nike", name: "Phoenix Fleece Hoodie", type: "Sudadera", material: "Mezcla sintética", season: "Invierno 2024", fit: "Oversize" },
  { id: "n4", brand: "Nike", name: "Dri-FIT Training Shirt", type: "Camisa", material: "Poliéster", season: "Sin temporada", fit: "Regular" },
  { id: "a1", brand: "Adidas", name: "Essentials 3-Stripes Tee", type: "Camiseta", material: "Algodón", season: "Sin temporada", fit: "Regular" },
  { id: "a2", brand: "Adidas", name: "Trefoil Hoodie", type: "Sudadera", material: "Mezcla sintética", season: "Otoño 2024", fit: "Regular" },
  { id: "a3", brand: "Adidas", name: "Adicolor Classics Tee", type: "Camiseta", material: "Algodón", season: "Sin temporada", fit: "Oversize" },
  { id: "m1", brand: "Mango", name: "Blusa Fluida Estampada", type: "Blusa", material: "Viscosa", season: "Verano 2024", fit: "Fluido" },
  { id: "m2", brand: "Mango", name: "Camisa Lino Oversize", type: "Camisa", material: "Lino", season: "Verano 2024", fit: "Oversize" },
  { id: "m3", brand: "Mango", name: "Vestido Camisero Botones", type: "Vestido", material: "Algodón", season: "Primavera 2024", fit: "Regular" },
  { id: "m4", brand: "Mango", name: "Blusa Satén Escote V", type: "Blusa", material: "Satén", season: "Sin temporada", fit: "Slim" },
  { id: "md1", brand: "Massimo Dutti", name: "Blusa Seda Natural", type: "Blusa", material: "Seda", season: "Primavera 2024", fit: "Regular" },
  { id: "md2", brand: "Massimo Dutti", name: "Camisa Cuadros Franela", type: "Camisa", material: "Franela", season: "Otoño 2024", fit: "Regular" },
  { id: "md3", brand: "Massimo Dutti", name: "Vestido Camisero Premium", type: "Vestido", material: "Algodón", season: "Primavera 2024", fit: "Regular" },
  { id: "l1", brand: "Levi's", name: "501 Original Jeans", type: "Pantalón", material: "Denim", season: "Sin temporada", fit: "Straight" },
  { id: "l2", brand: "Levi's", name: "Camisa Barstow Western", type: "Camisa", material: "Algodón", season: "Sin temporada", fit: "Regular" },
  { id: "l3", brand: "Levi's", name: "Trucker Jacket Denim", type: "Chaqueta", material: "Denim", season: "Sin temporada", fit: "Regular" },
  { id: "pb1", brand: "Pull&Bear", name: "Camiseta Crop Lavado", type: "Camiseta", material: "Algodón", season: "Verano 2024", fit: "Crop" },
  { id: "pb2", brand: "Pull&Bear", name: "Camisa Bowling Floral", type: "Camisa", material: "Viscosa", season: "Verano 2024", fit: "Regular" },
  { id: "pb3", brand: "Pull&Bear", name: "Vestido Crochet Mini", type: "Vestido", material: "Algodón", season: "Verano 2024", fit: "Mini" },
  { id: "st1", brand: "Stradivarius", name: "Blusa Popelín Fruncida", type: "Blusa", material: "Algodón", season: "Primavera 2024", fit: "Regular" },
  { id: "st2", brand: "Stradivarius", name: "Vestido Mini Floral", type: "Vestido", material: "Viscosa", season: "Verano 2024", fit: "Mini" },
  { id: "st3", brand: "Stradivarius", name: "Camisa Satén Brillante", type: "Camisa", material: "Satén", season: "Sin temporada", fit: "Regular" },
  { id: "bk1", brand: "Bershka", name: "Camisa Oversized Denim", type: "Camisa", material: "Denim", season: "Sin temporada", fit: "Oversize" },
  { id: "bk2", brand: "Bershka", name: "Camiseta Y2K Graphic", type: "Camiseta", material: "Algodón", season: "Verano 2024", fit: "Crop" },
  { id: "bk3", brand: "Bershka", name: "Blusa Crochet Boho", type: "Blusa", material: "Algodón", season: "Verano 2024", fit: "Regular" },
]

const MODEL_TYPE_FILTERS = ["Todos", "Blusa", "Camisa", "Camiseta", "Vestido", "Sudadera", "Chaqueta", "Pantalón"]

const BRAND_COLORS: Record<string, string> = {
  Zara: "#000000",
  "H&M": "#C8102E",
  Nike: "#111111",
  Adidas: "#000000",
  "Levi's": "#C41230",
  Mango: "#333333",
  "Massimo Dutti": "#1A1A1A",
  "Pull&Bear": "#000000",
  Stradivarius: "#7B4F3A",
  Bershka: "#E05A00",
}

const SIZE_TABLE: Record<string, Record<string, string>> = {
  XS: {
    Zara: "XS",
    "H&M": "S",
    Nike: "XS",
    Adidas: "XS",
    "Levi's": "XS",
    Mango: "XS",
    "Massimo Dutti": "XS",
    "Pull&Bear": "XS",
    Stradivarius: "XS",
    Bershka: "XS",
  },
  S: {
    Zara: "S",
    "H&M": "M",
    Nike: "S",
    Adidas: "S",
    "Levi's": "S",
    Mango: "S",
    "Massimo Dutti": "S",
    "Pull&Bear": "S",
    Stradivarius: "S",
    Bershka: "S",
  },
  M: {
    Zara: "M",
    "H&M": "L",
    Nike: "M",
    Adidas: "M",
    "Levi's": "M",
    Mango: "S",
    "Massimo Dutti": "M",
    "Pull&Bear": "M",
    Stradivarius: "M",
    Bershka: "M",
  },
  L: {
    Zara: "L",
    "H&M": "XL",
    Nike: "L",
    Adidas: "L",
    "Levi's": "L",
    Mango: "M",
    "Massimo Dutti": "L",
    "Pull&Bear": "L",
    Stradivarius: "L",
    Bershka: "L",
  },
  XL: {
    Zara: "XL",
    "H&M": "XXL",
    Nike: "XL",
    Adidas: "XL",
    "Levi's": "XL",
    Mango: "L",
    "Massimo Dutti": "XL",
    "Pull&Bear": "XL",
    Stradivarius: "XL",
    Bershka: "XL",
  },
  XXL: {
    Zara: "XXL",
    "H&M": "XXXL",
    Nike: "XXL",
    Adidas: "XXL",
    "Levi's": "XXL",
    Mango: "XL",
    "Massimo Dutti": "XXL",
    "Pull&Bear": "XXL",
    Stradivarius: "XXL",
    Bershka: "XXL",
  },
}

const CONFIDENCE: Record<string, number> = {
  Zara: 96,
  "H&M": 89,
  Nike: 94,
  Adidas: 92,
  "Levi's": 97,
  Mango: 88,
  "Massimo Dutti": 95,
  "Pull&Bear": 91,
  Stradivarius: 90,
  Bershka: 87,
}

const INITIAL_GARMENTS: Garment[] = [
  {
    id: "1",
    name: "Nike Camiseta",
    brand: "Nike",
    size: "M",
    type: "Camiseta",
    refActive: true,
  },
  {
    id: "2",
    name: "Adidas Hoodie",
    brand: "Adidas",
    size: "L",
    type: "Sudadera",
    refActive: true,
  },
  {
    id: "3",
    name: "Zara Jeans",
    brand: "Zara",
    size: "32",
    type: "Pantalón",
    refActive: true,
  },
]

const ONBOARDING = [
  {
    img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=900&fit=crop&auto=format",
    step: "01",
    title: "Agrega prendas de referencia",
    desc: "Añade prendas que ya tienes y te quedan perfectas. Serán tu punto de partida.",
  },
  {
    img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=900&fit=crop&auto=format",
    step: "02",
    title: "Elige la marca deseada",
    desc: "Selecciona la marca donde quieres comprar y analizamos su tabla de tallas.",
  },
  {
    img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&h=900&fit=crop&auto=format",
    step: "03",
    title: "Obtén tu talla exacta",
    desc: "Te recomendamos la talla equivalente con un porcentaje de confianza basado en datos reales.",
  },
]

const NOTIFICATIONS_DATA = [
  {
    id: "1",
    title: "Nueva marca disponible",
    body: "Uniqlo ya está en nuestro catálogo de tallas.",
    time: "hace 2h",
    read: false,
  },
  {
    id: "2",
    title: "Tabla de tallas actualizada",
    body: "Hemos actualizado la tabla de tallas de Levi's para la temporada 2025.",
    time: "hace 1d",
    read: false,
  },
  {
    id: "3",
    title: "Bienvenida a UNISIZE",
    body: "Empieza agregando tu primera prenda de referencia.",
    time: "hace 3d",
    read: true,
  },
]

// ---- Main Component ----
// ---- Shell ----
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#E2DED9" }}
    >
      <div
        className="relative bg-white flex flex-col overflow-hidden w-full md:rounded-[44px] md:shadow-[0_32px_80px_rgba(0,0,0,0.22)]"
        style={{ width: "100%", maxWidth: "390px", height: "100dvh", maxHeight: "100dvh" }}
      >
        <style>{`
          .scroll-pane::-webkit-scrollbar { display: none; }
          .scroll-pane { -ms-overflow-style: none; scrollbar-width: none; }
          @supports (font-family: 'Inter') { body { font-family: 'Inter', sans-serif; } }
          .display-font { font-family: 'Playfair Display', Georgia, serif; }
        `}</style>
        {children}
      </div>
    </div>
  )
}

// ---- Header ----
function Header({
  title,
  showBack = true,
  right,
  onBack,
}: {
  title?: string
  showBack?: boolean
  right?: React.ReactNode
  onBack?: () => void
}) {
  return (
    <header className="flex items-center justify-between px-5 pt-12 pb-4 flex-shrink-0">
      <div className="w-10">
        {showBack && (
          <button
            onClick={onBack}
            aria-label="Volver"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F0EDE8] transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={1.8} />
          </button>
        )}
      </div>
      {title && (
        <span className="text-[15px] font-semibold tracking-[-0.01em]">{title}</span>
      )}
      <div className="w-10 flex justify-end">{right}</div>
    </header>
  )
}

// ---- Bottom Nav ----
const NAV_TABS = [
  { id: "home" as const, Icon: Home, label: "Inicio" },
  { id: "garments" as const, Icon: Shirt, label: "Prendas" },
  { id: "search" as const, Icon: Search, label: "Buscar" },
  { id: "profile" as const, Icon: User, label: "Perfil" },
]

function BottomNav({
  activeTab,
  onTabChange,
}: {
  activeTab: "home" | "garments" | "search" | "profile"
  onTabChange: (id: "home" | "garments" | "search" | "profile") => void
}) {
  return (
    <nav className="flex border-t border-[rgba(0,0,0,0.07)] bg-white flex-shrink-0">
      {NAV_TABS.map(({ id, Icon, label }) => {
        const active = activeTab === id
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className="flex-1 flex flex-col items-center py-3 gap-1 transition-colors"
            style={{ color: active ? "#111111" : "#999999" }}
          >
            <Icon size={22} strokeWidth={active ? 2 : 1.5} />
            <span className="text-[11px]" style={{ fontWeight: active ? 600 : 400 }}>
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

export default function App() {
  // ---- Persistent auth ----
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const email = loadSession()
    if (!email) return null
    return loadAccounts().find((a) => a.email === email) ?? null
  })
  const [authError, setAuthError] = useState("")

  const [screen, setScreen] = useState<Screen>(() => loadSession() ? "home" : "splash")
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [authMode, setAuthMode] = useState<"login" | "register">("register")
  const [garments, setGarments] = useState<Garment[]>(() => {
    const email = loadSession()
    if (!email) return []
    return loadAccounts().find((a) => a.email === email)?.garments ?? []
  })
  const [selectedModel, setSelectedModel] = useState<BrandModel | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchTypeFilter, setSearchTypeFilter] = useState("Todos")
  const [searchBrandFilter, setSearchBrandFilter] = useState("Todos")
  const [fitPreference, setFitPreference] = useState<"ajustado" | "normal" | "holgado">("normal")
  const [refMode, setRefMode] = useState<"closet" | "measurements">("closet")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [filterMaterial, setFilterMaterial] = useState("Todos")
  const [filterSeason, setFilterSeason] = useState("Todos")
  const [filterColor, setFilterColor] = useState("")
  const [activeTab, setActiveTab] = useState<
    "home" | "garments" | "search" | "profile"
  >("home")
  const [garmentsQuery, setGarmentsQuery] = useState("")
  const [garmentPhoto, setGarmentPhoto] = useState<string | null>(null)
  const [editingGarment, setEditingGarment] = useState<Garment | null>(null)
  const EMPTY_FORM = { name: "", brand: BRANDS[0], size: "M", type: GARMENT_TYPES[0], model: "", refActive: true }
  const [addForm, setAddForm] = useState(EMPTY_FORM)
  const [measurements, setMeasurements] = useState({
    pecho: "88",
    cintura: "68",
    cadera: "94",
    hombros: "38",
    manga: "62",
    entrepierna: "78",
  })
  const [localMeasurements, setLocalMeasurements] = useState({
    pecho: "88",
    cintura: "68",
    cadera: "94",
    hombros: "38",
    manga: "62",
    entrepierna: "78",
  })
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" })

  // Persist garments to the current user's account whenever they change
  useEffect(() => {
    if (!currentUser) return
    const accounts = loadAccounts()
    const updated = accounts.map((a) =>
      a.email === currentUser.email ? { ...a, garments } : a
    )
    saveAccounts(updated)
  }, [garments, currentUser])

  // Persist measurements to current user's account
  useEffect(() => {
    if (!currentUser) return
    const accounts = loadAccounts()
    const updated = accounts.map((a) =>
      a.email === currentUser.email ? { ...a, measurements } : a
    )
    saveAccounts(updated)
  }, [measurements, currentUser])

  const nav = (s: Screen) => setScreen(s)

  const goBack = () => {
    if (screen === "onboarding") {
      if (onboardingStep > 0) return setOnboardingStep((o) => o - 1)
      return nav("splash")
    }
    if (screen === "auth") return nav("onboarding")
    if (screen === "add-garment") return nav("garments")
    if (screen === "edit-garment") return nav("garments")
    if (screen === "edit-measurements") return nav("profile")
    if (screen === "result") {
      setSelectedModel(null)
      setFitPreference("normal")
      return nav("search")
    }
    nav("home")
  }

  const handleAddGarment = () => {
    if (!addForm.name.trim()) return
    setGarments((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: addForm.name,
        brand: addForm.brand,
        size: addForm.size,
        type: addForm.type,
        model: addForm.model || undefined,
        photo: garmentPhoto || undefined,
        refActive: addForm.refActive,
      },
    ])
    setAddForm(EMPTY_FORM)
    setGarmentPhoto(null)
    nav("garments")
  }

  const handleSaveEdit = () => {
    if (!editingGarment || !addForm.name.trim()) return
    setGarments((prev) =>
      prev.map((g) =>
        g.id === editingGarment.id
          ? {
              ...g,
              name: addForm.name,
              brand: addForm.brand,
              size: addForm.size,
              type: addForm.type,
              model: addForm.model || undefined,
              photo: garmentPhoto ?? g.photo,
              refActive: addForm.refActive,
            }
          : g
      )
    )
    setEditingGarment(null)
    setAddForm({ name: "", brand: BRANDS[0], size: "M", type: GARMENT_TYPES[0], model: "" })
    setGarmentPhoto(null)
    nav("garments")
  }

  // Map body measurements to standard size depending on garment type
  const profileSizeForType = (type: string): string => {
    const t = type.toLowerCase()
    // Bottom garments: use cintura
    if (t === "pantalón" || t === "falda" || t === "shorts") {
      const cm = parseFloat(measurements.cintura)
      if (isNaN(cm)) return "M"
      if (cm < 62) return "XS"
      if (cm < 68) return "S"
      if (cm < 74) return "M"
      if (cm < 80) return "L"
      if (cm < 88) return "XL"
      return "XXL"
    }
    // Top garments: use pecho
    const cm = parseFloat(measurements.pecho)
    if (isNaN(cm)) return "M"
    if (cm < 82) return "XS"
    if (cm < 88) return "S"
    if (cm < 96) return "M"
    if (cm < 104) return "L"
    if (cm < 112) return "XL"
    return "XXL"
  }

  // Labels for what measurement is being used per type
  const measurementLabelForType = (type: string): string => {
    const t = type.toLowerCase()
    if (t === "pantalón" || t === "falda" || t === "shorts")
      return `Cintura ${measurements.cintura} cm · Cadera ${measurements.cadera} cm`
    return `Pecho ${measurements.pecho} cm · Hombros ${measurements.hombros} cm`
  }

  // Auto-select best reference garment from closet — must match the same type exactly
  const activeGarments = garments.filter((g) => g.refActive)
  const autoRef = selectedModel
    ? (activeGarments.find((g) => g.type.toLowerCase() === selectedModel.type.toLowerCase()) ?? null)
    : null

  const profileSize = selectedModel ? profileSizeForType(selectedModel.type) : "M"

  // refSize: use closet garment if mode is closet AND garment exists, else profile measurements
  const usingCloset = refMode === "closet" && autoRef !== null
  const refSize = usingCloset ? autoRef!.size : profileSize

  const ALL_SIZES_ORDERED = ["XS", "S", "M", "L", "XL", "XXL"]

  const shiftSize = (size: string | null, direction: "up" | "down" | "none"): string => {
    if (!size || direction === "none") return size ?? "—"
    const idx = ALL_SIZES_ORDERED.indexOf(size)
    if (idx === -1) return size // numeric sizes (jeans) — no shift
    if (direction === "down") return ALL_SIZES_ORDERED[Math.max(0, idx - 1)]
    return ALL_SIZES_ORDERED[Math.min(ALL_SIZES_ORDERED.length - 1, idx + 1)]
  }

  const baseResultSize = selectedModel
    ? SIZE_TABLE[refSize]?.[selectedModel.brand] ?? refSize
    : null

  const resultSize = shiftSize(
    baseResultSize,
    fitPreference === "ajustado" ? "down" : fitPreference === "holgado" ? "up" : "none"
  )

  const confidence = selectedModel ? (CONFIDENCE[selectedModel.brand] ?? 90) : 90


  // =========================================================
  // SPLASH
  // =========================================================
  if (screen === "splash") {
    return (
      <Shell>
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1100&fit=crop&auto=format"
            alt="Mujer eligiendo ropa"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/85" />
          <div className="relative mt-auto px-8 pb-10">
            <p className="text-white/60 text-[13px] font-medium tracking-[0.15em] uppercase mb-2">
              Tallaje inteligente
            </p>
            <h1
              className="display-font text-white text-[52px] font-bold leading-none mb-3 tracking-tight"
            >
              UNISIZE
            </h1>
            <p className="text-white/75 text-[16px] leading-relaxed mb-8 font-light">
              Tu talla perfecta, siempre.
              <br />
              En cualquier marca.
            </p>
            <button
              onClick={() => nav("onboarding")}
              className="w-full py-4 bg-white text-[#111111] text-[15px] font-semibold rounded-2xl mb-3 hover:bg-white/90 transition-colors tracking-[-0.01em]"
            >
              Comenzar
            </button>
            <button
              onClick={() => {
                setAuthMode("login")
                nav("auth")
              }}
              className="w-full py-3 text-white/65 text-[14px] hover:text-white transition-colors"
            >
              Ya tengo cuenta
            </button>
          </div>
        </div>
      </Shell>
    )
  }

  // =========================================================
  // ONBOARDING
  // =========================================================
  if (screen === "onboarding") {
    const step = ONBOARDING[onboardingStep]
    const isLast = onboardingStep === ONBOARDING.length - 1
    return (
      <Shell>
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Image */}
          <div className="relative flex-shrink-0" style={{ height: "52%" }}>
            <img
              src={step.img}
              alt={step.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
            {/* Skip */}
            <button
              onClick={() => {
                setAuthMode("register")
                nav("auth")
              }}
              className="absolute top-12 right-5 text-white/80 text-[13px] font-medium bg-black/25 px-4 py-2 rounded-full backdrop-blur-sm"
            >
              Omitir
            </button>
            {/* Step indicator overlay */}
            <div className="absolute bottom-4 left-6">
              <span
                className="display-font text-[#111111]/15 text-[80px] font-bold leading-none select-none"
              >
                {step.step}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col px-6 pt-2 pb-6">
            {/* Dots */}
            <div className="flex gap-2 mb-5">
              {ONBOARDING.map((_, i) => (
                <div
                  key={i}
                  className="h-[3px] rounded-full transition-all duration-300"
                  style={{
                    width: i === onboardingStep ? 24 : 8,
                    background: i === onboardingStep ? "#111111" : "#E0DDD8",
                  }}
                />
              ))}
            </div>

            <h2
              className="display-font text-[26px] font-bold leading-tight mb-3 text-[#111111]"
            >
              {step.title}
            </h2>
            <p className="text-[15px] text-[#999999] leading-relaxed flex-1">
              {step.desc}
            </p>

            <div className="flex gap-3 mt-4">
              {onboardingStep > 0 && (
                <button
                  onClick={() => setOnboardingStep((o) => o - 1)}
                  className="flex-1 py-4 border border-[rgba(0,0,0,0.1)] text-[#111111] text-[15px] font-semibold rounded-2xl hover:bg-[#F5F2EE] transition-colors"
                >
                  Anterior
                </button>
              )}
              <button
                onClick={() => {
                  if (!isLast) {
                    setOnboardingStep((o) => o + 1)
                  } else {
                    setAuthMode("register")
                    nav("auth")
                  }
                }}
                className="flex-1 py-4 bg-[#111111] text-white text-[15px] font-semibold rounded-2xl hover:opacity-90 transition-opacity"
              >
                {isLast ? "Crear cuenta" : "Siguiente"}
              </button>
            </div>
          </div>
        </div>
      </Shell>
    )
  }

  // =========================================================
  // AUTH
  // =========================================================
  if (screen === "auth") {
    return (
      <Shell>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            showBack
            onBack={goBack}
            title={authMode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          />
          <div className="flex-1 flex flex-col px-6 py-2 overflow-y-auto scroll-pane">
            <div className="mb-8">
              <h1
                className="display-font text-[32px] font-bold leading-tight mb-2"
              >
                {authMode === "login"
                  ? "Bienvenida de nuevo"
                  : "Empieza ahora"}
              </h1>
              <p className="text-[15px] text-[#999999]">
                {authMode === "login"
                  ? "Accede a tu cuenta para continuar."
                  : "Encuentra tu talla perfecta en minutos."}
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {authMode === "register" && (
                <div>
                  <label className="text-[12px] font-semibold text-[#999999] uppercase tracking-widest mb-2 block">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={registerForm.name}
                    onChange={(e) =>
                      setRegisterForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="w-full px-4 py-4 bg-[#F5F2EE] rounded-xl text-[15px] outline-none focus:ring-2 focus:ring-[#111111]/15"
                  />
                </div>
              )}
              <div>
                <label className="text-[12px] font-semibold text-[#999999] uppercase tracking-widest mb-2 block">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={
                    authMode === "login" ? loginForm.email : registerForm.email
                  }
                  onChange={(e) =>
                    authMode === "login"
                      ? setLoginForm((f) => ({ ...f, email: e.target.value }))
                      : setRegisterForm((f) => ({
                          ...f,
                          email: e.target.value,
                        }))
                  }
                  className="w-full px-4 py-4 bg-[#F5F2EE] rounded-xl text-[15px] outline-none focus:ring-2 focus:ring-[#111111]/15"
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-[#999999] uppercase tracking-widest mb-2 block">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={
                    authMode === "login"
                      ? loginForm.password
                      : registerForm.password
                  }
                  onChange={(e) =>
                    authMode === "login"
                      ? setLoginForm((f) => ({
                          ...f,
                          password: e.target.value,
                        }))
                      : setRegisterForm((f) => ({
                          ...f,
                          password: e.target.value,
                        }))
                  }
                  className="w-full px-4 py-4 bg-[#F5F2EE] rounded-xl text-[15px] outline-none focus:ring-2 focus:ring-[#111111]/15"
                />
              </div>
              {authMode === "login" && (
                <button className="text-right text-[13px] text-[#999999] hover:text-[#111111] transition-colors">
                  Olvidé mi contraseña
                </button>
              )}
            </div>

            <div className="mt-auto pt-8 pb-2">
              {authError ? (
                <p className="text-[13px] text-red-400 text-center mb-4 bg-red-50 rounded-xl px-4 py-3">
                  {authError}
                </p>
              ) : null}
              <button
                onClick={() => {
                  setAuthError("")
                  const accounts = loadAccounts()
                  if (authMode === "login") {
                    const user = accounts.find(
                      (a) => a.email.toLowerCase() === loginForm.email.toLowerCase() && a.password === loginForm.password
                    )
                    if (!user) { setAuthError("Correo o contraseña incorrectos."); return }
                    setCurrentUser(user)
                    setGarments(user.garments)
                    setMeasurements(user.measurements ?? measurements)
                    saveSession(user.email)
                    setLoginForm({ email: "", password: "" })
                    setActiveTab("home")
                    nav("home")
                  } else {
                    if (!registerForm.name.trim()) { setAuthError("Ingresa tu nombre."); return }
                    if (!registerForm.email.trim()) { setAuthError("Ingresa tu correo."); return }
                    if (registerForm.password.length < 6) { setAuthError("La contraseña debe tener al menos 6 caracteres."); return }
                    if (accounts.some((a) => a.email.toLowerCase() === registerForm.email.toLowerCase())) {
                      setAuthError("Ya existe una cuenta con ese correo."); return
                    }
                    const newUser: UserAccount = {
                      name: registerForm.name.trim(),
                      email: registerForm.email.trim().toLowerCase(),
                      password: registerForm.password,
                      garments: [],
                      measurements: { pecho: "88", cintura: "68", cadera: "94", hombros: "38", manga: "62", entrepierna: "78" },
                    }
                    saveAccounts([...accounts, newUser])
                    setCurrentUser(newUser)
                    setGarments([])
                    saveSession(newUser.email)
                    setRegisterForm({ name: "", email: "", password: "" })
                    setActiveTab("home")
                    nav("home")
                  }
                }}
                className="w-full py-4 bg-[#111111] text-white text-[15px] font-semibold rounded-2xl hover:opacity-90 transition-opacity mb-5"
              >
                {authMode === "login" ? "Entrar" : "Crear cuenta"}
              </button>
              <p className="text-center text-[14px] text-[#999999]">
                {authMode === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
                <button
                  onClick={() => { setAuthMode((m) => (m === "login" ? "register" : "login")); setAuthError("") }}
                  className="font-semibold text-[#111111] hover:underline"
                >
                  {authMode === "login" ? "Crear cuenta" : "Iniciar sesión"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </Shell>
    )
  }

  // =========================================================
  // HOME
  // =========================================================
  if (screen === "home") {
    return (
      <Shell>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto scroll-pane">
            {/* Top bar */}
            <div className="px-6 pt-12 pb-2">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-[12px] text-[#999999] mb-0.5">
                    Buenos días
                  </p>
                  <h1
                    className="display-font text-[26px] font-bold leading-tight"
                  >¡Hola, {currentUser?.name.split(" ")[0] ?? ""}!</h1>
                </div>
                <button
                  onClick={() => nav("notifications")}
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-[#F5F2EE] relative"
                  aria-label="Notificaciones"
                >
                  <Bell size={20} strokeWidth={1.5} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full" />
                </button>
              </div>

              {/* Quick search */}
              <button
                onClick={() => {
                  setActiveTab("search")
                  nav("search")
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 bg-[#F5F2EE] rounded-2xl mb-5"
              >
                <Search size={17} className="text-[#999999]" strokeWidth={1.5} />
                <span className="text-[14px] text-[#999999]">
                  Buscar talla equivalente...
                </span>
              </button>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2.5 mb-6">
                {[
                  { label: "Prendas", value: garments.length },
                  { label: "Marcas", value: "10" },
                  { label: "Consultas", value: "5" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="bg-[#F5F2EE] rounded-2xl p-4 text-center"
                  >
                    <p className="text-[22px] font-bold leading-none mb-1">
                      {value}
                    </p>
                    <p className="text-[11px] text-[#999999]">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="px-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[15px] font-semibold">
                  Marcas disponibles
                </h3>
                <button className="text-[12px] text-[#999999]">
                  Ver todas
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {BRANDS.slice(0, 8).map((brand) => (
                  <button
                    key={brand}
                    onClick={() => {
                      setSearchBrandFilter(brand)
                      setSearchQuery("")
                      setSearchTypeFilter("Todos")
                      setActiveTab("search")
                      nav("search")
                    }}
                    className="aspect-square bg-[#F5F2EE] rounded-2xl flex items-center justify-center hover:bg-[#E8E5E0] transition-colors p-1"
                  >
                    <span
                      className="text-[10px] font-bold text-center leading-tight"
                      style={{ color: BRAND_COLORS[brand] ?? "#111" }}
                    >
                      {brand}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent garments */}
            <div className="px-6 pb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[15px] font-semibold">Mis prendas</h3>
                <button
                  onClick={() => {
                    setActiveTab("garments")
                    nav("garments")
                  }}
                  className="text-[12px] text-[#999999]"
                >
                  Ver todas
                </button>
              </div>
              <div className="flex flex-col gap-2.5">
                {garments.slice(0, 3).map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center gap-3.5 p-3.5 bg-[#F5F2EE] rounded-2xl"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {g.photo
                        ? <img src={g.photo} alt={g.name} className="w-full h-full object-cover" />
                        : <Shirt size={20} strokeWidth={1.2} className="text-[#999999]" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[14px] truncate">
                        {g.name}
                      </p>
                      <p className="text-[12px] text-[#999999]">{g.brand}</p>
                    </div>
                    <span className="text-[13px] font-bold bg-white px-3 py-1.5 rounded-xl">
                      {g.size}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <BottomNav activeTab={activeTab} onTabChange={(id) => { setActiveTab(id); nav(id) }} />
        </div>
      </Shell>
    )
  }

  // =========================================================
  // GARMENTS
  // =========================================================
  if (screen === "garments") {
    const filtered = garments.filter(
      (g) =>
        !garmentsQuery ||
        g.name.toLowerCase().includes(garmentsQuery.toLowerCase()) ||
        g.brand.toLowerCase().includes(garmentsQuery.toLowerCase())
    )
    return (
      <Shell>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            showBack={false}
            onBack={goBack}
            title="Mi Armario"
            right={
              <button
                onClick={() => { setAddForm(EMPTY_FORM); setGarmentPhoto(null); nav("add-garment") }}
                aria-label="Agregar prenda"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#111111] text-white"
              >
                <Plus size={18} />
              </button>
            }
          />

          <div className="flex-1 overflow-y-auto scroll-pane px-6 pb-6">
            {/* Section heading */}
            <p className="text-[11px] font-semibold text-[#999999] uppercase tracking-[0.15em] mb-3">
              Mis prendas
            </p>

            {/* Search */}
            <div className="flex items-center gap-3 px-4 py-3 bg-[#F5F2EE] rounded-xl mb-4">
              <Search size={16} className="text-[#999999]" strokeWidth={1.5} />
              <input
                placeholder="Buscar prenda o marca..."
                value={garmentsQuery}
                onChange={(e) => setGarmentsQuery(e.target.value)}
                className="flex-1 bg-transparent text-[14px] outline-none"
              />
              {garmentsQuery && (
                <button onClick={() => setGarmentsQuery("")}>
                  <X size={14} className="text-[#999999]" />
                </button>
              )}
            </div>

            <div className="flex flex-col divide-y divide-[rgba(0,0,0,0.05)]">
              {filtered.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center gap-4 py-3.5"
                >
                  {/* Thumbnail */}
                  <button
                    onClick={() => {
                      setEditingGarment(g)
                      setAddForm({ name: g.name, brand: g.brand, size: g.size, type: g.type, model: g.model ?? "", refActive: g.refActive })
                      setGarmentPhoto(null)
                      nav("edit-garment")
                    }}
                    className="w-14 h-14 bg-[#F5F2EE] rounded-2xl flex-shrink-0 overflow-hidden focus:outline-none"
                  >
                    {g.photo ? (
                      <img src={g.photo} alt={g.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Shirt size={22} strokeWidth={1.2} className="text-[#AAAAAA]" />
                      </div>
                    )}
                  </button>

                  {/* Info */}
                  <button
                    onClick={() => {
                      setEditingGarment(g)
                      setAddForm({ name: g.name, brand: g.brand, size: g.size, type: g.type, model: g.model ?? "", refActive: g.refActive })
                      setGarmentPhoto(null)
                      nav("edit-garment")
                    }}
                    className="flex-1 min-w-0 text-left focus:outline-none"
                  >
                    <p className="font-semibold text-[15px] truncate leading-tight">{g.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[12px] text-[#999999]">Talla {g.size}</span>
                      {g.refActive && (
                        <>
                          <span className="text-[#CCCCCC]">·</span>
                          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            Ref. Activa
                          </span>
                        </>
                      )}
                    </div>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setGarments((prev) => prev.filter((x) => x.id !== g.id))}
                    aria-label="Eliminar prenda"
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F2EE] transition-colors flex-shrink-0"
                  >
                    <X size={14} className="text-[#CCCCCC]" />
                  </button>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <Shirt
                    size={44}
                    strokeWidth={0.8}
                    className="text-[#CCCCCC] mx-auto mb-3"
                  />
                  <p className="text-[#BBBBBB] text-[14px]">
                    No se encontraron prendas
                  </p>
                </div>
              )}
            </div>
          </div>
          <BottomNav activeTab={activeTab} onTabChange={(id) => { setActiveTab(id); nav(id) }} />
        </div>
      </Shell>
    )
  }

  // =========================================================
  // ADD GARMENT
  // =========================================================
  if (screen === "add-garment") {
    return (
      <Shell>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header showBack onBack={goBack} title="Nueva prenda" />
          <div className="flex-1 overflow-y-auto scroll-pane px-6 pb-8">
            {/* Photo upload */}
            <label className="block w-full mb-6 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const url = URL.createObjectURL(file)
                    setGarmentPhoto(url)
                  }
                }}
              />
              {garmentPhoto ? (
                <div className="w-full h-48 rounded-2xl overflow-hidden relative group">
                  <img
                    src={garmentPhoto}
                    alt="Foto de la prenda"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-[13px] font-semibold">Cambiar foto</p>
                  </div>
                </div>
              ) : (
                <div className="w-full rounded-2xl bg-[#F5F2EE] flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[rgba(0,0,0,0.08)] hover:bg-[#EDE9E4] transition-colors py-10">
                  <Shirt size={36} strokeWidth={0.8} className="text-[#CCCCCC]" />
                  <p className="text-[13px] text-[#BBBBBB]">Subir foto de referencia</p>
                  <p className="text-[11px] text-[#CCCCCC]">Toca para seleccionar o usar cámara</p>
                </div>
              )}
            </label>

            <div className="flex flex-col gap-6">
              {/* Name */}
              <div>
                <label className="text-[11px] font-semibold text-[#999999] uppercase tracking-widest mb-2 block">
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Ej. Camiseta azul marino"
                  value={addForm.name}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full px-4 py-4 bg-[#F5F2EE] rounded-xl text-[15px] outline-none focus:ring-2 focus:ring-[#111111]/10"
                />
              </div>

              {/* Type */}
              <div>
                <label className="text-[11px] font-semibold text-[#999999] uppercase tracking-widest mb-2 block">
                  Tipo de prenda / Estilo
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {GARMENT_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setAddForm((f) => ({ ...f, type }))}
                      className="py-2.5 rounded-xl text-[13px] font-medium transition-colors"
                      style={{
                        background:
                          addForm.type === type ? "#111111" : "#F5F2EE",
                        color: addForm.type === type ? "#ffffff" : "#111111",
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model */}
              <div>
                <label className="text-[11px] font-semibold text-[#999999] uppercase tracking-widest mb-2 block">
                  Modelo / Serie
                </label>
                <input
                  type="text"
                  placeholder="Ej. Club Tee Premium"
                  value={addForm.model}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, model: e.target.value }))
                  }
                  className="w-full px-4 py-4 bg-[#F5F2EE] rounded-xl text-[15px] outline-none focus:ring-2 focus:ring-[#111111]/10"
                />
              </div>

              {/* Brand */}
              <div>
                <label className="text-[11px] font-semibold text-[#999999] uppercase tracking-widest mb-2 block">
                  Marca
                </label>
                <div className="relative">
                  <select
                    value={addForm.brand}
                    onChange={(e) =>
                      setAddForm((f) => ({ ...f, brand: e.target.value }))
                    }
                    className="w-full px-4 py-4 bg-[#F5F2EE] rounded-xl text-[15px] outline-none appearance-none cursor-pointer"
                  >
                    {BRANDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <ChevronRight
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] rotate-90 pointer-events-none"
                  />
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="text-[11px] font-semibold text-[#999999] uppercase tracking-widest mb-2 block">
                  Talla actual
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setAddForm((f) => ({ ...f, size }))}
                      className="py-3 rounded-xl text-[13px] font-bold transition-colors"
                      style={{
                        background:
                          addForm.size === size ? "#111111" : "#F5F2EE",
                        color: addForm.size === size ? "#ffffff" : "#111111",
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {/* Jeans sizes */}
                <p className="text-[10px] text-[#BBBBBB] mt-2 mb-1.5">O talla numérica (jeans):</p>
                <div className="grid grid-cols-6 gap-2">
                  {JEANS_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setAddForm((f) => ({ ...f, size }))}
                      className="py-3 rounded-xl text-[13px] font-bold transition-colors"
                      style={{
                        background:
                          addForm.size === size ? "#111111" : "#F5F2EE",
                        color: addForm.size === size ? "#ffffff" : "#111111",
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleAddGarment}
              disabled={!addForm.name.trim()}
              className="w-full py-4 bg-[#111111] text-white text-[15px] font-semibold rounded-2xl mt-8 hover:opacity-90 transition-opacity disabled:opacity-30"
            >
              Guardar prenda
            </button>
          </div>
        </div>
      </Shell>
    )
  }

  // =========================================================
  // EDIT GARMENT
  // =========================================================
  if (screen === "edit-garment" && editingGarment) {
    const currentPhoto = garmentPhoto ?? editingGarment.photo ?? null
    return (
      <Shell>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header showBack onBack={goBack} title="Editar prenda" />
          <div className="flex-1 overflow-y-auto scroll-pane px-6 pb-8">
            {/* Photo */}
            <label className="block w-full mb-6 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setGarmentPhoto(URL.createObjectURL(file))
                }}
              />
              {currentPhoto ? (
                <div className="w-full h-48 rounded-2xl overflow-hidden relative group">
                  <img src={currentPhoto} alt="Foto de la prenda" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-[13px] font-semibold">Cambiar foto</p>
                  </div>
                </div>
              ) : (
                <div className="w-full rounded-2xl bg-[#F5F2EE] flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[rgba(0,0,0,0.08)] hover:bg-[#EDE9E4] transition-colors py-10">
                  <Shirt size={36} strokeWidth={0.8} className="text-[#CCCCCC]" />
                  <p className="text-[13px] text-[#BBBBBB]">Subir foto de referencia</p>
                  <p className="text-[11px] text-[#CCCCCC]">Toca para seleccionar o usar cámara</p>
                </div>
              )}
            </label>

            <div className="flex flex-col gap-6">
              {/* Name */}
              <div>
                <label className="text-[11px] font-semibold text-[#999999] uppercase tracking-widest mb-2 block">Nombre</label>
                <input
                  type="text"
                  placeholder="Ej. Camiseta azul marino"
                  value={addForm.name}
                  onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-4 bg-[#F5F2EE] rounded-xl text-[15px] outline-none focus:ring-2 focus:ring-[#111111]/10"
                />
              </div>

              {/* Type */}
              <div>
                <label className="text-[11px] font-semibold text-[#999999] uppercase tracking-widest mb-2 block">Tipo de prenda / Estilo</label>
                <div className="grid grid-cols-3 gap-2">
                  {GARMENT_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setAddForm((f) => ({ ...f, type }))}
                      className="py-2.5 rounded-xl text-[13px] font-medium transition-colors"
                      style={{ background: addForm.type === type ? "#111111" : "#F5F2EE", color: addForm.type === type ? "#ffffff" : "#111111" }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model */}
              <div>
                <label className="text-[11px] font-semibold text-[#999999] uppercase tracking-widest mb-2 block">Modelo / Serie</label>
                <input
                  type="text"
                  placeholder="Ej. Club Tee Premium"
                  value={addForm.model}
                  onChange={(e) => setAddForm((f) => ({ ...f, model: e.target.value }))}
                  className="w-full px-4 py-4 bg-[#F5F2EE] rounded-xl text-[15px] outline-none focus:ring-2 focus:ring-[#111111]/10"
                />
              </div>

              {/* Brand */}
              <div>
                <label className="text-[11px] font-semibold text-[#999999] uppercase tracking-widest mb-2 block">Marca</label>
                <div className="relative">
                  <select
                    value={addForm.brand}
                    onChange={(e) => setAddForm((f) => ({ ...f, brand: e.target.value }))}
                    className="w-full px-4 py-4 bg-[#F5F2EE] rounded-xl text-[15px] outline-none appearance-none cursor-pointer"
                  >
                    {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] rotate-90 pointer-events-none" />
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="text-[11px] font-semibold text-[#999999] uppercase tracking-widest mb-2 block">Talla actual</label>
                <div className="grid grid-cols-6 gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setAddForm((f) => ({ ...f, size }))}
                      className="py-3 rounded-xl text-[13px] font-bold transition-colors"
                      style={{ background: addForm.size === size ? "#111111" : "#F5F2EE", color: addForm.size === size ? "#ffffff" : "#111111" }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-[#BBBBBB] mt-2 mb-1.5">O talla numérica (jeans):</p>
                <div className="grid grid-cols-6 gap-2">
                  {JEANS_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setAddForm((f) => ({ ...f, size }))}
                      className="py-3 rounded-xl text-[13px] font-bold transition-colors"
                      style={{ background: addForm.size === size ? "#111111" : "#F5F2EE", color: addForm.size === size ? "#ffffff" : "#111111" }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ref. Activa toggle */}
            <div
              className="flex items-center justify-between mt-8 mb-4 p-4 rounded-2xl cursor-pointer select-none"
              style={{ background: addForm.refActive ? "rgba(16,185,129,0.08)" : "#F5F2EE" }}
              onClick={() => setAddForm((f) => ({ ...f, refActive: !f.refActive }))}
            >
              <div>
                <p className="text-[14px] font-semibold">Referencia activa</p>
                <p className="text-[12px] mt-0.5" style={{ color: addForm.refActive ? "#059669" : "#AAAAAA" }}>
                  {addForm.refActive
                    ? "Esta prenda se usa en tus búsquedas"
                    : "No se usa como referencia de talla"}
                </p>
              </div>
              {/* Toggle switch */}
              <div
                className="w-12 h-6 rounded-full flex-shrink-0 relative transition-colors duration-200"
                style={{ background: addForm.refActive ? "#111111" : "#DDDDDD" }}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200"
                  style={{ left: addForm.refActive ? "calc(100% - 22px)" : "2px" }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setGarments((prev) => prev.filter((x) => x.id !== editingGarment.id))
                  setEditingGarment(null)
                  setAddForm(EMPTY_FORM)
                  setGarmentPhoto(null)
                  nav("garments")
                }}
                className="flex-1 py-4 border border-[rgba(0,0,0,0.1)] text-red-400 text-[15px] font-semibold rounded-2xl hover:bg-red-50 transition-colors"
              >
                Eliminar
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!addForm.name.trim()}
                className="flex-2 flex-grow-[2] py-4 bg-[#111111] text-white text-[15px] font-semibold rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-30"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </Shell>
    )
  }

  // =========================================================
  // SEARCH
  // =========================================================
  if (screen === "search") {
    const activeAdvancedCount = [
      filterMaterial !== "Todos",
      filterSeason !== "Todos",
      filterColor !== "",
    ].filter(Boolean).length

    const filteredModels = BRAND_MODELS.filter((m) => {
      const q = searchQuery.toLowerCase()
      const matchesQuery = !q || m.brand.toLowerCase().includes(q) || m.name.toLowerCase().includes(q) || m.type.toLowerCase().includes(q)
      const matchesType = searchTypeFilter === "Todos" || m.type === searchTypeFilter
      const matchesBrand = searchBrandFilter === "Todos" || m.brand === searchBrandFilter
      const matchesMaterial = filterMaterial === "Todos" || m.material.toLowerCase().includes(filterMaterial.toLowerCase())
      const matchesSeason = filterSeason === "Todos" || m.season === filterSeason
      const matchesColor = filterColor === "" || true // color is visual, not in model data — kept for UX
      return matchesQuery && matchesType && matchesBrand && matchesMaterial && matchesSeason && matchesColor
    })

    return (
      <Shell>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header showBack={false} onBack={goBack} title="Buscar talla" />

          <div className="px-6 pb-3 flex-shrink-0">
            {/* Search bar + filter toggle */}
            <div className="flex gap-2 mb-3">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-[#F5F2EE] rounded-xl">
                <Search size={16} className="text-[#999999]" strokeWidth={1.5} />
                <input
                  placeholder="Marca o modelo de prenda..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-[14px] outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")}>
                    <X size={14} className="text-[#999999]" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowAdvancedFilters((v) => !v)}
                className="w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0 relative transition-colors"
                style={{
                  background: showAdvancedFilters || activeAdvancedCount > 0 ? "#111111" : "#F5F2EE",
                }}
              >
                <SlidersHorizontal
                  size={18}
                  strokeWidth={1.8}
                  color={showAdvancedFilters || activeAdvancedCount > 0 ? "#ffffff" : "#666666"}
                />
                {activeAdvancedCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
                    {activeAdvancedCount}
                  </span>
                )}
              </button>
            </div>

            {/* Active brand filter badge */}
            {searchBrandFilter !== "Todos" && (
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold"
                  style={{ background: "#111111", color: "#ffffff" }}
                >
                  <span>{searchBrandFilter}</span>
                  <button onClick={() => setSearchBrandFilter("Todos")}>
                    <X size={12} className="text-white/70" />
                  </button>
                </div>
                <span className="text-[11px] text-[#999999]">Filtrando por marca</span>
              </div>
            )}

            {/* Type filter chips */}
            <div className="flex gap-2 overflow-x-auto scroll-pane pb-1">
              {MODEL_TYPE_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setSearchTypeFilter(f)}
                  className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-colors"
                  style={{
                    background: searchTypeFilter === f ? "#111111" : "#F5F2EE",
                    color: searchTypeFilter === f ? "#ffffff" : "#666666",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Advanced filters panel */}
            {showAdvancedFilters && (
              <div className="mt-3 bg-[#F5F2EE] rounded-2xl p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-semibold text-[#111111] uppercase tracking-widest">Filtros avanzados</p>
                  {activeAdvancedCount > 0 && (
                    <button
                      onClick={() => { setFilterMaterial("Todos"); setFilterSeason("Todos"); setFilterColor("") }}
                      className="text-[11px] text-[#999999] hover:text-[#111111] transition-colors"
                    >
                      Limpiar
                    </button>
                  )}
                </div>

                {/* Material */}
                <div>
                  <p className="text-[10px] font-semibold text-[#999999] uppercase tracking-widest mb-2">Tejido / Material</p>
                  <div className="flex gap-2 flex-wrap">
                    {["Todos", ...MATERIALS].map((mat) => (
                      <button
                        key={mat}
                        onClick={() => setFilterMaterial(mat)}
                        className="px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors flex-shrink-0"
                        style={{
                          background: filterMaterial === mat ? "#111111" : "#ffffff",
                          color: filterMaterial === mat ? "#ffffff" : "#666666",
                        }}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Season */}
                <div>
                  <p className="text-[10px] font-semibold text-[#999999] uppercase tracking-widest mb-2">Temporada</p>
                  <div className="relative">
                    <select
                      value={filterSeason}
                      onChange={(e) => setFilterSeason(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white rounded-xl text-[13px] outline-none appearance-none cursor-pointer"
                    >
                      <option value="Todos">Todas las temporadas</option>
                      {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] rotate-90 pointer-events-none" />
                  </div>
                </div>

                {/* Color */}
                <div>
                  <p className="text-[10px] font-semibold text-[#999999] uppercase tracking-widest mb-2">Color preferido</p>
                  <div className="flex gap-2.5">
                    {COLORS.map((c) => {
                      const active = filterColor === c.name
                      return (
                        <button
                          key={c.name}
                          onClick={() => setFilterColor(active ? "" : c.name)}
                          aria-label={c.name}
                          className="w-8 h-8 rounded-full transition-all flex items-center justify-center flex-shrink-0"
                          style={{
                            background: c.hex,
                            border: active ? "2px solid #111111" : c.hex === "#FFFFFF" ? "1.5px solid #E0DDD8" : "2px solid transparent",
                            boxShadow: active ? "0 0 0 2px white, 0 0 0 3.5px #111111" : "none",
                          }}
                        >
                          {active && (
                            <Check size={12} color={c.hex === "#FFFFFF" ? "#111111" : "white"} strokeWidth={2.5} />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Closet info banner */}
          {(() => {
            const n = garments.filter((g) => g.refActive).length
            return n > 0 ? (
              <div className="mx-6 mb-3 flex-shrink-0">
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
                  <Shirt size={13} className="text-emerald-600 flex-shrink-0" />
                  <p className="text-[11px] text-emerald-700 font-medium">
                    {n} prenda{n > 1 ? "s" : ""} activa{n > 1 ? "s" : ""} como referencia en tu clóset
                  </p>
                </div>
              </div>
            ) : (
              <div className="mx-6 mb-3 flex-shrink-0">
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                  <Shirt size={13} className="text-amber-500 flex-shrink-0" />
                  <p className="text-[11px] text-amber-700 font-medium">
                    Sin prendas de referencia activas — actívalas desde Mi Armario
                  </p>
                </div>
              </div>
            )
          })()}

          <div className="flex-1 overflow-y-auto scroll-pane px-6 pb-6">
            {filteredModels.length === 0 ? (
              <div className="text-center py-16">
                <Search size={40} strokeWidth={0.8} className="text-[#CCCCCC] mx-auto mb-3" />
                <p className="text-[#BBBBBB] text-[14px]">Sin resultados</p>
                <p className="text-[12px] text-[#CCCCCC] mt-1">Prueba con otra marca o tipo</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {filteredModels.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedModel(m)
                      nav("result")
                    }}
                    className="flex items-center gap-4 p-4 bg-[#F5F2EE] rounded-2xl text-left hover:bg-[#EDE9E4] transition-colors"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shirt size={18} strokeWidth={1.2} className="text-[#BBBBBB]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[12px] font-bold" style={{ color: BRAND_COLORS[m.brand] ?? "#111" }}>
                          {m.brand}
                        </span>
                        <span className="text-[10px] text-[#CCCCCC]">·</span>
                        <span className="text-[10px] text-[#999999] bg-white px-2 py-0.5 rounded-full">{m.type}</span>
                      </div>
                      <p className="font-semibold text-[14px] truncate leading-tight">{m.name}</p>
                      <p className="text-[11px] text-[#AAAAAA] mt-0.5">{m.material} · {m.fit} · {m.season}</p>
                    </div>
                    <ChevronRight size={16} className="text-[#CCCCCC] flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <BottomNav activeTab={activeTab} onTabChange={(id) => { setActiveTab(id); nav(id) }} />
        </div>
      </Shell>
    )
  }

  // =========================================================
  // RESULT
  // =========================================================
  if (screen === "result" && selectedModel) {
    return (
      <Shell>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header showBack onBack={goBack} title="Tu talla equivalente" />
          <div className="flex-1 overflow-y-auto scroll-pane px-6 pb-8">

            {/* Model info */}
            <div className="flex items-center gap-3 p-3.5 bg-[#F5F2EE] rounded-2xl mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                <Shirt size={16} strokeWidth={1.2} className="text-[#BBBBBB]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold truncate">{selectedModel.name}</p>
                <p className="text-[11px] text-[#999999]">{selectedModel.brand} · {selectedModel.type} · {selectedModel.material}</p>
              </div>
            </div>

            {/* Fit selector */}
            <div className="mb-4">
              <p className="text-[11px] font-semibold text-[#999999] uppercase tracking-widest mb-2">
                Ajuste deseado
              </p>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { key: "ajustado", label: "Ajustado", sub: "Más ceñido al cuerpo" },
                  { key: "normal",   label: "Normal",   sub: "Talla base recomendada" },
                  { key: "holgado",  label: "Holgado",  sub: "Más espacio y comodidad" },
                ] as const).map(({ key, label, sub }) => {
                  const active = fitPreference === key
                  return (
                    <button
                      key={key}
                      onClick={() => setFitPreference(key)}
                      className="flex flex-col items-center py-3 px-2 rounded-2xl transition-all border-2"
                      style={{
                        borderColor: active ? "#111111" : "transparent",
                        background: active ? "#111111" : "#F5F2EE",
                      }}
                    >
                      <span
                        className="text-[12px] font-bold leading-tight"
                        style={{ color: active ? "#ffffff" : "#111111" }}
                      >
                        {label}
                      </span>
                      <span
                        className="text-[9px] mt-0.5 leading-tight text-center"
                        style={{ color: active ? "rgba(255,255,255,0.6)" : "#AAAAAA" }}
                      >
                        {sub}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Main result card */}
            <div className="bg-[#111111] rounded-3xl p-8 mb-4 text-center">
              <p className="text-[11px] text-white/50 uppercase tracking-widest font-semibold mb-3">
                Tu talla en {selectedModel.brand}
              </p>
              <div
                className="display-font text-white leading-none mb-5"
                style={{ fontSize: "clamp(72px, 22vw, 100px)", fontWeight: 800 }}
              >
                {resultSize ?? "—"}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-white/15 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: `${confidence}%` }} />
                </div>
                <span className="text-[13px] font-semibold text-white">{confidence}%</span>
              </div>
              <p className="text-[11px] text-white/40 mt-1">índice de confianza</p>
            </div>

            {/* Reference mode toggle */}
            <div className="mb-4">
              <p className="text-[11px] font-semibold text-[#999999] uppercase tracking-widest mb-2">
                Referencia
              </p>
              <div className="flex gap-2 mb-3">
                {([
                  { key: "closet", label: "Mi armario" },
                  { key: "measurements", label: "Mis medidas" },
                ] as const).map(({ key, label }) => {
                  const active = usingCloset ? key === "closet" : key === "measurements"
                  const unavailable = key === "closet" && !autoRef
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        if (unavailable) return
                        setRefMode(key)
                      }}
                      className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold transition-all"
                      style={{
                        background: active ? "#111111" : "#F5F2EE",
                        color: active ? "#ffffff" : unavailable ? "#CCCCCC" : "#666666",
                        opacity: unavailable ? 0.5 : 1,
                      }}
                    >
                      {label}
                      {key === "closet" && !autoRef && (
                        <span className="block text-[9px] font-normal mt-0.5">sin prenda de este tipo</span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Reference detail card */}
              <div className="flex gap-3 items-center">
                <div className="flex-1 bg-[#F5F2EE] rounded-2xl p-4 text-center">
                  {usingCloset ? (
                    <>
                      <p className="text-[10px] text-[#999999] uppercase tracking-widest mb-1">Tu prenda</p>
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mx-auto mb-1 overflow-hidden">
                        {autoRef.photo
                          ? <img src={autoRef.photo} alt={autoRef.name} className="w-full h-full object-cover" />
                          : <Shirt size={14} strokeWidth={1.2} className="text-[#BBBBBB]" />
                        }
                      </div>
                      <p className="text-[11px] font-semibold truncate">{autoRef.name}</p>
                      <p className="text-[10px] text-[#999999]">{autoRef.brand}</p>
                      <p className="text-[24px] font-bold leading-tight mt-1">{autoRef.size}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-[10px] text-[#999999] uppercase tracking-widest mb-1">Tus medidas</p>
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mx-auto mb-1">
                        <Shirt size={14} strokeWidth={1.2} className="text-[#BBBBBB]" />
                      </div>
                      <p className="text-[10px] text-[#999999] leading-snug mt-1">
                        {measurementLabelForType(selectedModel.type)}
                      </p>
                      <p className="text-[24px] font-bold leading-tight mt-1">{profileSize}</p>
                    </>
                  )}
                </div>
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <span className="text-[#CCCCCC] text-lg">→</span>
                  <span className="text-[9px] text-[#CCCCCC] uppercase tracking-widest">equiv.</span>
                </div>
                <div className="flex-1 bg-[#111111] rounded-2xl p-4 text-center">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">En {selectedModel.brand}</p>
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-1">
                    <Shirt size={14} strokeWidth={1.2} className="text-white/40" />
                  </div>
                  <p className="text-[11px] font-semibold text-white truncate">{selectedModel.name}</p>
                  <p className="text-[10px] text-white/50">{selectedModel.type}</p>
                  <p className="text-[24px] font-bold text-white leading-tight mt-1">{resultSize}</p>
                </div>
              </div>
            </div>

            {/* Full comparison table */}
            <div className="mb-5">
              <p className="text-[11px] font-semibold text-[#999999] uppercase tracking-widest mb-2">
                Equivalencias en todas las marcas
              </p>
              <div className="bg-[#F5F2EE] rounded-2xl overflow-hidden">
                {BRANDS.map((brand, i) => {
                  const baseEquiv = SIZE_TABLE[refSize]?.[brand] ?? refSize
                  const equiv = shiftSize(
                    baseEquiv,
                    fitPreference === "ajustado" ? "down" : fitPreference === "holgado" ? "up" : "none"
                  )
                  const highlight = brand === selectedModel.brand
                  return (
                    <div
                      key={brand}
                      className="flex items-center justify-between px-4 py-3"
                      style={{
                        borderBottom: i < BRANDS.length - 1 ? "1px solid rgba(255,255,255,0.7)" : "none",
                        background: highlight ? "rgba(17,17,17,0.06)" : "transparent",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {highlight && <div className="w-1.5 h-1.5 rounded-full bg-[#111111]" />}
                        <span className="text-[14px]" style={{ fontWeight: highlight ? 600 : 400 }}>{brand}</span>
                      </div>
                      <span className="text-[15px] font-bold" style={{ color: highlight ? "#111111" : "#BBBBBB" }}>
                        {equiv}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedModel(null)
                  setFitPreference("normal")
                  nav("search")
                }}
                className="flex-1 py-4 border border-[rgba(0,0,0,0.1)] text-[#111111] rounded-2xl text-[14px] font-semibold hover:bg-[#F5F2EE] transition-colors"
              >
                Nueva búsqueda
              </button>
              <button className="flex-1 py-4 bg-[#111111] text-white rounded-2xl text-[14px] font-semibold hover:opacity-90 transition-opacity">
                Guardar resultado
              </button>
            </div>
          </div>
        </div>
      </Shell>
    )
  }

  // =========================================================
  // PROFILE
  // =========================================================
  if (screen === "profile") {
    return (
      <Shell>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header showBack={false} onBack={goBack} title="Perfil" />
          <div className="flex-1 overflow-y-auto scroll-pane pb-6">
            {/* Avatar */}
            <div className="flex flex-col items-center px-6 mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-3 bg-[#F5F2EE]">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format"
                  alt={`Foto de perfil de ${currentUser?.name ?? ""}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="display-font text-[22px] font-bold">
                {currentUser?.name ?? ""}
              </h2>
              <p className="text-[14px] text-[#999999] mt-0.5">{currentUser?.email ?? ""}</p>
            </div>

            {/* Measurements */}
            <div className="px-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] font-semibold text-[#999999] uppercase tracking-wider">
                  Mis medidas
                </h3>
                <button
                  onClick={() => {
                    setLocalMeasurements({ ...measurements })
                    nav("edit-measurements")
                  }}
                  className="text-[12px] font-semibold text-[#111111] hover:opacity-70 transition-opacity"
                >
                  Editar
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: "Pecho", key: "pecho" as const },
                  { label: "Cintura", key: "cintura" as const },
                  { label: "Cadera", key: "cadera" as const },
                  { label: "Hombros", key: "hombros" as const },
                ].map(({ label, key }) => (
                  <div
                    key={label}
                    className="bg-[#F5F2EE] rounded-2xl p-4"
                  >
                    <p className="text-[10px] text-[#999999] uppercase tracking-widest mb-1">
                      {label}
                    </p>
                    <p className="text-[22px] font-bold leading-none">
                      {measurements[key]}
                      <span className="text-[13px] font-normal text-[#999999] ml-1">cm</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="px-6">
              {[
                { label: "Editar medidas", Icon: Ruler, action: () => { setLocalMeasurements({ ...measurements }); nav("edit-measurements") } },
                { label: "Notificaciones", Icon: Bell, action: () => nav("notifications") },
                { label: "Configuración", Icon: Settings, action: () => {} },
              ].map(({ label, Icon, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="w-full flex items-center justify-between py-4 border-b border-[rgba(0,0,0,0.06)] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      strokeWidth={1.5}
                      className="text-[#999999]"
                    />
                    <span className="text-[15px]">{label}</span>
                  </div>
                  <ChevronRight size={16} className="text-[#CCCCCC]" />
                </button>
              ))}

              <button
                onClick={() => {
                  clearSession()
                  setCurrentUser(null)
                  setGarments([])
                  setActiveTab("home")
                  setOnboardingStep(0)
                  nav("splash")
                }}
                className="flex items-center gap-3 py-4 text-red-400 w-full mt-2"
              >
                <LogOut size={18} strokeWidth={1.5} />
                <span className="text-[15px]">Cerrar sesión</span>
              </button>
            </div>
          </div>
          <BottomNav activeTab={activeTab} onTabChange={(id) => { setActiveTab(id); nav(id) }} />
        </div>
      </Shell>
    )
  }

  // =========================================================
  // EDIT MEASUREMENTS
  // =========================================================
  if (screen === "edit-measurements") {
    const fields = [
      { key: "pecho" as const, label: "Pecho", desc: "Contorno alrededor de la parte más ancha del pecho", icon: "⊙" },
      { key: "cintura" as const, label: "Cintura", desc: "Contorno en la parte más estrecha del torso", icon: "◎" },
      { key: "cadera" as const, label: "Cadera", desc: "Contorno alrededor de la parte más ancha de la cadera", icon: "⊙" },
      { key: "hombros" as const, label: "Hombros", desc: "Distancia de hombro a hombro por la espalda", icon: "↔" },
      { key: "manga" as const, label: "Manga", desc: "Desde el hombro hasta la muñeca con el brazo extendido", icon: "↕" },
      { key: "entrepierna" as const, label: "Entrepierna", desc: "Desde la ingle hasta el tobillo", icon: "↕" },
    ]

    const handleSave = () => {
      setMeasurements({ ...localMeasurements })
      nav("profile")
    }

    return (
      <Shell>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header showBack onBack={goBack} title="Editar medidas" />
          <div className="flex-1 overflow-y-auto scroll-pane px-6 pb-8">

            {/* Intro card */}
            <div className="bg-[#F5F2EE] rounded-2xl p-4 mb-6 flex gap-3">
              <Ruler size={20} strokeWidth={1.5} className="text-[#999999] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-semibold mb-0.5">¿Cómo medir correctamente?</p>
                <p className="text-[12px] text-[#999999] leading-relaxed">
                  Usa una cinta métrica flexible y mide sobre ropa ajustada o directamente sobre la piel. Introduce los valores en centímetros.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {fields.map(({ key, label, desc }) => (
                <div key={key}>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <label className="text-[13px] font-semibold">{label}</label>
                    <span className="text-[11px] text-[#BBBBBB]">cm</span>
                  </div>
                  <p className="text-[11px] text-[#BBBBBB] mb-2 leading-snug">{desc}</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setLocalMeasurements((m) => ({
                          ...m,
                          [key]: String(Math.max(0, Number(m[key]) - 1)),
                        }))
                      }
                      className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#F5F2EE] text-[20px] font-light hover:bg-[#E8E5E0] transition-colors flex-shrink-0"
                    >
                      −
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={localMeasurements[key]}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9.]/g, "")
                          setLocalMeasurements((m) => ({ ...m, [key]: val }))
                        }}
                        onBlur={(e) => {
                          const num = parseFloat(e.target.value)
                          if (!isNaN(num)) {
                            setLocalMeasurements((m) => ({ ...m, [key]: String(num) }))
                          }
                        }}
                        className="w-full text-center py-3 bg-[#F5F2EE] rounded-xl text-[22px] font-bold outline-none focus:ring-2 focus:ring-[#111111]/15"
                      />
                    </div>
                    <button
                      onClick={() =>
                        setLocalMeasurements((m) => ({
                          ...m,
                          [key]: String(Number(m[key]) + 1),
                        }))
                      }
                      className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#F5F2EE] text-[20px] font-light hover:bg-[#E8E5E0] transition-colors flex-shrink-0"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Preview chips */}
            <div className="mt-6 mb-2">
              <p className="text-[11px] font-semibold text-[#999999] uppercase tracking-widest mb-3">
                Resumen
              </p>
              <div className="grid grid-cols-3 gap-2">
                {fields.map(({ key, label }) => (
                  <div key={key} className="bg-[#F5F2EE] rounded-xl px-3 py-2.5 text-center">
                    <p className="text-[10px] text-[#999999] mb-0.5">{label}</p>
                    <p className="text-[16px] font-bold">{localMeasurements[key]}<span className="text-[10px] font-normal text-[#BBBBBB]"> cm</span></p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full py-4 bg-[#111111] text-white text-[15px] font-semibold rounded-2xl mt-6 hover:opacity-90 transition-opacity"
            >
              Guardar medidas
            </button>
          </div>
        </div>
      </Shell>
    )
  }

  // =========================================================
  // NOTIFICATIONS
  // =========================================================
  if (screen === "notifications") {
    return (
      <Shell>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header showBack onBack={goBack} title="Notificaciones" />
          <div className="flex-1 overflow-y-auto scroll-pane px-6 pb-6">
            {NOTIFICATIONS_DATA.map((n) => (
              <div
                key={n.id}
                className="flex gap-4 py-4 border-b border-[rgba(0,0,0,0.06)] last:border-0"
                style={{ opacity: n.read ? 0.55 : 1 }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{
                    background: n.read ? "#E0DDD8" : "#111111",
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <p className="text-[14px] font-semibold">{n.title}</p>
                    <p className="text-[11px] text-[#999999] flex-shrink-0">
                      {n.time}
                    </p>
                  </div>
                  <p className="text-[13px] text-[#999999] leading-relaxed">
                    {n.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Shell>
    )
  }

  return <Shell><div className="flex-1" /></Shell>
}
