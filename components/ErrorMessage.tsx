import { AlertCircle } from "lucide-react";
import { Button } from "./ui/Button";
import { Alert, AlertDescription, AlertTitle } from "./ui/Alert";

type ErrorMessageProps = {
  retry?: () => void;
};

export function ErrorMessage({ retry }: ErrorMessageProps) {
  return (
    <div className="px-8">
      <Alert variant="destructive" className="max-sm:min-w-[90vw]">
        <div className="flex items-center">
          <AlertCircle className="h-8 w-8" />
          <div className="flex flex-col pl-4">
            <AlertTitle className="text-xl">Something went wrong</AlertTitle>
            <AlertDescription>An unexpected error occurred...</AlertDescription>
          </div>
          {!!retry && (
            <Button
              variant="destructive"
              onClick={retry}
              className="ml-auto sm:ml-6"
            >
              Retry
            </Button>
          )}
        </div>
      </Alert>
    </div>
  );
}
