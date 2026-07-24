(() => {
  "use strict";

  const passwordOutput = document.getElementById("password");
  const status = document.getElementById("status");
  const generateButton = document.getElementById("generate");
  const copyButton = document.getElementById("copy");
  const { adjectives, nouns } = globalThis.PASSWORD_WORDS;
  const symbols = Object.freeze(["!", "@", "#", "$", "%", "&", "*", "+", "="]);

  if (adjectives.length < 512 || nouns.length < 512) {
    throw new Error("The password word lists are incomplete.");
  }

  function secureInteger(maxExclusive) {
    const range = 0x100000000;
    const limit = range - (range % maxExclusive);
    const values = new Uint32Array(1);

    do {
      crypto.getRandomValues(values);
    } while (values[0] >= limit);

    return values[0] % maxExclusive;
  }

  function secureDigit() {
    return 1 + secureInteger(9);
  }

  function generatePassword() {
    const digits = `${secureDigit()}${secureDigit()}${secureDigit()}`;
    const adjective = adjectives[secureInteger(adjectives.length)];
    const noun = nouns[secureInteger(nouns.length)];
    const symbol = symbols[secureInteger(symbols.length)];

    passwordOutput.textContent = `${digits}-${adjective}-${noun}${symbol}`;
    status.textContent = "";
  }

  async function copyPassword() {
    const password = passwordOutput.textContent;

    try {
      await navigator.clipboard.writeText(password);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = password;
      textArea.setAttribute("readonly", "");
      textArea.className = "copy-fallback";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }

    status.textContent = "Password copied to clipboard";
  }

  generateButton.addEventListener("click", generatePassword);
  copyButton.addEventListener("click", copyPassword);
  generatePassword();
})();
