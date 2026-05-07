"use client";
import Link from "next/link";
import { motion } from "framer-motion";

import {
  Shield,
  Eye,
  Database,
  Lock,
  Cookie,
  Users,
  Globe,
  Bell,
  Trash2,
  ShieldCheck,
} from "lucide-react";

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
  icon: React.ElementType;
  children: React.ReactNode;
}

function PolicySection({ id, number, title, icon: Icon, children }: SectionProps) {
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
        <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200/60 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-gold-600" />
        </div>
        <div>
          <span className="text-xs font-bold text-gold-500 tracking-wider uppercase">
            Section {number}
          </span>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-navy-950">
            {title}
          </h2>
        </div>
      </div>
      <div className="ml-14 text-navy-800/70 leading-relaxed space-y-4 text-[15px]">
        {children}
      </div>
    </motion.section>
  );
}

const tocItems = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "data-collection", label: "Data We Collect", icon: Database },
  { id: "data-usage", label: "How We Use Your Data", icon: Shield },
  { id: "cookies", label: "Cookies & Tracking", icon: Cookie },
  { id: "data-sharing", label: "Data Sharing", icon: Users },
  { id: "data-security", label: "Data Security", icon: Lock },
  { id: "your-rights", label: "Your Rights", icon: ShieldCheck },
  { id: "data-retention", label: "Data Retention", icon: Trash2 },
  { id: "international", label: "International Transfers", icon: Globe },
  { id: "updates", label: "Policy Updates", icon: Bell },
];

