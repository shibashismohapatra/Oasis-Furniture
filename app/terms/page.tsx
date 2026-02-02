import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions - Oasis Furniture',
  description: 'Terms and conditions for Oasis Furniture showroom',
}

export default function TermsPage() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-brand-gold mb-8">
            Terms & Conditions
          </h1>

          <div className="prose prose-lg max-w-none text-neutral-700 space-y-6">
            <p className="text-sm text-neutral-500">
              Last updated: February 2, 2026
            </p>

            <section>
              <h2 className="text-2xl font-serif text-brand-gold mb-4">
                1. Showroom-Only Business
              </h2>
              <p>
                Oasis Furniture & Furnishings operates exclusively as a physical showroom in Bhubaneswar. This website serves as an informational resource and does not facilitate online purchases, payments, or product delivery through the website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-gold mb-4">
                2. Product Information
              </h2>
              <p>
                All product images, descriptions, and specifications on this website are for illustrative purposes only. Actual products may vary in:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Colors, fabrics, and finishes</li>
                <li>Dimensions and configurations</li>
                <li>Availability and pricing</li>
              </ul>
              <p className="mt-4">
                We recommend visiting our showroom to view products in person and discuss customization options with our design consultants.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-gold mb-4">
                3. Pricing and Availability
              </h2>
              <p>
                Prices are not displayed on this website. All pricing, discounts, and promotional offers are available only at our Bhubaneswar showroom and are subject to change without notice. Product availability may vary.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-gold mb-4">
                4. Purchases and Payments
              </h2>
              <p>
                All furniture purchases must be made in person at our showroom. We accept the following payment methods at the showroom:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cash</li>
                <li>Credit/Debit Cards</li>
                <li>UPI and Digital Wallets</li>
                <li>Bank Transfers (as applicable)</li>
              </ul>
              <p className="mt-4">
                No online payment processing is available through this website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-gold mb-4">
                5. Customization Services
              </h2>
              <p>
                We offer customization services for select furniture pieces. Custom orders:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Require advance payment as per showroom policy</li>
                <li>Have longer delivery timelines than stock items</li>
                <li>May not be eligible for returns or exchanges</li>
                <li>Are subject to specific terms discussed during consultation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-gold mb-4">
                6. Delivery and Installation
              </h2>
              <p>
                Delivery and installation services are available for Bhubaneswar and surrounding areas. Terms include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Delivery charges apply based on location</li>
                <li>Installation support is provided where applicable</li>
                <li>Delivery timelines are estimates and may vary</li>
                <li>Customer must ensure access and space availability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-gold mb-4">
                7. Returns and Exchanges
              </h2>
              <p>
                Returns and exchange policies are determined at the time of purchase and vary based on product type. Custom-made items are generally not eligible for return. Please discuss return terms with our showroom staff before completing your purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-gold mb-4">
                8. Warranty
              </h2>
              <p>
                Warranty terms vary by product and manufacturer. Warranty information will be provided at the time of purchase. Warranty typically covers manufacturing defects but not damage from misuse or normal wear and tear.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-gold mb-4">
                9. Intellectual Property
              </h2>
              <p>
                All content on this website, including images, text, logos, and design, is the property of Oasis Furniture & Furnishings and is protected by copyright laws. Unauthorized use is prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-gold mb-4">
                10. Limitation of Liability
              </h2>
              <p>
                Oasis Furniture & Furnishings is not liable for any indirect, incidental, or consequential damages arising from the use of this website or purchases made at our showroom, except as required by applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-gold mb-4">
                11. Contact Information
              </h2>
              <p>
                For questions about these terms or any aspect of our services:
              </p>
              <ul className="list-none space-y-2 mt-4">
                <li>Visit: Plot No. 123, Patia, Bhubaneswar, Odisha 751024</li>
                <li>Call: +91 98765 43210</li>
                <li>WhatsApp: +91 98765 43210</li>
                <li>Email: info@oasisfurniture.in</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-gold mb-4">
                12. Governing Law
              </h2>
              <p>
                These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Bhubaneswar, Odisha.
              </p>
            </section>
          </div>
        </div>
      </div>
    </section>
  )
}
