"use client";

import { Header } from "@/components/Header";
import { CardsProvider } from "./components/CardsContext";
import { CommandMenu } from "./components/CommandMenu";

type CardsLayoutProps = {
  children: React.ReactNode;
};

export default function CardsLayout({ children }: CardsLayoutProps) {
  return (
    <CardsProvider>
      <Header>
        <CommandMenu />
      </Header>
      {children}
    </CardsProvider>
  );
}
