import { Globe2, ShoppingCart, Menu, X, UserRound } from "lucide-react";
import { type MouseEvent, useState, useEffect } from "react";
import logo from "@/assets/logo.png";
import { useCart } from "@/store/cart";
import { useLanguage } from "@/context/LanguageContext";
import { useAccount } from "@/context/AccountContext";
import { skipSplashIntroOnNextLoad } from "@/components/SplashIntro";

const links = [
  { href: "/#cards", labelKey: "cards" },
  { href: "/#boosters", labelKey: "boosters" },
  { href: "/#magnets", labelKey: "magnets" },
  { href: "/#cups", labelKey: "cups" },
  { href: "/#apparel", labelKey: "apparel" },
  { href: "/#game", labelKey: "game" },
  { href: "/special-request", labelKey: "specialOrder" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count, setOpen: setCartOpen } = useCart();
  const { t, toggleLanguage } = useLanguage();
  const { account, openAccount } = useAccount();

  const markInternalNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    skipSplashIntroOnNextLoad();
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : "bg-transparent"
      }`}
    >
      <nav className="container flex h-20 items-center justify-between gap-2 md:h-24 lg:h-28">
        <a href="/#top" onClick={markInternalNavigation} className="flex shrink-0 items-center gap-3 group">
          <img
            src={logo}
            alt="Pokémon SA"
            className="h-12 w-28 object-cover object-center sm:h-14 sm:w-36 md:h-16 md:w-40 lg:h-20 lg:w-52 drop-shadow-[0_0_18px_hsl(var(--pk-blue)/0.7)] transition-transform group-hover:scale-105"
          />
          <span className="hidden font-display text-lg font-black text-gradient-gold lg:inline">{t("brand")}</span>
        </a>

        <div className="hidden lg:flex items-center gap-4 xl:gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={markInternalNavigation}
              className="relative flex min-h-11 items-center text-sm font-medium text-foreground/80 transition-colors hover:text-pk-yellow after:content-[''] after:absolute after:left-0 after:bottom-2 after:h-px after:w-0 after:bg-pk-yellow after:transition-all hover:after:w-full"
            >
              {t(l.labelKey)}
            </a>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            onClick={openAccount}
            className="hidden h-11 items-center gap-2 rounded-full border border-border bg-muted/60 px-3 text-xs font-bold hover:border-pk-yellow hover:text-pk-yellow lg:flex"
          >
            <UserRound className="h-4 w-4" />
            {account ? account.name.split(" ")[0] : t("account")}
          </button>
          <button
            onClick={toggleLanguage}
            className="h-11 px-2 sm:px-3 grid place-items-center rounded-full bg-muted/60 border border-border text-xs font-bold hover:border-pk-yellow hover:text-pk-yellow transition-all"
            aria-label="Toggle language"
          >
            <span className="flex items-center gap-1.5">
              <Globe2 className="h-4 w-4" />
              {t("language")}
            </span>
          </button>
          <button
            onClick={() => setCartOpen(true)}
            className="relative h-11 w-11 grid place-items-center rounded-full bg-muted/60 border border-border hover:border-pk-yellow hover:glow-yellow transition-all"
            aria-label={t("cart")}
          >
            <ShoppingCart className="h-5 w-5" />
            {count() > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-pk-yellow text-background text-[11px] font-bold grid place-items-center">
                {count()}
              </span>
            )}
          </button>
          <button
            className="grid h-11 w-11 place-items-center rounded-full border border-border bg-muted/60 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="bg-background/95 backdrop-blur-xl border-t border-border lg:hidden">
          <div className="container py-4 flex flex-col gap-1">
            <button
              onClick={() => {
                setOpen(false);
                openAccount();
              }}
              className="py-3 text-start text-base font-medium hover:text-pk-yellow"
            >
              {account ? account.name : t("account")}
            </button>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(event) => {
                  markInternalNavigation(event);
                  setOpen(false);
                }}
                className="py-3 text-base font-medium hover:text-pk-yellow"
              >
                {t(l.labelKey)}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
