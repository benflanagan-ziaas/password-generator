# Memorable Password Generator

A small, dependency-free password generator that creates passwords in this format:

`123-Red-Dog`

## Security design

- Passwords are generated locally in the browser and are never transmitted or stored.
- Random choices use the browser's cryptographically secure random-number generator.
- The site has no third-party scripts, analytics, external dependencies, forms or network requests.
- A restrictive Content Security Policy blocks scripts and connections that are not part of this site.
- The source is public so these properties can be independently checked.

Never add API keys, passwords, access tokens or other secrets to this repository.

## Important limitation

The requested format has 230,400 possible combinations (about 17.8 bits of entropy). It is memorable, but not strong enough for email, banking, primary accounts or other sensitive uses. Use a password manager-generated password for those accounts.

## GitHub Pages

The site is published from the repository's `main` branch and root (`/`) folder under **Settings → Pages**.
