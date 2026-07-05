export const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) => (
  <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""} mb-14`}>
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pk-yellow/40 bg-pk-yellow/5">
      <span className="h-1.5 w-1.5 rounded-full bg-pk-yellow" />
      <span className="text-[11px] uppercase tracking-[0.3em] text-pk-yellow font-medium">{eyebrow}</span>
    </div>
    <h2 className="mt-5 font-display font-black text-4xl md:text-5xl lg:text-6xl">
      <span className="text-gradient-gold">{title}</span>
    </h2>
    {description && <p className="mt-4 text-muted-foreground md:text-lg">{description}</p>}
  </div>
);
