"use client";

import { CardsContext } from "@/app/(cards)/_components/CardsContext";
import { EditCardForm } from "@/app/(cards)/_components/EditCardForm";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/Dialog";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function EditCard() {
  const { editWordData } = useContext(CardsContext);
  const { back } = useRouter();

  if (!editWordData) return null;

  return (
    <Dialog
      defaultOpen
      onOpenChange={(open) => {
        if (!open) back();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit card</DialogTitle>
          <DialogDescription>Change the word&rsquo;s details</DialogDescription>
        </DialogHeader>
        <EditCardForm isModal wordData={editWordData} />
      </DialogContent>
    </Dialog>
  );
}
