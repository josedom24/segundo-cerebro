# Segundo Cerebro - Wiki Educativa

Un vault de Obsidian sobre **virtualización, contenedores y orquestación**, construido a partir de 7 cursos completos. Publicado con **Quartz** como sitio web estático.

## 📚 Contenido

### Cursos Ingestionados (7)

| Curso | Módulos | Fuente |
|-------|---------|--------|
| **Docker 2024** | 8 | [josedomingo.org](https://plataforma.josedomingo.org/pledin/cursos/docker2024) |
| **Kubernetes 2024** | 10 | [IESGN - CEP](https://github.com/iesgn/curso_kubernetes_cep) |
| **Podman 2024** | 10 | [josedomingo.org](https://github.com/josedom24/curso_podman_ow) |
| **KVM Introducción** | 7 | [josedomingo.org](https://plataforma.josedomingo.org/pledin/cursos/kvm1/) |
| **KVM Avanzado** | 7 | [josedomingo.org](https://plataforma.josedomingo.org/pledin/cursos/kvm2/) |
| **Proxmox VE** | 8 | [IESGN - CEP](https://github.com/josedom24/curso_proxmox_cep) |
| **OpenStack** | 5 | [IESGN - IES](https://github.com/josedom24/curso_openstack_ies) |

**Total:** 55 módulos + 15 conceptos = 70 páginas de contenido

### Estructura

```
segundo-cerebro/
├── wiki/                          # Vault de Obsidian
│   ├── index.md                   # Tabla de contenidos
│   ├── concepts/                  # Conceptos reutilizables (15)
│   └── summaries/                 # Resúmenes de módulos (55)
├── quartz/                        # Site builder (Quartz v4)
│   ├── quartz.config.ts           # Configuración del site
│   ├── quartz.layout.ts           # Layout y componentes
│   └── quartz/components/         # Componentes personalizados
├── scripts/
│   └── deploy.sh                  # Build + rsync al servidor
├── raw-sources/                   # Archivos fuente originales
├── CLAUDE.md                      # Reglas del vault (instrucciones para Claude)
├── log.md                         # Historial append-only de cambios
└── README.md                      # Este archivo
```

## 🔍 Conceptos Clave (15)

### Plataformas (7)
- **Docker** — Plataforma líder de containerización
- **Kubernetes** — Orquestación enterprise de contenedores
- **Podman** — Runtime daemonless, rootless, alternativa Docker
- **KVM** — Hipervisor integrado en Linux para VMs
- **Proxmox VE** — Plataforma virtualización (KVM + LXC)
- **OpenStack** — Plataforma cloud IaaS (compute, storage, networking)
- **Helm** — Package manager de Kubernetes

### Kubernetes Patterns (5)
- **Deployment** — Orquestación declarativa con rolling updates
- **Service** — Exposición de Pods con load balancing y DNS
- **Pod** — Unidad mínima de Kubernetes
- **StatefulSet** — Aplicaciones con identidad persistente
- **Job** — Tareas batch con completación garantizada

### Storage & Base (3)
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

**Creado:** 2026-04-15 | **Última actualización:** 2026-04-16
