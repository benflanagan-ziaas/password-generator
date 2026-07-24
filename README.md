# Simple Password Generator

A dependency-free generator for readable passwords such as:

`482-Gentle-Rocket!`

## Security design

- Every choice is generated locally with the browser's cryptographically secure random-number generator.
- Each of the three digits is selected independently from `1–9`.
- Words come from curated lists of 512 positive or neutral adjectives and 512 child-friendly nouns.
- The number of words, digits and special characters can be adjusted.
- The separator can be replaced with another visible character.
- Special characters are selected from nine clear, commonly accepted symbols.
- Generated passwords are never transmitted, stored or logged.
- The site has no analytics, external libraries, third-party scripts, forms or network requests.
- A restrictive Content Security Policy blocks scripts and connections that are not part of the site.

Never add API keys, passwords, access tokens or other secrets to this repository.

## Important limitation

The default settings have 1,719,926,784 possible combinations (about 30.7 bits of entropy). Adding components increases the password space; removing them reduces it. This generator is still intended for readability rather than high-value account security. Use a password manager-generated password for email, banking, administrator and primary accounts.

## GitHub Pages

The site is published from the repository's `main` branch and root (`/`) folder under **Settings → Pages**.
