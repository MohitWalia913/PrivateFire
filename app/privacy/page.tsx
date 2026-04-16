import Link from 'next/link'
import { Flame } from 'lucide-react'
import Footer from '@/components/Footer'

const sections = [
  {
    id: 'introduction',
    title: '1. Introduction',
    content: `Private Fire ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our mobile application, or engage with our services. By using Private Fire, you consent to the practices described in this policy. If you do not agree with this policy, please do not access or use our Services.`,
  },
  {
    id: 'information-we-collect',
    title: '2. Information We Collect',
    content: `We collect several types of information from and about users of our Services:\n\nPersonal Identifiers: Full name, email address, phone number, and mailing or property address.\n\nLocation Data: ZIP code and property coordinates used to assess fire risk and deploy protection services.\n\nFinancial Information: Billing details collected through our secure payment processor (we do not store raw card data).\n\nUsage Data: Pages visited, features used, time spent on the platform, device type, browser, IP address, and referral sources.\n\nCommunications: Any messages, support tickets, or correspondence you send us.`,
  },
  {
    id: 'how-we-use',
    title: '3. How We Use Your Information',
    content: `We use the information we collect to:\n\n• Deliver and manage your fire protection service and coverage application account\n• Send emergency alerts and fire risk notifications relevant to your area\n• Process payments and communicate about your subscription\n• Improve and personalize the Services\n• Respond to support inquiries and communications\n• Comply with applicable legal obligations\n• Detect and prevent fraud or unauthorized activity`,
  },
  {
    id: 'sharing',
    title: '4. Information Sharing',
    content: `We do not sell, rent, or trade your personal information to third parties for marketing purposes.\n\nWe may share your information only in the following circumstances:\n\nEmergency Services: When necessary to protect life or property, we may share your location and contact information with public emergency services such as fire departments or law enforcement.\n\nService Providers: Trusted third-party vendors who assist us in operating our platform (e.g., payment processors, cloud hosting, analytics) are contractually bound to use your data only for the services they provide to us.\n\nLegal Requirements: We may disclose information when required by law, court order, or government authority.`,
  },
  {
    id: 'security',
    title: '5. Data Security',
    content: `We implement industry-standard security measures to protect your personal information, including encryption in transit (TLS), encrypted storage at rest, access controls, and regular security reviews. However, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security, and you use our Services at your own risk. In the event of a data breach that affects your rights, we will notify you as required by applicable law.`,
  },
  {
    id: 'cookies',
    title: '6. Cookies and Tracking',
    content: `We use cookies and similar tracking technologies to enhance your experience on our platform. Cookies help us remember your preferences, keep you logged in, and analyze how you use our Services.\n\nTypes of cookies we use:\n• Essential Cookies: Required for the platform to function correctly.\n• Analytics Cookies: Help us understand usage patterns (e.g., page views, feature adoption).\n• Preference Cookies: Store your settings and personalization choices.\n\nYou may configure your browser to refuse cookies; however, some parts of our Services may not function properly without them.`,
  },
  {
    id: 'your-rights',
    title: '7. Your Rights',
    content: `Depending on your location, you may have the following rights with respect to your personal information:\n\nAccess: Request a copy of the personal data we hold about you.\n\nCorrection: Request that we correct inaccurate or incomplete information.\n\nDeletion: Request that we delete your personal data, subject to certain legal exceptions.\n\nPortability: Request your data in a structured, machine-readable format.\n\nOptimize Marketing: Opt out of marketing communications at any time by clicking "Unsubscribe" in our emails or contacting us directly.\n\nTo exercise any of these rights, contact us at info@privatefire.com.`,
  },
  {
    id: 'retention',
    title: '8. Data Retention',
    content: `We retain your personal information for as long as your account is active or as needed to provide our Services. We also retain data to comply with legal obligations, resolve disputes, and enforce our agreements. When your data is no longer necessary, we will delete or anonymize it in accordance with our internal data retention policies. You may request earlier deletion by contacting us at info@privatefire.com.`,
  },
  {
    id: 'children',
    title: "9. Children's Privacy",
    content: `Our Services are intended solely for individuals who are 18 years of age or older. We do not knowingly collect personal information from minors. If you believe that a minor has provided us with their personal information, please contact us immediately at info@privatefire.com so we can take appropriate steps to remove that information from our systems.`,
  },
  {
    id: 'changes',
    title: '10. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or for other operational reasons. We will notify you of material changes by updating the "Last Updated" date at the top of this page and, where appropriate, by sending an email to registered users. Your continued use of our Services after any changes constitutes your acceptance of the updated policy.`,
  },
  {
    id: 'contact',
    title: '11. Contact Us',
    content: `If you have questions, concerns, or requests related to this Privacy Policy or the handling of your personal information, please contact us:\n\nEmail: info@privatefire.com\nPhone: 818-414-1980\nMailing Address: Private Fire, Los Angeles, California`,
  },
]

export default function PrivacyPage() {
  return (
    <>
      <div className="min-h-screen bg-[#f8f7f5] pt-20 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-5">
              <Flame size={13} className="text-orange-400" />
              <span className="text-orange-600 text-xs font-medium">Legal</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 leading-tight">
              Privacy{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                Policy
              </span>
            </h1>
            <p className="text-gray-500 text-sm">Last Updated: January 1, 2026</p>
            <p className="text-gray-600 max-w-2xl mx-auto mt-3">
              Your privacy matters to us. This policy explains what data we collect, why we collect it, and how we protect it.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sticky Table of Contents */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-24 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <p className="text-gray-900 font-semibold text-sm mb-4">Table of Contents</p>
                <nav className="space-y-1.5">
                  {sections.map(s => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="block text-gray-600 hover:text-orange-500 text-xs leading-relaxed transition-colors py-0.5"
                    >
                      {s.title}
                    </a>
                  ))}
                </nav>
                <div className="mt-6 pt-5 border-t border-gray-200">
                  <Link
                    href="/"
                    className="flex items-center gap-1.5 text-orange-500 hover:text-orange-600 text-xs transition-colors"
                  >
                    <Flame size={11} /> Back to Home
                  </Link>
                </div>
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1 space-y-5">
              {sections.map(s => (
                <section
                  key={s.id}
                  id={s.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 scroll-mt-28 shadow-sm"
                >
                  <h2 className="text-gray-900 font-bold text-lg mb-4">{s.title}</h2>
                  {s.content.split('\n\n').map((para, i) => (
                    <p key={i} className="text-gray-600 text-sm leading-relaxed mb-3 last:mb-0 whitespace-pre-line">
                      {para}
                    </p>
                  ))}
                </section>
              ))}

              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
                <p className="text-gray-600 text-sm">
                  Questions about your privacy?{' '}
                  <Link href="/contact" className="text-orange-500 hover:text-orange-600 transition-colors font-medium">
                    Contact our team
                  </Link>
                  {' '}or review our{' '}
                  <Link href="/terms" className="text-orange-500 hover:text-orange-600 transition-colors font-medium">
                    Terms and Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
