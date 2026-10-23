/// <reference types="vite-plus" />
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, lazyPlugins } from 'vite-plus'

// Base configurable pour un déploiement sous sous-chemin (ex. GitHub Pages /OIDApp/).
const base = process.env.VITE_BASE ?? '/'

// https://vite.dev/config/
export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  lint: {
    plugins: ['react', 'typescript', 'oxc'],
    rules: {
      'react/rules-of-hooks': 'error',
      'react/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],
      'vite-plus/prefer-vite-plus-imports': 'error',
    },
    overrides: [
      {
        files: ['src/routes/**'],
        rules: {
          'react/only-export-components': 'off',
        },
      },
    ],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      {
        name: 'vite-plus',
        specifier: 'vite-plus/oxlint-plugin',
      },
    ],
  },
  fmt: {
    semi: false,
    singleQuote: true,
    printWidth: 100,
    trailingComma: 'all',
    sortPackageJson: false,
    ignorePatterns: ['dist', 'node_modules', 'src/routeTree.gen.ts', 'package-lock.json'],
  },
  base,
  plugins: lazyPlugins(() => [
    // Doit précéder react() : génère src/routeTree.gen.ts (file-based routing).
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ]),
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    globals: false,
  },
})
