import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface ExternalLink {
  label: string
  url: string
  internal?: boolean
}

interface Options {
  links: ExternalLink[]
}

export default ((opts?: Options) => {
  const ExternalLinks: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const links = opts?.links ?? []
    return (
      <nav class={`external-links ${displayClass ?? ""}`} aria-expanded="true">
        <button
          type="button"
          class="external-links-toggle mobile-only"
          aria-controls="external-links-content"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="external-links-icon"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          <span>Enlaces</span>
        </button>
        <div id="external-links-content" class="external-links-content">
          <ul>
            {links.map(({ label, url, internal }) => (
              <li>
                <a href={url} {...(!internal && { target: "_blank", rel: "noopener noreferrer" })}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    )
  }

  ExternalLinks.css = `
.external-links {
  margin-top: 0.5rem;
}

.external-links-toggle {
  display: none;
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  color: var(--secondary);
  font-size: 0.9rem;
  gap: 0.5rem;
  align-items: center;
}

.external-links-toggle:hover {
  color: var(--tertiary);
}

.external-links-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.external-links.collapsed .external-links-icon {
  transform: rotate(-90deg);
}

.external-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.external-links a {
  font-size: 0.9rem;
  color: var(--secondary);
  text-decoration: none;
  opacity: 0.8;
}

.external-links a:hover {
  opacity: 1;
  color: var(--tertiary);
}

@media (max-width: 768px) {
  .external-links-toggle {
    display: flex;
  }

  .external-links.collapsed .external-links-content {
    display: none;
  }

  .external-links-content {
    margin-top: 0.5rem;
  }

  .external-links ul {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .external-links a {
    font-size: 0.85rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    background: var(--lightgray);
  }
}
`

  ExternalLinks.afterHydrate = () => {
    const toggleButtons = document.querySelectorAll(".external-links-toggle")
    toggleButtons.forEach((button) => {
      button.addEventListener("click", function (this: HTMLElement) {
        const nav = this.closest(".external-links") as HTMLElement
        if (nav) {
          nav.classList.toggle("collapsed")
          nav.setAttribute(
            "aria-expanded",
            nav.getAttribute("aria-expanded") === "true" ? "false" : "true",
          )
        }
      })
    })
  }

  return ExternalLinks
}) satisfies QuartzComponentConstructor
