"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/ui/Motion";
import Logo from "@/components/ui/Logo";
import { FAQ, CONTACTS, NAV_LINKS, BRAND } from "@/lib/content";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative mx-auto max-w-3xl px-6 py-32">
      <Reveal>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-peach/70">FAQ</span>
        <h2 className="mt-3 font-display text-section text-ink">Частые вопросы</h2>
      </Reveal>

      <div className="mt-12 space-y-3">
        {FAQ.map((item, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={i} delay={i * 0.04}>
              <div className="overflow-hidden rounded-2xl glass">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-display text-lg text-ink">{item.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-peach/30 text-peach"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="px-6 pb-6 font-mono text-sm leading-relaxed text-mist/70">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="relative mx-auto max-w-4xl px-6 py-20 scroll-mt-24">
      <Reveal className="text-center">
        <h2 className="font-display text-section text-ink">Остались вопросы?</h2>
        <p className="mt-3 font-mono text-sm text-mist/60">Свяжитесь с нами удобным способом.</p>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="mx-auto mt-10 grid max-w-xl gap-3 sm:grid-cols-2">
          <ContactCard
            label="Telegram"
            value={CONTACTS.telegramHandle}
            href={CONTACTS.telegram}
            icon={
              <path d="M21.5 4.3 2.9 11.3c-1 .4-1 1.8.1 2.1l4.6 1.4 1.8 5.5c.3.9 1.4 1 2 .3l2.5-2.7 4.7 3.5c.7.5 1.7.1 1.9-.7L23 5.6c.2-1-.7-1.7-1.5-1.3ZM9.6 14.4l8-5.3-6.1 6c-.2.2-.4.5-.4.8l-.3 2.5-1.2-4Z" />
            }
          />
          <ContactCard
            label="Email"
            value={CONTACTS.email}
            href={`mailto:${CONTACTS.email}`}
            icon={
              <>
                <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
                <path d="m3.5 7 8.5 6 8.5-6" />
              </>
            }
          />
        </div>
      </Reveal>
    </section>
  );
}

function ContactCard({
  label,
  value,
  href,
  icon,
}: {
  label: string;
  value: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center gap-2 rounded-2xl glass p-6 text-center transition-colors hover:border-peach/30"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-7 w-7 text-peach transition-transform duration-300 group-hover:-translate-y-1"
      >
        {icon}
      </svg>
      <span className="font-mono text-xs uppercase tracking-widest text-mist/50">{label}</span>
      <span className="font-display text-base text-ink">{value}</span>
    </a>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-peach/30 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-[120%] -translate-x-1/2 translate-y-1/2 rounded-[100%] bg-peach/10 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs font-display text-2xl leading-tight text-ink">
              {BRAND.tagline}
            </p>
            <p className="mt-3 font-mono text-xs text-mist/50">
              Создано для лётного состава. Теперь доступно каждому.
            </p>
          </div>

          <FooterCol
            title="Продукт"
            links={NAV_LINKS.map((l) => ({ label: l.label, href: l.href }))}
          />
          <FooterCol
            title="Компания"
            links={[
              { label: "Как активировать", href: "#how" },
              { label: "Цены", href: "#search" },
              { label: "Реферальная программа", href: "#referral" },
              { label: "Платёжные условия", href: "#pricing" },
            ]}
          />
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="font-mono text-xs text-mist/40">
            © {new Date().getFullYear()} Sapsan. Все права защищены.
          </p>
          <p className="font-mono text-xs text-mist/40">Сделано в небе ✦</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-peach/70">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="font-mono text-sm text-mist/60 transition-colors hover:text-peach">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
