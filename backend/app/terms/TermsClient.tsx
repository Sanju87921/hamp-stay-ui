"use client";
import Link from "next/link";
import { motion } from "framer-motion";

import { Shield, FileText, AlertTriangle } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

interface SectionProps {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}

function PolicySection({ id, number, title, children }: SectionProps) {
  return (
    <motion.section
      id={id}
      custom={parseInt(number)}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="scroll-mt-32"
    >
      <div className="flex items-start gap-4 mb-4">
        <span className="text-xs font-bold text-gold-500 bg-gold-50 border border-gold-200/60 rounded-full w-8 h-8 flex items-center justify-center shrink-0 mt-1">
          {number}
        </span>
        <h2 className="text-xl md:text-2xl font-serif font-bold text-navy-950">
          {title}
        </h2>
      </div>
      <div className="ml-12 text-navy-800/70 leading-relaxed space-y-4 text-[15px]">
        {children}
      </div>
    </motion.section>
  );
}

const tocItems = [
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "eligibility", label: "Eligibility" },
  { id: "accounts", label: "User Accounts" },
  { id: "bookings", label: "Bookings & Reservations" },
  { id: "payments", label: "Payments & Pricing" },
  { id: "cancellations", label: "Cancellations & Refunds" },
  { id: "conduct", label: "User Conduct" },
  { id: "intellectual-property", label: "Intellectual Property" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "governing-law", label: "Governing Law" },
  { id: "changes", label: "Changes to Terms" },
  { id: "contact", label: "Contact Us" },
];

