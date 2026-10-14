import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import { ICONES, Icone, type IconeNome } from "./icon"

/** Botão shadcn adaptado à marca: alvo ≥ 48 px, pílula, ícone + texto. */
const buttonVariants = cva(
  "inline-flex max-w-full shrink-0 items-center justify-center gap-2 rounded-full text-center font-bold transition-all duration-150 outline-none hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus-visible:ring-4 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-suave hover:bg-primary/85",
        destructive: "bg-destructive text-destructive-foreground shadow-suave hover:bg-destructive/90",
        outline: "border-2 border-border bg-card text-foreground shadow-suave hover:bg-secondary",
        secondary: "bg-secondary text-secondary-foreground shadow-suave hover:bg-secondary/80",
        ghost: "bg-transparent text-foreground hover:bg-muted",
        link: "text-foreground underline underline-offset-4 hover:translate-y-0",
      },
      size: {
        default: "min-h-12 px-5 text-base",
        sm: "min-h-12 px-4 text-sm",
        lg: "min-h-20 px-8 text-xl",
        icon: "size-12",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    /** nome do ícone Phosphor (ver ICONES) ou caractere curto (ex.: número da opção) */
    icone?: IconeNome | (string & {})
  }

function Button({ className, variant, size, asChild = false, icone, children, type = "button", ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button"
  const iconeEl = icone ? (
    icone in ICONES ? <Icone nome={icone as IconeNome} size={size === "lg" ? 32 : 24} /> : <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-primary font-extrabold text-primary-foreground">{icone}</span>
  ) : null
  return (
    <Comp data-slot="button" type={asChild ? undefined : type} className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {asChild && React.isValidElement<{ children?: React.ReactNode }>(children)
        ? React.cloneElement(children, undefined, iconeEl, children.props.children)
        : <>{iconeEl}{children}</>}
    </Comp>
  )
}

export { Button, buttonVariants }
