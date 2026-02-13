import { PageContainer, SectionHeader } from '@petrosquare/ui';

export default function TermsPage() {
  return (
    <PageContainer>
      <SectionHeader title="Terms of Use" description="Legal agreement governing the use of the PetroSquare Platform." />

      <div className="max-w-4xl mx-auto py-8 space-y-8 text-sm text-muted leading-relaxed">
        <section>
          <h3 className="text-white font-bold text-lg mb-4">1. Acceptance of Terms</h3>
          <p>
            By accessing and using the PetroSquare Platform ("Service"), you agree to comply with and be bound by these Terms of Use. If you do not agree to these terms, please do not use the Service.
          </p>
        </section>

        <section>
          <h3 className="text-white font-bold text-lg mb-4">2. Permitted Use</h3>
          <p>
            You are granted a limited, non-exclusive, non-transferable license to access and use the Service for internal business purposes related to oil and gas operations, analysis, and management. You may not:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Reverse engineer, decompile, or disassemble any aspect of the Service.</li>
            <li>Use the Service to build a competitive product.</li>
            <li>Share your access credentials with unauthorized third parties.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-white font-bold text-lg mb-4">3. No Investment Advice</h3>
          <p>
            The data, analytics, and insights provided by PetroSquare are for informational and operational purposes only. <strong>Nothing in this Service constitutes financial, investment, legal, or tax advice.</strong> You are solely responsible for your investment decisions.
          </p>
        </section>

        <section>
          <h3 className="text-white font-bold text-lg mb-4">4. Disclaimer of Warranties</h3>
          <p>
            The Service is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. PetroSquare does not warrant that the data is accurate, complete, or up-to-date.
          </p>
        </section>

        <section>
          <h3 className="text-white font-bold text-lg mb-4">5. Limitation of Liability</h3>
          <p>
            In no event shall PetroSquare be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of or in connection with your use of the Service.
          </p>
        </section>

        <section>
          <h3 className="text-white font-bold text-lg mb-4">6. Modifications</h3>
          <p>
            We reserve the right to modify or discontinue the Service at any time without notice. We may also update these Terms of Use from time to time. Your continued use of the Service constitutes acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h3 className="text-white font-bold text-lg mb-4">7. Governing Law</h3>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State of Texas, without regard to its conflict of law provisions.
          </p>
        </section>
      </div>
    </PageContainer>
  );
}
