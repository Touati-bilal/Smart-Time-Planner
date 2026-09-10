export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "planin-theme";

export function systemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveTheme(pref: ThemePreference): ResolvedTheme {
  if (pref === "system") return systemPrefersDark() ? "dark" : "light";
  return pref;
}

export function applyThemeAttribute(pref: ThemePreference) {
  const root = document.documentElement;
  if (pref === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", pref);
  }
}

/**
 * Blocking script string injected before hydration so the correct theme
 * attribute is set before first paint (no flash of the wrong theme).
 *
 * Dark is the app's default: an explicit "system" or "light" choice is
 * always honored, but a first-ever visit (nothing in localStorage yet)
 * lands in dark rather than following the OS preference.
 */
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var pref = localStorage.getItem("${THEME_STORAGE_KEY}");
    if (pref === "light" || pref === "dark") {
      document.documentElement.setAttribute("data-theme", pref);
    } else if (pref !== "system") {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  } catch (e) {}
})();
`;

/**
 * iOS's apple-mobile-web-app-status-bar-style has no "auto" value, so when
 * the app is installed to the home screen the OS status bar (clock/battery)
 * never tracks Light/Dark Mode on its own — it must be set explicitly. This
 * runs before first paint (like THEME_INIT_SCRIPT) so the status bar matches
 * the *system* appearance from the first frame, deliberately independent of
 * whichever in-app theme the user has picked. ThemeProvider keeps it in sync
 * afterwards if the OS setting changes while the app stays open.
 */
export const STATUS_BAR_INIT_SCRIPT = `
(function () {
  try {
    applyStatusBarStyle(window.matchMedia("(prefers-color-scheme: dark)").matches);
  } catch (e) {}
  function applyStatusBarStyle(dark) {
    var meta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "apple-mobile-web-app-status-bar-style");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", dark ? "black" : "default");
  }
})();
`;

export function applyStatusBarStyle(systemDark: boolean) {
  if (typeof document === "undefined") return;
  const meta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (meta) meta.setAttribute("content", systemDark ? "black" : "default");
}
