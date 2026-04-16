function toggleExternalLinks(this: HTMLElement) {
  const nav = this.closest(".external-links") as HTMLElement
  if (!nav) return

  nav.classList.toggle("collapsed")
  nav.setAttribute(
    "aria-expanded",
    nav.getAttribute("aria-expanded") === "true" ? "false" : "true",
  )
}

const toggleButtons = document.querySelectorAll(".external-links-toggle")
toggleButtons.forEach((button) => {
  button.addEventListener("click", toggleExternalLinks)
})
