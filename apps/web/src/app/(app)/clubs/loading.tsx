export default function ClubsLoading() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        <div className="mb-10">
          <div className="h-4 w-14 bg-gray-800 rounded-full mb-3 animate-pulse" />
          <div className="h-10 w-44 bg-gray-800 rounded-xl animate-pulse" />
          <div className="h-4 w-48 bg-gray-800 rounded-lg mt-3 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-900 border border-white/5 rounded-2xl p-6 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gray-800 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 bg-gray-800 rounded-lg" />
                  <div className="h-4 w-1/2 bg-gray-800 rounded-lg" />
                </div>
              </div>
              <div className="h-4 w-full bg-gray-800 rounded-lg mb-2" />
              <div className="h-4 w-2/3 bg-gray-800 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
