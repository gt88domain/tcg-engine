import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div
      className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center"
      data-ocid="not_found.page"
    >
      <AlertCircle className="w-10 h-10 text-muted-foreground" />
      <h1 className="text-lg font-display font-bold">Page not found</h1>
      <p className="text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Button asChild variant="outline" data-ocid="not_found.home_button">
        <Link to="/">Go home</Link>
      </Button>
    </div>
  );
}
