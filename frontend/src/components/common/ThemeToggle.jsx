import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/useTheme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
      className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-200/60 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      {isDark ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
};

export default ThemeToggle;
