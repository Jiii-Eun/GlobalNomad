export default function scrollToAnchor(id: string, delay = 500) {
  setTimeout(() => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, delay);
}
