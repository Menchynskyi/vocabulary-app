import "@/styles/global.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/Sonner";
import { AuthProvider } from "@/components/AuthProvider";

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <AuthProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}

export const metadata = {
  title: "Vocabulary App",
  description: "Learn new words with this app",
  keywords: "vocabulary, words, learn",
};
