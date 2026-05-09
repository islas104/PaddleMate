import Link from "next/link";
import { Check } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

export const metadata = { title: "Pricing" };

const plans = [
  {
    name: "Starter",
    price: 19,
    description: "Everything you need to get your club online",
    highlight: false,
    features: [
      "Court blocking & scheduling",
      "Customer management",
      "Matches & tournaments",
      "Payments",
      "Reports",
      "Public classes",
      "Integrations",
      "48h support",
    ],
  },
  {
    name: "Pro",
    price: 49,
    description: "Advanced tools for growing clubs",
    highlight: false,
    features: [
      "Everything in Starter",
      "Court information display",
      "User categories",
      "Money wallet",
      "POS system",
      "8h support",
    ],
  },
  {
    name: "Club",
    price: 99,
    description: "Optimal for clubs scaling fast",
    highlight: true,
    badge: "Most popular",
    features: [
      "Everything in Pro",
      "Coaches & courses",
      "Customer memberships",
      "Invoicing",
      "Leagues",
      "Private classes",
      "Campaigns",
      "API integrations",
      "Multiple legal entities",
      "4h support",
      "POS system",
    ],
  },
  {
    name: "Elite",
    price: 239,
    description: "Top-tier for large multi-venue clubs",
    highlight: false,
    features: [
      "Everything in Club",
      "Highest priority support",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-4">Pricing</p>
          <h1 className="text-5xl font-black tracking-tight mb-4">
            Plans for every club
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            No hidden fees, no setup costs, cancel anytime.
          </p>
          <div className="inline-flex items-center gap-2 mt-5 bg-brand-950/60 border border-brand-800 text-brand-400 text-sm font-semibold px-5 py-2 rounded-full">
            🏆 Up to 40% cheaper than Playtomic
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                plan.highlight
                  ? "border-brand-500 bg-brand-600 shadow-2xl shadow-brand-900/50"
                  : "border-white/5 bg-gray-900"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">
                  {plan.badge}
                </span>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-black mb-1 text-white">{plan.name}</h2>
                <p className={`text-sm mb-4 ${plan.highlight ? "text-brand-100" : "text-gray-500"}`}>
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">€{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? "text-brand-200" : "text-gray-600"}`}>
                    /mo
                  </span>
                </div>
              </div>

              <Link
                href="/signup"
                className={`block text-center py-2.5 rounded-xl font-bold text-sm mb-6 transition-colors ${
                  plan.highlight
                    ? "bg-white text-brand-600 hover:bg-gray-100"
                    : "bg-brand-500 text-white hover:bg-brand-400"
                }`}
              >
                Get started
              </Link>

              <ul className="space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight ? "text-brand-200" : "text-brand-500"}`} />
                    <span className={plan.highlight ? "text-brand-50" : "text-gray-400"}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-600 text-sm mt-10">
          All prices exclude VAT · Monthly billing · No setup fees
        </p>
      </div>
    </div>
  );
}
