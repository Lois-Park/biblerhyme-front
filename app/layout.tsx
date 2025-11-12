import type { Metadata } from "next";
import ThemeRegistry from '../theme/ThemeRegistry';

export const metadata: Metadata = {
  title: "BibleRhyme",
  description: "말씀이 리듬이 되다, BibleRhyme",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}