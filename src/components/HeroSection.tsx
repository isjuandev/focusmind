"use client";

import { useState, useEffect } from "react";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Track page visit (once per session)
    const key = "fm_visited";
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "visit" }),
      }).catch(() => {});
    }
  }, []);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Ingresa un correo válido.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Error al registrar.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMsg("Error de red. Intenta de nuevo.");
      setStatus("error");
    }
  }

  async function handleAppClick() {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "app_click" }),
    }).catch(() => {});
    window.open("https://focusmindd1.netlify.app/", "_blank", "noopener");
  }

  return (
    <section className={styles.hero}>
      {/* Glow orb */}
      <div className={styles.glow} aria-hidden />

      {/* Grid texture */}
      <div className={styles.grid} aria-hidden />

      <div className={styles.inner}>
        <span className={styles.badge}>
          <span className={styles.dot} />
          TDAH · Gamificación · Concentración
        </span>

        <h1 className={styles.headline}>
          Entrena tu<br />
          <span className={styles.gradient}>concentración</span>
          <br />como nunca
        </h1>

        <p className={styles.sub}>
          FocusMind usa ejercicios gamificados y recordatorios inteligentes
          para ayudarte a gestionar el TDAH en tu vida diaria.
        </p>

        {status === "success" ? (
          <div className={styles.successBox}>
            <span className={styles.successIcon}>🎉</span>
            <div>
              <strong>¡Listo!</strong> Te avisaremos con novedades de FocusMind.
            </div>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleRegister} noValidate>
            <div className={styles.inputRow}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className={styles.input}
                disabled={status === "loading"}
                aria-label="Correo electrónico"
              />
              <button
                type="submit"
                className={styles.btnPrimary}
                disabled={status === "loading"}
              >
                {status === "loading" ? "..." : "Registrarme gratis"}
              </button>
            </div>
            {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
          </form>
        )}

        <button className={styles.btnApp} onClick={handleAppClick} type="button">
          <span className={styles.playIcon}>▶</span>
          Ir a la app ahora
        </button>

        <p className={styles.disclaimer}>
          Sin tarjeta de crédito · Gratis para siempre
        </p>
      </div>
    </section>
  );
}
