import styles from "./SocialProof.module.css";

const quotes = [
  {
    text: "Llevaba años buscando algo que me ayudara con el TDAH sin sentirme abrumado. FocusMind lo hace simple y hasta divertido.",
    author: "Mariana, 23 años",
    role: "Estudiante de Diseño",
  },
  {
    text: "Los ejercicios de concentración me ayudan a prepararme antes de estudiar. La diferencia es notable desde la primera semana.",
    author: "Sebastián, 19 años",
    role: "Estudiante de Ingeniería",
  },
  {
    text: "Mi psicóloga me recomendó FocusMind como complemento entre consultas. Es exactamente lo que necesitaba.",
    author: "Valentina, 27 años",
    role: "Diseñadora freelance",
  },
];

export default function SocialProof() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>TESTIMONIOS</p>
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
