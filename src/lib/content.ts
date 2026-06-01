/**
 * Sapsan eSIM — контент лендинга (единый источник правды).
 * Все тексты на русском языке.
 */

export const BRAND = {
  name: "Sapsan",
  tagline: "Приземляйся на связи.",
  subtagline: "Создано для лётного состава. Теперь доступно каждому.",
  description:
    "Глобальная eSIM с оплатой по мере использования. Без роуминга. Без пакетов.",
  cta: "Купить eSIM",
  ctaSecondary: "Проверить тариф",
} as const;

export const NAV_LINKS = [
  { label: "Возможности", href: "#features" },
  { label: "Цены по странам", href: "#search" },
  { label: "Как это работает", href: "#how" },
  { label: "Рефералы", href: "#referral" },
  { label: "Вопросы", href: "#faq" },
] as const;

export const FEATURES = [
  {
    title: "Одна eSIM для всего мира",
    text: "Один профиль — 150+ стран. Никаких локальных SIM-карт и обмена номерами.",
    icon: "globe",
  },
  {
    title: "Платите только за трафик",
    text: "Оплата по факту использования. Никаких пакетов, которые сгорают.",
    icon: "wallet",
  },
  {
    title: "Мгновенная активация",
    text: "Профиль активируется за секунды — прямо в настройках устройства.",
    icon: "bolt",
  },
  {
    title: "Без роуминга",
    text: "Подключение к локальным сетям напрямую. Роуминговых наценок нет.",
    icon: "signal",
  },
  {
    title: "Лучшие операторы",
    text: "Автоматический выбор сети с сильнейшим сигналом в точке нахождения.",
    icon: "tower",
  },
  {
    title: "Работает сразу после посадки",
    text: "Сеть подхватывается автоматически, как только вы приземлились.",
    icon: "plane",
  },
] as const;

export type CountryRate = {
  country: string;
  countryGenitive: string; // для «Купить eSIM для ...»
  flag: string;
  pricePerGb: number; // USD
  operators: { name: string; price: number }[];
  speed: string;
  coverage: number; // %
  note?: string; // спец. примечание над кнопкой
};

export const COUNTRY_RATES: CountryRate[] = [
  { country: "Российская Федерация", countryGenitive: "РФ", flag: "🇷🇺", pricePerGb: 1.89, operators: [{ name: "Tele2", price: 1.89 }, { name: "Beeline", price: 1.99 }, { name: "MTS", price: 15.0 }], speed: "5G", coverage: 98, note: "С данной eSIM работают все заблокированные источники, включая Instagram, Telegram и пр. без дополнительного подключения к VPN." },
  { country: "США", countryGenitive: "США", flag: "🇺🇸", pricePerGb: 3.5, operators: [{ name: "AT&T", price: 3.5 }, { name: "T-Mobile", price: 3.7 }, { name: "Verizon", price: 4.0 }], speed: "5G", coverage: 99 },
  { country: "Германия", countryGenitive: "Германии", flag: "🇩🇪", pricePerGb: 2.9, operators: [{ name: "Telekom", price: 2.9 }, { name: "Vodafone", price: 3.1 }, { name: "O2", price: 2.7 }], speed: "5G", coverage: 98 },
  { country: "Япония", countryGenitive: "Японии", flag: "🇯🇵", pricePerGb: 4.2, operators: [{ name: "NTT Docomo", price: 4.2 }, { name: "SoftBank", price: 4.5 }], speed: "5G", coverage: 99 },
  { country: "ОАЭ", countryGenitive: "ОАЭ", flag: "🇦🇪", pricePerGb: 5.0, operators: [{ name: "Etisalat", price: 5.0 }, { name: "du", price: 5.3 }], speed: "5G", coverage: 99 },
  { country: "Франция", countryGenitive: "Франции", flag: "🇫🇷", pricePerGb: 2.7, operators: [{ name: "Orange", price: 2.7 }, { name: "SFR", price: 2.9 }, { name: "Bouygues", price: 2.8 }], speed: "5G", coverage: 97 },
  { country: "Турция", countryGenitive: "Турции", flag: "🇹🇷", pricePerGb: 2.4, operators: [{ name: "Turkcell", price: 2.4 }, { name: "Vodafone", price: 2.6 }], speed: "4G+", coverage: 96 },
  { country: "Таиланд", countryGenitive: "Таиланда", flag: "🇹🇭", pricePerGb: 2.1, operators: [{ name: "AIS", price: 2.1 }, { name: "TrueMove", price: 2.3 }], speed: "5G", coverage: 95 },
  { country: "Испания", countryGenitive: "Испании", flag: "🇪🇸", pricePerGb: 2.8, operators: [{ name: "Movistar", price: 2.8 }, { name: "Orange", price: 3.0 }], speed: "5G", coverage: 97 },
  { country: "Великобритания", countryGenitive: "Великобритании", flag: "🇬🇧", pricePerGb: 3.1, operators: [{ name: "EE", price: 3.1 }, { name: "Vodafone", price: 3.3 }, { name: "O2", price: 3.2 }], speed: "5G", coverage: 98 },
  { country: "Сингапур", countryGenitive: "Сингапура", flag: "🇸🇬", pricePerGb: 3.8, operators: [{ name: "Singtel", price: 3.8 }, { name: "StarHub", price: 4.0 }], speed: "5G", coverage: 99 },
];

