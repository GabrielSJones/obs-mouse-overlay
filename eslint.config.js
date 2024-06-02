import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
  
    rules: {
      ...tseslint.configs.strictTypeChecked.rules,
      "@typescript-eslint/no-non-null-assertion": "off",
    },

    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ...reactRecommended,
    rules: {
      ...reactRecommended.rules,
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      ...reactRecommended.settings,
      react: { version: "detect" },
    },
  },
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    ignores: ["vite.config.ts", "eslint.config.js", "dist/", "src-tauri/"],
  }
);
