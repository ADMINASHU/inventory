"use client"

import { signIn } from "next-auth/react"
import React, { useState } from "react";

export default function SignIn() {
  const [hover, setHover] = useState(false);

  return (
    <div style={{ width: "100%", textAlign: "center", margin: "1.5rem 0" }}>
    <hr></hr>
      <div
        style={{
          display: "inline-block",
          background: "#FBFCF6",
          color: "#888",
          padding: "0 0.4rem",
          position: "relative",
          top: "-0.7rem",
          fontSize: "0.95rem",
          zIndex: 1,
        }}
      >
        or 
      </div>
      <button
        type="button"
        className="button"
        style={{
          "--provider-bg": "#fff",
          "--provider-bg-hover": "color-mix(in srgb, #1a73e8 30%, #fff)",
          "--provider-dark-bg": "#161b22",
          "--provider-dark-bg-hover": "color-mix(in srgb, #1a73e8 30%, #000)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "5px",
          background: hover ? "color-mix(in srgb, #1a73e8 30%, #fff)" : "#fff",
          fontSize: "14px",
          transition: "background 0.2s",
          border: "1px solid #dadce0",
          marginTop: "1rem",
          width: "100%",
          maxWidth: "320px",
          marginLeft: "auto",
          marginRight: "auto"
        }}
        tabIndex={0}
        onClick={() => signIn("google")}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <span
          style={{
            filter: "invert(1) grayscale(1) brightness(1.3) contrast(9000)",
            mixBlendMode: "luminosity",
            opacity: 0.95
          }}
        >
          Sign in with Google
        </span>
        <img
          loading="lazy"
          height="24"
          src="https://authjs.dev/img/providers/google.svg"
          alt="Google"
        />
      </button>
    </div>
  );
}
