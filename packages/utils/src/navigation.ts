import type { NavigateFunction } from "react-router-dom";

let navigateRef: NavigateFunction | null = null;

export function setNavigate(navigate: NavigateFunction): void {
  navigateRef = navigate;
}

export function navigateTo(path: string): void {
  if (!navigateRef) {
    console.warn(`navigateTo("${path}") called before the router mounted — ignoring.`);
    return;
  }
  navigateRef(path);
}
