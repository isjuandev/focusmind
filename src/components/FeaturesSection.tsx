import styles from "./FeaturesSection.module.css";

const features = [
  {
    icon: "🎮",
    color: "blue",
    title: "Ejercicios cognitivos",
    desc: "Minijuegos diseñados para mejorar atención sostenida y memoria de trabajo.",
  },
  {
    icon: "📊",
    color: "green",
    title: "Progreso visual",
    desc: "Informes semanales para ver tu evolución y mantener la motivación.",
  },
  {
    icon: "🎧",
    color: "cyan",
    title: "Sonidos Focus",
    desc: "Música binaural y ruido blanco para entrar en estado de flujo profundo.",
  },
  {
    icon: "✍️",
    color: "violet",
    title: "Reflexión guiada",
    desc: "Journaling estructurado para entender tus patrones de concentración.",
  },
  {
    icon: "📅",
    color: "amber",
    title: "Planeador diario",
    desc: "Organiza tu día en bloques adaptados a tu ritmo de atención.",
  },
  {
    icon: "🔔",
    color: "coral",
    title: "Recordatorios",
    desc: "Notificaciones inteligentes que respetan tu flujo de trabajo.",
  },
];

export default function FeaturesSection() {
  return (
    <section className={styles.section} id="features">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>LO QUE INCLUYE</p>
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
