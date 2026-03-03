import { Header } from "@/components/Header";
import { CardsProvider } from "./_components/CardsContext";
import { CardsCommandMenu } from "./_components/CardsCommandMenu";
import { Settings } from "./_components/Settings";
import { Suspense } from "react";
import { CardsSkeleton } from "./_components/CardsSkeleton";

type CardsLayoutProps = {
  children: React.ReactNode;
  editCardModal: React.ReactNode;
};

export default function CardsLayout({
  children,
  editCardModal,
}: CardsLayoutProps) {
  return (
    <CardsProvider>
      <Header>
        <Suspense>
          <CardsCommandMenu />
        </Suspense>
        <Settings />
      </Header>
      <main className="flex justify-center">
        <Suspense fallback={<CardsSkeleton />}>{children}</Suspense>
        {editCardModal}
      </main>
    </CardsProvider>
  );
}
