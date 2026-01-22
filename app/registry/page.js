import { getPublicDeclarations, getStats } from '../../lib/db';

export const dynamic = 'force-dynamic';

export default async function RegistryPage() {
  let declarations = [];
  let stats = { total: 0, public: 0 };
  
  try {
    declarations = getPublicDeclarations();
    stats = getStats();
  } catch (error) {
    console.error('Failed to load registry:', error);
  }
  
  const tierNames = {
    witness: 'Witness',
    steward: 'Steward',
    founder: 'Founder Witness'
  };
  
  return (
    <>
      <section className="section">
        <div className="container">
          <h1 className="text-center mb-2">Public Registry</h1>
          <p className="text-center hero-ru mb-4">Публичный реестр</p>
          
          <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto 2rem', color: 'var(--color-text-muted)' }}>
            Those who have chosen to make their declaration public. 
            Listing is entirely optional and can be withdrawn at any time.
          </p>
          
          <div className="stats mb-4">
            <div className="stat">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Declarations</div>
            </div>
            <div className="stat">
              <div className="stat-number">{stats.public}</div>
              <div className="stat-label">Public Listings</div>
            </div>
          </div>
          
          {declarations.length > 0 ? (
            <div className="registry-list">
              {declarations.map((d, index) => (
                <div key={index} className="registry-item">
                  <div>
                    <span className="registry-name">{d.displayName}</span>
                    {d.country && (
                      <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.5rem' }}>
                        — {d.country}
                      </span>
                    )}
                  </div>
                  <div className="registry-meta">
                    <span>{tierNames[d.tier] || d.tier}</span>
                    <span style={{ margin: '0 0.5rem' }}>•</span>
                    <span>{new Date(d.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="declaration-box text-center">
              <p>No public declarations yet.</p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>
                Be the first to make your declaration public.
              </p>
            </div>
          )}
          
          <div className="text-center mt-4">
            <a href="/#tiers" className="btn-primary">Make Your Declaration</a>
          </div>
        </div>
      </section>
    </>
  );
}
