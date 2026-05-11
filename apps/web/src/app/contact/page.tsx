import { Navbar } from "@/components/layout/Navbar";
import { ContactForm } from "./ContactForm";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 pt-28 pb-16">
        <div className="mb-10">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-2">Get in touch</p>
          <h1 className="text-4xl font-black mb-3">Contact us</h1>
          <p className="text-gray-400">
            Have a question or want to list your venue? We typically reply within 24 hours.
          </p>
        </div>

        <ContactForm />

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-5">
            <p className="text-xl mb-2">🏟️</p>
            <p className="font-bold text-sm mb-1">List your venue</p>
            <p className="text-gray-500 text-xs mb-1">Want to get your courts on PaddleMate? Fill in the form above or visit our</p>
            <a href="/for-venues" className="text-brand-400 text-xs hover:text-brand-300 transition-colors">venues page →</a>
          </div>
          <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-5">
            <p className="text-xl mb-2">💬</p>
            <p className="font-bold text-sm mb-1">Response time</p>
            <p className="text-gray-500 text-xs">We aim to reply to all enquiries within 24 hours on business days.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
