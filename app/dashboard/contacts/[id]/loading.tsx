export default function ContactDetailLoading() {
  return (
    <div className="bg-[#fff8f5] min-h-screen pb-32">
      {/* Hero skeleton */}
      <div className="w-full h-[320px] bg-[#9c3e21]/20 animate-pulse" />

      {/* Content */}
      <div className="relative -mt-10 bg-[#fff8f5] rounded-t-3xl min-h-screen">
        {/* Junction chip */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 h-9 w-32 bg-white rounded-full shadow-sm animate-pulse" />

        <div className="max-w-2xl mx-auto px-6 pt-12 text-center">
          {/* Name */}
          <div className="h-8 w-48 bg-[#eae1dc] rounded-full animate-pulse mx-auto mb-3" />
          <div className="h-4 w-36 bg-[#eae1dc] rounded-full animate-pulse mx-auto mb-7" />

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-[#f5ece8] animate-pulse" />
            ))}
          </div>

          {/* Tags */}
          <div className="flex justify-center gap-2 mb-6">
            {[60, 72, 56, 80].map((w, i) => (
              <div
                key={i}
                className="h-7 rounded-full bg-[#f5ece8] animate-pulse"
                style={{ width: `${w}px` }}
              />
            ))}
          </div>

          {/* Frequency widget */}
          <div className="h-32 rounded-[20px] bg-[#eae1dc]/30 animate-pulse mb-6" />

          {/* Timeline header */}
          <div className="h-7 w-40 bg-[#eae1dc] rounded-full animate-pulse mb-4" />

          {/* Timeline items */}
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#eae1dc] animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-[#eae1dc] rounded-full animate-pulse" />
                  <div className="h-3 w-1/2 bg-[#eae1dc] rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
