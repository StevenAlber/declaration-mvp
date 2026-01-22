import './globals.css';

export const metadata = {
  title: 'THE DECLARATION — A Civilizational Coordination Framework',
  description: 'A private registry of civilizational continuity. 2026–2126.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="header-inner">
            <a href="/" className="logo">The Declaration</a>
            <nav className="nav">
              <a href="#framework">Framework</a>
              <a href="#tiers">Coordination</a>
              <a href="#entry">Entry</a>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="footer">
          <p>THE DECLARATION — A Private Civilizational Coordination Framework — 2026–2126</p>
        </footer>
      </body>
    </html>
  );
}
