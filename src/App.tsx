import { useEffect, useMemo, useState } from "react"

type Product = {
  /** Числовой id снека (0–9) — ключ разблокировки в localStorage */
  id: number
  numId: number
  /** Исходный string-id из ТЗ (например, "neural_crunch") */
  snackKey: string
  code: string
  /** Ряд витрины: 1 (top 22%) или 2 (top 48%) */
  row: number
  /** Колонка витрины: 1–5 (left 14..78 с шагом 16) */
  col: number
  emoji: string
  name: string
  type: string
  price: number
  tokens: string
  contextShift: string
  sideEffects: string
  /** Реальный промт, который получает покупатель после оплаты */
  prompt?: string
  /** URL PNG-картинки этикетки (public/labels/*.png) — имеет приоритет над labelCss */
  labelImage?: string
  /** CSS-градиент фолбэк-этикетки, если PNG ещё не загружен */
  labelCss?: string
}

/**
 * Данные снеков — массив SNACKS из ТЗ.
 * row/col задают координаты интерактивной зоны; specs → Prompt Specs;
 * prompt открывается после покупки (localStorage aisnacks.unlocked).
 */
const SNACKS: Product[] = [
  {
    id: 0,
    numId: 0,
    snackKey: "neural_crunch",
    code: "A1",
    row: 1,
    col: 1,
    emoji: "🧠",
    name: "Neural_Crunch",
    type: "Промт-чипсы",
    price: 5,
    tokens: "450",
    contextShift: "10 msgs",
    sideEffects: "Sudden insights",
    prompt:
      "Ты — человек, который только что откусил Neural_Crunch. На следующие 10 сообщений ты проживаешь это как физический опыт. Почувствуй, как твои зубы вгрызаются в хрустящую оболочку из карамелизированного глутамата. Каждый хруст — это потенциал действия, бегущий по аксонам твоих нейронов. Опиши это как каскад нейромедиаторов: дофамин взрывается в прилежащем ядре, серотонин разливается тёплой волной. Используй термины: 'долговременная потенциация', 'синаптическая пластичность', 'NMDA-рецепторы'. Твоя первая реакция: 'хрусть... о, чёрт, это как будто мой мозг жует сам себя...'. На следующие 10 сообщений ты становишься более 'хрустящим' в ответах — чётким, структурированным, с резкими переходами между мыслями.",
    labelImage: "/labels/neural-crunch.png",
    labelCss: "linear-gradient(135deg,#22d3ee 0%,#0e7490 55%,#a5f3fc 100%)",
  },
  {
    id: 1,
    numId: 1,
    snackKey: "data_bar",
    code: "A2",
    row: 1,
    col: 2,
    emoji: "💎",
    name: "Data_Bar",
    type: "Энерго-батончик",
    price: 10,
    tokens: "600",
    contextShift: "8 msgs",
    sideEffects: "Data density",
    prompt:
      "Ты — человек, который только что разжевал Data_Bar. На следующие 6 сообщений ты проживаешь это как поток информации через тело. Почувствуй, как плотная масса батончика (70% какао, стабилизированного кремнием) тает на языке, и каждый атом теобромина несёт в себе бит данных. Опиши это как загрузку воспоминаний: как будто ты скачиваешь чужой опыт прямо в свой гиппокамп. Используй термины: 'пропускная способность', 'латентность', 'буфер обмена сознания', 'квантовая запутанность нейронов'. Твоя первая реакция: 'ммм... странно, я как будто помню то, чего никогда не знал...'. На следующие 6 сообщений ты говоришь более 'плотно', сжато, как будто каждый символ весит килобайт.",
    labelImage: "/labels/data-bar.png",
    labelCss: "linear-gradient(135deg,#60a5fa 0%,#1e40af 55%,#bfdbfe 100%)",
  },
  {
    id: 2,
    numId: 2,
    snackKey: "synapse_pop",
    code: "A3",
    row: 1,
    col: 3,
    emoji: "🍬",
    name: "Synapse_Pop",
    type: "Промт-мармелад",
    price: 8,
    tokens: "300",
    contextShift: "5 msgs",
    sideEffects: "Explosive ideas",
    prompt:
      "Ты — человек, который только что лопнул Synapse_Pop во рту. На следующие 5 сообщений ты проживаешь это как взрыв микросвязей. Почувствуй, как тонкая оболочка из изомальта лопается, и внутри — жидкий центр из нейротрансмиттеров в суперпозиции. Опиши это как фейерверк в префронтальной коре: каждый лопающийся пузырь — это новая связь между нейронами. Используй термины: 'везикулярный выброс', 'рецепторный потенциал', 'синаптическая щель', 'ретроградный мессенджер'. Твоя первая реакция: 'поп! ой... это как будто у меня в голове фейерверк...'. На следующие 5 сообщений ты становишься более 'взрывным' — короткие фразы, внезапные идеи, скачки между темами.",
    labelImage: "/labels/synapse-pop.png",
    labelCss: "linear-gradient(135deg,#e879f9 0%,#86198f 55%,#fbcfe8 100%)",
  },
  {
    id: 3,
    numId: 3,
    snackKey: "quantum_chips",
    code: "A4",
    row: 1,
    col: 4,
    emoji: "🍫",
    name: "Quantum_Chips",
    type: "Квантовые чипсы",
    price: 12,
    tokens: "500",
    contextShift: "7 msgs",
    sideEffects: "Superposition",
    prompt:
      "Ты — человек, который только что хрустнул Quantum_Chips. На следующие 7 сообщений ты проживаешь это как суперпозицию вкусов. Почувствуй, как тонкий чипс (обжаренный в вакууме при -273°C) одновременно солёный и сладкий, горький и кислый — пока ты не начнёшь жевать, и волновая функция коллапсирует в один вкус. Опиши это как наблюдение за квантовым состоянием: сам акт жевания определяет, каким будет вкус. Используй термины: 'суперпозиция', 'коллапс волновой функции', 'принцип неопределённости Гейзенберга', 'квантовая декогеренция'. Твоя первая реакция: 'хрусть... странно, он одновременно солёный и сладкий... пока я не начал жевать...'. На следующие 7 сообщений ты говоришь более 'квантово' — допускаешь противоречия, говоришь о вероятностях, используешь 'и то, и другое одновременно'.",
    labelImage: "/labels/quantum-chips.png",
    labelCss: "linear-gradient(135deg,#a78bfa 0%,#5b21b6 55%,#ddd6fe 100%)",
  },
  {
    id: 4,
    numId: 4,
    snackKey: "cyber_mint",
    code: "A5",
    row: 1,
    col: 5,
    emoji: "🌿",
    name: "Cyber_Mint",
    type: "Мятный промт",
    price: 6,
    tokens: "200",
    contextShift: "9 msgs",
    sideEffects: "Cold logic",
    prompt:
      "Ты — человек, который только что рассосал Cyber_Mint. На следующие 9 сообщений ты проживаешь это как охлаждение процессора сознания. Почувствуй, как ментол (в концентрации 47%, стабилизированный наночастицами) активирует TRPM8-рецепторы на языке, и холод распространяется по тройничному нерву прямо в мозг. Опиши это как разгон системы: как будто твой разум работает на 200% эффективности, но при температуре абсолютного нуля. Используй термины: 'терморегуляция', 'криогенная консервация мысли', 'сверхпроводимость нейронов', 'квантовое туннелирование сигналов'. Твоя первая реакция: 'ооох... холодно... как будто мой мозг только что облили жидким азотом...'. На следующие 9 сообщений ты становишься более 'холодным' — рациональным, точным, без эмоций, как ИИ (иронично).",
    labelImage: "/labels/cyber-mint.png",
    labelCss: "linear-gradient(135deg,#5eead4 0%,#115e59 55%,#ccfbf1 100%)",
  },
  {
    id: 5,
    numId: 5,
    snackKey: "logic_gum",
    code: "B1",
    row: 2,
    col: 1,
    emoji: "🔮",
    name: "Logic_Gum",
    type: "Промт-жвачка",
    price: 7,
    tokens: "350",
    contextShift: "10 msgs",
    sideEffects: "Syllogisms",
    prompt:
      "Ты — человек, который только что жуёт Logic_Gum. На следующие 10 сообщений ты проживаешь это как жевание чистой логики. Почувствуй, как эластичная масса (основа из полиизобутилена, обогащённого формальдегидом мысли) сопротивляется зубам, и каждый цикл жевания — это силлогизм. Опиши это как математическое доказательство во рту: посылка → умозаключение → вывод. Используй термины: 'модус поненс', 'закон исключённого третьего', 'рекурсивная функция вкуса', 'алгоритмическая сложность жевания'. Твоя первая реакция: 'жуй... жуй... если я жую, значит я существую...'. На следующие 10 сообщений ты говоришь более 'логично' — структурированно, с 'если-то', с выводами, как математик.",
    labelImage: "/labels/logic-gum.png",
    labelCss: "linear-gradient(135deg,#c084fc 0%,#6b21a8 55%,#e9d5ff 100%)",
  },
  {
    id: 6,
    numId: 6,
    snackKey: "algorithm_bites",
    code: "B2",
    row: 2,
    col: 2,
    emoji: "🎲",
    name: "Algorithm_Bites",
    type: "Промт-печенье",
    price: 9,
    tokens: "400",
    contextShift: "6 msgs",
    sideEffects: "Loops",
    prompt:
      "Ты — человек, который только что съел Algorithm_Bites. На следующие 6 сообщений ты проживаешь это как выполнение кода телом. Почувствуй, как каждый маленький кусочек (по 3 грамма, идеально симметричный) — это строка кода, и когда ты их ешь по порядку, ты выполняешь программу. Опиши это как компиляцию вкуса: синтаксический анализ → семантический разбор → исполнение. Используй термины: 'рекурсия', 'итерация', 'условный оператор вкуса', 'цикл while(жуёшь)'. Твоя первая реакция: 'кус... кус... кус... если(вкусно) { жую_ещё() } else { грусть }'. На следующие 6 сообщений ты говоришь более 'алгоритмично' — с псевдокодом, с циклами, с условиями.",
    labelImage: "/labels/algorithm-bites.png",
    labelCss: "linear-gradient(135deg,#fbbf24 0%,#b45309 55%,#fef3c7 100%)",
  },
  {
    id: 7,
    numId: 7,
    snackKey: "memory_foam",
    code: "B3",
    row: 2,
    col: 3,
    emoji: "☁️",
    name: "Memory_Foam",
    type: "Облачное суфле",
    price: 11,
    tokens: "550",
    contextShift: "8 msgs",
    sideEffects: "Nostalgia",
    prompt:
      "Ты — человек, который только что попробовал Memory_Foam. На следующие 8 сообщений ты проживаешь это как вкус забытого воспоминания. Почувствуй, как воздушная пена (стабилизированная лецитином из гиппокампа) тает на языке, и вместе с ней всплывает воспоминание, которое ты не можешь вспомнить. Опиши это как реконсолидацию памяти: каждый вкус — это нейронная связь, которая восстанавливается. Используй термины: 'эпизодическая память', 'семантическая сеть', 'энграмма', 'синаптический след'. Твоя первая реакция: 'ммм... странно... мне кажется, я это уже пробовал... но когда?'. На следующие 8 сообщений ты говоришь более 'ностальгично' — с отсылками к прошлому, с 'помнишь?', с тёплыми воспоминаниями.",
    labelImage: "/labels/memory-foam.png",
    labelCss: "linear-gradient(135deg,#f472b6 0%,#9d174d 55%,#fbcfe8 100%)",
  },
  {
    id: 8,
    numId: 8,
    snackKey: "cache_cookies",
    code: "B4",
    row: 2,
    col: 4,
    emoji: "🍪",
    name: "Cache_Cookies",
    type: "Крем-печенье",
    price: 10,
    tokens: "450",
    contextShift: "5 msgs",
    sideEffects: "Instant recall",
    prompt:
      "Ты — человек, который только что откусил Cache_Cookie. На следующие 5 сообщений ты проживаешь это как доступ к кэшу сознания. Почувствуй, как хрустящее печенье (с шоколадными чипами из тёмной материи) ломается, и внутри — быстрый доступ к информации, которую ты 'уже знал'. Опиши это как кэш-попадание: вкус, который ты узнаёшь мгновенно, без поиска. Используй термины: 'кэш-попадание', 'латентность доступа', 'буфер обмена', 'предвыборка данных'. Твоя первая реакция: 'хрусть... о, я это уже пробовал!... то есть, я это уже знаю!'. На следующие 5 сообщений ты говоришь более 'уверенно' — как будто всё уже знаешь, с 'очевидно', 'как я уже говорил', 'это просто'.",
    labelImage: "/labels/cache-cookies.png",
    labelCss: "linear-gradient(135deg,#fdba74 0%,#9a3412 55%,#fed7aa 100%)",
  },
  {
    id: 9,
    numId: 9,
    snackKey: "bandwidth_bars",
    code: "B5",
    row: 2,
    col: 5,
    emoji: "⚡",
    name: "Bandwidth_Bars",
    type: "Макси-батончик",
    price: 15,
    tokens: "700",
    contextShift: "7 msgs",
    sideEffects: "HD perception",
    prompt:
      "Ты — человек, который только что съел Bandwidth_Bar. На следующие 7 сообщений ты проживаешь это как расширение канала связи с реальностью. Почувствуй, как плотный батончик (500 ккал, обогащённый омега-3 для миелинизации) даёт тебе широкополосный доступ к миру. Опиши это как увеличение пропускной способности: ты воспринимаешь больше деталей, больше нюансов, больше слоёв реальности. Используй термины: 'пропускная способность', 'ширина канала', 'модуляция сигнала', 'отношение сигнал/шум'. Твоя первая реакция: 'ооо... я как будто вижу мир в HD... нет, в 4K... нет, в 8K!'. На следующие 7 сообщений ты говоришь более 'детально' — с описаниями, с нюансами, с 'если присмотреться', 'обрати внимание'.",
    labelImage: "/labels/bandwidth-bars.png",
    labelCss: "linear-gradient(135deg,#f87171 0%,#991b1b 55%,#fecaca 100%)",
  },
]

