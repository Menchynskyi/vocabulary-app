import { Header } from "@/components/Header";
import { Settings } from "./_components/Settings";
import { Suspense } from "react";
import { MatchUpCommandMenu } from "./_components/MatchUpCommandMenu";

type MatchUpLayoutProps = {
  children: React.ReactNode;
};

export default function MatchUpLayout({ children }: MatchUpLayoutProps) {
  return (
    <>
      <Header>
        <Suspense>
          <MatchUpCommandMenu />
          <Settings />
        </Suspense>
      </Header>
      <main className="mt-10 flex justify-center lg:mt-36">{children}</main>
    </>
  );
}
