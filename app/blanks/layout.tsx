import { Header } from "@/components/Header";
import { CommandMenu } from "@/components/CommandMenu";
import { Settings } from "./_components/Settings";

type BlanksLayoutProps = {
  children: React.ReactNode;
};

export default function BlanksLayout({ children }: BlanksLayoutProps) {
  return (
    <>
      <Header>
        <CommandMenu showVoice showSettings />
        <Settings />
      </Header>
      <main className="mt-16 flex justify-center sm:mt-36">{children}</main>
    </>
  );
}