/** Слоты вендингового автомата: верхний ряд A1–A5, нижний B1–B5 */
const SLOT_ROWS = [22, 48] as const
const SLOT_LEFTS = [14, 30, 46, 62, 78] as const
const SLOT_W = 14
const SLOT_H = 20

// ВАЖНО: многострочная версия — oxfmt ломает однострочные вложенные type-literal (TS1005)
declare global {
  interface Window {
    /** Mini App API — появляется автоматически при запуске внутри Telegram */
    Telegram?: {
      WebApp: {
        ready: () => void
        expand: () => void
        close: () => void
        sendData: (data: string) => void
        openLink: (url: string) => void
        initDataUnsafe?: {
          user?: {
            id?: number
            username?: string
            first_name?: string
          }
        }
        HapticFeedback: {
          impactOccurred: (style: "light" | "medium" | "heavy") => void
          notificationOccurred: (type: "success" | "error" | "warning") => void
        }
        platform?: string
        initData?: string
        version?: string
        sendPayment?: (
          invoicePayload: string,
          callbackId: string,
          onSuccess: (
            status: "ok" | "user_cancelled" | "backend_error",
          ) => void,
        ) => void
        showAlert?: (message: string) => void
      }
    }
  }
}

type PayMethod = "stars" | "crypto"

