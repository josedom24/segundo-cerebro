import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const PagefindSearch: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={`pagefind-search ${displayClass ?? ""}`}>
      <div id="pagefind-search-input"></div>
    </div>
  )
}

PagefindSearch.afterDOMLoaded = `
  const loadPagefind = async () => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "/pagefind/pagefind-ui.css"
    document.head.appendChild(link)

    const script = document.createElement("script")
    script.src = "/pagefind/pagefind-ui.js"
    script.onload = () => {
      new PagefindUI({
        element: "#pagefind-search-input",
        showSubResults: false,
        showImages: false,
        translations: {
          placeholder: "Buscar en el wiki...",
          zero_results: "Sin resultados para [SEARCH_TERM]",
        },
      })
    }
    document.head.appendChild(script)
  }
  loadPagefind()
`

PagefindSearch.css = `
.pagefind-search {
  width: 100%;
}
.pagefind-search .pagefind-ui__search-input {
  width: 100%;
  border-radius: 4px;
}
`

export default (() => PagefindSearch) satisfies QuartzComponentConstructor
