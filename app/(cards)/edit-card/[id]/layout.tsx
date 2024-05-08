import { Header } from "@/components/Header";

type EditCardLayoutProps = {
  children: React.ReactNode;
};

export default function EditCardLayout({ children }: EditCardLayoutProps) {
  return (
    <div className="mt-8 max-sm:w-[90vw] sm:mt-12 sm:min-w-[400px]">
      <h1 className="mb-6 text-2xl font-semibold sm:mb-8">Edit card</h1>
      {children}
    </div>
  );
}