export const STEPS = [
  { n: "01", title: "Проверьте совместимость устройства", text: "Убедитесь, что ваш смартфон поддерживает eSIM. Это занимает 10 секунд." },
  { n: "02", title: "Купите и установите eSIM", text: "Оплата — и профиль приходит мгновенно. Сканируйте QR или установите в один тап." },
  { n: "03", title: "Приземляйтесь на связи", text: "Сеть подключается автоматически после посадки. Интернет уже работает." },
] as const;

export const PERSONAS = [
  { title: "Пилоты", text: "Связь в любой точке маршрута — от вылета до финальной посадки.", tag: "Лётный состав" },
  { title: "Бортпроводники", text: "Один профиль на все направления экипажа. Без локальных SIM.", tag: "Экипаж" },
  { title: "Цифровые кочевники", text: "Работайте из любой страны без поиска местного оператора.", tag: "Remote" },
  { title: "Бизнес-путешественники", text: "Предсказуемые расходы и отчётность по фактическому трафику.", tag: "Business" },
  { title: "Туристы", text: "Интернет сразу после прилёта — карты, такси, связь.", tag: "Travel" },
] as const;

export const STATS = [
  { value: 150, suffix: "+", label: "стран" },
  { value: 500, suffix: "+", label: "операторов" },
  { value: 99.9, suffix: "%", label: "uptime" },
  { value: 1, prefix: "< ", suffix: " мин", label: "на подключение" },
] as const;

// Примечание под блоком доверия (законодательство РФ)
export const ACTIVATION_NOTE =
  "Из-за законодательства РФ eSIM с тарифами под РФ активируются в течение 24 часов — обычно гораздо быстрее.";

export const REFERRAL = {
  reward: "1 ГБ",
  title: "Приглашайте друзей — получайте трафик",
  text: "За каждого приглашённого друга вы получаете 1 ГБ трафика бесплатно на баланс. Приглашать можно бесконечное количество пользователей.",
} as const;

export const FAQ = [
  { q: "Что такое eSIM и чем она лучше обычной SIM?", a: "eSIM — это встроенный цифровой профиль оператора. Не нужно искать местную SIM-карту, менять номер или ждать доставку. Профиль устанавливается за секунды." },
  { q: "Как работает оплата по мере использования?", a: "Вы пополняете баланс и платите только за фактически потреблённые гигабайты по локальной цене страны. Пакеты не сгорают, остаток сохраняется." },
  { q: "Сохранится ли мой основной номер?", a: "Да. Sapsan работает как вторая линия данных. Ваш основной номер и звонки остаются активными." },
  { q: "Какие устройства поддерживаются?", a: "Все современные iPhone (XS и новее), Google Pixel, флагманы Samsung и большинство устройств с поддержкой eSIM. Проверка совместимости — в один тап." },
  { q: "Нужно ли что-то делать при пересечении границы?", a: "Нет. Sapsan автоматически переключается на сеть лучшего локального оператора сразу после посадки." },
  { q: "Есть ли скрытые комиссии или абонентская плата?", a: "Нет. Никакой абонентской платы, роуминговых наценок и скрытых комиссий. Только стоимость трафика." },
] as const;

export const CONTACTS = {
  telegram: "https://t.me/sapsansup",
  telegramHandle: "@sapsansup",
  email: "support@sapsanex.cc",
} as const;

// Стоимость открытия профиля eSIM
export const ESIM_SETUP_PRICE = 29; // USD, единоразово + оплата по тарифу
