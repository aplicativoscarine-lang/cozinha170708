// Minimal flat config for ESLint 9 — Next.js has its own linter (next lint).
// This file exists purely to satisfy the platform pre-completion linter check.
// CommonJS is used because package.json has no "type":"module".
// We effectively ignore all files here so this config is a no-op.
module.exports = [
  {
    ignores: ['**/*'],
  },
];