export function PrivacyClient() {
  return (
    <main className="min-h-screen bg-sand-50">
      {/* ── HERO ── */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-200/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-sunset-200/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-emerald-50/60 backdrop-blur-md border border-emerald-200/60 rounded-full px-5 py-2 mb-6">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-700">
                Your Privacy Matters
              </span>
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-serif font-bold text-navy-950 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Privacy{" "}
            <span className="text-gold-600 italic">Policy</span>
          </motion.h1>

          <motion.p
            className="text-lg text-navy-800/60 max-w-2xl mx-auto leading-relaxed mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            At HampiStays, we are committed to protecting your personal data.
            This policy explains what information we collect, how we use it,
            and the choices you have.
          </motion.p>

          <motion.p
            className="text-sm text-navy-800/40 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Effective: May 1, 2026 · Last updated: May 1, 2026
          </motion.p>
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section className="container mx-auto px-4 md:px-6 mb-16">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          {[
            {
              icon: Lock,
              title: "256-bit Encryption",
              desc: "All data transmitted is encrypted end-to-end",
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              icon: ShieldCheck,
              title: "GDPR Compliant",
              desc: "We follow global data protection standards",
              color: "text-gold-600",
              bg: "bg-gold-50",
            },
            {
              icon: Database,
              title: "No Data Selling",
              desc: "We never sell your personal information",
              color: "text-sunset-600",
              bg: "bg-sunset-50",
            },
          ].map((badge) => (
            <div
              key={badge.title}
              className="flex items-center gap-4 p-5 rounded-2xl bg-white/70 backdrop-blur-xl border border-sand-200/50"
            >
              <div
                className={`w-12 h-12 rounded-xl ${badge.bg} flex items-center justify-center shrink-0`}
              >
                <badge.icon className={`w-6 h-6 ${badge.color}`} />
              </div>
              <div>
                <h4 className="font-bold text-navy-950 text-sm">
                  {badge.title}
                </h4>
                <p className="text-xs text-navy-800/50">{badge.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
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
                Contents
              </h3>
              <nav className="space-y-1">
                {tocItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-sm text-navy-800/60 hover:text-gold-600 hover:bg-gold-50/50 transition-all duration-200 font-medium"
                  >
                    <item.icon className="w-3.5 h-3.5 shrink-0 opacity-50" />
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </motion.aside>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-14">
            <PolicySection
              id="overview"
              number="1"
              title="Overview"
              icon={Eye}
            >
              <p>
                HampiStays Private Limited ("HampiStays," "we," "us," or "our")
                operates the hampistays.com website and mobile applications. This
                Privacy Policy describes how we collect, use, store, share, and
                protect your personal information when you use our platform.
              </p>
              <p>
                This policy applies to all users of our services, including
                guests searching for or booking accommodations, and property
                owners listing their resorts on our platform. By using
                HampiStays, you consent to the practices described in this
                policy.
              </p>
            </PolicySection>

            <PolicySection
              id="data-collection"
              number="2"
              title="Data We Collect"
              icon={Database}
            >
              <p>
                We collect the following categories of personal information:
              </p>

              <h4 className="font-bold text-navy-950 mt-4 text-base">
                Information You Provide
              </h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Account Data:</strong> Name, email address, phone
                  number, and password when you create an account
                </li>
                <li>
                  <strong>Profile Data:</strong> Profile photo, preferences,
                  saved resorts, and communication preferences
                </li>
                <li>
                  <strong>Booking Data:</strong> Check-in/check-out dates, number
                  of guests, special requests, and booking history
                </li>
                <li>
                  <strong>Payment Data:</strong> Credit/debit card details, UPI
                  IDs, and billing address (processed by secure payment partners)
                </li>
                <li>
                  <strong>Communication Data:</strong> Messages exchanged with
                  hosts, reviews, ratings, and support inquiries
                </li>
              </ul>

              <h4 className="font-bold text-navy-950 mt-4 text-base">
                Information Collected Automatically
              </h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Device Data:</strong> IP address, browser type,
                  operating system, and device identifiers
                </li>
                <li>
                  <strong>Usage Data:</strong> Pages visited, search queries,
                  click patterns, and session duration
                </li>
                <li>
                  <strong>Location Data:</strong> Approximate location based on
                  IP address (precise location only with your consent)
                </li>
              </ul>
            </PolicySection>

            <PolicySection
              id="data-usage"
              number="3"
              title="How We Use Your Data"
              icon={Shield}
            >
              <p>We use your personal information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Process and manage your bookings, payments, and reservations
                </li>
                <li>
                  Personalize your experience with tailored resort
                  recommendations
                </li>
                <li>
                  Communicate booking confirmations, reminders, and support
                  responses
                </li>
                <li>
                  Improve our platform through analytics and performance
                  monitoring
                </li>
                <li>
                  Detect, prevent, and address fraud, security threats, and
                  technical issues
                </li>
                <li>
                  Send marketing communications (only with your explicit
                  consent, with easy opt-out)
                </li>
                <li>Comply with legal obligations and regulatory requirements</li>
                <li>
                  Facilitate host-guest communication for a seamless stay
                  experience
                </li>
              </ul>
            </PolicySection>

            <PolicySection
              id="cookies"
              number="4"
              title="Cookies & Tracking"
              icon={Cookie}
            >
              <p>
                We use cookies and similar tracking technologies to enhance your
                browsing experience. Types of cookies we use:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse mt-2">
                  <thead>
                    <tr className="border-b border-sand-200">
                      <th className="text-left py-3 pr-4 font-bold text-navy-950">
                        Type
                      </th>
                      <th className="text-left py-3 pr-4 font-bold text-navy-950">
                        Purpose
                      </th>
                      <th className="text-left py-3 font-bold text-navy-950">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-navy-800/70">
                    <tr className="border-b border-sand-100">
                      <td className="py-3 pr-4 font-semibold text-navy-950">
                        Essential
                      </td>
                      <td className="py-3 pr-4">
                        Login sessions, security, and core functionality
                      </td>
                      <td className="py-3">Session</td>
                    </tr>
                    <tr className="border-b border-sand-100">
                      <td className="py-3 pr-4 font-semibold text-navy-950">
                        Analytics
                      </td>
                      <td className="py-3 pr-4">
                        Page views, user behavior, and performance metrics
                      </td>
                      <td className="py-3">2 years</td>
                    </tr>
                    <tr className="border-b border-sand-100">
                      <td className="py-3 pr-4 font-semibold text-navy-950">
                        Functional
                      </td>
                      <td className="py-3 pr-4">
                        Language preferences, search history, and saved filters
                      </td>
                      <td className="py-3">1 year</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-semibold text-navy-950">
                        Marketing
                      </td>
                      <td className="py-3 pr-4">
                        Personalized ads and retargeting (opt-in only)
                      </td>
                      <td className="py-3">90 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-3">
                You can manage cookie preferences through your browser settings.
                Disabling essential cookies may affect platform functionality.
              </p>
            </PolicySection>

            <PolicySection
              id="data-sharing"
              number="5"
              title="Data Sharing"
              icon={Users}
            >
              <p>
                We do not sell your personal data. We may share information
                with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Property Owners/Hosts:</strong> Name, contact
                  details, and booking information necessary to fulfill your
                  reservation
                </li>
                <li>
                  <strong>Payment Processors:</strong> Razorpay, Stripe, and
                  other PCI-DSS certified partners to process transactions
                  securely
                </li>
                <li>
                  <strong>Analytics Partners:</strong> Aggregated, anonymized
                  data to improve our services (Google Analytics, Mixpanel)
                </li>
                <li>
                  <strong>Legal Authorities:</strong> When required by law, court
                  order, or to protect the safety and rights of our users
                </li>
                <li>
                  <strong>Service Providers:</strong> Cloud hosting (AWS),
                  email delivery, and customer support tools — all bound by
                  strict data processing agreements
                </li>
              </ul>
            </PolicySection>

            <PolicySection
              id="data-security"
              number="6"
              title="Data Security"
              icon={Lock}
            >
              <p>
                We implement industry-standard security measures to protect
                your data:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  TLS 1.3 encryption for all data in transit
                </li>
                <li>
                  AES-256 encryption for sensitive data at rest
                </li>
                <li>
                  Regular security audits and penetration testing by
                  third-party firms
                </li>
                <li>
                  Multi-factor authentication (MFA) available for all accounts
                </li>
                <li>
                  SOC 2 Type II compliant cloud infrastructure
                </li>
                <li>
                  Access controls and role-based permissions for internal
                  staff
                </li>
              </ul>
              <p>
                While we strive for maximum security, no system is 100%
                impenetrable. We encourage users to use strong passwords and
                enable MFA.
              </p>
            </PolicySection>

            <PolicySection
              id="your-rights"
              number="7"
              title="Your Rights"
              icon={ShieldCheck}
            >
              <p>
                As a HampiStays user, you have the following rights regarding
                your personal data:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {[
                  {
                    right: "Access",
                    desc: "Request a copy of all personal data we hold about you",
                  },
                  {
                    right: "Correction",
                    desc: "Update or correct inaccurate personal information",
                  },
                  {
                    right: "Deletion",
                    desc: "Request deletion of your account and associated data",
                  },
                  {
                    right: "Portability",
                    desc: "Receive your data in a structured, machine-readable format",
                  },
                  {
                    right: "Restriction",
                    desc: "Limit how we process your personal information",
                  },
                  {
                    right: "Objection",
                    desc: "Opt out of marketing and profiling activities",
                  },
                ].map((item) => (
                  <div
                    key={item.right}
                    className="p-4 rounded-xl bg-sand-50/80 border border-sand-200/50"
                  >
                    <h5 className="font-bold text-navy-950 text-sm mb-1">
                      Right to {item.right}
                    </h5>
                    <p className="text-xs text-navy-800/50 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-4">
                To exercise any of these rights, contact us at{" "}
                <span className="font-semibold text-navy-950">
                  privacy@hampistays.com
                </span>
                . We will respond within 30 days.
              </p>
            </PolicySection>

            <PolicySection
              id="data-retention"
              number="8"
              title="Data Retention"
              icon={Trash2}
            >
              <p>
                We retain your personal data only as long as necessary to
                fulfill the purposes described in this policy:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Active accounts:</strong> Data is retained while your
                  account remains active
                </li>
                <li>
                  <strong>After account deletion:</strong> Personal data is
                  deleted within 90 days, except where retention is required by
                  law
                </li>
                <li>
                  <strong>Booking records:</strong> Retained for 7 years for
                  tax and regulatory compliance
                </li>
                <li>
                  <strong>Analytics data:</strong> Aggregated and anonymized
                  after 24 months
                </li>
                <li>
                  <strong>Support tickets:</strong> Retained for 3 years from
                  resolution date
                </li>
              </ul>
            </PolicySection>

            <PolicySection
              id="international"
              number="9"
              title="International Transfers"
              icon={Globe}
            >
              <p>
                HampiStays primarily stores data within India. In cases where
                data may be transferred internationally (e.g., cloud
                infrastructure, third-party services), we ensure:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Adequate data protection through Standard Contractual Clauses
                  (SCCs)
                </li>
                <li>
                  Compliance with the Digital Personal Data Protection Act
                  (DPDPA) 2023
                </li>
                <li>
                  Transfers only to jurisdictions with adequate data protection
                  frameworks
                </li>
              </ul>
            </PolicySection>

            <PolicySection
              id="updates"
              number="10"
              title="Policy Updates"
              icon={Bell}
            >
              <p>
                We may update this Privacy Policy periodically to reflect
                changes in our practices, technologies, or legal requirements.
                When we make significant changes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We will notify you via email and in-app notification</li>
                <li>A summary of changes will be posted on our website</li>
                <li>
                  The "Last updated" date at the top of this policy will be
                  revised
                </li>
              </ul>
              <p>
                We encourage you to review this policy regularly.
              </p>

              {/* Contact block */}
              <div className="bg-sand-100/80 rounded-2xl p-6 mt-6 space-y-3">
                <h4 className="font-bold text-navy-950 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-gold-600" />
                  Data Protection Officer
                </h4>
                <p>
                  For privacy-specific inquiries, contact our DPO:
                </p>
                <p>
                  Email:{" "}
                  <span className="font-semibold text-navy-950">
                    dpo@hampistays.com
                  </span>
                </p>
                <p>
                  Mail: Data Protection Officer, HampiStays Pvt. Ltd., 123
                  Heritage Route, Kamalapura, Hampi, Karnataka 583239
                </p>
                <p className="pt-2">
                  Or visit our{" "}
                  <Link
                    href="/contact"
                    className="text-gold-600 font-semibold hover:text-sunset-500 transition-colors underline underline-offset-2"
                  >
                    Contact page
                  </Link>{" "}
                  for general inquiries.
                </p>
              </div>
            </PolicySection>
          </div>
        </div>
      </section>
    </main>
  );
}
