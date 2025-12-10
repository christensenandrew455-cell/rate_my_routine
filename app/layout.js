import "./globals.css";

export const metadata = {
  title: "Rate My Routine",
  description: "Get AI-powered insights to optimize your day.",
};

export default function RootLayout({ children }) {
  const footerStyle = {
    width: '100%',
    padding: '20px 0',
    textAlign: 'center',
    backgroundColor: '#f8f8f8',
    borderTop: '1px solid #eaeaea',
    position: 'relative',
    bottom: 0,
  };

  const linkStyle = {
    textDecoration: 'underline',
    color: '#0070f3',
    cursor: 'pointer',
  };

  return (
    <html lang="en">
      <head>
        {/* Ezoic CMP Scripts */}
        <script src="https://cmp.gatekeeperconsent.com/min.js" data-cfasync="false"></script>
        <script src="https://the.gatekeeperconsent.com/cmp.min.js" data-cfasync="false"></script>

        {/* Ezoic Standalone Loader */}
        <script async src="//www.ezojs.com/ezoic/sa.min.js"></script>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.ezstandalone = window.ezstandalone || {};
              ezstandalone.cmd = ezstandalone.cmd || [];
            `,
          }}
        />
      </head>

      <body className="bg-gray-100 min-h-screen" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <main style={{ flex: '1' }}>{children}</main>

        <footer style={footerStyle}>
          <a href="/privacy" style={linkStyle}>Privacy Policy</a>
        </footer>
      </body>
    </html>
  );
}