export function TermsClient() {
  return (
    <main className="min-h-screen bg-sand-50">
      {/* ── HERO ── */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-200/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-navy-950/5 backdrop-blur-md border border-navy-950/10 rounded-full px-5 py-2 mb-6">
              <FileText className="w-4 h-4 text-navy-950/50" />
              <span className="text-xs font-bold tracking-widest uppercase text-navy-950/60">
                Legal
              </span>
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-serif font-bold text-navy-950 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Terms of{" "}
            <span className="text-gold-600 italic">Service</span>
          </motion.h1>

          <motion.p
            className="text-lg text-navy-800/60 max-w-2xl mx-auto leading-relaxed mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Please read these terms carefully before using the HampiStays
            platform. By accessing or using our services, you agree to be bound
            by these terms.
          </motion.p>

          <motion.p
            className="text-sm text-navy-800/40 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Last updated: May 1, 2026
          </motion.p>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="container mx-auto px-4 md:px-6 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Sticky TOC Sidebar */}
          <motion.aside
            className="lg:col-span-3 hidden lg:block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="sticky top-32 bg-white/70 backdrop-blur-xl rounded-2xl border border-sand-200/60 p-6">
              <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider mb-4">
                Table of Contents
              </h3>
              <nav className="space-y-1">
                {tocItems.map((item, i) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="flex items-center gap-2 py-2 px-3 rounded-lg text-sm text-navy-800/60 hover:text-gold-600 hover:bg-gold-50/50 transition-all duration-200 font-medium"
                  >
                    <span className="text-xs text-navy-800/30 font-bold w-5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </motion.aside>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-12">
            {/* Important Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex gap-4 p-6 rounded-2xl bg-sunset-50/50 border border-sunset-200/40"
            >
              <AlertTriangle className="w-6 h-6 text-sunset-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-navy-950 mb-1">
                  Important Notice
                </h4>
                <p className="text-sm text-navy-800/60 leading-relaxed">
                  These Terms of Service constitute a legally binding agreement
                  between you and HampiStays Private Limited. If you do not
                  agree to these terms, please do not use our platform.
                </p>
              </div>
            </motion.div>

            <PolicySection id="acceptance" number="1" title="Acceptance of Terms">
              <p>
                By accessing or using the HampiStays platform — including our
                website, mobile applications, and related services — you
                acknowledge that you have read, understood, and agree to be
                bound by these Terms of Service and our{" "}
                <Link
                  href="/privacy"
                  className="text-gold-600 font-semibold hover:text-sunset-500 transition-colors underline underline-offset-2"
                >
                  Privacy Policy
                </Link>
                .
              </p>
              <p>
                If you are using our services on behalf of an organization, you
                represent and warrant that you have the authority to bind that
                organization to these terms.
              </p>
            </PolicySection>

            <PolicySection id="eligibility" number="2" title="Eligibility">
              <p>
                To use HampiStays, you must be at least 18 years old and
                capable of forming a binding legal contract under Indian law. By
                creating an account, you represent that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are of legal age to enter into a binding agreement</li>
                <li>
                  All information you provide during registration is accurate,
                  current, and complete
                </li>
                <li>
                  You will maintain the accuracy of your account information
                </li>
                <li>
                  Your use of the platform does not violate any applicable law
                  or regulation
                </li>
              </ul>
            </PolicySection>

            <PolicySection id="accounts" number="3" title="User Accounts">
              <p>
                When you create an account on HampiStays, you are responsible
                for maintaining the confidentiality of your login credentials
                and for all activities that occur under your account.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Use a strong, unique password and do not share it with third
                  parties
                </li>
                <li>
                  Notify us immediately at{" "}
                  <span className="font-semibold text-navy-950">
                    security@hampistays.com
                  </span>{" "}
                  if you suspect unauthorized access
                </li>
                <li>
                  We reserve the right to suspend or terminate accounts that
                  violate these terms
                </li>
                <li>
                  You may not create multiple accounts for the same individual
                </li>
              </ul>
            </PolicySection>

            <PolicySection
              id="bookings"
              number="4"
              title="Bookings & Reservations"
            >
              <p>
                HampiStays acts as an intermediary platform connecting travelers
                (guests) with resort owners and property managers. When you make
                a booking:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  A booking confirmation constitutes a binding agreement between
                  you and the property owner
                </li>
                <li>
                  Property availability is subject to real-time changes and
                  confirmation by the host
                </li>
                <li>
                  You agree to abide by the specific house rules and policies of
                  each property
                </li>
                <li>
                  HampiStays is not liable for any disputes arising directly
                  between guests and property owners, though we will assist in
                  mediation
                </li>
                <li>
                  Check-in and check-out times are set by individual properties
                  and must be respected
                </li>
              </ul>
            </PolicySection>

            <PolicySection id="payments" number="5" title="Payments & Pricing">
              <p>
                All prices displayed on HampiStays are in Indian Rupees (₹)
                unless otherwise stated. Payment terms include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Prices include applicable taxes and service fees as displayed
                  at checkout
                </li>
                <li>
                  We accept major credit/debit cards, UPI, net banking, and
                  select digital wallets
                </li>
                <li>
                  Payment is processed securely through our PCI-DSS compliant
                  payment gateway partners
                </li>
                <li>
                  Dynamic pricing may apply during peak seasons, festivals, and
                  holidays
                </li>
                <li>
                  Promotional codes and discounts are subject to specific terms
                  and validity periods
                </li>
              </ul>
            </PolicySection>

            <PolicySection
              id="cancellations"
              number="6"
              title="Cancellations & Refunds"
            >
              <p>
                Cancellation policies may vary by property. The following
                general guidelines apply:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse mt-2">
                  <thead>
                    <tr className="border-b border-sand-200">
                      <th className="text-left py-3 pr-4 font-bold text-navy-950">
                        Timeframe
                      </th>
                      <th className="text-left py-3 pr-4 font-bold text-navy-950">
                        Refund
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-navy-800/70">
                    <tr className="border-b border-sand-100">
                      <td className="py-3 pr-4">30+ days before check-in</td>
                      <td className="py-3 pr-4 font-semibold text-emerald-600">
                        Full refund (100%)
                      </td>
                    </tr>
                    <tr className="border-b border-sand-100">
                      <td className="py-3 pr-4">15–29 days before check-in</td>
                      <td className="py-3 pr-4 font-semibold text-gold-600">
                        75% refund
                      </td>
                    </tr>
                    <tr className="border-b border-sand-100">
                      <td className="py-3 pr-4">7–14 days before check-in</td>
                      <td className="py-3 pr-4 font-semibold text-sunset-600">
                        50% refund
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Less than 7 days</td>
                      <td className="py-3 pr-4 font-semibold text-red-500">
                        No refund
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3">
                Refunds are processed within 7–10 business days to the original
                payment method. Special circumstances (medical emergencies,
                natural disasters) may be considered on a case-by-case basis.
              </p>
            </PolicySection>

            <PolicySection id="conduct" number="7" title="User Conduct">
              <p>You agree not to use HampiStays to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Post false, misleading, or fraudulent content or reviews
                </li>
                <li>
                  Harass, threaten, or discriminate against other users or hosts
                </li>
                <li>
                  Attempt to circumvent our platform to make direct bookings and
                  avoid service fees
                </li>
                <li>
                  Use automated tools, bots, or scripts to scrape or access the
                  platform
                </li>
                <li>
                  Engage in any activity that disrupts or interferes with our
                  services
                </li>
                <li>
                  Damage, destroy, or steal property belonging to hosts or other
                  guests
                </li>
              </ul>
            </PolicySection>

            <PolicySection
              id="intellectual-property"
              number="8"
              title="Intellectual Property"
            >
              <p>
                All content on HampiStays — including logos, text, images,
                designs, software, and trademarks — is the property of
                HampiStays Private Limited or its licensors and is protected by
                Indian and international intellectual property laws.
              </p>
              <p>
                You may not reproduce, distribute, modify, or create derivative
                works from our content without prior written permission.
                User-generated content (reviews, photos) remains your property,
                but you grant HampiStays a non-exclusive, worldwide, royalty-free
                license to use, display, and distribute such content on our
                platform.
              </p>
            </PolicySection>

            <PolicySection
              id="liability"
              number="9"
              title="Limitation of Liability"
            >
              <p>
                To the maximum extent permitted by law, HampiStays shall not be
                liable for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Indirect, incidental, special, or consequential damages
                  arising from use of our platform
                </li>
                <li>
                  Loss of profits, data, or business opportunities related to
                  bookings
                </li>
                <li>
                  Actions or omissions of property owners, guests, or third-party
                  service providers
                </li>
                <li>
                  Service interruptions caused by factors beyond our reasonable
                  control
                </li>
              </ul>
              <p>
                Our total liability for any claim shall not exceed the amount
                you paid to HampiStays in the 12 months preceding the claim.
              </p>
            </PolicySection>

            <PolicySection
              id="governing-law"
              number="10"
              title="Governing Law"
            >
              <p>
                These Terms of Service are governed by and construed in
                accordance with the laws of India. Any disputes arising from or
                relating to these terms shall be subject to the exclusive
                jurisdiction of the courts in Bengaluru, Karnataka.
              </p>
              <p>
                Before pursuing legal action, both parties agree to attempt
                resolution through good-faith negotiation and, if necessary,
                mediation through a mutually agreed mediator.
              </p>
            </PolicySection>

            <PolicySection id="changes" number="11" title="Changes to Terms">
              <p>
                We reserve the right to modify these Terms of Service at any
                time. Material changes will be communicated through:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email notification to registered users</li>
                <li>A prominent notice on our website and app</li>
                <li>An updated "Last modified" date at the top of this page</li>
              </ul>
              <p>
                Continued use of HampiStays after changes are posted
                constitutes acceptance of the revised terms.
              </p>
            </PolicySection>

            <PolicySection id="contact" number="12" title="Contact Us">
              <p>
                If you have questions about these Terms of Service, please
                contact us:
              </p>
              <div className="bg-sand-100/80 rounded-2xl p-6 mt-2 space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gold-600 shrink-0" />
                  <span className="font-semibold text-navy-950">
                    HampiStays Private Limited
                  </span>
                </div>
                <p>123 Heritage Route, Kamalapura, Hampi, Karnataka 583239</p>
                <p>
                  Email:{" "}
                  <span className="font-semibold text-navy-950">
                    legal@hampistays.com
                  </span>
                </p>
                <p>
                  Phone:{" "}
                  <span className="font-semibold text-navy-950">
                    +91 98765 43210
                  </span>
                </p>
              </div>
              <p className="mt-4">
                You can also reach us through our{" "}
                <Link
                  href="/contact"
                  className="text-gold-600 font-semibold hover:text-sunset-500 transition-colors underline underline-offset-2"
                >
                  Contact page
                </Link>
                .
              </p>
            </PolicySection>
          </div>
        </div>
      </section>
    </main>
  );
}
