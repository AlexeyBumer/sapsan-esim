# Sapsan eSIM — премиальный лендинг

> **Приземляйся на связи.** Создано для лётного состава. Теперь доступно каждому.

Премиальный digital-product лендинг для международной eSIM. Уровень исполнения — Awwwards / Linear / Stripe / Vercel. Тёмная авиационная эстетика: глубокий teal, тёплый персиковый акцент, стекло, свечение, 3D-глобус глобальной сети.

---

## Запуск

```bash
npm install
# положите Prociono-Regular.woff2 в public/fonts (иначе fallback Georgia)
npm run dev      # http://localhost:3000
npm run build && npm run start
```

## Технологии

Next.js 15 (App Router) · React 19 · TypeScript · TailwindCSS · Framer Motion · GSAP (ScrollTrigger) · Three.js + React Three Fiber + Drei · Lenis (smooth scroll) · Theatre.js (подготовлено).

Архитектура подготовлена к подключению **Spline Scene, Rive, Lottie** — достаточно добавить компонент в `src/components/three` или `src/components/sections` и смонтировать через `next/dynamic` (как `GlobeScene`).

---

## Структура проекта

```
src/
├─ app/
│  ├─ layout.tsx          # шрифты (Prociono + JetBrains Mono), Lenis, метаданные
│  └─ page.tsx            # сборка всех секций
├─ components/
│  ├─ sections/           # секции лендинга
│  │  ├─ Navbar.tsx
│  │  ├─ Hero.tsx         # 3D-глобус + параллакс + reveal заголовка
│  │  ├─ Features.tsx     # 6 преимуществ, hover-карточки
│  │  ├─ CountrySearch.tsx# поиск страны (Stripe-dashboard стиль)
│  │  ├─ HowItWorks.tsx   # 3 шага, 3D-tilt карточки
│  │  ├─ WorldMap.tsx     # интерактивная карта покрытия (SVG/WebGL-ready)
│  │  ├─ PersonasStats.tsx# сценарии + анимированные счётчики
│  │  └─ FaqContactFooter.tsx
│  ├─ three/
│  │  └─ GlobeScene.tsx   # R3F: глобус, дуги-маршруты, хабы, орбиты
│  └─ ui/
│     ├─ Logo.tsx         # фирменный глиф Sapsan (персиковый градиент)
│     ├─ MagneticButton.tsx
│     └─ Motion.tsx       # Reveal + AnimatedCounter
├─ lib/
│  ├─ content.ts          # ВСЕ тексты/данные лендинга (единый источник)
│  ├─ SmoothScroll.tsx    # Lenis + GSAP ticker
│  └─ cn.ts
└─ styles/globals.css     # токены, glass, noise, glow, scrollbar
```

---

## Дизайн-система (токены)

Определены в `tailwind.config.ts` и `globals.css`.

| Роль | Токен | HEX |
|---|---|---|
| Фон (бездна) | `abyss` | `#021111` |
| Фон (глубина) | `deep` | `#062222` |
| Поверхность | `surface` | `#0d2f2f` |
| Поверхность 2 | `surface-2` | `#103838` |
| Поверхность 3 | `surface-3` | `#1f4d4d` |
| Акцент | `peach` | `#ffdead` |
| Текст | `ink` | `#ffffff` |
| Текст вторичный | `mist` | `#d7e0e0` |

**Типографика.** Prociono — дисплейные заголовки (`font-display`). JetBrains Mono — интерфейс, цифры, тарифы, технические элементы (`font-mono`).

**Утилиты.** `.glass` / `.glass-strong` (стекло), `.noise` (зерно), `.text-grad` (градиентный текст), `.hairline` (светящийся разделитель), `shadow-glow` (свечение).

---

## Motion-система

- **Smooth scroll** — Lenis, синхронизирован с GSAP ScrollTrigger (`SmoothScroll.tsx`).
- **Reveal on scroll** — `Reveal` (Framer Motion `useInView`), стаггер по `delay`.
- **Hero** — пословный reveal заголовка, параллакс глобуса к курсору, бегущие частицы по дугам-маршрутам, вращение орбит.
- **Magnetic buttons** — притяжение к курсору (spring) + shimmer.
- **3D-tilt** — карточки шагов реагируют наклоном.
- **Counters** — анимированный счёт в блоке доверия.
- **prefers-reduced-motion** — анимации отключаются для доступности.

---

## Секции

Hero · Преимущества · Поиск стоимости по странам · Как это работает (3 шага) · Карта покрытия · Сценарии (пилоты / бортпроводники / кочевники / бизнес / туристы) · Блок доверия (150+ стран, 500+ операторов, 99.9% uptime, < 1 мин) · FAQ · Контакты · Footer со свечением.

Все тексты — на русском, вынесены в `src/lib/content.ts`.
