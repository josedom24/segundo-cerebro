import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const PagefindSearch: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={`pagefind-search ${displayClass ?? ""}`}>
      <div id="pagefind-search-input"></div>
    </div>
  )
}

PagefindSearch.beforeDOMLoaded = `
  const pLink = document.createElement("link")
  pLink.rel = "stylesheet"
  pLink.href = "/pagefind/pagefind-ui.css"
  document.head.appendChild(pLink)

  const pScript = document.createElement("script")
  pScript.src = "/pagefind/pagefind-ui.js"
  pScript.type = "text/javascript"
  document.head.appendChild(pScript)
`

PagefindSearch.afterDOMLoaded = `
  function initPagefind() {
    if (typeof PagefindUI === "undefined" || !document.getElementById("pagefind-search-input")) {
      setTimeout(initPagefind, 100)
      return
    }
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
  initPagefind()

  document.addEventListener("nav", () => {
    const el = document.getElementById("pagefind-search-input")
    if (el) el.innerHTML = ""
    initPagefind()
  })
`

PagefindSearch.css = `
.pagefind-search {
  width: 100%;
}
`

export default (() => PagefindSearch) satisfies QuartzComponentConstructor
