# Simple Password Generator

A dependency-free generator for readable passwords such as:

`482-Gentle-Rocket-Harbor-Pencil!`

## Security design

- Every choice is generated locally with the browser's cryptographically secure random-number generator.
- Every digit is selected independently from `1–9`.
- Words come from curated lists of 512 positive or neutral adjectives and 512 child-friendly nouns.
- The default uses four words, three digits and one clear symbol, so even the shortest possible result exceeds 15 characters.
- The number of words, digits and special characters can be adjusted.
- The separator can be replaced with another visible character.
- The separator is placed between every non-empty group, including special characters.
- Component groups can be securely shuffled, or placed in a chosen order with the drag-and-drop editor.
- The editor shows a live drop marker, confirms moved rows, includes arrow controls for touchscreens and keyboards, and hides groups whose count is zero.
- **Randomise all** securely changes every count, the separator and the group order while keeping at least four words, one digit and one special character.
- Special characters are selected from nine clear, commonly accepted symbols.
- Generated passwords are never transmitted, stored or logged.
- The site has no analytics, external libraries, third-party scripts, forms or network requests.
- A restrictive Content Security Policy blocks scripts and connections that are not part of the site.

Never add API keys, passwords, access tokens or other secrets to this repository.

## Important limitation

The default word, digit and symbol choices provide about 48.7 bits of entropy. Random group order adds about 2.6 bits when all three groups are enabled, for roughly 51 bits in total. Adding more words matters much more; removing components reduces the password space. This generator is still intended for readability rather than the highest-value account security. Use a reputable password manager-generated password for email, banking, administrator and primary accounts, and turn on multi-factor authentication wherever possible.

## Guidance followed

- [NIST SP 800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html) prioritises password length, requires at least 15 characters for single-factor use, permits long passphrases, and advises against arbitrary character-composition rules.
- The [UK National Cyber Security Centre](https://www.ncsc.gov.uk/collection/top-tips-for-staying-secure-online/three-random-words) recommends random-word passphrases for a strong balance of length and memorability, and warns that lookalike substitutions add little security while hurting recall.

## GitHub Pages

The site is published from the repository's `main` branch and root (`/`) folder under **Settings → Pages**.
