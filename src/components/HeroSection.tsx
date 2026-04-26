"use client";

import { useState, useEffect } from "react";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    occupation: "",
    email: "",
  });
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

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.lastName.trim()) {
      setErrorMsg("Ingresa tu nombre y apellido.");
      return;
    }
    if (!["Estudiante", "Empleado", "No aplica"].includes(form.occupation)) {
      setErrorMsg("Selecciona a qué te dedicas.");
      return;
    }
    if (!form.email || !form.email.includes("@")) {
      setErrorMsg("Ingresa un correo válido.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          lastName: form.lastName.trim(),
          occupation: form.occupation,
          email: form.email.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Error al registrar.");
        setStatus("error");
        return;
      }
      setStatus("success");
      setForm({ name: "", lastName: "", occupation: "", email: "" });
    } catch {
      setErrorMsg("Error de red. Intenta de nuevo.");
      setStatus("error");
    }
  }

  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <nav className={styles.nav}>
          <span className={styles.logo}>FocusMind</span>
          <div className={styles.navLinks}>
            <a href="#how-it-works">Cómo funciona</a>
            <a href="#for-who">Para quién</a>
            <a href="#features">Características</a>
          </div>
          <a
            href="https://focusmindd1.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navCta}
            onClick={handleOpenApp}
          >
            Empezar gratis →
          </a>
        </nav>

        <span className={styles.badge}>
          🧠 Apoyo digital para el TDAH
        </span>

        <h1 className={styles.headline}>
          Entrena tu mente,<br />
          domina tu <span className={styles.gradient}>atención</span>
        </h1>

        <p className={styles.sub}>
          FocusMind es la app diseñada para personas con TDAH y dificultades de
          concentración. Ejercicios, planeación y reflexión — todo en un solo
          lugar, mientras esperas tu próxima consulta.
        </p>

        {status === "success" ? (
          <div className={styles.successBox}>
            <span className={styles.successIcon}>🎉</span>
            <div>
              <strong>¡Listo!</strong> Te avisaremos con novedades de FocusMind.
            </div>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleRegister} noValidate id="registro">
            <div className={styles.twoCols}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Nombre"
                className={styles.input}
                disabled={status === "loading"}
                aria-label="Nombre"
              />
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
                placeholder="Apellido"
                className={styles.input}
                disabled={status === "loading"}
                aria-label="Apellido"
              />
            </div>
            <div className={styles.inputRow}>
              <select
                value={form.occupation}
                onChange={(e) => setForm((prev) => ({ ...prev, occupation: e.target.value }))}
                className={styles.select}
                disabled={status === "loading"}
                aria-label="A qué te dedicas"
              >
                <option value="">¿A qué te dedicas?</option>
                <option value="Estudiante">Estudiante</option>
                <option value="Empleado">Empleado</option>
                <option value="No aplica">No aplica</option>
              </select>
            </div>
            <div className={styles.inputRow}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="tu@correo.com"
                className={styles.input}
                disabled={status === "loading"}
                aria-label="Correo electrónico"
              />
            </div>
            <div className={styles.submitRow}>
              <button
                type="submit"
                className={styles.btnPrimary}
                disabled={status === "loading"}
              >
                {status === "loading" ? "..." : "Quiero acceso gratis"}
              </button>
            </div>
            {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
          </form>
        )}

        <button
          className={styles.btnApp}
          onClick={() => window.location.assign("#how-it-works")}
          type="button"
        >
          Ver cómo funciona →
        </button>

        <p className={styles.disclaimer}>
          Sin tarjeta de crédito · Cancela cuando quieras · Gratis para siempre en plan básico
        </p>
      </div>
    </section>
  );
}
