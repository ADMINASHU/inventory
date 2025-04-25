import React from "react"

export const Button = React.forwardRef(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={`px-3 py-1.5 rounded border text-sm font-medium transition-colors
        ${variant === "outline" ? "border-gray-300 bg-white hover:bg-gray-100" : "bg-black text-white"}
        ${size === "icon" ? "p-2 w-8 h-8 flex items-center justify-center" : ""}
        ${className}
      `}
      {...props}
    />
  )
)
Button.displayName = "Button"
