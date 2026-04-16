---
created: 2026-04-16
updated: 2026-04-16
sources: [osv4_paas_curso]
tags: [openshift]
---

# Monitorización y Observabilidad (Curso 2 - Módulo 9)

## Resumen
Herramientas de observabilidad en OpenShift: métricas (Prometheus), logs (ELK), alertas, dashboards, y monitorización de aplicaciones.

## Conceptos Clave

### Stack de Observabilidad
```
Aplicaciones
    ├─ Métricas (Prometheus)
    ├─ Logs (Elasticsearch)
    ├─ Traces (Jaeger)
    └─ Alertas (AlertManager)
```

### Prometheus (Métricas)
**Propósito:** Recolectar y almacenar métricas de tiempo real

**Incluido en OpenShift:** Sí (cluster monitoring)

**Métrica típica:**
```
cpu_usage_percent{pod="myapp-1"} = 45%
memory_bytes{pod="myapp-1"} = 256MB
request_duration_seconds = 0.234
```

**Visualización:** Grafana

### Prometheus Queries (PromQL)
```
# CPU actual
node_cpu_seconds_total

# Memoria disponible
node_memory_MemAvailable_bytes

# Request rate
rate(http_requests_total[5m])

# Error rate
rate(http_requests_total{status=~"5.."}[5m])
```

### Logs
**OpenShift logging:** Elasticsearch + Kibana (optional)

**Fuentes:**
- Container logs (stdout)
- Application logs
- Audit logs

**Acceso:**
```bash
oc logs deployment/myapp
oc logs -f pod/myapp-1  # Tail
```

**Centralizado:** Logs → Elasticsearch → Kibana (búsqueda)

### Alertas
**AlertManager:** Alertas basadas en métricas

**Ejemplo:**
```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: myapp-alerts
spec:
  groups:
  - name: myapp
    rules:
    - alert: HighCPU
      expr: cpu_usage_percent > 80
      for: 5m
      annotations:
        summary: "Pod {{ $labels.pod }} CPU alta"
```

**Acciones:** Slack, email, PagerDuty, webhook

### Dashboards
**Grafana:** Visualización de métricas

**Tipos de panel:**
- Gráficos de línea (tendencia)
- Gauges (valor actual)
- Tablas (listados)
- Heatmaps (distribución)

**Pre-built:** OpenShift incluye dashboards cluster

### Health Checks
```yaml
spec:
  containers:
  - name: app
    livenessProbe:
      httpGet:
        path: /health
        port: 8080
      initialDelaySeconds: 10
      periodSeconds: 5
    readinessProbe:
      httpGet:
        path: /ready
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 3
```

**Liveness:** ¿Está vivo? Si no → restart
**Readiness:** ¿Listo para tráfico? Si no → quita de LB

### Métricas de Aplicación
**Exponer en app:** `/metrics` endpoint Prometheus format

```
# HELP http_requests_total Total requests
# TYPE http_requests_total counter
http_requests_total{method="GET",status="200"} 1234
```

**Biblioteca:** Prometheus client library

### Relaciones
- Parte de: [[openshift]]
- Herramientas: Prometheus, Grafana, Elasticsearch, Kibana
- Integración: AlertManager para alertas

## Fuentes
- [Curso OpenShift v4 PaaS (Módulo 9)](https://plataforma.josedomingo.org/pledin/cursos/osv4_paas/modulo9)
