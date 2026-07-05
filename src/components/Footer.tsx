import logo from "@/assets/logo.png";
import { Instagram, Twitter, Youtube, Facebook } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const { t } = useLanguage();
  return (
    <footer className="site-footer relative border-t border-border bg-gradient-to-b from-background to-black/60">
      {/* Newsletter */}
      <div className="container py-16">
        <div className="footer-newsletter rounded-3xl border border-pk-blue/30 bg-gradient-to-br from-pk-blue/10 via-background to-pk-yellow/10 p-5 text-center sm:p-8 md:p-12">
          <h3 className="font-display font-black text-3xl md:text-4xl text-gradient-gold">{t("footerJoin")}</h3>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            {t("footerJoinCopy")}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setEmail("");
            }}
            className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className="h-12 w-full rounded-full border border-border bg-muted px-5 text-sm outline-none focus:border-pk-yellow sm:flex-1"
            />
            <button className="h-12 px-6 rounded-full bg-pk-yellow text-background font-bold uppercase tracking-wider text-xs hover:glow-yellow transition-all">
              {t("subscribe")}
            </button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="footer-link-grid container pb-12 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Pokémon SA" className="h-10 w-auto" />
            <div>
              <div className="font-display font-bold text-sm text-gradient-gold">{t("brand")}</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{t("tagline")}</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4 max-w-xs">
            {t("footerDescription")}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border bg-muted transition-all hover:border-pk-yellow hover:text-pk-yellow"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {[
          { title: t("shop"), links: [t("cards"), t("boosters"), t("magnets"), t("cups"), t("specialOrder")] },
          { title: t("support"), links: [t("shipping"), t("returns"), t("faq"), t("contact")] },
          { title: t("legal"), links: [t("privacy"), t("terms"), t("cookies"), t("accessibility")] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-pk-yellow">{col.title}</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="-mx-3 inline-flex min-h-11 items-center px-3 text-muted-foreground transition-colors hover:text-foreground">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} {t("brand")}. {t("rights")}</div>
          <div>{t("location")}</div>
        </div>
      </div>
    </footer>
  );
};
