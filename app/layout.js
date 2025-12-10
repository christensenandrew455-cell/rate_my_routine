import "./globals.css";

export const metadata = {
  title: "Rate My Routine",
  description: "Get AI-powered insights to optimize your day.",
};

export default function RootLayout({ children }) {
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

      <body className="bg-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}