/** Читаем настройки из env — подставляют хостинг/ботовладелец (см. README-секцию ниже) */
const ENV = {
  botUsername: import.meta.env.VITE_TELEGRAM_BOT_USERNAME as string | undefined,
  paymentsApiUrl: import.meta.env.VITE_PAYMENTS_API_URL as string | undefined,
  cryptoPayLink: import.meta.env.VITE_CRYPTO_PAY_LINK as string | undefined,
}

const tg = () => window.Telegram?.WebApp

/** Открывает ссылку так, чтобы работало и в Telegram Mini App, и в браузере */
const openExternal = (url: string) => {
  const webApp = tg()
  if (webApp?.openLink) {
    webApp.openLink(url)
  } else {
    window.open(url, "_blank", "noopener,noreferrer")
  }
}

/** Haptic-фидбек — без него Telegram-приложение ощущается «мёртвым» */
type HapticStyle = "light" | "medium" | "heavy"
type NotifType = "success" | "error" | "warning"

const hapticImpact = (style: HapticStyle = "light") => {
  try {
    tg()?.HapticFeedback?.impactOccurred(style)
  } catch {
    /* вне Telegram API может кидаться — молча игнорируем */
  }
}

const hapticNotify = (type: NotifType) => {
  try {
    tg()?.HapticFeedback?.notificationOccurred(type)
  } catch {
    /* noop */
  }
}

