import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — PowerDoc',
  description: 'PowerDoc privacy policy — how we handle your data and protect your privacy.',
};

const LAST_UPDATED = '13 May 2025';
const COMPANY = 'PowerDoc';
const CONTACT_EMAIL = 'privacy@powerdoc.io';

export default function PrivacyPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-10 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="prose prose-slate max-w-none space-y-8 text-slate-700 text-[15px] leading-relaxed">

        <Section title="1. Introduction">
          <p>
            Welcome to <strong>{COMPANY}</strong> ("we", "our", or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our document processing services.
          </p>
          <p>
            By using our services, you agree to the terms of this Privacy Policy. If you do not agree, please discontinue use of our website immediately.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <SubHeading>2.1 Information You Provide</SubHeading>
          <p>
            <strong>{COMPANY} does not require account registration.</strong> We do not collect your name, email address, or any other personal identifiers in order to use our tools.
          </p>

          <SubHeading>2.2 Files and Documents</SubHeading>
          <p>
            <strong>Your documents are processed entirely within your browser.</strong> When you upload a file to our editor or converter, it is loaded into your browser&apos;s memory (RAM) and processed locally using client-side JavaScript. Files are <strong>never transmitted to our servers</strong>, stored on our infrastructure, or shared with any third party.
          </p>
          <p>
            Once you close the browser tab or navigate away, all file data is cleared from memory. We have no access to your documents at any time.
          </p>

          <SubHeading>2.3 Automatically Collected Information</SubHeading>
          <p>When you visit our website, we may automatically collect certain technical information, including:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>IP address (anonymised)</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Referring URL</li>
            <li>Pages visited and time spent</li>
            <li>Device type (desktop, mobile, tablet)</li>
          </ul>
          <p>This data is collected via analytics tools (such as Google Analytics) in aggregated, anonymised form and is used solely to improve our service. It cannot be used to identify you personally.</p>

          <SubHeading>2.4 Cookies and Tracking</SubHeading>
          <p>
            We use essential cookies required for the website to function (e.g. session management). We may also use non-essential cookies for analytics and advertising. You can manage your cookie preferences through your browser settings. See our <a href="#cookies" className="text-blue-600 underline">Cookie Policy</a> below.
          </p>
        </Section>

        <Section title="3. Your Data — Your Responsibility">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <p className="font-semibold text-amber-800 mb-2">Important Notice</p>
            <p className="text-amber-700">
              You are solely responsible for the documents and data you choose to process using our service. You must ensure that you have the legal right to process any documents you upload, including appropriate permissions from data subjects if the documents contain personal information about third parties.
            </p>
            <p className="text-amber-700 mt-2">
              <strong>{COMPANY} accepts no liability whatsoever</strong> for the content, legality, accuracy, or suitability of any documents you process through our service. We are not a data processor or data controller in relation to your document content.
            </p>
          </div>
        </Section>

        <Section title="4. How We Use Information">
          <p>We use the automatically collected technical information to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Operate, maintain, and improve our website</li>
            <li>Monitor usage patterns to detect abuse or security issues</li>
            <li>Compile anonymous, aggregate statistics</li>
            <li>Display relevant advertising through third-party ad networks</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p>We do not sell, rent, or trade your personal information to third parties for marketing purposes.</p>
        </Section>

        <Section title="5. Advertising">
          <p>
            Our website is supported by advertising. We work with third-party advertising partners, which may include Google AdSense and similar ad networks. These partners may use cookies and web beacons to serve ads based on your browsing activity across websites.
          </p>
          <p>
            We do not control or have access to the data collected by advertising partners. Their use of your data is governed by their own privacy policies. You can opt out of interest-based advertising through:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><a href="https://adssettings.google.com" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a></li>
            <li><a href="https://optout.aboutads.info" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance Opt-Out</a></li>
          </ul>
        </Section>

        <Section title="6. Data Sharing and Disclosure">
          <p>We do not sell or share your personal data except in the following limited circumstances:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Service providers:</strong> We may share anonymised analytics data with analytics platforms (e.g. Google Analytics).</li>
            <li><strong>Legal requirements:</strong> We may disclose information if required by law, court order, or governmental authority.</li>
            <li><strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of assets, user data may be transferred as part of that transaction, subject to the same privacy protections.</li>
            <li><strong>Protection of rights:</strong> We may disclose information to protect the rights, property, or safety of {COMPANY}, our users, or others.</li>
          </ul>
        </Section>

        <Section title="7. Data Retention">
          <p>
            Since we do not store document files, there is no document data to retain or delete.
          </p>
          <p>
            Anonymised analytics data may be retained for up to 26 months in line with standard analytics platform practices. This data cannot be used to identify you individually.
          </p>
          <p>
            Any admin settings stored in your browser (via localStorage) remain on your device only and are not accessible to us. You can clear them at any time through your browser settings.
          </p>
        </Section>

        <Section title="8. International Data Transfers">
          <p>
            Our website may be accessed from anywhere in the world. Anonymised analytics data may be processed in countries outside your own jurisdiction, including the United States, which may have different data protection laws than your country.
          </p>
          <p>
            Where applicable (e.g. EU/EEA residents), any such transfers are conducted under appropriate safeguards such as Standard Contractual Clauses.
          </p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>
            Our services are not directed to children under the age of 13 (or 16 in the EU). We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately at <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 underline">{CONTACT_EMAIL}</a>.
          </p>
        </Section>

        <Section title="10. Your Rights">
          <p>Depending on your jurisdiction, you may have the following rights:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Right of access:</strong> Request a copy of the personal data we hold about you.</li>
            <li><strong>Right to rectification:</strong> Request correction of inaccurate data.</li>
            <li><strong>Right to erasure:</strong> Request deletion of your personal data.</li>
            <li><strong>Right to restriction:</strong> Request that we limit the processing of your data.</li>
            <li><strong>Right to data portability:</strong> Receive your data in a machine-readable format.</li>
            <li><strong>Right to object:</strong> Object to processing based on legitimate interests or direct marketing.</li>
            <li><strong>Rights related to automated decision-making:</strong> We do not conduct automated profiling or decision-making.</li>
          </ul>
          <p>To exercise these rights, contact us at <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 underline">{CONTACT_EMAIL}</a>. We will respond within 30 days.</p>
        </Section>

        <Section title="11. Security">
          <p>
            We implement commercially reasonable technical and organisational security measures to protect our website infrastructure. However, since we do not store your documents, the risk of document data exposure is minimised.
          </p>
          <p>
            No method of transmission over the Internet or method of electronic storage is 100% secure. You use our service at your own risk.
          </p>
        </Section>

        <Section title="12. Cookie Policy" id="cookies">
          <p>We use the following types of cookies:</p>
          <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-3 py-2 border-b border-slate-200 font-semibold text-slate-700">Type</th>
                <th className="text-left px-3 py-2 border-b border-slate-200 font-semibold text-slate-700">Purpose</th>
                <th className="text-left px-3 py-2 border-b border-slate-200 font-semibold text-slate-700">Mandatory?</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Essential', 'Session management, security', 'Yes'],
                ['Analytics', 'Aggregate usage statistics (Google Analytics)', 'No'],
                ['Advertising', 'Interest-based ad personalisation', 'No'],
                ['Preferences', 'Admin settings (localStorage)', 'No'],
              ].map(([type, purpose, mandatory]) => (
                <tr key={type} className="border-b border-slate-100 last:border-0">
                  <td className="px-3 py-2 font-medium">{type}</td>
                  <td className="px-3 py-2 text-slate-500">{purpose}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${mandatory === 'Yes' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                      {mandatory}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3">You may disable non-essential cookies via your browser settings. Disabling essential cookies may affect site functionality.</p>
        </Section>

        <Section title="13. Third-Party Links">
          <p>
            Our website may contain links to third-party websites. We are not responsible for the privacy practices of those websites. We encourage you to review the privacy policy of any third-party site you visit.
          </p>
        </Section>

        <Section title="14. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We will post the updated policy on this page with a revised "Last updated" date. Your continued use of our services after the changes take effect constitutes your acceptance of the new policy.
          </p>
        </Section>

        <Section title="15. Contact Us">
          <p>If you have questions or concerns about this Privacy Policy, please contact us:</p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-3">
            <p className="font-semibold text-slate-800">{COMPANY}</p>
            <p className="text-sm mt-1">Email: <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 underline">{CONTACT_EMAIL}</a></p>
          </div>
        </Section>
      </div>
    </article>
  );
}

function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id}>
      <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="font-semibold text-slate-800 mt-4 mb-1">{children}</h3>;
}
