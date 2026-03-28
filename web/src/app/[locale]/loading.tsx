export default function LocaleLoading() {
  return (
    <div className="glass-panel mx-auto flex min-h-[60vh] w-full max-w-6xl flex-col gap-4 rounded-[32px] p-8">
      <div className="h-8 w-48 animate-pulse rounded-full bg-accent-soft" />
      <div className="h-4 w-72 animate-pulse rounded-full bg-line" />
      <div className="mt-6 grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="h-[480px] animate-pulse rounded-[28px] bg-line/50" />
        <div className="h-[480px] animate-pulse rounded-[28px] bg-line/50" />
      </div>
    </div>
  );
}
