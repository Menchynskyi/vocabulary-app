import { Header } from "@/components/Header";
import { CommandMenu } from "@/components/CommandMenu";

type StatsLayoutProps = {
  children: React.ReactNode;
};

export default function StatsLayout({ children }: StatsLayoutProps) {
  return (
    <>
      <Header>
        <CommandMenu />
      </Header>
      <main className="my-12 flex justify-center max-sm:my-6">{children}</main>
    </>
  );
}
