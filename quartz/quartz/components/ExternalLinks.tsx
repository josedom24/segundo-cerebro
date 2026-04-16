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
      <nav class={`external-links ${displayClass ?? ""}`}>
        <ul>
          {links.map(({ label, url, internal }) => (
            <li>
              <a href={url} {...(!internal && { target: "_blank", rel: "noopener noreferrer" })}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    )
  }

  ExternalLinks.css = `
.external-links {
  margin-top: 0.5rem;
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
`
  return ExternalLinks
}) satisfies QuartzComponentConstructor
