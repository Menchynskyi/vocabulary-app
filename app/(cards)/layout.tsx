"use client";

import { Header } from "@/components/Header";
import { CardsProvider } from "./components/CardsContext";

type CardsLayoutProps = {
  children: React.ReactNode;
};

export default function CardsLayout({ children }: CardsLayoutProps) {
  return (
    <CardsProvider>
      <Header />
      {children}
    </CardsProvider>
  );
}
