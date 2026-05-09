import Link from "next/link";
import { Check } from "lucide-react";

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
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <Link href="/" className="text-xl font-bold text-brand-600">
          PaddleMate
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/courts" className="text-sm text-gray-600 hover:text-gray-900">Courts</Link>
          <Link href="/matches" className="text-sm text-gray-600 hover:text-gray-900">Matches</Link>
          <Link href="/clubs" className="text-sm text-gray-600 hover:text-gray-900">Clubs</Link>
          <Link href="/auth/login" className="text-sm bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">
            Sign in
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Pricing plans
          </h1>
          <p className="text-gray-500 text-lg">
            Flexible plans for every club — no hidden fees, cancel anytime.
          </p>
          <div className="inline-flex items-center gap-2 mt-4 bg-brand-50 text-brand-700 text-sm font-medium px-4 py-2 rounded-full">
            Up to 40% cheaper than the competition
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                plan.highlight
                  ? "border-brand-500 shadow-lg shadow-brand-100 bg-brand-600 text-white"
                  : "border-gray-200 bg-white text-gray-900"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {plan.badge}
                </span>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
                <p className={`text-sm mb-4 ${plan.highlight ? "text-brand-100" : "text-gray-500"}`}>
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">€{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? "text-brand-200" : "text-gray-400"}`}>
                    /mo (VAT excl.)
                  </span>
                </div>
              </div>

              <Link
                href="/auth/signup"
                className={`block text-center py-2.5 rounded-lg font-medium text-sm mb-6 transition-colors ${
                  plan.highlight
                    ? "bg-white text-brand-600 hover:bg-brand-50"
                    : "bg-brand-600 text-white hover:bg-brand-700"
                }`}
              >
                Get started
              </Link>

              <ul className="space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        plan.highlight ? "text-brand-200" : "text-brand-600"
                      }`}
                    />
                    <span className={plan.highlight ? "text-brand-50" : "text-gray-600"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-400 text-sm mt-10">
          All prices exclude VAT. Monthly billing. No setup fees.
        </p>
      </div>
    </div>
  );
}
