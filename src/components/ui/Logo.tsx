import { cn } from "@/lib/cn";

/**
 * Логотип Sapsan — фирменный глиф «крыло сапсана» (персиковый градиент).
 * Только "Sapsan", без приставок.
 */
export default function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" className={cn("group flex items-center gap-3", className)}>
      <span className="relative grid place-items-center">
        <svg viewBox="0 0 200 77" className="h-6 w-auto" aria-hidden>
          <defs>
            <linearGradient id="sapsanLg" x1="123.8" y1="81.3" x2="79.8" y2="-28.2" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFEAD9" />
              <stop offset="0.68" stopColor="#FFD5AF" />
              <stop offset="0.96" stopColor="#FFCC9D" />
            </linearGradient>
          </defs>
          <path
            d="M174.265 16.5855C174.265 16.5855 179.02 0 132.704 0C131.761 0 130.817 0 129.837 0.0366C128.675 0.0366 127.514 0.0366 126.352 0.0732H126.098L0 3.8443L19.7097 23.725C32.4864 23.6151 86.2796 23.4687 86.2796 27.1299C86.2796 30.7912 43.1217 31.2305 27.2233 31.3038L46.4974 50.7451C61.815 51.3675 89.4012 52.832 89.4012 54.7358C89.4012 57.9211 68.7478 58.4703 54.1562 58.4703L72.4502 76.9231H103.63C122.287 49.5368 139.456 45.363 157.496 44.7772C192.668 43.569 198.367 51.3675 198.367 51.3675C207.659 24.3108 174.265 16.5855 174.265 16.5855ZM150.381 22.59C145.154 21.9676 133.939 14.7183 133.939 14.7183C145.917 18.3429 163.557 17.5374 163.557 17.5374C163.557 17.5374 155.536 23.1758 150.345 22.59H150.381Z"
            fill="url(#sapsanLg)"
            className="transition-transform duration-500 group-hover:translate-x-0.5"
          />
        </svg>
        <span className="absolute inset-0 rounded-full bg-peach/25 blur-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </span>
      <span className="font-display text-2xl leading-none tracking-tight text-ink">Sapsan</span>
    </a>
  );
}
