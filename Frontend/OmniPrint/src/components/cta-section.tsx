"use client";

import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {Link} from "react-router";

const CONTACT_NUMBER = "+91 9999xxxx";

export function CTASection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 lg:px-16 lg:py-24">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg
              className="h-full w-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern
                  id="grid"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="1" cy="1" r="1" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left max-w-xl">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-4 text-balance">
                Ready to transform your brand?
              </h2>
              <p className="text-primary-foreground/80 text-lg">
                Get a free consultation and quote for your signage project. Our
                experts are here to help you stand out.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 group w-full sm:w-auto"
                asChild
              >
                <Link to="/contact">
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <a
                href={`tel:${CONTACT_NUMBER.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>{CONTACT_NUMBER}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
