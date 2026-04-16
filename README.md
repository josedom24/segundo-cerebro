# Segundo Cerebro - Wiki Educativa

Un vault de Obsidian comprehensivo sobre **virtualización, contenedores y orquestación**, construido a partir de 6 cursos completos. Publicado con **Quartz** como sitio web estático.

## 📚 Contenido

### Cursos Ingestionados (6)

| Curso | Módulos | Fuente |
|-------|---------|--------|
| **Docker 2024** | 8 | [josedomingo.org](https://plataforma.josedomingo.org/pledin/cursos/docker2024) |
| **Kubernetes 2024** | 10 | [IESGN - CEP](https://github.com/iesgn/curso_kubernetes_cep) |
| **Podman 2024** | 10 | [josedomingo.org](https://github.com/josedom24/curso_podman_ow) |
| **KVM Introducción** | 7 | [josedomingo.org](https://plataforma.josedomingo.org/pledin/cursos/kvm1/) |
| **KVM Avanzado** | 7 | [josedomingo.org](https://plataforma.josedomingo.org/pledin/cursos/kvm2/) |
| **Proxmox VE** | 8 | [IESGN - CEP](https://github.com/josedom24/curso_proxmox_cep) |

**Total:** 50 módulos + 9 conceptos clave = 59 páginas de contenido

### Estructura

```
segundo-cerebro/
├── wiki/                          # Vault de Obsidian
│   ├── index.md                   # Tabla de contenidos
│   ├── concepts/                  # Páginas de conceptos (9)
│   │   ├── docker.md
│   │   ├── kubernetes.md
│   │   ├── podman.md
│   │   ├── kvm.md
│   │   ├── proxmox.md
│   │   ├── contenedores.md
│   │   ├── dockerfile.md
│   │   ├── docker-compose.md
│   │   └── helm.md
│   └── summaries/                 # Resúmenes de módulos (50)
│       └── [módulos por curso]
├── raw-sources/                   # Archivos fuente originales
├── CLAUDE.md                       # Guía del vault (instrucciones de uso)
├── INSTRUCCIONES.md               # Workflow y comandos
├── log.md                          # Historial append-only de cambios
└── README.md                       # Este archivo
```

## 🔍 Conceptos Clave

- **Contenedores** — Empaquetamiento a nivel SO (Docker, Podman)
- **Docker** — Plataforma líder de containerización
- **Kubernetes** — Orquestación enterprise de contenedores
- **Podman** — Runtime daemonless, rootless, alternativa Docker
- **KVM** — Hipervisor integrado en Linux para VMs
- **Proxmox VE** — Plataforma virtualización (KVM + LXC)
- **Dockerfile** — Sintaxis para construir imágenes
- **Docker Compose** — Orquestación simple (single-host)
- **Helm** — Package manager de Kubernetes

## 🚀 Cómo Usar

### Localmente (Obsidian)

1. **Clona el repositorio:**
   ```bash
   git clone git@github.com:josedom24/segundo-cerebro.git
   cd segundo-cerebro
   ```

2. **Abre en Obsidian:**
   - Abre Obsidian
   - "Open vault as folder"
   - Selecciona el directorio `wiki/`

3. **Navega el contenido:**
   - Empieza en `wiki/index.md` para ver el catálogo
   - Usa el graph view para explorar conexiones
   - Los links internos (`[[nombre]]`) son clickeables

### Publicación Web (Quartz)

1. **Configura Quartz:**
   ```bash
   git submodule add https://github.com/jackiegeig/quartz.git quartz-publish
   cd quartz-publish
   npm install
   ```

2. **Publica el vault:**
   ```bash
   npx quartz build --output public
   ```

3. **Despliega:**
   - GitHub Pages (automático)
   - Netlify
   - Vercel
   - Tu servidor

Ver documentación completa en [INSTRUCCIONES.md](INSTRUCCIONES.md)

## 📖 Cómo Funciona Este Vault

### Workflow de Ingesta

Cada fuente (curso) sigue este proceso:

1. **Lee** el contenido completo
2. **Extrae** 3-5 puntos clave
3. **Escribe** resúmenes en `wiki/summaries/`
4. **Actualiza** `wiki/concepts/` con conexiones
5. **Registra** cambios en `log.md`

### Convenciones

- **Nombres de archivos:** `kebab-case` (minúsculas, guiones)
  - ❌ Evitar: `01-introduccion-docker.md`
  - ✅ Correcto: `introduccion-docker.md`
  
- **Enlaces internos:** `[[filename|Texto mostrado]]`
  - Soportan [[conceptos]] y [[módulos]]
  - Compatible con Obsidian y Quartz

- **Frontmatter YAML:**
  ```yaml
  ---
  created: YYYY-MM-DD
  updated: YYYY-MM-DD
  sources: [fuente-1, fuente-2]
  tags: [tag1, tag2]
  ---
  ```

### Mantenimiento

- **Log:** Todos los cambios registrados en `log.md` (append-only)
- **Lint reports:** Auditorías periódicas en `lint-report.md`
- **Audits:** Reportes de reparación en `AUDIT_REPAIR_REPORT.md`

## 🧹 Estado del Vault

**Último audit (2026-04-16):**
- ✅ 118 enlaces únicos validados
- ✅ 0 referencias rotas
- ✅ 0 archivos huérfanos
- ✅ Obsidian-compatible

## 📝 Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `CLAUDE.md` | Reglas del vault, convenciones de nombrado, workflow |
| `INSTRUCCIONES.md` | Guía de uso, ejemplos, comandos rápidos |
| `log.md` | Historial de todas las operaciones (append-only) |
| `lint-report.md` | Auditoría de problemas y soluciones |
| `AUDIT_REPAIR_REPORT.md` | Detalles del último audit (enlaces, referencias, etc) |

## 🎯 Próximos Pasos

- [ ] Publicar con Quartz
- [ ] Configurar GitHub Pages
- [ ] Agregar nuevos cursos según necesidad
- [ ] Mantener actualizado con cursos nuevos

## 📜 Licencia

Este proyecto es una compilación de:
- Contenido de [josedomingo.org](https://josedomingo.org) 
- Cursos de [IESGN - CEP](https://github.com/iesgn)
- Síntesis y organización personales

Respeta las licencias de las fuentes originales.

## 🤝 Notas

- Este es un **segundo cerebro personal** — refleja el aprendizaje y síntesis individual
- Publicado públicamente para compartir conocimiento educativo
- Feedback y sugerencias bienvenidas (issues, PRs)

---

**Creado:** 2026-04-15  
**Última actualización:** 2026-04-16  
**Status:** Listo para publicar con Quartz ✨
