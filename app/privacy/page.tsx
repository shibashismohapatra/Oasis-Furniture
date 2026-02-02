import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Oasis Furniture',
  description: 'Privacy policy for Oasis Furniture showroom',
}

export default function PrivacyPage() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-brand-gold mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-lg max-w-none text-neutral-700 space-y-6">
            <p className="text-sm text-neutral-500">
              Last updated: February 2, 2026
            </p>

            <section>
              <h2 className="text-2xl font-serif text-brand-gold mb-4">
                Information We Collect
              </h2>
              <p>
                Oasis Furniture & Furnishings operates as a showroom-only business in Bhubaneswar. We do not process online payments or maintain user accounts. The information we collect is limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contact information provided when you reach out to us via phone, email, or WhatsApp</li>
                <li>Information shared during in-person consultations at our showroom</li>
                <li>Basic website analytics (page views, device type) through standard web technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-gold mb-4">
                How We Use Your Information
              </h2>
              <p>
                We use the information collected to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Respond to your inquiries about our furniture collections</li>
                <li>Provide design consultation and customization services</li>
                <li>Schedule showroom visits and appointments</li>
                <li>Process offline furniture purchases made at our showroom</li>
                <li>Coordinate delivery and installation services</li>
                <li>Send updates about new collections or showroom offers (only if you opt-in)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-gold mb-4">
                Data Sharing
              </h2>
              <p>
                We do not sell or rent your personal information to third parties. Information may be shared only with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Delivery and installation service providers for order fulfillment</li>
                <li>Legal authorities if required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-gold mb-4">
                No Online Payments
              </h2>
              <p>
                This website is for informational purposes only. We do not process online payments, store payment card information, or maintain shopping carts. All purchases are handled in person at our Bhubaneswar showroom.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-gold mb-4">
                Cookies and Analytics
              </h2>
              <p>
                Our website uses standard web analytics to understand visitor behavior and improve user experience. These analytics tools may use cookies to collect anonymous data about page visits and navigation patterns.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-gold mb-4">
                Your Rights
              </h2>
              <p>
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Request access to information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information (subject to legal requirements)</li>
                <li>Opt out of marketing communications at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-gold mb-4">
                Contact Us
              </h2>
              <p>
                For privacy-related questions or to exercise your rights, please contact us:
              </p>
              <ul className="list-none space-y-2 mt-4">
                <li>Email: info@oasisfurniture.in</li>
                <li>Phone: +91 98765 43210</li>
                <li>Address: Plot No. 123, Patia, Bhubaneswar, Odisha 751024</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-gold mb-4">
                Updates to This Policy
              </h2>
              <p>
                We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date.
              </p>
            </section>
          </div>
        </div>
      </div>
    </section>
  )
}
