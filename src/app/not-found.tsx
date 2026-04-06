import Link from "next/link";
import { Ticket, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div
      className="min-h-[calc(100vh-4rem)] flex items-center
                  justify-center p-8"
    >
      <div className="text-center space-y-8 max-w-md">
        {/* Animated 404 */}
        <div className="relative">
          <div
            className="text-[10rem] font-black leading-none
                        gradient-text opacity-20 select-none"
          >
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-24 h-24 rounded-3xl gradient-bg
                          flex items-center justify-center
                          shadow-2xl shadow-violet-500/30
                          animate-float"
            >
              <Ticket className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold">
            Ticket not found
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or
            may have moved. Let&apos;s get you back on track.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            className="gradient-bg hover:opacity-90 gap-2 font-semibold"
            asChild
          >
            <Link href="/events">
              <Search className="w-4 h-4" />
              Browse events
            </Link>
          </Button>
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
              Go home
            </Link>
          </Button>
        </div>

        {/* Help text */}
        <p className="text-xs text-muted-foreground">
          Need help?{" "}
          <Link
            href="#"
            className="text-primary hover:underline underline-offset-2"
          >
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}