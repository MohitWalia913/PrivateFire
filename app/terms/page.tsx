import Link from 'next/link'
import { Flame } from 'lucide-react'
import Footer from '@/components/Footer'

const sections = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: `By accessing or using the Private Fire website, mobile application, or any related services (collectively, the "Services"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our Services. Your continued use of the Services following any updates to these Terms constitutes your acceptance of those changes.`,
  },
  {
    id: 'description',
    title: '2. Description of Services',
    content: `Private Fire provides private wildfire protection services to qualifying property owners in high-risk areas of California. Our Services include, but are not limited to, private wildfire defense deployment, emergency response coordination, fire risk monitoring, property hardening assessments, and priority alert notifications. Private Fire operates independently of public fire agencies and offers supplemental protection services to subscribed members.`,
  },
  {
    id: 'eligibility',
    title: '3. Eligibility',
    content: `To use our Services, you must be at least 18 years of age, a current resident of the State of California, and a legal owner or authorized representative of the property you wish to protect. By creating an account or placing a bid, you represent and warrant that you meet all eligibility requirements. Private Fire reserves the right to verify eligibility and to suspend or terminate accounts that do not comply.`,
  },
  {
    id: 'coverage-applications',
    title: '4. Coverage Applications and Service Slots',
    content: `Private Fire offers a limited number of annual protection slots — currently capped at 300 — allocated through a competitive coverage application process. The minimum starting coverage amount is $10,000 per year. Applications are submitted per ZIP code area and the highest applicants at auction close secure service slots for the following 12-month period. Applications are binding once submitted. If your application is outranked, you will be notified and may increase your coverage amount before the auction closes. Private Fire reserves the right to adjust slot limits, minimum coverage amounts, and auction timelines at its sole discretion with reasonable notice.`,
  },
  {
    id: 'payment',
    title: '5. Payment Terms',
    content: `Payment is collected from winning bidders within 48 hours of auction close. Accepted payment methods are listed at checkout. Fees are non-refundable once a service slot is confirmed and the service period has begun. If payment fails, your slot may be forfeited and offered to the next highest bidder. Annual renewals are offered to existing members at a rate determined by subsequent auction results or a renewal pricing schedule communicated 60 days in advance.`,
  },
  {
    id: 'limitations',
    title: '6. Service Limitations and Disclaimer',
    content: `Private Fire services are supplemental in nature and are not a replacement for public fire department or government emergency services. While we strive to provide the highest level of protection, we cannot guarantee the prevention of fire damage, property loss, or personal injury. Emergency deployment is subject to conditions including active incidents, access constraints, personnel availability, and force majeure events. Private Fire expressly disclaims any warranties, express or implied, regarding outcome or coverage guarantees.`,
  },
  {
    id: 'accounts',
    title: '7. User Accounts and Security',
    content: `You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to notify Private Fire immediately at info@privatefire.com if you suspect any unauthorized access or breach. Private Fire is not liable for any loss or damage arising from your failure to safeguard your account. You may not share, sell, or transfer your account or service slot to another party without prior written consent from Private Fire.`,
  },
  {
    id: 'ip',
    title: '8. Intellectual Property',
    content: `All content on the Private Fire platform, including text, graphics, logos, imagery, software, and data compilations, is the exclusive property of Private Fire or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, modify, or create derivative works of any content without express written permission. Limited personal, non-commercial use is permitted solely for evaluating our Services.`,
  },
  {
    id: 'liability',
    title: '9. Limitation of Liability',
    content: `To the maximum extent permitted by applicable law, Private Fire and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, property, or data. In no event shall Private Fire's total liability to you exceed the amount you paid for the Services in the 12 months preceding the claim.`,
  },
  {
    id: 'indemnification',
    title: '10. Indemnification',
    content: `You agree to indemnify, defend, and hold harmless Private Fire and its affiliates, officers, agents, and employees from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising out of or in any way connected with your access to or use of the Services, your violation of these Terms, or your infringement of any third-party rights.`,
  },
  {
    id: 'governing',
    title: '11. Governing Law',
    content: `These Terms and Conditions shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes arising under or related to these Terms shall be subject to the exclusive jurisdiction of the state and federal courts located in Los Angeles County, California.`,
  },
  {
    id: 'changes',
    title: '12. Changes to Terms',
    content: `Private Fire reserves the right to modify these Terms and Conditions at any time. We will provide notice of material changes by updating the "Last Updated" date at the top of this page and, where appropriate, by sending an email notification to registered users. Your continued use of the Services after changes take effect constitutes your acceptance of the revised Terms. We encourage you to review these Terms periodically.`,
  },
  {
    id: 'contact',
    title: '13. Contact Information',
    content: `If you have questions or concerns about these Terms and Conditions, please contact us:\n\nEmail: info@privatefire.com\nPhone: 818-414-1980\nMailing Address: Private Fire, Los Angeles, California`,
  },
]

export default function TermsPage() {
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
              Terms and{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                Conditions
              </span>
            </h1>
            <p className="text-gray-500 text-sm">Last Updated: January 1, 2026</p>
            <p className="text-gray-600 max-w-2xl mx-auto mt-3">
              Please read these terms carefully before using Private Fire services. By accessing our platform, you agree to be bound by these conditions.
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
                  Questions about these terms?{' '}
                  <Link href="/contact" className="text-orange-500 hover:text-orange-600 transition-colors font-medium">
                    Contact our team
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
