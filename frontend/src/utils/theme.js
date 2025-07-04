// utils/theme.js
export const themes = {
    light: {
      name: "Light",
      colors: {
        darkbg: "#ffffff",
        darkcard: "#f3f4f6",
        darktext: "#1f2937",
        accent: "#e879f9",
      }
    },
    dark: {
      name: "Dark",
      colors: {
        darkbg: "#0f0a1a",
        darkcard: "#1a1030",
        darktext: "#f8fafc",
        accent: "#e879f9",
      }
    },
    midnight: {
      name: "Midnight",
      colors: {
        darkbg: "#0a0a1a",
        darkcard: "#151530",
        darktext: "#e0e0ff",
        accent: "#9f7aea",
      }
    },
    slate: {
      name: "Slate",
      colors: {
        darkbg: "#1a1a2e",
        darkcard: "#2a2a3a",
        darktext: "#e2e8f0",
        accent: "#818cf8",
      }
    },
    amber: {
      name: "Amber",
      colors: {
        darkbg: "#1a1200",
        darkcard: "#2a1e00",
        darktext: "#fef3c7",
        accent: "#f59e0b",
      }
    },
    system: {
      name: "System Default",
      colors: null
    }
  };
  
  export function applyTheme(themeName) {
    const theme = themes[themeName];
    const root = document.documentElement;
    let appliedTheme = themeName;
  
    // Handle system theme
    if (themeName === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
      appliedTheme = prefersDark ? "dark" : "light";
    } else {
      root.classList.toggle("dark", themeName !== "light");
    }
  
    // Apply custom colors if they exist
    if (theme.colors) {
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }
  
    localStorage.setItem("theme", themeName);
    return theme.name;
  }
  
  export function getCurrentTheme() {
    const savedTheme = localStorage.getItem("theme");
  
    if (savedTheme) {
      if (savedTheme === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        return prefersDark ? "dark" : "light";
      }
      return savedTheme;
    }
  
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }
  
  export function getCurrentThemeName() {
    const savedTheme = localStorage.getItem("theme") || "system";
    return themes[savedTheme].name;
  }