/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    locale: 'es-PE' | 'en';
  }
}

interface ImportMetaEnv {
  readonly API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
