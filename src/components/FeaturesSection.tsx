import styles from "./FeaturesSection.module.css";

const features = [
  {
    icon: "🎮",
    color: "blue",
    title: "Ejercicios cognitivos",
    desc: "Minijuegos de atención y memoria diseñados con base en terapia cognitiva.",
  },
  {
    icon: "📅",
    color: "amber",
    title: "Planeador diario",
    desc: "Organiza tu día en bloques adaptados a tu ritmo de concentración.",
  },
  {
    icon: "🎧",
    color: "cyan",
    title: "Sonidos Focus",
    desc: "Música binaural y ruido blanco para entrar en estado de flujo profundo.",
  },
  {
    icon: "📊",
    color: "green",
    title: "Informe de progreso",
    desc: "Visualiza tu evolución semana a semana y mantén la motivación.",
  },
  {
    icon: "✍️",
    color: "violet",
    title: "Reflexión guiada",
    desc: "Journaling estructurado para identificar tus patrones de atención.",
  },
  {
    icon: "🔔",
    color: "coral",
    title: "Recordatorios inteligentes",
    desc: "Notificaciones que respetan tu flujo y te recuerdan sin interrumpirte.",
  },
];

export default function FeaturesSection() {
  return (
    <section className={styles.section} id="features">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>QUÉ INCLUYE</p>
        <h2 className={styles.title}>Todo lo que necesitas<br />para enfocarte</h2>
        <div className={styles.grid}>
          {features.map((f) => (
            <div key={f.title} className={`${styles.card} ${styles[f.color]}`}>
              <div className={styles.iconWrap}>
                <span className={styles.icon}>{f.icon}</span>
              </div>
              <h3 className={styles.cardTitle}>{f.title}</h3>
              <p className={styles.cardDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
