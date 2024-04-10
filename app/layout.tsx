import "@/styles/global.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <body>
          {children}
          <Toaster />
        </body>
      </ThemeProvider>
    </html>
  );
}

export const metadata = {
  title: "Vocabulary App",
  description: "Learn new words with this app",
  keywords: "vocabulary, words, learn",
};
