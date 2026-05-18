export default function DashboardLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header skeleton */}
      <header className="bg-[#9c3e21] pt-14 pb-24 px-6 flex flex-col items-center relative">
        <div className="w-full flex justify-between items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-white/20 animate-pulse" />
          <div className="w-6 h-6 rounded bg-white/20 animate-pulse" />
        </div>
        <div className="h-9 w-20 bg-white/20 rounded-full animate-pulse mb-2" />
        <div className="h-4 w-40 bg-white/20 rounded-full animate-pulse" />
      </header>

      {/* Content panel skeleton */}
      <main className="flex-1 bg-[#fff8f5] rounded-t-[24px] -mt-12 relative z-10 pt-10 pb-32 px-6">
        {/* Yellow chip skeleton */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2">
          <div className="h-10 w-52 bg-[#eae1dc] rounded-full animate-pulse" />
        </div>

        {/* Section header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-7 w-44 bg-[#eae1dc] rounded-full animate-pulse" />
          <div className="w-7 h-7 rounded-full bg-[#eae1dc] animate-pulse" />
        </div>

        {/* Contact card skeletons */}
        <div className="flex flex-col gap-3 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[#f5ece8] rounded-[20px] p-4 flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-full bg-[#eae1dc] animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-32 bg-[#eae1dc] rounded-full animate-pulse" />
                <div className="h-3.5 w-20 bg-[#eae1dc] rounded-full animate-pulse" />
                <div className="h-3.5 w-28 bg-[#ddc0b9] rounded-full animate-pulse" />
              </div>
              <div className="h-3.5 w-16 bg-[#eae1dc] rounded-full animate-pulse shrink-0" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