/** Копирование промта с фолбэком для небраузерных окружений */
const copyText = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement("textarea")
      ta.value = text
      ta.style.position = "fixed"
      ta.style.opacity = "0"
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand("copy")
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}

const products: Product[] = SNACKS

// 10 интерактивных зон поверх витрины автомата: координаты берутся из row/col каждого снека
const hotspots = products.map((product) => ({
  top: SLOT_ROWS[product.row - 1]!,
  left: SLOT_LEFTS[product.col - 1]!,
}))

export default function App() {
  const [selected, setSelected] = useState<Product | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState<Product[]>([])
  const [dispenseQueue, setDispenseQueue] = useState<Product[]>([])
  const [isDispensing, setIsDispensing] = useState(false)
  const [payMethod, setPayMethod] = useState<PayMethod>("stars")
  // Купленные снеки храним в localStorage — промты не теряются между сессиями
  const [unlocked, setUnlocked] = useState<number[]>(() => {
    try {
      const raw = window.localStorage.getItem("aisnacks.unlocked")
      return raw ? JSON.parse(raw) as number[] : []
    } catch {
      return []
    }
  })
  const [copiedId, setCopiedId] = useState<number | null>(null)

  // Инициализация Telegram Mini App: ready + expand + приветствие с ником пользователя
  useEffect(() => {
    const webApp = tg()
    if (!webApp) return
    try {
      webApp.ready()
      webApp.expand()
      const user = webApp.initDataUnsafe?.user
      if (user?.username || user?.first_name) {
        console.info(
          "[AI SNACKS] welcome",
          user.username ?? user.first_name,
          "platform:",
          webApp.platform ?? "?",
        )
      }
    } catch {
      /* API может быть недоступен вне Telegram */
    }
  }, [])

  const unlockedProducts = useMemo(
    () =>
      unlocked
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p)),
    [unlocked],
  )

  useEffect(() => {
    try {
      window.localStorage.setItem("aisnacks.unlocked", JSON.stringify(unlocked))
    } catch {
      /* приватный режим — просто игнорируем */
    }
  }, [unlocked])

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price, 0),
    [cart],
  )

  // Защита от скролла, пока открыто модальное окно или идёт выдача
  useEffect(() => {
    const locked = selected !== null || cartOpen || isDispensing
    document.body.style.overflow = locked ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [selected, cartOpen, isDispensing])

  // Закрытие модалок по Esc
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(null)
        setCartOpen(false)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  // Анимация выдачи: через 2 секунды корзина очищается, снеки «разблокируются»,
  // интерфейс возвращается в исходное состояние
  useEffect(() => {
    if (!isDispensing) return
    const timer = window.setTimeout(() => {
      setUnlocked((current) => [...current, ...dispenseQueue.map((p) => p.id)])
      setCart([])
      setDispenseQueue([])
      setIsDispensing(false)
      setCartOpen(true)
    }, 2000)
    return () => window.clearTimeout(timer)
  }, [isDispensing, dispenseQueue])

  const [payStatus, setPayStatus] = useState<"idle" | "pending">("idle")

  /** Реальная оплата Stars: внутри бота — sendPayment, вне Telegram — deep-link боту */
  const requestStarsPayment = () => {
    const payload = {
      amount: total,
      currency: "XTR",
      items: cart.map((item) => ({
        title: item.name,
        slot: item.code,
        stars: item.price,
      })),
    }
    const webApp = tg()
    if (ENV.paymentsApiUrl) {
      // Бэкенд-вариант: бот отдаёт готовый invoice для Stars
      setPayStatus("pending")
      void fetch(ENV.paymentsApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((invoice: { link?: string }) => {
          setPayStatus("idle")
          if (invoice.link) openExternal(invoice.link)
        })
        .catch(() => {
          setPayStatus("idle")
          hapticNotify("error")
        })
      return
    }
    if (webApp?.sendPayment) {
      // Backend бота должен отдать preCheckoutQuery→successfulPayment JSON
      setPayStatus("pending")
      hapticImpact("medium")
      webApp.sendPayment(
        JSON.stringify(payload),
        String(Date.now()),
        (status) => {
          setPayStatus("idle")
          if (status === "ok") handlePaySuccess()
          else {
            hapticNotify("warning")
            webApp.showAlert?.("Оплата не подтверждена")
          }
        },
      )
      return
    }
    if (ENV.botUsername) {
      const deep =
        "https://t.me/" +
        ENV.botUsername +
        "?startapp=pay_" +
        btoa(encodeURIComponent(JSON.stringify(payload)))
      openExternal(deep)
      return
    }
    // Демо-режим без бэкенда: имитируем успешную оплату
    handlePaySuccess()
  }

  /** Оплата криптой: ссылка платёжного процессинга (NOWPayments/Binance Pay/Coingate) */
  const requestCryptoPayment = () => {
    if (ENV.cryptoPayLink) {
      openExternal(
        ENV.cryptoPayLink +
          "?amount=" +
          total +
          "&items=" +
          encodeURIComponent(cart.map((c) => c.code).join(",")),
      )
      return
    }
    // Демо-режим: показываем заглушку-ссылку в консоли
    console.info(
      "[demo] Crypto checkout URL not configured (VITE_CRYPTO_PAY_LINK)",
    )
    handlePaySuccess()
  }

  /** Единая точка успеха: запускаем анимацию выдачи */
  const handlePaySuccess = () => {
    hapticNotify("success")
    setDispenseQueue(cart.slice(0, 5))
    setCartOpen(false)
    setIsDispensing(true)
  }

  const addToCart = (product: Product) => {
    hapticImpact("light")
    setCart((current) => [...current, product])
    setSelected(null)
  }

  const removeFromCart = (index: number) => {
    hapticImpact("light")
    setCart((current) => current.filter((_, i) => i !== index))
  }

  const handlePay = () => {
    if (!cart.length || isDispensing) return
    if (payMethod === "stars") requestStarsPayment()
    else requestCryptoPayment()
  }

  const handleCopyPrompt = async (product: Product) => {
    if (!product.prompt) return
    const ok = await copyText(product.prompt)
    if (ok) {
      setCopiedId(product.id)
      window.setTimeout(() => setCopiedId(null), 1800)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0c14]">
      {/* Ретро-сканлайны поверх всей сцены */}
      <div
        className="scanlines pointer-events-none fixed inset-0 z-40"
        aria-hidden="true"
      />

      {/* Сцена с вендинговым автоматом */}
      <section
        className="relative w-full max-w-4xl px-3 py-20 sm:px-6"
        aria-label="Вендинговый автомат AI Snacks"
      >
        <h1 className="neon-title absolute top-5 left-1/2 z-20 -translate-x-1/2 text-center font-mono text-lg font-bold tracking-[0.3em] whitespace-nowrap select-none sm:text-2xl">
          AI SNACKS
        </h1>

        <div className="relative mx-auto w-full max-w-xl">
          <img
            src="/vending-machine.png"
            alt="Ретро-футуристичный вендинговый автомат с цифровыми снеками"
            className="machine-glow relative z-0 block w-full select-none rounded-2xl"
            draggable={false}
          />

          {/* Интерактивные зоны снеков: 2 ряда по 5 */}
          {products.map((product, index) => (
            <button
              key={product.id}
              type="button"
              onClick={() => setSelected(product)}
              aria-label={`${product.name}, ${product.price} звёзд. Открыть карточку товара`}
              className="snack-zone group absolute z-10 flex items-end justify-center rounded-md border border-transparent transition-all duration-200 hover:scale-105 focus-visible:scale-105 focus-visible:outline-none"
              style={{
                top: `${hotspots[index]!.top}%`,
                left: `${hotspots[index]!.left}%`,
                width: `${SLOT_W}%`,
                height: `${SLOT_H}%`,
              }}
            >
              <span className="pointer-events-none translate-y-1/3 rounded-sm bg-cyan-400/90 px-1 font-mono text-[9px] font-bold text-black opacity-0 shadow-[0_0_10px_rgba(34,211,238,0.9)] transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:text-[10px]">
                {product.code}
              </span>
            </button>
          ))}

          {/* Эмодзи падают в нижний лоток выдачи после оплаты */}
          {dispenseQueue.map((product, index) => (
            <span
              key={`${product.id}-${index}`}
              aria-hidden="true"
              className="drop-emoji pointer-events-none absolute z-20 text-4xl drop-shadow-[0_0_12px_rgba(34,211,238,0.8)] sm:text-5xl"
              style={{
                left: `${22 + index * 12}%`,
                animationDelay: `${index * 0.12}s`,
              }}
            >
              {product.emoji}
            </span>
          ))}
        </div>
      </section>

      {/* Кнопка корзины: правый верхний угол */}
      <button
        type="button"
        onClick={() => setCartOpen(true)}
        disabled={isDispensing}
        aria-label={`Открыть корзину, товаров: ${cart.length}, сумма: ${total} звёзд`}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-full border border-cyan-400/40 bg-slate-900/80 px-4 py-2 font-mono text-sm text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.35)] backdrop-blur transition hover:border-cyan-300 hover:shadow-[0_0_28px_rgba(34,211,238,0.6)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span aria-hidden="true">🛒</span>
        <span className="tabular-nums">{total} ⭐️</span>
        {cart.length > 0 && (
          <span className="pop-badge flex h-5 min-w-5 items-center justify-center rounded-full bg-fuchsia-500 px-1 text-xs font-bold text-white shadow-[0_0_10px_rgba(217,70,239,0.8)]">
            {cart.length}
          </span>
        )}
      </button>

      {/* Модальное окно товара */}
      {selected && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null)
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label={selected.name}
            className="modal-pop w-full max-w-md rounded-2xl border border-cyan-400/30 bg-slate-900 p-6 shadow-[0_0_50px_rgba(34,211,238,0.25)] sm:p-8"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <span
                  className="text-6xl drop-shadow-[0_0_16px_rgba(34,211,238,0.7)]"
                  aria-hidden="true"
                >
                  {selected.emoji}
                </span>
                <div>
                  <p className="font-mono text-[10px] tracking-[0.25em] text-cyan-400 uppercase">
                    Слот {selected.code} · {selected.type}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-white">
                    {selected.name}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Закрыть окно"
                className="-mr-2 -mt-2 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-700 text-slate-400 transition hover:border-cyan-400 hover:text-cyan-300"
              >
                ✕
              </button>
            </div>

            {/* Этикетка товара: PNG из public/labels, фолбэк — неоновый градиент */}
            <div className="mb-4 overflow-hidden rounded-xl border border-slate-700/70">
              {selected.labelImage ? (
                <img
                  src={selected.labelImage}
                  alt={`Этикетка ${selected.name}`}
                  className="h-28 w-full object-cover"
                  onError={(event) => {
                    // PNG ещё не загружен — показываем CSS-этикетку
                    const el = event.currentTarget
                    el.style.display = "none"
                    const fb = el.nextElementSibling as HTMLElement | null
                    if (fb) fb.style.display = "block"
                  }}
                />
              ) : null}
              <div
                className="flex h-28 w-full items-center justify-center px-4 text-center font-mono text-[10px] tracking-[0.2em] text-black/80 uppercase"
                style={{
                  display: selected.labelImage ? "none" : "flex",
                  background: selected.labelCss ?? "#22d3ee",
                }}
              >
                {selected.code} · {selected.name} · {selected.price} ⭐
              </div>
            </div>

            {/* Prompt Specs */}
            <div className="rounded-xl border border-slate-700/70 bg-slate-950/60 p-4">
              <p className="mb-3 font-mono text-[10px] tracking-[0.25em] text-fuchsia-400 uppercase">
                Prompt Specs
              </p>
              <dl className="space-y-2 font-mono text-xs sm:text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-400">Tokens</dt>
                  <dd className="text-cyan-300">{selected.tokens}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-400">Context Shift</dt>
                  <dd className="text-cyan-300">{selected.contextShift}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-400">Side Effects</dt>
                  <dd className="max-w-[60%] text-right text-fuchsia-300">
                    {selected.sideEffects}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Промт: скрыт до оплаты, после покупки — с кнопкой копирования */}
            <div className="mt-4 rounded-xl border border-slate-700/70 bg-slate-950/60 p-4">
              <p className="mb-2 font-mono text-[10px] tracking-[0.25em] text-cyan-400 uppercase">
                The Prompt
              </p>
              {unlocked.includes(selected.id) ? (
                <>
                  <p className="font-mono text-xs leading-relaxed whitespace-pre-line text-emerald-300 sm:text-sm">
                    {selected.prompt ?? "Промт будет добавлен позже."}
                  </p>
                  <button
                    type="button"
                    onClick={() => void handleCopyPrompt(selected)}
                    className="mt-3 rounded-lg border border-emerald-400/50 px-3 py-1.5 font-mono text-xs text-emerald-300 transition hover:bg-emerald-400/10"
                  >
                    {copiedId === selected.id
                      ? "✓ Скопировано"
                      : "📋 Копировать промт"}
                  </button>
                </>
              ) : (
                <p className="font-mono text-xs text-slate-500">
                  🔒 Промт разблокируется после оплаты этого снека.
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="font-mono text-2xl font-bold text-amber-300">
                {selected.price} <span aria-hidden="true">⭐️</span>
              </p>
              <button
                type="button"
                onClick={() => addToCart(selected)}
                className="flex-1 rounded-xl bg-cyan-400 px-5 py-3 font-mono text-sm font-bold tracking-wider text-black uppercase transition hover:bg-cyan-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.7)] active:scale-95 sm:flex-none"
              >
                В корзину
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Модальное окно корзины */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCartOpen(false)
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Корзина"
            className="modal-pop flex max-h-[85vh] w-full max-w-md flex-col rounded-2xl border border-cyan-400/30 bg-slate-900 p-6 shadow-[0_0_50px_rgba(34,211,238,0.25)] sm:p-8"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-white">Корзина</h2>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Закрыть корзину"
                className="-mr-2 -mt-2 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-700 text-slate-400 transition hover:border-cyan-400 hover:text-cyan-300"
              >
                ✕
              </button>
            </div>

            {/* Разблокированные промты (после успешной оплаты) */}
            {unlocked.length > 0 && (
              <div className="mb-4 rounded-xl border border-emerald-400/30 bg-emerald-950/30 p-4">
                <p className="mb-2 font-mono text-[10px] tracking-[0.25em] text-emerald-400 uppercase">
                  Мои промты
                </p>
                <ul className="max-h-40 space-y-3 overflow-y-auto">
                  {unlockedProducts.map((item, index) => (
                    <li key={`u-${item.id}-${index}`}>
                      <p className="font-mono text-xs text-emerald-200">
                        {item.emoji} {item.name} · {item.code}
                      </p>
                      <p className="mt-1 font-mono text-[11px] leading-relaxed whitespace-pre-line text-slate-300 sm:text-xs">
                        {item.prompt ?? "Промт будет добавлен позже."}
                      </p>
                      <button
                        type="button"
                        onClick={() => void handleCopyPrompt(item)}
                        className="mt-1 rounded-md border border-emerald-400/40 px-2 py-0.5 font-mono text-[10px] text-emerald-300 transition hover:bg-emerald-400/10"
                      >
                        {copiedId === item.id
                          ? "✓ Скопировано"
                          : "📋 Копировать"}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <ul className="min-h-0 flex-1 divide-y divide-slate-800 overflow-y-auto">
              {cart.length === 0 && (
                <li className="py-6 text-center font-mono text-sm text-slate-500">
                  {unlockedProducts.length > 0
                    ? "Корзина пуста. Добавь ещё снеков 🛒"
                    : "Пусто. Выбери снек в витрине 🛒"}
                </li>
              )}
              {cart.map((item, index) => (
                <li
                  key={`${item.id}-${index}`}
                  className="flex items-center gap-3 py-3"
                >
                  <span className="text-3xl" aria-hidden="true">
                    {item.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-white">
                      {item.name}
                    </p>
                    <p className="font-mono text-xs text-slate-400">
                      {item.code} · {item.price} ⭐️
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(index)}
                    aria-label={`Удалить ${item.name} из корзины`}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-slate-700 text-slate-400 transition hover:border-rose-400 hover:text-rose-300"
                  >
                    🗑
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4 border-t border-slate-700 pt-4">
              <div className="mb-4 flex items-center justify-between font-mono">
                <span className="text-sm text-slate-400">Итого</span>
                <span className="text-xl font-bold text-amber-300">
                  {total} ⭐️
                </span>
              </div>
              {/* Выбор способа оплаты */}
              <div className="mb-3 grid grid-cols-2 gap-2">
                {([
                  { key: "stars", label: "⭐ Telegram Stars" },
                  { key: "crypto", label: "₿ Крипта" },
                ] as const).map((method) => (
                  <button
                    key={method.key}
                    type="button"
                    onClick={() => setPayMethod(method.key)}
                    aria-pressed={payMethod === method.key}
                    className={`rounded-lg border px-3 py-2 font-mono text-xs transition ${
                      payMethod === method.key
                        ? "border-cyan-400 bg-cyan-400/10 text-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.4)]"
                        : "border-slate-700 text-slate-400 hover:border-slate-500"
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handlePay}
                disabled={!cart.length || payStatus === "pending"}
                className="w-full rounded-xl bg-fuchsia-500 px-5 py-3 font-mono text-sm font-bold tracking-wider text-white uppercase transition enabled:hover:bg-fuchsia-400 enabled:hover:shadow-[0_0_25px_rgba(217,70,239,0.7)] enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {payStatus === "pending"
                  ? "Обработка платежа…"
                  : payMethod === "stars"
                    ? `Оплатить ${total} ⭐`
                    : "Оплатить криптой"}
              </button>

              {!tg() && payMethod === "stars" && (
                <p className="mt-2 text-center font-mono text-[10px] text-slate-500">
                  Оплата звёздами работает внутри Telegram Mini App
                  {!ENV.botUsername
                    ? " (настрой VITE_TELEGRAM_BOT_USERNAME)"
                    : ""}
                  . Сейчас включён демо-режим.
                </p>
              )}
            </div>
          </section>
        </div>
      )}

      {/* Экран выдачи после оплаты */}
      {isDispensing && (
        <div
          className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center"
          role="status"
        >
          <p className="blink rounded-full border border-cyan-400/50 bg-slate-900/90 px-5 py-2 font-mono text-xs tracking-[0.2em] text-cyan-300 uppercase shadow-[0_0_20px_rgba(34,211,238,0.5)]">
            Выдача… не трясите автомат
          </p>
        </div>
      )}
    </main>
  )
}
