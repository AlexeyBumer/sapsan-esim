"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";
import MagneticButton from "@/components/ui/MagneticButton";
import { NAV_LINKS, MENU_LINKS, BRAND } from "@/lib/content";
import { cn } from "@/lib/cn";

type Props = {
  /**
   * "auth" — облегчённая шапка для /login и /register: только логотип
   * (кликабельный, ведёт на главную). Кнопка кабинета не нужна, так как
   * пользователь и так находится на странице авторизации.
   */
  variant?: "default" | "auth";
};

export default function Navbar({ variant = "default" }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={cn(
          "flex w-full max-w-6xl items-center justify-between rounded-full px-5 py-2.5 transition-all duration-500",
          scrolled ? "glass-strong shadow-glow-sm" : "border border-transparent"
        )}
      >
        <Logo />

        {variant === "auth" ? null : (
          <>
            <div className="hidden items-center gap-7 lg:flex">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-xs uppercase tracking-widest text-mist/70 transition-colors hover:text-peach"
                >
                  {l.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {/* Десктоп: текстовая ссылка "Личный кабинет" */}
              <a
                href="/account"
                className="hidden font-mono text-xs text-mist/70 transition-colors hover:text-peach sm:block"
              >
                Личный кабинет
              </a>

              {/* Мобильный: кнопка "Личный кабинет" вместо "Купить eSIM" */}
              <span className="sm:hidden">
                <MagneticButton href="/account" className="!px-3.5 !py-2 whitespace-nowrap text-[11px]">
                  Личный кабинет
                </MagneticButton>
              </span>

              {/* Меню "≡" — справа от кнопки/ссылки "Личный кабинет" */}
              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label="Меню"
                  aria-expanded={menuOpen}
                  className="grid h-9 w-9 place-items-center rounded-full glass text-mist/70 transition-colors hover:text-peach"
                >
                  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                    <path
                      d="M3 5.5h14M3 10h14M3 14.5h14"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-full mt-3 w-56 overflow-hidden rounded-2xl glass-strong p-2 shadow-glow-sm"
                    >
                      {MENU_LINKS.map((l) => (
                        <a
                          key={l.href}
                          href={l.href}
                          onClick={() => setMenuOpen(false)}
                          className="block rounded-xl px-4 py-2.5 font-mono text-xs text-mist/80 transition-colors hover:bg-white/5 hover:text-peach"
                        >
                          {l.label}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Десктоп: кнопка "Купить eSIM" */}
              <span className="hidden sm:inline-block">
                <MagneticButton href="/#search" className="!px-5 !py-2.5 text-xs">
                  {BRAND.cta}
                </MagneticButton>
              </span>
            </div>
          </>
        )}
      </nav>
    </motion.header>
  );
}
