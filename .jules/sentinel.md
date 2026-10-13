## 2024-05-14 - Vite Environment Variable Leak
**Vulnerability:** The VITE_ADMIN_PASSWORD was being read as a plaintext environment variable. In Vite, any environment variable prefixed with VITE_ is statically replaced with its value during the build process, thereby exposing the plaintext password to the public bundle.
**Learning:** Client-side bundles should never include plaintext passwords or secrets as environment variables, even if they are only used to verify an input on the client-side. The public bundler will expose them.
**Prevention:** Always hash the password and provide the hash as the environment variable (e.g., VITE_ADMIN_PASSWORD_HASH), then check if the hash of the user input matches the provided hash.

## 2024-05-18 - [Mutation XSS Bypass via <template> in DOMParser]
**Vulnerability:** A custom HTML sanitizer using `DOMParser` and iterating over `querySelectorAll('*')` could be bypassed using `<template>`, `<svg>`, or `<math>` elements.
**Learning:** Elements inside `<template>` are parsed into a separate document fragment (`HTMLTemplateElement.content`) and do not appear in a standard `querySelectorAll('*')` tree traversal, allowing malicious scripts inside templates to survive sanitization. `<math>` and `<svg>` elements alter HTML parsing context.
**Prevention:** Always explicitly query and `.remove()` known content-masking (`<template>`) and foreign context (`<svg>`, `<math>`) elements *before* iterating over the DOM tree for attribute/tag sanitization.
