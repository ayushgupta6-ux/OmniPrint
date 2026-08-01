"use client"

import { useState } from "react"
import { Ruler, Wand2, Upload, UserCheck, Wallet, Wrench, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  {
    id: 1,
    name: "Select",
    description: "Choose from categories like Signage, Stationery, or Premium Acrylics",
    icon: Ruler,
    options: ["Signage", "Stationery", "Premium Acrylics", "LED Boards"],
  },
  {
    id: 2,
    name: "Design",
    description: "Create your perfect design with our flexible options",
    icon: Wand2,
    options: [
      { name: "AI Designer", desc: "Instant generation", icon: Wand2 },
      { name: "Upload File", desc: "CDR/PDF/ai", icon: Upload },
      { name: "Hire Pro", desc: "Expert design", icon: UserCheck },
    ],
  },
  {
    id: 3,
    name: "Quote",
    description: "Real-time pricing based on size, material, and quantity",
    icon: Wallet,
    features: ["Instant pricing", "Multiple materials", "Bulk discounts"],
  },
  {
    id: 4,
    name: "Fulfill",
    description: "Choose delivery or professional installation",
    icon: Wrench,
    options: ["Express Delivery", "On-Site Installation", "Pickup from Sector-10"],
  },
]

export function ProcessTracker() {
  const [activeStep, setActiveStep] = useState(1)

  return (
    <section id="process" className="bg-secondary py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            How It Works
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            From Idea to Installation in 4 Simple Steps
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Our streamlined process ensures you get premium quality with maximum convenience
          </p>
        </div>

        {/* Stepper Navigation */}
        <div className="relative mb-12">
          {/* Progress Line */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-border hidden lg:block">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={cn(
                  "relative flex flex-col items-center text-center group",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-2"
                )}
              >
                {/* Step Circle */}
                <div
                  className={cn(
                    "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300",
                    activeStep >= step.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground group-hover:border-primary/50"
                  )}
                >
                  {activeStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-3">
                  <p
                    className={cn(
                      "text-sm font-semibold transition-colors",
                      activeStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    Step {step.id}: {step.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground hidden lg:block max-w-[150px]">
                    {step.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
          {activeStep === 1 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps[0].options?.map((option) => (
                <div
                  key={option}
                  className="group cursor-pointer rounded-xl border border-border bg-secondary p-6 text-center transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Ruler className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground">{option}</p>
                  <p className="mt-1 text-sm text-muted-foreground">View all options</p>
                </div>
              ))}
            </div>
          )}

          {activeStep === 2 && (
            <div className="grid gap-4 sm:grid-cols-3">
              {(steps[1].options as Array<{name: string; desc: string; icon: typeof Wand2}>)?.map((option) => (
                <div
                  key={option.name}
                  className="group cursor-pointer rounded-xl border border-border bg-secondary p-6 text-center transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <option.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground">{option.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{option.desc}</p>
                </div>
              ))}
            </div>
          )}

          {activeStep === 3 && (
            <div className="text-center max-w-md mx-auto">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Wallet className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Real-Time Pricing Calculator
              </h3>
              <div className="space-y-3">
                {steps[2].features?.map((feature) => (
                  <div key={feature} className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl bg-secondary border border-border">
                <p className="text-sm text-muted-foreground">Example Quote</p>
                <p className="text-3xl font-bold text-primary mt-1">₹4,999</p>
                <p className="text-xs text-muted-foreground mt-1">For 4x2 ft LED Glow Sign</p>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="grid gap-4 sm:grid-cols-3">
              {(steps[3].options as string[])?.map((option) => (
                <div
                  key={option}
                  className="group cursor-pointer rounded-xl border border-border bg-secondary p-6 text-center transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Wrench className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground">{option}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {option === "Express Delivery" && "Same day in Noida"}
                    {option === "On-Site Installation" && "Professional setup"}
                    {option === "Pickup from Sector-10" && "Save on delivery"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
