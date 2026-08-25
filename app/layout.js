import "./globals.css";

export const metadata = {
  title: {
    default: "Rabbit Bytes Creator Connect",
    template: "%s | Rabbit Bytes Creator Connect",
  },
  description:
    "Manage TikTok Shop creator outreach and affiliate collaboration workflows more efficiently.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
