import { expect, type Locator, type Page } from "@playwright/test";
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

/**
 * Lädt eine Seite und wartet, bis die Webschrift eingetauscht ist. Sonst kann
 * der Umbruch beim Schrifttausch ein Ziel kurz vor dem Klick verschieben.
 */
export async function gotoReady(page: Page, url: string): Promise<void> {
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

/**
 * Scrollt ein Ziel in den sichtbaren Bereich, wartet auf seine Freigabe durch
 * die Scroll-Animation (data-revealed) und klickt es dann.
 */
export async function clickRevealed(target: Locator): Promise<void> {
  await target.scrollIntoViewIfNeeded();
  await expect(
    target.locator("xpath=ancestor::*[@data-reveal][1]"),
  ).toHaveAttribute("data-revealed", "");
  await target.click();
}
