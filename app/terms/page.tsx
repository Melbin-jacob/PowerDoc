import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — PowerDoc',
  description: 'PowerDoc terms of service — rules governing your use of our document tools.',
};

const LAST_UPDATED = '13 May 2025';
const COMPANY = 'PowerDoc';
const CONTACT_EMAIL = 'legal@powerdoc.io';

export default function TermsPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-10 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
        <p className="font-semibold text-amber-800 mb-1">Please read carefully</p>
        <p className="text-sm text-amber-700">
          By accessing or using {COMPANY}, you agree to be bound by these Terms of Service. If you do not agree, you must stop using the service immediately.
        </p>
      </div>

      <div className="space-y-8 text-slate-700 text-[15px] leading-relaxed">

        <Section title="1. Acceptance of Terms">
          <p>
            These Terms of Service ("Terms") constitute a legally binding agreement between you and <strong>{COMPANY}</strong> ("we", "our", "us") governing your access to and use of the {COMPANY} website and all associated tools and services (collectively, the "Service").
          </p>
          <p>
            By using the Service, you confirm that you are at least 18 years old (or the age of digital majority in your jurisdiction), that you have read and understood these Terms, and that you agree to be bound by them.
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p>
            {COMPANY} provides browser-based tools for editing, converting, merging, splitting, compressing, and otherwise processing PDF and document files ("Document Tools"). All processing occurs locally in your browser. We do not upload, store, or retain your documents on our servers.
          </p>
          <p>
            The Service is provided free of charge and is supported by advertising revenue.
          </p>
        </Section>

        <Section title="3. User Responsibilities and Acceptable Use">
          <p>You agree to use the Service only for lawful purposes. You must not use the Service to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Process, edit, or distribute documents that infringe any intellectual property rights, including copyright, trademarks, or trade secrets</li>
            <li>Process documents containing illegal content, including but not limited to child sexual abuse material (CSAM), content inciting violence, or content related to terrorism</li>
            <li>Attempt to circumvent, disable, or interfere with the security features of the Service</li>
            <li>Use automated tools, scripts, or bots to access the Service in a manner that places unreasonable load on our infrastructure</li>
            <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
            <li>Use the Service for any commercial purpose that competes with or harms {COMPANY}</li>
            <li>Misrepresent your identity or impersonate any person or entity</li>
          </ul>
        </Section>

        <Section title="4. Intellectual Property">
          <SubHeading>4.1 Your Documents</SubHeading>
          <p>
            You retain full ownership of all documents and content you process using the Service. {COMPANY} does not claim any intellectual property rights over your documents. Because files are processed locally and never transmitted to us, we have no access to your content.
          </p>

          <SubHeading>4.2 Our Platform</SubHeading>
          <p>
            The {COMPANY} website, including its design, code, logos, text, and other content, is the property of {COMPANY} and is protected by copyright, trademark, and other intellectual property laws. You may not copy, reproduce, modify, or distribute any part of our platform without our express written permission.
          </p>
        </Section>

        <Section title="5. Disclaimer of Warranties" id="disclaimer">
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <p className="font-semibold text-red-800 mb-2">No Warranties</p>
            <p className="text-red-700 uppercase text-sm font-medium mb-2">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
            </p>
            <p className="text-red-700 text-sm">
              TO THE FULLEST EXTENT PERMITTED BY LAW, {COMPANY.toUpperCase()} EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2 text-sm text-red-700">
              <li>WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT</li>
              <li>THAT THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE</li>
              <li>THAT THE RESULTS OBTAINED FROM THE SERVICE WILL BE ACCURATE OR RELIABLE</li>
              <li>THAT ANY ERRORS IN THE SERVICE WILL BE CORRECTED</li>
            </ul>
          </div>
        </Section>

        <Section title="6. Limitation of Liability">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <p className="text-slate-800 font-semibold mb-2">Important: Liability Cap</p>
            <p className="text-slate-700">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL {COMPANY.toUpperCase()}, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES, BE LIABLE FOR ANY:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2 text-slate-600 text-sm">
              <li>INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES</li>
              <li>LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR BUSINESS OPPORTUNITY</li>
              <li>DAMAGE TO OR LOSS OF DOCUMENTS, FILES, OR DATA</li>
              <li>COST OF SUBSTITUTE SERVICES</li>
              <li>ANY OTHER INTANGIBLE LOSSES</li>
            </ul>
            <p className="text-slate-600 mt-3 text-sm">
              WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STATUTE, OR ANY OTHER LEGAL THEORY, EVEN IF {COMPANY.toUpperCase()} HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
            </p>
          </div>
          <p className="mt-4">
            Our total aggregate liability to you for any claims arising out of or relating to these Terms or the Service shall not exceed <strong>USD $10</strong>.
          </p>
        </Section>

        <Section title="7. Customer Data Responsibility">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="font-semibold text-blue-800 mb-2">You are responsible for your data</p>
            <p className="text-blue-700 text-sm">
              <strong>You are solely and exclusively responsible for all documents, data, and content that you process using the Service.</strong> This includes ensuring that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2 text-sm text-blue-700">
              <li>You have the legal right to process the documents (e.g. you own them or have obtained proper authorisation)</li>
              <li>Processing the documents does not violate any applicable law, regulation, or third-party rights</li>
              <li>If the documents contain personal data of third parties, you have complied with all applicable data protection laws (including GDPR, CCPA, or other applicable regulations)</li>
              <li>You have taken appropriate measures to secure your device and network before processing sensitive documents</li>
              <li>You have maintained adequate backups of your original documents before using our tools</li>
            </ul>
            <p className="text-blue-700 mt-3 text-sm font-medium">
              {COMPANY} is not liable for any loss, corruption, or exposure of your documents or data arising from your use of the Service.
            </p>
          </div>
        </Section>

        <Section title="8. Indemnification">
          <p>
            You agree to defend, indemnify, and hold harmless {COMPANY} and its officers, directors, employees, contractors, agents, licensors, service providers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable legal fees) arising out of or relating to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your violation of these Terms</li>
            <li>Your use of the Service</li>
            <li>Any documents or content you process through the Service</li>
            <li>Your violation of any third-party right, including intellectual property or privacy rights</li>
            <li>Your violation of any applicable law or regulation</li>
          </ul>
        </Section>

        <Section title="9. Advertising">
          <p>
            The Service is free and is supported by third-party advertising. Some downloads may require you to view an advertisement for a brief period (typically 30 seconds) before proceeding. By using the Service, you acknowledge and accept this model.
          </p>
          <p>
            We are not responsible for the content of third-party advertisements displayed on or through the Service. Clicking on advertisements is at your own risk.
          </p>
        </Section>

        <Section title="10. Privacy">
          <p>
            Your use of the Service is also governed by our <a href="/privacy" className="text-blue-600 underline">Privacy Policy</a>, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices.
          </p>
        </Section>

        <Section title="11. Modifications to the Service">
          <p>
            We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time, with or without notice, for any reason including scheduled maintenance. We will not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.
          </p>
        </Section>

        <Section title="12. Modifications to Terms">
          <p>
            We reserve the right to revise these Terms at any time. We will notify you of material changes by updating the "Last updated" date at the top of this page. Your continued use of the Service after any changes constitutes your acceptance of the new Terms.
          </p>
        </Section>

        <Section title="13. Governing Law and Jurisdiction">
          <p>
            These Terms shall be governed by and construed in accordance with the laws of England and Wales, without regard to conflict of law principles. You agree to submit to the exclusive jurisdiction of the courts located in England and Wales to resolve any dispute arising from these Terms or the Service.
          </p>
          <p>
            If you are a consumer located in the EU, you may also have access to the EU Online Dispute Resolution platform at <a href="https://ec.europa.eu/consumers/odr" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a>.
          </p>
        </Section>

        <Section title="14. Severability">
          <p>
            If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect.
          </p>
        </Section>

        <Section title="15. Entire Agreement">
          <p>
            These Terms, together with our Privacy Policy, constitute the entire agreement between you and {COMPANY} regarding the Service and supersede all prior agreements, representations, and understandings.
          </p>
        </Section>

        <Section title="16. Contact Us">
          <p>If you have questions about these Terms, please contact:</p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-3">
            <p className="font-semibold text-slate-800">{COMPANY} Legal</p>
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
