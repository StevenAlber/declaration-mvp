export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="mb-4">Privacy Policy</h1>
        
        <h2>Overview</h2>
        <p>
          THE DECLARATION / НАСЛЕДИЕ is committed to protecting participant privacy. 
          This policy explains what data we collect, how we use it, and your rights.
        </p>
        
        <h2>Data We Collect</h2>
        <p>When you make a declaration, we collect:</p>
        <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
          <li>Email address (for receipt and certificate delivery)</li>
          <li>Display name (optional, only if you choose to appear in public registry)</li>
          <li>Country (optional)</li>
          <li>Participation tier and date</li>
          <li>Payment information (processed securely by Stripe; we do not store card details)</li>
        </ul>
        
        <h2>How We Use Your Data</h2>
        <p>Your data is used exclusively for:</p>
        <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
          <li>Maintaining the civilizational registry</li>
          <li>Delivering your certificate and any tier-specific communications</li>
          <li>Public listing (only with your explicit opt-in consent)</li>
        </ul>
        
        <h2>What We Do NOT Do</h2>
        <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
          <li>We do not share your data with governments</li>
          <li>We do not share your data with corporations or advertisers</li>
          <li>We do not sell your data to any third party</li>
          <li>We do not use your data for marketing without consent</li>
          <li>We do not track your activity beyond the registry itself</li>
        </ul>
        
        <h2>Public Registry</h2>
        <p>
          By default, your declaration is private. You may choose to opt-in to the public 
          registry, which displays only your chosen display name (or pseudonym), country 
          (if provided), tier, and declaration date. You may opt-out at any time.
        </p>
        
        <h2>Data Security</h2>
        <p>
          Your data is encrypted and stored securely. We use industry-standard security 
          measures to protect against unauthorized access.
        </p>
        
        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
          <li>Access your data</li>
          <li>Correct inaccurate data</li>
          <li>Withdraw from the public registry at any time</li>
          <li>Request complete deletion of your data (30-day notice)</li>
        </ul>
        
        <h2>Data Retention</h2>
        <p>
          Registry records are maintained permanently as historical documentation of 
          civilizational declarations. If you request deletion, your record will be 
          removed within 30 days.
        </p>
        
        <h2>Contact</h2>
        <p>
          For privacy-related inquiries, contact us at privacy@[domain].
        </p>
        
        <p style={{ marginTop: '2rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Last updated: January 2026
        </p>
      </div>
    </section>
  );
}
