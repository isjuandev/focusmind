"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import styles from "./MetricsDashboard.module.css";

interface MetricsData {
  visits: number;
  appClicks: number;
  registrations: number;
  conversionRate: number;
  ctr: number;
  emails: Array<{
    name?: string;
    lastName?: string;
    occupation?: "Estudiante" | "Empleado" | "No aplica";
    email: string;
    ts: string;
  }>;
  updatedAt: string;
}

function getVerdict(rate: number, visits: number) {
  if (visits < 50) return { icon: "⏳", label: "Recopilando datos", desc: `Necesitas al menos ${50 - visits} visitas más para tomar decisiones.`, cls: "neutral" };
  if (rate >= 10) return { icon: "✅", label: "Hipótesis VALIDADA", desc: `${rate.toFixed(1)}% ≥ 10% de conversión. ¡Propuesta de valor confirmada!`, cls: "success" };
  if (rate >= 5)  return { icon: "⚠️", label: "Ajustar propuesta de valor", desc: `${rate.toFixed(1)}% está en zona amarilla (5–9%). Revisa el copy y los beneficios.`, cls: "warning" };
  return { icon: "❌", label: "Replantear solución", desc: `${rate.toFixed(1)}% < 5%. El problema o la propuesta no conectan con la audiencia.`, cls: "danger" };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("es-CO", {
    day: "2-digit", month: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function MetricsDashboard() {
  const [data, setData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [needsToken, setNeedsToken] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchMetrics = useCallback(async (t?: string) => {
    setLoading(true);
    setError("");
    try {
      const params = t ? `?token=${encodeURIComponent(t)}` : "";
      const res = await fetch(`/api/metrics${params}`);
      if (res.status === 401) {
        setNeedsToken(true);
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error("Error al cargar métricas");
      const json = await res.json();
      setData(json);
      setLastRefresh(new Date());
      setNeedsToken(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem("fm_token");
    if (saved) { setToken(saved); fetchMetrics(saved); }
    else fetchMetrics();
  }, [fetchMetrics]);

  // Auto-refresh cada 60s
  useEffect(() => {
    const id = setInterval(() => fetchMetrics(token || undefined), 60_000);
    return () => clearInterval(id);
  }, [fetchMetrics, token]);

  function handleTokenSubmit(e: React.FormEvent) {
    e.preventDefault();
    sessionStorage.setItem("fm_token", tokenInput);
    setToken(tokenInput);
    fetchMetrics(tokenInput);
  }

  if (needsToken && !token) {
    return (
      <div className={styles.tokenWrap}>
        <h1 className={styles.tokenTitle}>Dashboard protegido</h1>
        <p className={styles.tokenSub}>Ingresa tu METRICS_SECRET para continuar.</p>
        <form onSubmit={handleTokenSubmit} className={styles.tokenForm}>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Token secreto"
            className={styles.tokenInput}
          />
          <button type="submit" className={styles.tokenBtn}>Ingresar</button>
        </form>
      </div>
    );
  }

  const verdict = data ? getVerdict(data.conversionRate, data.visits) : null;
  const barW = data ? Math.min((data.conversionRate / 10) * 100, 100) : 0;
  const ctrW = data ? Math.min(data.ctr, 100) : 0;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <div className={styles.logoRow}>
            <Link href="/" className={styles.back}>← Landing</Link>
          </div>
          <h1 className={styles.title}>Dashboard del Experimento</h1>
          <p className={styles.sub}>
            Experimento 1 · Smoke Test · Meta: ≥10% conversión en 7 días
          </p>
        </div>
        <div className={styles.headerActions}>
          {lastRefresh && (
            <span className={styles.lastRefresh}>
              Actualizado {lastRefresh.toLocaleTimeString("es-CO")}
            </span>
          )}
          <button
            className={styles.refreshBtn}
            onClick={() => fetchMetrics(token || undefined)}
            disabled={loading}
          >
            {loading ? "..." : "↻ Actualizar"}
          </button>
        </div>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      {loading && !data ? (
        <div className={styles.loadingState}>Cargando métricas...</div>
      ) : data ? (
        <>
          {/* KPI Cards */}
          <div className={styles.kpiGrid}>
            <div className={styles.kpi}>
              <div className={styles.kpiLabel}>Total visitas</div>
              <div className={`${styles.kpiVal} ${styles.blue}`}>{data.visits.toLocaleString()}</div>
              <div className={styles.kpiSub}>sesiones únicas</div>
            </div>
            <div className={styles.kpi}>
              <div className={styles.kpiLabel}>Registros email</div>
              <div className={`${styles.kpiVal} ${styles.green}`}>{data.registrations}</div>
              <div className={styles.kpiSub}>leads capturados</div>
            </div>
            <div className={styles.kpi}>
              <div className={styles.kpiLabel}>Clics "Ir a la app"</div>
              <div className={`${styles.kpiVal} ${styles.violet}`}>{data.appClicks}</div>
              <div className={styles.kpiSub}>interacciones botón</div>
            </div>
            <div className={styles.kpi}>
              <div className={styles.kpiLabel}>Tasa de conversión</div>
              <div className={`${styles.kpiVal} ${styles.amber}`}>{data.conversionRate.toFixed(1)}%</div>
              <div className={styles.kpiSub}>registros / visitas</div>
            </div>
          </div>

          {/* Progress bars */}
          <div className={styles.bars}>
            <div className={styles.barCard}>
              <div className={styles.barHeader}>
                <span className={styles.barLabel}>Progreso hacia meta (10%)</span>
                <span className={styles.barVal}>{data.conversionRate.toFixed(1)}%</span>
              </div>
              <div className={styles.track}>
                <div className={`${styles.fill} ${styles.fillBlue}`} style={{ width: `${barW}%` }} />
              </div>
              <div className={styles.barNote}>{data.visits} visitas registradas · meta: 150+</div>
            </div>

            <div className={styles.barCard}>
              <div className={styles.barHeader}>
                <span className={styles.barLabel}>CTR botón "Ir a la app"</span>
                <span className={styles.barVal}>{data.ctr.toFixed(1)}%</span>
              </div>
              <div className={styles.track}>
                <div className={`${styles.fill} ${styles.fillViolet}`} style={{ width: `${ctrW}%` }} />
              </div>
              <div className={styles.barNote}>{data.appClicks} clics de {data.visits} visitas</div>
            </div>
          </div>

          {/* Verdict */}
          {verdict && (
            <div className={`${styles.verdict} ${styles[verdict.cls]}`}>
              <span className={styles.verdictIcon}>{verdict.icon}</span>
              <div>
                <div className={styles.verdictLabel}>{verdict.label}</div>
                <div className={styles.verdictDesc}>{verdict.desc}</div>
              </div>
            </div>
          )}

          {/* Criteria table */}
          <div className={styles.criteriaCard}>
            <div className={styles.criteriaTitle}>Criterios del experimento</div>
            <div className={styles.criteriaRow}>
              <span className={styles.criteriaBadge} style={{ background: "rgba(16,185,129,0.1)", color: "#34d399" }}>✅ Validado</span>
              <span className={styles.criteriaText}>≥ 10% conversión</span>
            </div>
            <div className={styles.criteriaRow}>
              <span className={styles.criteriaBadge} style={{ background: "rgba(251,191,36,0.1)", color: "#fbbf24" }}>⚠️ Ajustar</span>
              <span className={styles.criteriaText}>5–9% conversión</span>
            </div>
            <div className={styles.criteriaRow}>
              <span className={styles.criteriaBadge} style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>❌ Replantear</span>
              <span className={styles.criteriaText}>&lt; 5% conversión</span>
            </div>
          </div>

          {/* Email list */}
          <div className={styles.emailSection}>
            <div className={styles.emailHeader}>
              <span className={styles.emailTitle}>Leads registrados ({data.registrations})</span>
            </div>
            {data.emails.length === 0 ? (
              <div className={styles.emptyEmails}>Sin registros aún</div>
            ) : (
              <div className={styles.emailList}>
                {data.emails.map((e, i) => (
                  <div key={i} className={styles.emailItem}>
                    <div className={styles.emailMain}>
                      <span className={styles.emailName}>
                        {e.name || e.lastName
                          ? `${e.name ?? ""} ${e.lastName ?? ""}`.trim()
                          : "Sin nombre"}
                      </span>
                      <span className={styles.emailOccupation}>
                        {e.occupation ?? "No definido"}
                      </span>
                    </div>
                    <div className={styles.emailMeta}>
                      <span className={styles.emailAddr}>{e.email}</span>
                      <span className={styles.emailTs}>{formatDate(e.ts)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
