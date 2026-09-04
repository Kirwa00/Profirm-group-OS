import type { MetadataRoute } from "next";

// Served at /manifest.webmanifest. Lets the app install to a phone home
// screen and launch full-screen (no browser chrome).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Profirm OS",
    short_name: "Profirm OS",
    description: "Profirm Group — venture management operating system",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0A192F",
    theme_color: "#0A192F",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
