import { Suspense } from "react";
import { Header } from "@/components/Header";
import { ContextCommandMenu } from "./_components/ContextCommandMenu";
import { Settings } from "./_components/Settings";

type ContextLayoutProps = {
  children: React.ReactNode;
};

export default function ContextLayout({ children }: ContextLayoutProps) {
  return (
    <>
      <Header>
        <Suspense>
          <ContextCommandMenu />
          <Settings />
        </Suspense>
      </Header>
      <main className="my-12 flex justify-center max-sm:my-6 max-sm:mb-12">
        {children}
      </main>
    </>
  );
}
