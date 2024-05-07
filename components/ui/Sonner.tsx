"use client";

import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast: "!bg-background !text-foreground !border-border !shadow-lg",
          description: "!text-muted-foreground",
          actionButton: "!bg-primary !text-primary-foreground",
          cancelButton: "!bg-muted !text-muted-foreground",
        },
      }}
      icons={{
        loading: <Loader2 className="h-4 w-4 animate-spin" />,
      }}
      {...props}
    />
  );
};

export { Toaster };
