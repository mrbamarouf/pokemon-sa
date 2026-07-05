import { FormEvent, useEffect, useState } from "react";
import { Mail, Phone, User, X } from "lucide-react";
import { useAccount } from "@/context/AccountContext";
import { useLanguage } from "@/context/LanguageContext";

const text = {
  en: {
    title: "Trainer Account",
    subtitle: "Create your account for checkout and one reward game chance every 24 hours. Delivery details can be completed during payment.",
    name: "Full name",
    phone: "Mobile number",
    email: "Email optional",
    save: "Save Account",
    logout: "Logout",
    active: "Account active",
  },
  ar: {
    title: "حساب المدرب",
    subtitle: "أنشئ حسابك لإتمام الطلب وفرصة واحدة للألعاب كل 24 ساعة. العنوان والتوصيل تكون في خطوة الدفع لاحقًا.",
    name: "الاسم الكامل",
    phone: "رقم الجوال",
    email: "الإيميل اختياري",
    save: "حفظ الحساب",
    logout: "تسجيل خروج",
    active: "الحساب مفعل",
  },
};

export const AccountModal = () => {
  const { account, isAccountOpen, closeAccount, saveAccount, logout } = useAccount();
  const { language, dir } = useLanguage();
  const copy = text[language];
  const [name, setName] = useState(account?.name || "");
  const [phone, setPhone] = useState(account?.phone || "");
  const [email, setEmail] = useState(account?.email || "");

  useEffect(() => {
    if (!isAccountOpen) return;
    setName(account?.name || "");
    setPhone(account?.phone || "");
    setEmail(account?.email || "");
  }, [account, isAccountOpen]);

  if (!isAccountOpen) return null;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveAccount({ name: name.trim(), phone: phone.trim(), email: email.trim() || undefined });
  };

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-background/80 p-4 backdrop-blur-xl">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-[0_0_80px_hsl(var(--pk-blue)/0.18)]" dir={dir}>
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-pk-yellow/35 bg-pk-yellow/10 px-3 py-1 text-xs font-bold text-pk-yellow">
              <User className="h-3.5 w-3.5" />
              {account ? copy.active : copy.title}
            </div>
            <h2 className="mt-4 font-display text-3xl font-black text-gradient-gold">{copy.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy.subtitle}</p>
          </div>
          <button onClick={closeAccount} className="grid h-10 w-10 place-items-center rounded-full border border-border hover:border-pk-yellow">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4 p-5">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <User className="h-4 w-4" />
              {copy.name}
            </span>
            <input required value={name} onChange={(event) => setName(event.target.value)} className="h-12 w-full rounded-xl border border-border bg-background/70 px-4 outline-none focus:border-pk-yellow" />
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Phone className="h-4 w-4" />
              {copy.phone}
            </span>
            <input required value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" className="h-12 w-full rounded-xl border border-border bg-background/70 px-4 outline-none focus:border-pk-yellow" />
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Mail className="h-4 w-4" />
              {copy.email}
            </span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="h-12 w-full rounded-xl border border-border bg-background/70 px-4 outline-none focus:border-pk-yellow" />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="h-12 flex-1 rounded-full bg-gradient-electric font-display text-sm font-bold uppercase tracking-wider text-background glow-electric">
              {copy.save}
            </button>
            {account && (
              <button type="button" onClick={logout} className="h-12 rounded-full border border-border px-6 text-sm font-bold text-muted-foreground hover:border-pk-yellow hover:text-pk-yellow">
                {copy.logout}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
