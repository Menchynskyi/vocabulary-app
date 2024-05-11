import { Header } from "@/components/Header";
import { CommandMenu } from "./_components/CommandMenu";

type StatsLayoutProps = {
  children: React.ReactNode;
};

export default function StatsLayout({ children }: StatsLayoutProps) {
  return (
    <>
      <Header>
        <CommandMenu />
      </Header>
      <main className="mt-16 flex justify-center sm:mt-36">{children}</main>
    </>
  );
}
