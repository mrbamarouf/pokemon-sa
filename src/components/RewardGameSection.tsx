import { useMemo, useState } from "react";
import { Brain, Check, Clock3, Gift, RotateCw, Sparkles, Swords, Timer, Trophy, Zap } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { useLanguage } from "@/context/LanguageContext";
import { useAccount } from "@/context/AccountContext";

type GameKey = "wheel" | "quiz" | "memory" | "type";

const art = {
  pikachu: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png",
  charizard: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png",
  blastoise: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/009.png",
  venusaur: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/003.png",
  dragonite: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/149.png",
  mewtwo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/150.png",
};

const copy = {
  en: {
    choose: "Choose your challenge",
    codeReady: "Reward code unlocked",
    useCode: "Use this code at checkout or include it in your order notes.",
    start: "Start",
    reset: "Reset",
    wheel: "Prize Wheel",
    quiz: "Timed Quiz",
    memory: "Memory Match",
    type: "Type Battle",
    wheelDesc: "A polished reward wheel with store codes.",
    quizDesc: "Answer before the timer ends to unlock 10% off.",
    memoryDesc: "Find a matching pair and reveal a gift code.",
    typeDesc: "Pick the strongest matchup to win cashback.",
    question: "Start the timer to reveal a random question.",
    quizWin: "Correct. You unlocked 10% off.",
    quizLose: "Time ran out. Try again.",
    pairWin: "Match found. Your gift is ready.",
    typePrompt: "Opponent is Blastoise. Which pick has the best advantage?",
    typeWin: "Smart battle call. Cashback unlocked.",
    typeLose: "Not this matchup. Try another pick.",
    accountRequired: "Create your trainer account first. Rewards are limited to one chance every 24 hours per mobile number.",
    locked: "Your daily chance is already used.",
    nextChance: "Next chance in",
    accountButton: "Create Account",
  },
  ar: {
    choose: "اختر التحدي",
    codeReady: "تم فتح كود المكافأة",
    useCode: "استخدم هذا الكود عند الدفع أو اكتبه في ملاحظات الطلب.",
    start: "ابدأ",
    reset: "إعادة",
    wheel: "عجلة الجوائز",
    quiz: "كويز مؤقت",
    memory: "لعبة الذاكرة",
    type: "تحدي النوع",
    wheelDesc: "عجلة مكافآت مصممة بشكل أفضل مع أكواد المتجر.",
    quizDesc: "جاوب قبل انتهاء الوقت وافتح خصم 10%.",
    memoryDesc: "اكشف زوج متطابق واحصل على كود هدية.",
    typeDesc: "اختر المواجهة الأقوى وافتح كود استرداد.",
    question: "ابدأ المؤقت حتى يظهر سؤال عشوائي.",
    quizWin: "إجابة صحيحة. فتحت خصم 10%.",
    quizLose: "انتهى الوقت. حاول مرة ثانية.",
    pairWin: "تطابق صحيح. هديتك جاهزة.",
    typePrompt: "الخصم Blastoise. من هو الاختيار الأقوى؟",
    typeWin: "اختيار ممتاز. تم فتح كود الاسترداد.",
    typeLose: "المواجهة ليست الأفضل. جرّب اختيار آخر.",
    accountRequired: "أنشئ حساب المدرب أولًا. المكافآت محدودة بفرصة واحدة كل 24 ساعة لكل رقم جوال.",
    locked: "تم استخدام فرصتك اليومية.",
    nextChance: "الفرصة القادمة بعد",
    accountButton: "إنشاء حساب",
  },
};

const rewards = {
  en: [
    { title: "10% Off", code: "QUIZ10", tone: "from-pk-yellow to-amber-400" },
    { title: "Free Gift", code: "GIFT-SA", tone: "from-pk-blue to-cyan-300" },
    { title: "SAR 25 Cashback", code: "CASH25", tone: "from-pk-red to-rose-400" },
    { title: "Jeddah Shipping", code: "JEDDAHSHIP", tone: "from-emerald-400 to-lime-300" },
  ],
  ar: [
    { title: "خصم 10%", code: "QUIZ10", tone: "from-pk-yellow to-amber-400" },
    { title: "هدية مجانية", code: "GIFT-SA", tone: "from-pk-blue to-cyan-300" },
    { title: "استرداد 25 ر.س", code: "CASH25", tone: "from-pk-red to-rose-400" },
    { title: "شحن جدة", code: "JEDDAHSHIP", tone: "from-emerald-400 to-lime-300" },
  ],
};

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

