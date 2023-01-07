import ResizeObserver from "resize-observer-polyfill";

if (!("ResizeObserver" in window)) {
  window.ResizeObserver = ResizeObserver;
}
