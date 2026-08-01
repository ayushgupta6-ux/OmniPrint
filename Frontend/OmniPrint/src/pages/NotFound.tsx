import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
 

export default function NotFound() {
  

  return (
    <main className="pt-20 min-h-[70vh] flex items-center justify-center">
      <div className="mx-auto max-w-xl px-4 lg:px-8 text-center">
        <div className="font-serif text-8xl md:text-9xl text-muted-foreground/20 mb-4">
          404
        </div>
        <h1 className="font-serif text-3xl md:text-4xl mb-4">
          Page not found
        </h1>
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn't find the page you're looking for. It might have
          been moved or doesn't exist.
        </p>
        <Button asChild>
          <Link to="/" className="gap-2 flex items-center justify-center">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </main>
  );
}