const quizBank = {
  en: [
    { question: "Which type has the advantage against Water?", options: ["Grass", "Fire", "Rock", "Ice"], answer: "Grass" },
    { question: "Which Pokémon evolves from Charmander?", options: ["Charmeleon", "Dragonite", "Flareon", "Moltres"], answer: "Charmeleon" },
    { question: "Which Pokémon is known as the Genetic Pokémon?", options: ["Mewtwo", "Lucario", "Gengar", "Rayquaza"], answer: "Mewtwo" },
    { question: "Which item is used to catch wild Pokémon?", options: ["Poké Ball", "Potion", "Rare Candy", "Energy Card"], answer: "Poké Ball" },
  ],
  ar: [
    { question: "أي نوع أقوى ضد النوع المائي؟", options: ["Grass", "Fire", "Rock", "Ice"], answer: "Grass" },
    { question: "ما هو التطور التالي لـ Charmander؟", options: ["Charmeleon", "Dragonite", "Flareon", "Moltres"], answer: "Charmeleon" },
    { question: "من هو Pokémon المعروف باسم Genetic Pokémon؟", options: ["Mewtwo", "Lucario", "Gengar", "Rayquaza"], answer: "Mewtwo" },
    { question: "ما الأداة المستخدمة لالتقاط Pokémon؟", options: ["Poké Ball", "Potion", "Rare Candy", "Energy Card"], answer: "Poké Ball" },
  ],
};

