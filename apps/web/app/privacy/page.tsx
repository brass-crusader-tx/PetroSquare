import { PageContainer, SectionHeader } from '@petrosquare/ui';

export default function PrivacyPage() {
  return (
    <PageContainer>
      <SectionHeader title="Privacy Policy" description="How we collect, use, and protect your data." />

      <div className="max-w-4xl mx-auto py-8 space-y-8 text-sm text-muted leading-relaxed">
        <section>
          <h3 className="text-white font-bold text-lg mb-4">1. Information We Collect</h3>
          <p>
            We collect the following types of information:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Account Information:</strong> Name, email address, and company affiliation.</li>
            <li><strong>Usage Data:</strong> Pages visited, features used, and API calls made.</li>
            <li><strong>Input Data:</strong> Operational data you upload or query through the Service.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-white font-bold text-lg mb-4">2. How We Use Your Data</h3>
          <p>
            We use your data to:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Provide, maintain, and improve the Service.</li>
            <li>Respond to your support requests and inquiries.</li>
            <li>Enforce our Terms of Use and comply with legal obligations.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-white font-bold text-lg mb-4">3. Data Storage & LocalStorage</h3>
          <p>
            The PetroSquare Platform uses your browser's LocalStorage to persist user preferences (e.g., UI layout, theme settings) and session tokens. This data remains on your device and is not transmitted to third parties.
          </p>
        </section>

        <section>
          <h3 className="text-white font-bold text-lg mb-4">4. Data Sharing & Security</h3>
          <p>
            We do not sell your personal data to third parties. We may share aggregated, anonymized data for industry analysis. We implement robust security measures to protect your data, including encryption at rest and in transit.
          </p>
        </section>

        <section>
          <h3 className="text-white font-bold text-lg mb-4">5. Analytics</h3>
          <p>
            We may use third-party analytics services (e.g., Google Analytics) to understand usage patterns and improve the user experience. These services may collect non-personally identifiable information.
          </p>
        </section>

        <section>
          <h3 className="text-white font-bold text-lg mb-4">6. Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy, please contact our Data Protection Officer at:
            <br/><br/>
            <span className="text-white font-mono">privacy@petrosquare.com</span>
          </p>
        </section>
      </div>
    </PageContainer>
  );
}
