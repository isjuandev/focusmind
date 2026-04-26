 "use client";

import styles from "./Footer.module.css";
import Link from "next/link";

export default function Footer() {
  async function handleOpenApp(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const targetUrl = "https://focusmindd1.netlify.app/";
    try {
      await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "app_click" }),
      });
    } catch {
      // no-op
    } finally {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>FocusMind</span>
          <span className={styles.tagline}>Apoyo digital para el TDAH</span>
        </div>
        <div className={styles.links}>
          <Link href="/metrics" className={styles.link}>
            📊 Dashboard experimento
          </Link>
          <a
            href="https://focusmindd1.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            onClick={handleOpenApp}
          >
            Ir a la app →
          </a>
        </div>
        <p className={styles.copy}>© 2025 FocusMind · Proyecto terapéutico digital</p>
      </div>
    </footer>
  );
}
