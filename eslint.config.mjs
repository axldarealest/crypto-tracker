import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // Règles basiques React/Next.js seulement
      "react/no-unescaped-entities": "off", // Permettre les apostrophes
      "prefer-const": "warn", // Warning pour let → const
      "react-hooks/exhaustive-deps": "warn", // Warning dépendances useEffect
    }
  }
];

export default eslintConfig;
