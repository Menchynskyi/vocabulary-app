import { Header } from "@/components/Header";
import { Settings } from "./_components/Settings";
import { Suspense } from "react";
import { CommandMenu } from "./_components/CommandMenu";

type MatchUpLayoutProps = {
  children: React.ReactNode;
};

export default function MatchUpLayout({ children }: MatchUpLayoutProps) {
  return (
    <>
      <Header>
        <Suspense>
          <CommandMenu />
        <Settings />
        </Suspense>
      </Header>
      <main className="mt-16 flex justify-center sm:mt-36">{children}</main>
    </>
  );
}
