# Simple Password Generator

A dependency-free generator for readable passwords such as:

`482-Gentle-Rocket-!`

## Security design

- Every choice is generated locally with the browser's cryptographically secure random-number generator.
- Every digit is selected independently from `1–9`.
- Words come from curated lists of 512 positive or neutral adjectives and 512 child-friendly nouns.
- The default uses two words, three digits and one clear symbol in a stable `123-Red-Dog-!`-style order.
- Words, digits and special characters can each be adjusted from one to three.
- The separator can be replaced with another visible character.
- The separator is placed between every group, including on both sides of a special-character group in the middle.
- Component groups stay in the chosen drag-and-drop order until **Randomise all** visibly reshuffles the rows.
- On wider screens, component amounts and the separator live in the left pane, while ordering lives in the right; the panes stack on smaller screens.
- The editor uses a touch-friendly drag handle, shows a live drop marker, confirms moved rows, includes arrow controls for keyboards, and hides groups whose count is zero.
- **Randomise all** securely changes every count from one to three, the separator and the visible group order.
- Regenerate, Randomise all and Copy each provide a distinct icon animation, while respecting reduced-motion preferences. The order rows move into their new positions, and the two Copy squares overlap before separating again.
- The separator field flashes its border when the character changes.
- **Randomise all** smoothly moves the slider thumbs to guaranteed-new values while their number badges pop at each step.
- On phones, the three main actions stack at equal full width in their natural Regenerate, Randomise all, Copy order.
- Special characters are selected from nine clear, commonly accepted symbols.
- Generated passwords are never transmitted, stored or logged.
- The site has no analytics, external libraries, third-party scripts, forms or network requests.
- A restrictive Content Security Policy blocks scripts and connections that are not part of the site.

Never add API keys, passwords, access tokens or other secrets to this repository.

## Important limitation

The compact default provides about 30.7 bits of entropy. Enabling random group order adds about 2.6 bits; choosing three words adds roughly another nine bits. This generator prioritises readability and is not suitable for the highest-value accounts at its default settings. Use three words where a longer memorable password is acceptable, or use a reputable password manager-generated password for email, banking, administrator and primary accounts. Turn on multi-factor authentication wherever possible.

## Guidance followed

- [NIST SP 800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html) prioritises password length, requires at least 15 characters for single-factor use, permits long passphrases, and advises against arbitrary character-composition rules.
- The [UK National Cyber Security Centre](https://www.ncsc.gov.uk/collection/top-tips-for-staying-secure-online/three-random-words) recommends random-word passphrases for a strong balance of length and memorability, and warns that lookalike substitutions add little security while hurting recall.

## GitHub Pages

The site is published from the repository's `main` branch and root (`/`) folder under **Settings → Pages**.

