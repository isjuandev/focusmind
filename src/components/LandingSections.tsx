import styles from "./LandingSections.module.css";

const painPoints = [
  {
    icon: "😩",
    title: "La mente no para",
    text: "Empiezas algo, te distraes, vuelves a empezar. El ciclo nunca termina.",
  },
  {
    icon: "📅",
    title: "El tiempo se escapa",
    text: "Sabes lo que debes hacer, pero no cuándo ni cómo organizarlo.",
  },
  {
    icon: "🔋",
    title: "Agotamiento mental",
    text: "El esfuerzo de concentrarse consume más energía de la que tienes.",
  },
];

const steps = [
  {
    step: "Paso 1 — Ejercita",
    text: "Accede a ejercicios cognitivos breves (5–10 min) diseñados para mejorar la atención sostenida y la memoria de trabajo. Sin presión, a tu ritmo.",
  },
  {
    step: "Paso 2 — Planea",
    text: "Organiza tu día con un planeador visual adaptado a cómo funciona tu mente. Bloques cortos, prioridades claras, sin abrumarte.",
  },
  {
    step: "Paso 3 — Reflexiona",
    text: "Al final del día, un journaling guiado te ayuda a entender qué funcionó y qué no. Así mejoras semana a semana.",
  },
];

const profiles = [
  {
    title: "🎓 Estudiantes",
    text: "Tienes tareas, parciales y proyectos. Pero abres el computador y de repente pasaron dos horas. FocusMind te ayuda a entrar en modo estudio más rápido y mantenerte ahí.",
  },
  {
    title: "💼 Jóvenes profesionales",
    text: "Reuniones, correos, deadlines. Tu mente va a mil pero nada termina. Con FocusMind estructuras tu energía mental para rendir donde importa.",
  },
  {
    title: "🧠 Personas con TDAH",
    text: "Diagnosticado o no, si tu mente no para y el enfoque se te escapa, FocusMind es el complemento digital que faltaba entre consultas con tu especialista.",
  },
];

const stats = [
  { value: "+500", label: "Usuarios en lista de espera" },
  { value: "87%", label: "Reportan mejor organización en la primera semana" },
  { value: "4.8★", label: "Valoración promedio en pruebas beta" },
];

export default function LandingSections() {
  return (
    <>
      <section className={styles.section} id="problema">
        <div className={styles.inner}>
          <p className={styles.eyebrow}>POR QUÉ EXISTE FOCUSMIND</p>
          <h2 className={styles.title}>Concentrarse no debería ser tan difícil</h2>
          <p className={styles.intro}>
            Millones de personas luchan cada día para terminar una tarea, organizar
            su tiempo o simplemente mantenerse enfocadas. Las apps genéricas no
            entienden el TDAH. Los especialistas tienen listas de espera. Y en el
            medio, tú solo.
          </p>

          <div className={styles.grid}>
            {painPoints.map((item) => (
              <article className={styles.card} key={item.title}>
                <div className={styles.icon}>{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} id="how-it-works">
        <div className={styles.inner}>
          <p className={styles.eyebrow}>CÓMO FUNCIONA</p>
          <h2 className={styles.title}>Tu rutina de enfoque, paso a paso</h2>
          <div className={styles.steps}>
            {steps.map((item) => (
              <article className={styles.stepCard} key={item.step}>
                <h3>{item.step}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} id="for-who">
        <div className={styles.inner}>
          <p className={styles.eyebrow}>¿ESTO ES PARA TI?</p>
          <h2 className={styles.title}>FocusMind fue hecho para...</h2>
          <div className={styles.grid}>
            {profiles.map((item) => (
              <article className={styles.card} key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} id="cta">
        <div className={styles.inner}>
          <div className={styles.statsGrid}>
            {stats.map((item) => (
              <article className={styles.statCard} key={item.label}>
                <p className={styles.statValue}>{item.value}</p>
                <p className={styles.statLabel}>{item.label}</p>
              </article>
            ))}
          </div>

          <div className={styles.finalCta}>
            <h2>Tu mente merece una herramienta a su altura</h2>
            <p>
              Únete a las personas que ya están entrenando su concentración.
              Acceso completamente gratis durante el lanzamiento.
            </p>
            <a href="#registro" className={styles.ctaButton}>
              Registrarme gratis ahora
            </a>
            <small>
              Sin tarjeta de crédito · Cancela cuando quieras · Gratis para
              siempre en plan básico
            </small>
          </div>
        </div>
      </section>
    </>
  );
}
