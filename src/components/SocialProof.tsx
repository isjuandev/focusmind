import styles from "./SocialProof.module.css";

const quotes = [
  {
    text: "Llevaba años buscando algo que me ayudara con el TDAH sin sentirme abrumado. FocusMind lo hace simple y hasta divertido.",
    author: "Mariana R.",
    role: "Estudiante de Diseño, 23 años",
  },
  {
    text: "Los ejercicios de concentración me ayudan a prepararme antes de estudiar. La diferencia es notable desde la primera semana.",
    author: "Sebastián V.",
    role: "Estudiante de Ingeniería, 19 años",
  },
  {
    text: "Mi psicóloga me recomendó FocusMind como complemento entre consultas. Es exactamente lo que necesitaba.",
    author: "Valentina C.",
    role: "Diseñadora freelance, 27 años",
  },
];

export default function SocialProof() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>LO QUE DICEN</p>
        <h2 className={styles.title}>Personas reales,<br />resultados reales</h2>
        <div className={styles.grid}>
          {quotes.map((q, i) => (
            <blockquote key={i} className={styles.card}>
              <div className={styles.stars}>★★★★★</div>
              <p className={styles.quote}>&ldquo;{q.text}&rdquo;</p>
              <footer className={styles.footer}>
                <div className={styles.avatar}>
                  {q.author.charAt(0)}
                </div>
                <div>
                  <div className={styles.author}>{q.author}</div>
                  <div className={styles.role}>{q.role}</div>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
