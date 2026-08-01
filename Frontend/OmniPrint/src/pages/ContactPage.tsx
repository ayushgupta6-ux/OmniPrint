import { ContactForm } from "@/components/contact-form";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useEffect } from "react";

const CONTACT_NUMBER = "+91 99xxxxx";
const EMAIL = "hello@omniprint.com";

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: CONTACT_NUMBER,
    href: `tel:${CONTACT_NUMBER.replace(/\s/g, "")}`,
  },
  {
    icon: Mail,
    label: "Email",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
  },
  {
    icon: MapPin,
    label: "Address",
    value: "A-28B, Sector 10, Noida, Uttar Pradesh 201301",
    href: "https://maps.google.com",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon - Sat: 9:00 AM - 6:00 PM",
    href: null,
  },
];

export default function ContactPage() {
  useEffect(() => {
    document.title = "Contact Us | OmniPrint";
  }, []);

  return (
    <main className="pt-20">
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <span className="text-sm font-medium text-accent uppercase tracking-wider">
            Get in Touch
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mt-2 mb-4 text-balance">
            Let's discuss your project
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-pretty">
            Ready to transform your brand with stunning signage? Contact us
            for a free consultation and quote.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((info) => (
              <div
                key={info.label}
                className="p-6 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <info.icon className="h-6 w-6 text-accent" />
                </div>
                <div className="text-sm text-muted-foreground mb-1">
                  {info.label}
                </div>
                {info.href ? (
                  <a
                    href={info.href}
                    target={info.href.startsWith("http") ? "_blank" : undefined}
                    rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-foreground font-medium hover:text-accent transition-colors"
                  >
                    {info.value}
                  </a>
                ) : (
                  <div className="text-foreground font-medium">{info.value}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="p-8 lg:p-12 rounded-3xl bg-card border border-border">
            <h2 className="font-serif text-2xl md:text-3xl mb-2 text-center">
              Send us a message
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Fill out the form below and we'll get back to you within 24
              hours.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}