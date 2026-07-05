import heroVideo from "@/assets/hero-video.mp4.asset.json";
import heroBg from "@/assets/hero-bg.jpg";
import heroStorm from "@/assets/hero-storm.webm";
import logo from "@/assets/logo.png";
import { ChevronDown, PackageCheck, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const pikachuArt = "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png";
const charizardArt = "https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png";
const rayquazaArt = "https://assets.pokemon.com/assets/cms2/img/pokedex/full/384.png";

export const Hero = () => {
  const { t } = useLanguage();
  return (
    <section id="top" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
      <video
        autoPlay
        muted
        loop
        playsInline
        className="hero-storm-video absolute inset-0 w-full h-full object-cover opacity-100"
        poster={heroBg}
      >
        <source src={heroStorm} type="video/webm" />
        <source src={heroVideo.url} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/38 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,transparent_0%,hsl(var(--background)/0.14)_38%,hsl(var(--background))_84%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(hsl(var(--pk-blue)/0.32)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--pk-yellow)/0.2)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="hero-energy-haze" aria-hidden="true" />
      <div className="hero-storm-flash" aria-hidden="true" />
      <div className="hero-lightning hero-lightning-a" aria-hidden="true" />
      <div className="hero-lightning hero-lightning-b" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-0 z-[1]">
        <img
          src={charizardArt}
          alt=""
          className="absolute right-[-3rem] top-[14%] hidden w-[32rem] max-w-[42vw] rotate-6 opacity-90 drop-shadow-[0_0_55px_hsl(var(--pk-yellow)/0.35)] lg:block animate-float"
        />
        <img
          src={rayquazaArt}
          alt=""
          className="absolute left-[-4rem] top-[12%] hidden w-[30rem] max-w-[36vw] -rotate-12 opacity-70 drop-shadow-[0_0_60px_hsl(var(--pk-blue)/0.45)] xl:block"
        />
        <img
          src={pikachuArt}
          alt=""
          className="absolute bottom-[9rem] left-[7%] w-28 opacity-95 drop-shadow-[0_0_36px_hsl(var(--pk-yellow)/0.45)] md:w-40 lg:left-[12%]"
        />
      </div>

      <div className="relative container z-10 text-center pt-28 pb-20 animate-fade-in">
        <img
          src={logo}
          alt="Pokémon SA logo"
          className="mx-auto h-40 md:h-56 w-auto drop-shadow-[0_0_56px_hsl(var(--pk-blue)/0.8)] animate-float"
        />

        <h1 className="mt-6 font-display font-black text-5xl md:text-7xl lg:text-8xl tracking-tight">
          <span className="text-gradient-gold">{t("brand")}</span>
        </h1>

        <p className="mt-6 max-w-xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed">
          {t("heroCopy")}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background/45 px-4 text-xs font-bold uppercase tracking-wider text-foreground/80 backdrop-blur">
            <PackageCheck className="h-3.5 w-3.5 text-pk-blue" />
            {t("sealedDrops")}
          </div>
          <div className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background/45 px-4 text-xs font-bold uppercase tracking-wider text-foreground/80 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-pk-yellow" />
            {t("customPrintStudio")}
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#cards"
            className="group relative px-8 h-14 rounded-full bg-gradient-electric text-background font-display font-bold uppercase tracking-wider text-sm grid place-items-center glow-electric hover:scale-105 transition-transform"
          >
            <span>{t("shopTheDrop")}</span>
          </a>
          <a
            href="#cups"
            className="px-8 h-14 rounded-full border border-pk-yellow/60 text-pk-yellow font-display font-bold uppercase tracking-wider text-sm grid place-items-center hover:bg-pk-yellow hover:text-background transition-colors"
          >
            {t("customizeCups")}
          </a>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-pk-yellow/70" />
        </div>
      </div>
    </section>
  );
};
