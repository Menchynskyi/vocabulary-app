import { Header } from "@/components/Header";

type EditCardLayoutProps = {
  children: React.ReactNode;
};

export default function EditCardLayout({ children }: EditCardLayoutProps) {
  return (
    <div className="mt-12 max-sm:w-[90vw] sm:min-w-[400px]">
      <h1 className="mb-8 text-2xl font-semibold">Edit card</h1>
      {children}
    </div>
  );
}
