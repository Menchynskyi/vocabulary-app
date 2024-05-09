import { cn } from "@/utils/tailwind";
import { ClerkProvider } from "@clerk/nextjs";
import { NextClerkProviderProps } from "@clerk/nextjs/dist/types/types";
import { cva } from "class-variance-authority";

const clerkButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 !shadow-none !focus:shadow-none",
  {
    variants: {
      variant: {
        default: "bg-primary !text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive !text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent !hover:text-accent-foreground",
        secondary:
          "bg-secondary !text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "!text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export function AuthProvider({ children, ...props }: NextClerkProviderProps) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          rootBox: "rounded-md border overflow-hidden",
          cardBox: "rounded-none",
          card: "bg-background text-foreground shadow-none border-b rounded-none border-muted",
          headerTitle: "text-foreground",
          headerSubtitle: "text-muted-foreground",
          modalCloseButton:
            "text-foreground hover:text-muted-foreground opacity-70 hover:opacity-100 !shadow-none transition-opacity !focus-shadow-none hover:bg-background [&>svg]:h-2.5 [&>svg]:w-2.5",
          footer: "[&>*:last-child]:hidden bg-background bg-none",
          footerActionText: "text-muted-foreground",
          footerActionLink: "text-foreground hover:text-primary",
          socialButtonsProviderIcon__github: "dark:invert",
          modalBackdrop: "bg-black bg-opacity-80 overflow-hidden",
          userButtonTrigger:
            "!focus:outline-none !shadow-none !focus:shadow-none mx-auto",
          userButtonPopoverFooter: "hidden",
          userButtonPopoverActions: "border-0",
          userButtonPopoverCard:
            "border border-muted rounded-md box-shadow-none !top-[53px] w-auto min-w-40 shadow-md",
          userButtonPopoverMain:
            "bg-background shadow-none text-foreground p-1",
          userButtonPopoverActionButton:
            "text-foreground py-1.5 px-2 rounded-sm transition-colors hover:bg-muted hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-sm font-normal cursor-default",
          userButtonPopoverActionButton__signOut:
            "text-foreground p-0 py-1.5 px-2 rounded-sm transition-colors hover:bg-muted hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-sm !border-t-0 font-normal cursor-default",
          userPreview: "hidden",
          userButtonPopoverActionButtonIconBox: "hidden",
          navbar:
            "md:[&>*:last-child]:hidden *:text-foreground bg-background bg-none text-foreground border-r border-muted mr-0 rounded-none max-md:w-[12rem] max-md:px-2",
          navbarButtons: "gap-0",
          navbarButton:
            "[&.cl-active]:bg-background sm:hover:[&.cl-active]:bg-muted sm:hover:bg-muted text-foreground max-md:[&.cl-active]:bg-muted",
          scrollBox: "bg-background shadow-none rounded-none",
          pageScrollBox: "!max-h-[calc(100vh-8rem)]",
          profileSection__danger: "pb-14",
          navbarMobileMenuRow: "bg-none bg-background border-b border-red-500",
          navbarMobileMenuButton:
            "text-foreground !focus:shadow-none !shadow-none hover:text-foreground",
          profileSectionTitleText: "text-foreground",
          badge:
            "bg-background text-foreground border border-muted !outline-none !shadow-none",
          menuButton:
            "[&>*]:text-foreground text-foreground focus:text-foreground/60 !focus:shadow-none !shadow-none hover:bg-background",
          actionCard:
            "bg-background border border-muted rounded-md shadow-none",
          profileSection: "border-muted",
          formFieldLabel: "text-foreground",
          formFieldInput__deleteConfirmation:
            "text-foreground bg-background outline-none mt-1 !shadow-none !border border-muted focus:border-muted !focus-within:shadow-none hover:border-foreground focus:border-foreground foucs-within:border-foreground",
          menuItem:
            "text-foreground bg-background hover:bg-muted rounded-md hover:text-foreground focus:text-foreground",
          menuList: "bg-background border border-muted rounded-md !shadow-md",
          providerIcon__google: "!invert-0",
          providerIcon__github: "dark:invert",

          socialButtonsBlockButton: clerkButtonVariants({
            variant: "secondary",
          }),
          profileSectionPrimaryButton__profile: clerkButtonVariants({
            variant: "secondary",
          }),
          profileSectionPrimaryButton__danger: clerkButtonVariants({
            variant: "destructive",
          }),
          avatarImageActionsUpload: cn(
            clerkButtonVariants({
              variant: "secondary",
            }),
            "!hover:bg-secondary/80",
          ),
          button__danger: clerkButtonVariants({
            variant: "destructive",
          }),
          avatarImageActionsRemove: clerkButtonVariants({
            variant: "destructive",
          }),
          formButtonReset: cn(
            clerkButtonVariants({ variant: "ghost" }),
            "text-foreground hover:text-foreground hover:bg-muted",
          ),

          formButtonPrimary: clerkButtonVariants(),
        },
      }}
      {...props}
    >
      {children}
    </ClerkProvider>
  );
}
