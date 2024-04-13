import { Header } from "@/components/Header";

type MatchupLayoutProps = {
  children: React.ReactNode;
};

export default function MatchupLayout({ children }: MatchupLayoutProps) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
