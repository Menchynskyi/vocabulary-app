import { Header } from "@/components/Header";
import { CardsProvider } from "./_components/CardsContext";
import { CommandMenu } from "./_components/CommandMenu";
import { Settings } from "./_components/Settings";
import { Suspense } from "react";

type CardsLayoutProps = {
  children: React.ReactNode;
};

export default function CardsLayout({ children }: CardsLayoutProps) {
  return (
    <CardsProvider>
      <Header>
        <div>Test update</div>
        <Suspense>
          <CommandMenu />
        </Suspense>
        <Settings />
      </Header>
      <main className="mt-16 flex justify-center sm:mt-36">{children}</main>
    </CardsProvider>
  );
}
