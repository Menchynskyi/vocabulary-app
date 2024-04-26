import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/utils/tailwind";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[100vh] w-full flex-col items-center justify-center sm:flex-row">
      <div className="flex-col items-center justify-center">
        <h1 className="text-center text-4xl font-bold">Page not found</h1>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "default" }), "mt-4 w-full")}
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
