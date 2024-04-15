import { Header } from "@/components/Header";
import { CommandMenu } from "./_components/CommandMenu";

type MatchupLayoutProps = {
  children: React.ReactNode;
};

export default function MatchupLayout({ children }: MatchupLayoutProps) {
  return (
    <>
      <Header>
        <CommandMenu />
      </Header>
      {children}
    </>
  );
}
