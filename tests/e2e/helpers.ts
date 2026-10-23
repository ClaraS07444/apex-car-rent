import type { Page } from "@playwright/test";
import { routes } from "../../src/i18n/routes";

/** Alle 15 Seiten und die 3 Sprach-404 als URL-Liste. */
export const allPaths = Object.values(routes).flatMap((byLocale) =>
  Object.values(byLocale),
);

export function isDesktop(page: Page): boolean {
  return (page.viewportSize()?.width ?? 0) >= 1024;
}

/** Safari fokussiert Links erst mit Alt+Tab (Systemeinstellung). */
export function tabKey(browserName: string): string {
  return browserName === "webkit" ? "Alt+Tab" : "Tab";
}
