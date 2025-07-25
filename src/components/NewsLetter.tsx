// src/components/Newsletter.tsx
"use client";

/**
 * Re-export do Newsletter modular
 * Mantém compatibilidade com imports existentes
 */
import { Newsletter as ModularNewsletter } from './newsletter-system';
export default ModularNewsletter;
export { ModularNewsletter as Newsletter };
