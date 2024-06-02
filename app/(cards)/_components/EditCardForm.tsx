"use client";

import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { updateWord } from "@/server/notion/queries";
import { EditWordData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  word: z.string().min(1, "Word is required"),
  translation: z.string().max(100, "Translation is too long"),
  example: z.string().max(100, "Example is too long"),
  meaning: z.string().max(100, "Meaning is too long"),
});

type FormValues = z.infer<typeof formSchema>;

type EditCardFormProps = {
  isModal?: boolean;
  wordData: EditWordData;
};

export function EditCardForm({
  isModal,
  wordData: { word, translation, example, meaning, notionId },
}: EditCardFormProps) {
  const { back } = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      word,
      translation,
      example,
      meaning,
    },
  });

  const {
    formState: { isDirty, isSubmitting },
  } = form;

  const disabled = isSubmitting || !isDirty;

  const onSubmit = async (data: FormValues) => {
    const loadingToastId = toast.loading("Updating card...");
    try {
      await updateWord(notionId, {
        word: data.word !== word ? data.word : undefined,
        translation:
          data.translation !== translation ? data.translation : undefined,
        meaning: data.meaning !== meaning ? data.meaning : undefined,
        example: data.example !== example ? data.example : undefined,
      });

      toast.dismiss(loadingToastId);
      toast.success("Card successfully updated");

      if (isModal) {
        back();
        return;
      }

      form.reset({
        word: data.word,
        translation: data.translation,
        example: data.example,
        meaning: data.meaning,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Try again";
      toast.dismiss(loadingToastId);
      toast.error("Failed to update card", {
        description: message,
      });
      console.error(error);
    }
  };

  useEffect(() => {
    form.reset({
      word,
      translation,
      example,
      meaning,
    });
  }, [word, translation, example, meaning, form]);

  const handleCancel = () => {
    if (isModal) {
      back();
      return;
    }

    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="word"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Word</FormLabel>
              <FormControl>
                <Input autoFocus placeholder="Word..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="translation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Translation</FormLabel>
              <FormControl>
                <Input placeholder="Add translation..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="meaning"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meaning</FormLabel>
              <FormControl>
                <Input placeholder="Add meaning..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="example"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Example</FormLabel>
              <FormControl>
                <Input placeholder="Add example..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={handleCancel}
            disabled={isModal ? isSubmitting : disabled}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={disabled} className="w-full">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
