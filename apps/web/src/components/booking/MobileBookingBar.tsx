"use client";

export function MobileBookingBar({ pricePerHour }: { pricePerHour: number }) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur-md border-t border-white/10 px-5 py-4 flex items-center justify-between z-40">
      <div>
        <p className="text-xs text-gray-500 mb-0.5">From</p>
        <p className="text-2xl font-black text-brand-400">
          £{pricePerHour}
          <span className="text-sm text-gray-500 font-normal">/hr</span>
        </p>
      </div>
      <a
        href="#booking"
        className="bg-brand-500 hover:bg-brand-400 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-colors"
      >
        Book this court →
      </a>
    </div>
  );
}
