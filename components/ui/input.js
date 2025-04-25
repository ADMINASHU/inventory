import React from "react"

export const Input = React.forwardRef(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`border rounded px-3 py-1.5 text-sm ${className}`}
    {...props}
  />
))
Input.displayName = "Input"
