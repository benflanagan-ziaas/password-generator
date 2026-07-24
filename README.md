# Simple Password Generator

A dependency-free generator for readable passwords such as:

`482-Gentle-Rocket!`

## Security design

- Every choice is generated locally with the browser's cryptographically secure random-number generator.
- Each of the three digits is selected independently from `1–9`.
- Words come from curated lists of 128 positive adjectives and 128 child-friendly nouns.
- The final character is selected from nine clear, commonly accepted symbols.
- Generated passwords are never transmitted, stored or logged.
- The site has no analytics, external libraries, third-party scripts, forms or network requests.
- A restrictive Content Security Policy blocks scripts and connections that are not part of the site.

Never add API keys, passwords, access tokens or other secrets to this repository.

## Important limitation

This format has 107,495,424 possible combinations (about 26.7 bits of entropy). That is roughly 466 times the original generator's password space, but it is still intended for readability rather than high-value account security. Use a password manager-generated password for email, banking, administrator and primary accounts.

## GitHub Pages

The site is published from the repository's `main` branch and root (`/`) folder under **Settings → Pages**.
