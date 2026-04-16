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

  document.addEventListener("click", (e) => {
    const resultsArea = document.querySelector(".pagefind-ui__results-area")
    const searchInput = document.querySelector(".pagefind-ui__search-input")
    if (resultsArea && !resultsArea.contains(e.target) && e.target !== searchInput) {
      const input = document.querySelector(".pagefind-ui__search-input")
      if (input) input.value = ""
      if (resultsArea) resultsArea.innerHTML = ""
    }
  })
`

PagefindSearch.css = `
.pagefind-search {
  width: 100%;
  position: relative;
}

.pagefind-ui__results-area {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 80px;
}

.pagefind-ui__results {
  background: var(--light);
  border-radius: 8px;
  padding: 1rem;
  width: 90%;
  max-width: 700px;
  max-height: 70vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  list-style: none;
  margin: 0;
}

.pagefind-ui__results-area:empty {
  display: none;
}

.pagefind-ui__message:empty {
  display: none;
}

.pagefind-ui__message {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  background: var(--light);
  border-radius: 8px;
  padding: 1rem 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
`

export default (() => PagefindSearch) satisfies QuartzComponentConstructor
