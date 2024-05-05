import { cn } from "@/utils/tailwind";
import { Navigation } from "./Navigation";
import { ThemeToggleButton } from "./ThemeToggleButton";
import { GithubIcon } from "./icons/GithubIcon";
import { NotionIcon } from "./icons/NotionIcon";
import { buttonVariants } from "./ui/Button";
import { UserProfileButton } from "./UserProfileButton";

type HeaderProps = {
  children?: React.ReactNode;
};

export function Header({ children }: HeaderProps) {
  return (
    <header className="flex justify-center border-b px-4 py-2">
      <div className="flex w-full max-w-screen-2xl justify-between">
        <a
          aria-label="Notion page"
          href={process.env.NEXT_PUBLIC_NOTION_PAGE_URL}
          className={buttonVariants({ variant: "ghost", size: "icon" })}
          target="_blank"
          rel="noreferrer"
        >
          <NotionIcon className="h-[1.4rem] w-[1.4rem] transition-all" />
        </a>
        <Navigation />

        <div className="flex items-center">
          {children}
          <ThemeToggleButton />
          <a
            aria-label="GitHub repository"
            href="https://github.com/Menchynskyi/vocabulary-app"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "hidden sm:inline-flex",
            )}
            target="_blank"
            rel="noreferrer"
          >
            <GithubIcon className="h-[1.2rem] w-[1.2rem]" />
          </a>
        </div>
        <UserProfileButton />
      </div>
    </header>
  );
}
