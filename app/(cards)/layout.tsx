"use client";

import { Header } from "@/components/Header";
import { CardsProvider } from "./_components/CardsContext";
import { CommandMenu } from "./_components/CommandMenu";
import { Settings } from "./_components/Settings";

type CardsLayoutProps = {
  children: React.ReactNode;
};

export default function CardsLayout({ children }: CardsLayoutProps) {
  return (
    <CardsProvider>
      <Header>
        <CommandMenu />
        <Settings />
      </Header>
      {children}
    </CardsProvider>
  );
}
