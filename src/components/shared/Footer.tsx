import Link from "next/link";
import { Ticket, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  product: [
    { href: "/events", label: "Browse Events" },
    { href: "/register", label: "Create Account" },
    { href: "/login", label: "Sign In" },
  ],
  organizers: [
    { href: "/register", label: "Host an Event" },
    { href: "/organizer", label: "Dashboard" },
    { href: "/organizer/events/new", label: "Create Event" },
  ],
  support: [
    { href: "#", label: "Help Center" },
    { href: "#", label: "Contact Us" },
    { href: "#", label: "Privacy Policy" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="page-container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 w-fit">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <Ticket className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">
                Insta<span className="gradient-text">Tickets</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Modern event ticketing for East Africa. Buy, sell, and validate
              tickets with zero friction.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Mail, href: "#", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg border border-border flex items-center
                             justify-center text-muted-foreground hover:text-foreground
                             hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-sm font-semibold mb-4 capitalize">{section}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={`${section}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground
                                 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} InstaTickets. Built with ❤️ in Nairobi.
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by Go + Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}