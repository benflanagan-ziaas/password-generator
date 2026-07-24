(() => {
  "use strict";

  const passwordOutput = document.getElementById("password");
  const status = document.getElementById("status");
  const generateButton = document.getElementById("generate");
  const copyButton = document.getElementById("copy");
  const wordCountInput = document.getElementById("word-count");
  const wordCountValue = document.getElementById("word-count-value");
  const numberCountInput = document.getElementById("number-count");
  const numberCountValue = document.getElementById("number-count-value");
  const specialCountInput = document.getElementById("special-count");
  const specialCountValue = document.getElementById("special-count-value");
  const separatorInput = document.getElementById("separator");
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

  function selectedSeparator() {
    const [separator = "-"] = Array.from(separatorInput.value);
    return separator || "-";
  }

  function generateWords(wordCount) {
    const generatedWords = [
      adjectives[secureInteger(adjectives.length)]
    ];
    const usedNouns = new Set();

    while (generatedWords.length < wordCount) {
      const noun = nouns[secureInteger(nouns.length)];

      if (!usedNouns.has(noun)) {
        usedNouns.add(noun);
        generatedWords.push(noun);
      }
    }

    return generatedWords;
  }

  function generatePassword() {
    const wordCount = Number(wordCountInput.value);
    const numberCount = Number(numberCountInput.value);
    const specialCount = Number(specialCountInput.value);
    const separator = selectedSeparator();
    const components = [];

    if (numberCount > 0) {
      const digits = Array.from({ length: numberCount }, secureDigit).join("");
      components.push(digits);
    }

    components.push(...generateWords(wordCount));

    const specialCharacters = Array.from(
      { length: specialCount },
      () => symbols[secureInteger(symbols.length)]
    ).join("");

    passwordOutput.textContent = `${components.join(separator)}${specialCharacters}`;
    status.textContent = "";
  }

  function updateSlider(input, output) {
    output.value = input.value;
    output.textContent = input.value;
    generatePassword();
  }

  function updateSeparator() {
    const [firstCharacter = ""] = Array.from(separatorInput.value);

    if (firstCharacter && /\s/u.test(firstCharacter)) {
      separatorInput.value = "-";
    } else if (separatorInput.value !== firstCharacter) {
      separatorInput.value = firstCharacter;
    }

    generatePassword();
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
  wordCountInput.addEventListener("input", () => updateSlider(wordCountInput, wordCountValue));
  numberCountInput.addEventListener("input", () => updateSlider(numberCountInput, numberCountValue));
  specialCountInput.addEventListener("input", () => updateSlider(specialCountInput, specialCountValue));
  separatorInput.addEventListener("input", updateSeparator);
  separatorInput.addEventListener("blur", () => {
    if (!separatorInput.value) {
      separatorInput.value = "-";
      generatePassword();
    }
  });

  wordCountValue.value = wordCountInput.value;
  numberCountValue.value = numberCountInput.value;
  specialCountValue.value = specialCountInput.value;
  generatePassword();
})();
