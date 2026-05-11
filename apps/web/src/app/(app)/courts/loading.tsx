export default function CourtsLoading() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        <div className="mb-10">
          <div className="h-4 w-16 bg-gray-800 rounded-full mb-3 animate-pulse" />
          <div className="h-10 w-48 bg-gray-800 rounded-xl animate-pulse" />
        </div>
        {/* Search bar skeleton */}
        <div className="h-12 w-full bg-gray-900 border border-white/5 rounded-xl mb-4 animate-pulse" />
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-20 bg-gray-900 rounded-full animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden animate-pulse">
              <div className="h-40 bg-gray-800" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 bg-gray-800 rounded-lg" />
                <div className="h-4 w-1/2 bg-gray-800 rounded-lg" />
                <div className="flex gap-2 mt-3">
                  <div className="h-6 w-16 bg-gray-800 rounded-full" />
                  <div className="h-6 w-16 bg-gray-800 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
