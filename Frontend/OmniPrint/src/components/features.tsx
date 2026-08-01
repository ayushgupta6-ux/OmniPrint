"use client";

import { Upload, Sparkles, Headphones, Truck } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Upload Your Design",
    description:
      "Have a ready design? Simply upload your CDR, PDF, or PNG file and we will bring it to life.",
  },
  {
    icon: Sparkles,
    title: "AI Designer",
    description:
      "Use our free AI-powered design tool to create stunning visuals. Login to access this exclusive feature.",
  },
  {
    icon: Headphones,
    title: "Design Consultation",
    description:
      "Need help? Our expert designers will work with you to create the perfect design for your needs.",
  },
  {
    icon: Truck,
    title: "Professional Installation",
    description:
      "Optional professional installation services available across Noida and NCR region.",
  },
];

export function Features() {
  return (
    <section className="py-20 lg:py-32 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-accent uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mt-2 mb-4 text-balance">
            Three ways to get your design
          </h2>
          <p className="text-muted-foreground text-pretty">
            Whether you have a design ready or need help creating one, we have got
            you covered with flexible options.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-6 lg:p-8 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5"
            >
              {/* Number badge */}
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-sm font-medium text-muted-foreground">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                <feature.icon className="h-6 w-6 text-accent group-hover:text-accent-foreground transition-colors" />
              </div>

              {/* Content */}
              <h3 className="font-serif text-xl mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
