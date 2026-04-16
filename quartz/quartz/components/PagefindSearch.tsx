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
  function setupModal() {
    const modal = document.createElement("div")
    modal.id = "pagefind-modal"
    modal.innerHTML = '<div id="pagefind-modal-inner"></div>'
    document.body.appendChild(modal)

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal()
    })

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal()
    })
  }

  function closeModal() {
    const modal = document.getElementById("pagefind-modal")
    if (modal) modal.style.display = "none"
    const input = document.querySelector(".pagefind-ui__search-input")
    if (input) { input.value = ""; input.dispatchEvent(new Event("input")) }
  }

  function initPagefind() {
    if (typeof PagefindUI === "undefined" || !document.getElementById("pagefind-search-input")) {
      setTimeout(initPagefind, 100)
      return
    }

    setupModal()

    new PagefindUI({
      element: "#pagefind-search-input",
      showSubResults: false,
      showImages: false,
      translations: {
        placeholder: "Buscar en el wiki...",
        zero_results: "Sin resultados para [SEARCH_TERM]",
      },
    })

    // Mover el área de resultados al modal
    setTimeout(() => {
      const resultsArea = document.querySelector(".pagefind-ui__results-area")
      const modalInner = document.getElementById("pagefind-modal-inner")
      if (resultsArea && modalInner) {
        modalInner.appendChild(resultsArea)
      }
    }, 200)

    // Mostrar modal al escribir
    const input = document.querySelector(".pagefind-ui__search-input")
    if (input) {
      input.addEventListener("input", () => {
        const modal = document.getElementById("pagefind-modal")
        if (modal) modal.style.display = input.value ? "flex" : "none"
      })
    }
  }

  initPagefind()

  document.addEventListener("nav", () => {
    const existing = document.getElementById("pagefind-modal")
    if (existing) existing.remove()
    const el = document.getElementById("pagefind-search-input")
    if (el) el.innerHTML = ""
    initPagefind()
  })
`

PagefindSearch.css = `
.pagefind-search {
  width: 100%;
}

#pagefind-modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.5);
  align-items: flex-start;
  justify-content: center;
  padding-top: 80px;
}

#pagefind-modal-inner {
  background: var(--light);
  border-radius: 8px;
  padding: 1rem;
  width: 90%;
  max-width: 700px;
  max-height: 70vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
`

export default (() => PagefindSearch) satisfies QuartzComponentConstructor
