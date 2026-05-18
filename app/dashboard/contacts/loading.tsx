export default function ContactsLoading() {
  return (
    <div className="min-h-screen bg-[#9c3e21]">
      {/* Header skeleton */}
      <header className="bg-[#9c3e21] text-white pt-12 pb-6 px-6">
        <div className="flex items-center justify-between mb-1">
          <div className="w-10" />
          <div className="h-9 w-36 bg-white/20 rounded-full animate-pulse" />
          <div className="w-10" />
        </div>
        <div className="h-4 w-24 bg-white/20 rounded-full animate-pulse mx-auto mt-2" />
      </header>

      {/* Content panel */}
      <main className="bg-[#fff8f5] rounded-t-3xl -mt-4 relative z-10 min-h-screen pt-6 px-6">
        {/* Search bar skeleton */}
        <div className="bg-[#f5ece8] h-14 rounded-xl mb-5 animate-pulse" />

        {/* Filter chips */}
        <div className="flex gap-2 mb-5 overflow-hidden">
          {[80, 64, 72, 68, 76].map((w, i) => (
            <div
              key={i}
              className="h-9 rounded-full bg-[#f5ece8] animate-pulse shrink-0"
              style={{ width: `${w}px` }}
            />
          ))}
        </div>

        {/* Contact cards */}
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 bg-[#f5ece8] rounded-[20px] animate-pulse"
            >
              <div className="w-14 h-14 rounded-full bg-[#eae1dc] shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-[#eae1dc] rounded-full" />
                <div className="h-3 w-20 bg-[#eae1dc] rounded-full" />
              </div>
              <div className="h-6 w-16 bg-[#eae1dc] rounded-full" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
