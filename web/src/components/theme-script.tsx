export function ThemeScript() {
  const script = `
    try {
      const storedTheme = localStorage.getItem('lingua_ai_theme');
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.dataset.theme = storedTheme || systemTheme;
    } catch {}
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
