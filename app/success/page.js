'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [declaration, setDeclaration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publicOptIn, setPublicOptIn] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [country, setCountry] = useState('');
  const [saved, setSaved] = useState(false);
  
  useEffect(() => {
    if (sessionId) {
      fetchDeclaration();
    } else {
      setLoading(false);
    }
  }, [sessionId]);
  
  async function fetchDeclaration() {
    try {
      const res = await fetch(`/api/declaration?session_id=${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setDeclaration(data);
        setDisplayName(data.displayName || '');
        setCountry(data.country || '');
        setPublicOptIn(data.publicOptIn || false);
      }
    } catch (error) {
      console.error('Failed to fetch declaration:', error);
    } finally {
      setLoading(false);
    }
  }
  
  async function handleSaveOptIn() {
    try {
      const res = await fetch('/api/declaration/optin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: declaration.id,
          publicOptIn,
          displayName: displayName || null,
          country: country || null
        })
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save opt-in:', error);
    }
  }
  
  function generateCertificateUrl() {
    if (!declaration) return '#';
    return `/api/certificate?id=${declaration.id}`;
  }
  
  if (loading) {
    return (
      <section className="section">
        <div className="container text-center">
          <p>Loading your declaration...</p>
        </div>
      </section>
    );
  }
  
  if (!declaration) {
    return (
      <section className="section">
        <div className="container">
          <div className="success-box">
            <div className="success-icon">✓</div>
            <h2>Declaration Recorded</h2>
            <p className="mt-3">
              Thank you for your participation in THE DECLARATION.
            </p>
            <p>
              Your commitment to civilizational continuity has been permanently recorded.
            </p>
            <div className="mt-4">
              <a href="/" className="btn-secondary">Return Home</a>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  const tierNames = {
    witness: 'Witness',
    steward: 'Steward',
    founder: 'Founder Witness'
  };
  
  return (
    <section className="section">
      <div className="container">
        <div className="success-box">
          <div className="success-icon">✓</div>
          <h2>Declaration Recorded</h2>
          
          <div className="success-id">
            {declaration.id}
          </div>
          
          <p>
            <strong>Tier:</strong> {tierNames[declaration.tier] || declaration.tier}
          </p>
          <p>
            <strong>Date:</strong> {new Date(declaration.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          
          <div className="mt-4">
            <a href={generateCertificateUrl()} className="btn-primary" target="_blank">
              Download Certificate
            </a>
          </div>
          
          <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />
          
          <h3>Public Registry (Optional)</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            You may choose to have your declaration appear in the public registry. 
            This is entirely optional and can be changed at any time.
          </p>
          
          <div className="form-group mt-3">
            <div className="form-checkbox">
              <input
                type="checkbox"
                id="publicOptIn"
                checked={publicOptIn}
                onChange={(e) => setPublicOptIn(e.target.checked)}
              />
              <label htmlFor="publicOptIn">
                Yes, list my declaration in the public registry
              </label>
            </div>
          </div>
          
          {publicOptIn && (
            <>
              <div className="form-group">
                <label className="form-label">Display Name (or pseudonym)</label>
                <input
                  type="text"
                  className="form-input"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="How you wish to appear in the registry"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Country (optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g., United States, Russia, Germany"
                />
              </div>
            </>
          )}
          
          <button onClick={handleSaveOptIn} className="btn-secondary">
            {saved ? 'Saved ✓' : 'Save Preferences'}
          </button>
          
          <div className="mt-4">
            <a href="/registry" className="btn-secondary">View Public Registry</a>
            <a href="/" className="btn-secondary">Return Home</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <section className="section">
        <div className="container text-center">
          <p>Loading...</p>
        </div>
      </section>
    }>
      <SuccessContent />
    </Suspense>
  );
}
