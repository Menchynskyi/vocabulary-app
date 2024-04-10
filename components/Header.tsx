import { CommandMenu } from "./CommandMenu";
import { Navigation } from "./Navigation";
import { ThemeToggleButton } from "./ThemeToggleButton";
import { GithubIcon } from "./icons/GithubIcon";
import { NotionIcon } from "./icons/NotionIcon";
import { buttonVariants } from "./ui/button";

export function Header() {
  return (
    <header className="flex w-full max-w-screen-2xl justify-between border-b px-4 py-2">
      <a
        href="https://www.notion.so/menchynskyi/Words-and-expressions-beab3c4d95a44f5fb55e49040ec2c314?pvs=4" // TODO: move to .env
        className={buttonVariants({ variant: "ghost", size: "icon" })}
        target="_blank"
        rel="noreferrer"
      >
        <NotionIcon className="h-[1.4rem] w-[1.4rem] transition-all" />
      </a>
      <Navigation />

      <div className="flex items-center">
        <CommandMenu />
        <a
          href="https://github.com/Menchynskyi/vocabulary-app" // TODO: move to .env
          className={buttonVariants({ variant: "ghost", size: "icon" })}
          target="_blank"
          rel="noreferrer"
        >
          <GithubIcon className="h-[1.2rem] w-[1.2rem]" />
        </a>
        <ThemeToggleButton />
      </div>
    </header>
  );
}
