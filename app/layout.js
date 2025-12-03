import "./globals.css";

export const metadata = {
  title: "Rate My Routine",
  description: "Get AI-powered insights to optimize your day.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9836120352832422"
          crossOrigin="anonymous"
        ></script>
      </head>

      <body className="bg-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