const memoryPool = [
  { pair: "pikachu", image: art.pikachu },
  { pair: "charizard", image: art.charizard },
  { pair: "dragonite", image: art.dragonite },
  { pair: "gengar", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/094.png" },
];

const typeBattles = [
  {
    opponent: "Blastoise",
    image: art.blastoise,
    prompt: { en: "Opponent is a Water type. Choose the best counter.", ar: "الخصم من النوع المائي. اختر أفضل مواجهة." },
    options: [
      { id: "charizard", label: "Charizard", image: art.charizard, win: false },
      { id: "venusaur", label: "Venusaur", image: art.venusaur, win: true },
      { id: "mewtwo", label: "Mewtwo", image: art.mewtwo, win: false },
    ],
  },
  {
    opponent: "Charizard",
    image: art.charizard,
    prompt: { en: "Opponent is Fire and Flying. Pick the safer battle answer.", ar: "الخصم ناري وطائر. اختر المواجهة الأقوى." },
    options: [
      { id: "blastoise", label: "Blastoise", image: art.blastoise, win: true },
      { id: "venusaur", label: "Venusaur", image: art.venusaur, win: false },
      { id: "dragonite", label: "Dragonite", image: art.dragonite, win: false },
    ],
  },
  {
    opponent: "Mewtwo",
    image: art.mewtwo,
    prompt: { en: "Opponent is Psychic. Which choice pressures it best?", ar: "الخصم من النوع النفسي. أي اختيار يضغط عليه أكثر؟" },
    options: [
      { id: "gengar", label: "Gengar", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/094.png", win: true },
      { id: "pikachu", label: "Pikachu", image: art.pikachu, win: false },
      { id: "venusaur", label: "Venusaur", image: art.venusaur, win: false },
    ],
  },
];

const createQuiz = (language: "en" | "ar") => {
  const selected = quizBank[language][Math.floor(Math.random() * quizBank[language].length)];
  return { ...selected, options: shuffle(selected.options) };
};

const createMemoryDeck = () => {
  const pairs = shuffle(memoryPool).slice(0, 2);
  return shuffle(pairs.flatMap((card) => [0, 1].map((copy) => ({ ...card, id: `${card.pair}-${copy}-${Math.random()}` }))));
};

const createTypeBattle = () => {
  const selected = typeBattles[Math.floor(Math.random() * typeBattles.length)];
  return { ...selected, options: shuffle(selected.options) };
};

export const RewardGameSection = () => {
  const { language, t } = useLanguage();
  const { account, openAccount, canPlayGame, remainingGameLock, consumeGameChance } = useAccount();
  const text = copy[language];
  const rewardList = rewards[language];
  const [active, setActive] = useState<GameKey>("quiz");
  const [spinning, setSpinning] = useState(false);
  const [rewardIndex, setRewardIndex] = useState(0);
  const [turns, setTurns] = useState(0);
  const [quizTime, setQuizTime] = useState(12);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(() => createQuiz(language));
  const [quizResult, setQuizResult] = useState("");
  const [memoryDeck, setMemoryDeck] = useState(() => createMemoryDeck());
  const [pickedCards, setPickedCards] = useState<string[]>([]);
  const [memoryWin, setMemoryWin] = useState(false);
  const [typeBattle, setTypeBattle] = useState(() => createTypeBattle());
  const [typeResult, setTypeResult] = useState("");

  const currentReward = rewardList[rewardIndex];
  const rotation = useMemo(() => turns * 360 + rewardIndex * 90 + 45, [rewardIndex, turns]);

  const claimChance = (reward?: string) => {
    if (!account) {
      openAccount();
      return false;
    }
    return consumeGameChance(reward);
  };

  const spin = () => {
    if (spinning) return;
    const next = Math.floor(Math.random() * rewardList.length);
    if (!claimChance(rewardList[next].code)) return;
    setSpinning(true);
    setTurns((value) => value + 5);
    window.setTimeout(() => {
      setRewardIndex(next);
      setSpinning(false);
    }, 900);
  };

  const startQuiz = () => {
    if (!claimChance("QUIZ10")) return;
    setCurrentQuiz(createQuiz(language));
    setQuizStarted(true);
    setQuizResult("");
    setQuizTime(12);
    const timer = window.setInterval(() => {
      setQuizTime((time) => {
        if (time <= 1) {
          window.clearInterval(timer);
          setQuizResult(text.quizLose);
          return 0;
        }
        return time - 1;
      });
    }, 1000);
  };

  const answerQuiz = (option: string) => {
    if (!quizStarted || quizResult) return;
    if (option === currentQuiz.answer) {
      setRewardIndex(0);
      setQuizResult(text.quizWin);
    } else {
      setQuizResult(language === "ar" ? "إجابة غير صحيحة. فرصتك اليومية استُخدمت." : "Incorrect answer. Your daily chance has been used.");
    }
  };

  const pickMemory = (id: string) => {
    if (memoryWin) return;
    if (pickedCards.length === 0 && !claimChance("GIFT-SA")) return;
    const next = pickedCards.includes(id) ? pickedCards : [...pickedCards, id].slice(-2);
    setPickedCards(next);
    if (next.length === 2) {
      const first = memoryDeck.find((card) => card.id === next[0]);
      const second = memoryDeck.find((card) => card.id === next[1]);
      if (first && second && first.pair === second.pair && first.id !== second.id) {
        setRewardIndex(1);
        setMemoryWin(true);
      } else {
        window.setTimeout(() => setPickedCards([]), 700);
      }
    }
  };

  const playType = (win: boolean) => {
    if (!typeResult && !claimChance(win ? "CASH25" : undefined)) return;
    if (win) {
      setRewardIndex(2);
      setTypeResult(text.typeWin);
      return;
    }
    setTypeResult(text.typeLose);
  };

  const resetMemory = () => {
    setPickedCards([]);
    setMemoryWin(false);
    setMemoryDeck(createMemoryDeck());
  };

  const resetTypeBattle = () => {
    setTypeResult("");
    setTypeBattle(createTypeBattle());
  };

  const games = [
    { key: "quiz" as const, title: text.quiz, desc: text.quizDesc, icon: Brain },
    { key: "wheel" as const, title: text.wheel, desc: text.wheelDesc, icon: Gift },
    { key: "memory" as const, title: text.memory, desc: text.memoryDesc, icon: Sparkles },
    { key: "type" as const, title: text.type, desc: text.typeDesc, icon: Swords },
  ];

  const renderGame = () => {
    if (active === "wheel") {
      return (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-border bg-gradient-card p-8">
            <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(hsl(var(--pk-blue)/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--pk-yellow)/0.2)_1px,transparent_1px)] [background-size:44px_44px]" />
            <div className="relative mx-auto grid h-80 w-80 place-items-center sm:h-96 sm:w-96">
              <div className="absolute -top-2 z-20 h-0 w-0 border-x-[18px] border-t-[30px] border-x-transparent border-t-pk-yellow" />
              <div
                className="relative h-full w-full rounded-full border-[12px] border-background shadow-[0_0_80px_hsl(var(--pk-blue)/0.32)] transition-transform duration-1000 ease-out"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {rewardList.map((reward, index) => (
                  <div
                    key={reward.code}
                    className={`absolute inset-0 bg-gradient-to-br ${reward.tone}`}
                    style={{
                      clipPath: "polygon(50% 50%, 50% 0, 100% 0, 100% 50%)",
                      transform: `rotate(${index * 90}deg)`,
                      transformOrigin: "50% 50%",
                    }}
                  />
                ))}
                <div className="absolute inset-10 rounded-full bg-background/95 backdrop-blur grid place-items-center text-center">
                  <Zap className="mb-3 h-10 w-10 text-pk-yellow" />
                  <div className="font-display text-xl font-black">{currentReward.title}</div>
                </div>
              </div>
            </div>
          </div>
          <RewardPanel title={currentReward.title} code={currentReward.code} onClick={spin} button={spinning ? t("spinning") : t("spin")} />
        </div>
      );
    }

    if (active === "memory") {
      return (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-gradient-card p-5 sm:grid-cols-4">
            {memoryDeck.map((card) => {
              const open = pickedCards.includes(card.id) || memoryWin;
              return (
                <button
                  key={card.id}
                  onClick={() => pickMemory(card.id)}
                  className="relative aspect-square overflow-hidden rounded-xl border border-border bg-background/60 transition hover:border-pk-yellow"
                >
                  {open ? (
                    <img src={card.image} alt="" className="h-full w-full object-contain p-4" />
                  ) : (
                    <div className="grid h-full place-items-center bg-gradient-to-br from-pk-blue/30 to-pk-yellow/20">
                      <Sparkles className="h-10 w-10 text-pk-yellow" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <RewardPanel title={memoryWin ? text.pairWin : text.memory} code={memoryWin ? "GIFT-SA" : "???"} onClick={resetMemory} button={text.reset} />
        </div>
      );
    }

    if (active === "type") {
      return (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-border bg-gradient-card p-6">
            <div className="mb-5 flex items-center gap-4 rounded-xl border border-pk-blue/35 bg-pk-blue/10 p-4">
              <img src={typeBattle.image} alt={typeBattle.opponent} className="h-24 w-24 object-contain" />
              <div>
                <div className="font-display text-2xl font-black text-gradient-gold">{typeBattle.opponent}</div>
                <p className="text-sm text-muted-foreground">{typeBattle.prompt[language]}</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {typeBattle.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => playType(option.win)}
                  className="rounded-xl border border-border bg-background/55 p-4 transition hover:-translate-y-1 hover:border-pk-yellow"
                >
                  <img src={option.image} alt={option.label} className="mx-auto h-32 w-32 object-contain" />
                  <div className="mt-3 font-display font-bold">{option.label}</div>
                </button>
              ))}
            </div>
          </div>
          <RewardPanel title={typeResult || text.type} code={typeResult === text.typeWin ? "CASH25" : "???"} onClick={resetTypeBattle} button={text.reset} />
        </div>
      );
    }

    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-border bg-gradient-card p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <div className="font-display text-3xl font-black text-gradient-gold">{text.quiz}</div>
              <p className="mt-2 text-muted-foreground">{quizStarted ? currentQuiz.question : text.question}</p>
            </div>
            <div className="grid h-20 w-20 place-items-center rounded-full border border-pk-yellow bg-pk-yellow/10 font-display text-2xl font-black text-pk-yellow">
              {quizTime}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {(quizStarted ? currentQuiz.options : ["???", "???", "???", "???"]).map((option, index) => (
              <button
                key={`${option}-${index}`}
                onClick={() => answerQuiz(option)}
                disabled={!quizStarted || Boolean(quizResult)}
                className="min-h-14 rounded-xl border border-border bg-background/60 px-4 text-lg font-bold transition hover:border-pk-yellow hover:text-pk-yellow"
              >
                {option}
              </button>
            ))}
          </div>
          {quizResult && <div className="mt-5 rounded-xl border border-pk-yellow/35 bg-pk-yellow/10 p-4 text-pk-yellow">{quizResult}</div>}
        </div>
        <RewardPanel title={quizResult || text.quizDesc} code={quizResult === text.quizWin ? "QUIZ10" : "???"} onClick={startQuiz} button={text.start} />
      </div>
    );
  };

  const RewardPanel = ({
    title,
    code,
    onClick,
    button,
  }: {
    title: string;
    code: string;
    onClick: () => void;
    button: string;
  }) => (
    <div className="rounded-2xl border border-border bg-card/80 p-6 backdrop-blur-xl">
      <Trophy className="mb-4 h-8 w-8 text-pk-yellow" />
      <h3 className="font-display text-2xl font-black text-gradient-gold">{title}</h3>
      <div className="mt-5 rounded-xl border border-pk-yellow/40 bg-pk-yellow/10 p-4">
        <div className="text-[10px] uppercase tracking-[0.25em] text-pk-yellow">{text.codeReady}</div>
        <div className="mt-2 font-display text-3xl font-black">{code}</div>
        <p className="mt-2 text-sm text-muted-foreground">{text.useCode}</p>
      </div>
      <button
        onClick={onClick}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-electric font-display text-sm font-bold uppercase tracking-wider text-background glow-electric transition-transform hover:scale-[1.02]"
      >
        {spinning ? <RotateCw className="h-4 w-4 animate-spin" /> : <Timer className="h-4 w-4" />}
        {button}
      </button>
    </div>
  );

  return (
    <section id="game" className="relative overflow-hidden py-28 bg-gradient-to-b from-background via-pk-yellow/5 to-background">
      <div className="absolute inset-x-0 top-24 h-px bg-gradient-to-r from-transparent via-pk-yellow/50 to-transparent" />
      <div className="container">
        <SectionHeader eyebrow={t("gameEyebrow")} title={t("gameTitle")} description={t("gameDescription")} />

        <Reveal>
          <div className="mb-6 grid gap-3 md:grid-cols-4">
            {games.map((game) => {
              const Icon = game.icon;
              return (
                <button
                  key={game.key}
                  onClick={() => setActive(game.key)}
                  className={`rounded-2xl border p-4 text-start transition ${
                    active === game.key ? "border-pk-yellow bg-pk-yellow/10" : "border-border bg-card/55 hover:border-pk-blue"
                  }`}
                >
                  <Icon className="mb-3 h-6 w-6 text-pk-yellow" />
                  <div className="font-display text-lg font-bold">{game.title}</div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{game.desc}</p>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-pk-blue/35 bg-pk-blue/10 px-3 py-1.5 text-xs font-bold text-pk-blue">
              <Clock3 className="h-4 w-4" />
              {text.choose}
            </div>
            <button
              onClick={account ? undefined : openAccount}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${
                !account
                  ? "border-pk-yellow/45 bg-pk-yellow/10 text-pk-yellow"
                  : canPlayGame
                    ? "border-emerald-400/45 bg-emerald-400/10 text-emerald-300"
                    : "border-pk-yellow/45 bg-pk-yellow/10 text-pk-yellow"
              }`}
            >
              {account ? (
                canPlayGame ? (
                  <>
                    <Check className="h-4 w-4" />
                    {account.phone}
                  </>
                ) : (
                  <>
                    <Timer className="h-4 w-4" />
                    {text.nextChance} {remainingGameLock}
                  </>
                )
              ) : (
                <>
                  <Trophy className="h-4 w-4" />
                  {text.accountButton}
                </>
              )}
            </button>
          </div>
          {!account && <p className="mb-4 rounded-xl border border-pk-yellow/30 bg-pk-yellow/10 p-3 text-sm text-pk-yellow">{text.accountRequired}</p>}
          {account && !canPlayGame && <p className="mb-4 rounded-xl border border-pk-yellow/30 bg-pk-yellow/10 p-3 text-sm text-pk-yellow">{text.locked} {text.nextChance} {remainingGameLock}.</p>}
          {renderGame()}
        </Reveal>
      </div>
    </section>
  );
};
