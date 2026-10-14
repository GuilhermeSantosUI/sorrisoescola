import { CheckCircle, Info, Warning, XCircle, SpinnerGap } from "@phosphor-icons/react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

/** Tema claro apenas. */
const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    theme="light"
    className="toaster group"
    icons={{
      success: <CheckCircle weight="bold" className="size-5" />,
      info: <Info weight="bold" className="size-5" />,
      warning: <Warning weight="bold" className="size-5" />,
      error: <XCircle weight="bold" className="size-5" />,
      loading: <SpinnerGap weight="bold" className="size-5 animate-spin" />,
    }}
    style={
      {
        "--normal-bg": "var(--color-popover)",
        "--normal-text": "var(--color-popover-foreground)",
        "--normal-border": "var(--color-border)",
        "--border-radius": "var(--radius-md)",
      } as React.CSSProperties
    }
    {...props}
  />
)

export { Toaster }
