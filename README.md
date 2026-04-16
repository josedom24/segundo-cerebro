# Wiki Pledin - Segundo Cerebro Educativo

Un vault de Obsidian sobre **infraestructura y plataformas**, construido a partir de 9 cursos completos. Publicado con **Quartz** como sitio web estático.

## 📚 Contenido

### Infraestructura y Plataformas (9 cursos)

| Curso | Módulos | Fuente |
|-------|---------|--------|
| **KVM & libvirt** (Intro + Avanzado) | 14 | [josedomingo.org](https://plataforma.josedomingo.org/pledin/cursos/kvm1/) |
| **Proxmox VE** | 8 | [IESGN - CEP](https://github.com/josedom24/curso_proxmox_cep) |
| **OpenStack** | 5 | [IESGN - IES](https://github.com/josedom24/curso_openstack_ies) |
| **Docker 2024** | 8 | [josedomingo.org](https://plataforma.josedomingo.org/pledin/cursos/docker2024) |
| **Podman 2024** | 10 | [josedomingo.org](https://github.com/josedom24/curso_podman_ow) |
| **Kubernetes 2024** | 10 | [IESGN - CEP](https://github.com/iesgn/curso_kubernetes_cep) |
| **OpenShift v4 (Curso 1)** | 9 | [Plataforma](https://plataforma.josedomingo.org/pledin/cursos/osv4_k8s/) |
| **OpenShift v4 (Curso 2)** | 10 | [Plataforma](https://plataforma.josedomingo.org/pledin/cursos/osv4_paas/) |

**Total:** 74 módulos + 21 conceptos + 1 referencia de patrón = ~120 páginas

### Estructura

```
segundo-cerebro/
├── wiki/                          # Vault de Obsidian
│   ├── index.md                   # Tabla de contenidos (actualización dinámica)
│   ├── concepts/                  # Conceptos reutilizables (21)
│   ├── summaries/                 # Resúmenes de módulos (74)
│   └── log.md                     # Historial append-only de cambios
├── quartz/                        # Site builder (Quartz v4)
│   ├── quartz.config.ts           # Configuración del site (title, theme, plugins)
│   ├── quartz.layout.ts           # Layout y componentes
│   └── public/                    # Build output
├── scripts/
│   └── deploy.sh                  # Build + rsync al servidor
├── CLAUDE.md                      # Reglas del vault (instrucciones para Claude)
└── README.md                      # Este archivo
```

## 🔍 Conceptos Clave (21)

### Plataformas Principales (8)
- **Docker** — Containerización con imágenes, registros, Compose
- **Kubernetes** — Orquestación cloud-native: master/worker, auto-scaling
- **OpenShift** — Distribución empresarial de Kubernetes con PaaS
- **Podman** — Runtime daemonless, rootless nativo, Pods, Quadlet
- **KVM** — Hipervisor integrado en Linux para virtualización
- **Proxmox VE** — Plataforma virtualización: KVM + LXC, gestión centralizada
- **OpenStack** — Plataforma cloud IaaS: compute, storage, networking
- **Helm** — Package manager de Kubernetes: charts, templating

### OpenShift-specific Patterns (6)
- **PaaS** — Platform as a Service: abstracción de infraestructura
- **ImageStream** — Gestión automática de imágenes con triggers
- **Build** — CI/CD nativo: S2I, Docker build, webhooks
- **Route** — Exposición simplificada vs Kubernetes Ingress
- **Template** — Plantillas parametrizadas para aplicaciones complejas
- **DeploymentConfig** — Despliegues con triggers, rolling updates, lifecycle hooks

### Kubernetes Patterns (5)
- **Deployment** — Orquestación declarativa con rolling updates
- **Service** — Exposición de Pods con load balancing y DNS
- **Pod** — Unidad mínima de Kubernetes
- **StatefulSet** — Aplicaciones con identidad persistente
- **Job** — Tareas batch con completación garantizada

### Storage & Base (2)
- **Volume** — Almacenamiento persistente multiplataforma
- **Snapshot** — Captura punto-en-tiempo para backup y rollback
- **Contenedores** — Virtualización a nivel SO con kernel compartido

## 🚀 Uso

### Ver en Obsidian

```bash
git clone git@github.com:josedom24/segundo-cerebro.git
# Abre Obsidian → "Open vault as folder" → selecciona wiki/
```

### Build local (Quartz)

```bash
cd quartz
npm install       # solo la primera vez
npx quartz build --serve
# Abre http://localhost:8080
```

### Deploy al servidor

```bash
# Solo build + deploy
./scripts/deploy.sh

# Commit + build + deploy
./scripts/deploy.sh "mensaje del commit"
```

## 📖 Convenciones

- **Nombres de archivos:** `kebab-case` (minúsculas, guiones) — `introduccion-docker.md`
- **Wikilinks:** `[[nombre-archivo|Texto]]` o `[[Alias]]` (los conceptos tienen alias en frontmatter)
- **Frontmatter:**
  ```yaml
  ---
  created: YYYY-MM-DD
  updated: YYYY-MM-DD
  sources: [fuente-1]
  tags: [tag1, tag2]
  aliases: [NombreCapitalizado]   # obligatorio en concepts/
  ---
  ```

## 📝 Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `CLAUDE.md` | Reglas del vault, convenciones, workflow de ingesta |
| `log.md` | Historial de todas las operaciones (append-only) |
| `lint-report.md` | Auditoría de problemas y soluciones |

## 📜 Licencia

Contenido basado en cursos de [josedomingo.org](https://josedomingo.org) e [IESGN](https://github.com/iesgn). Respeta las licencias de las fuentes originales.

---

**Creado:** 2026-04-15 | **Última actualización:** 2026-04-16 | **App:** Wiki Pledin
