(() => {
  "use strict";

  const passwordOutput = document.getElementById("password");
  const status = document.getElementById("status");
  const generateButton = document.getElementById("generate");
  const copyButton = document.getElementById("copy");

  const colours = Object.freeze([
    "Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink", "Silver",
    "Gold", "Black", "White", "Brown", "Teal", "Indigo", "Violet", "Coral"
  ]);

  const animals = Object.freeze([
    "Dog", "Cat", "Fox", "Bear", "Tiger", "Lion", "Panda", "Otter",
    "Rabbit", "Badger", "Falcon", "Dolphin", "Koala", "Gecko", "Moose", "Zebra"
  ]);

  function secureInteger(maxExclusive) {
    const range = 0x100000000;
    const limit = range - (range % maxExclusive);
    const values = new Uint32Array(1);

    do {
      crypto.getRandomValues(values);
    } while (values[0] >= limit);

    return values[0] % maxExclusive;
  }

  function generatePassword() {
    const number = 100 + secureInteger(900);
    const colour = colours[secureInteger(colours.length)];
    const animal = animals[secureInteger(animals.length)];

    passwordOutput.textContent = `${number}-${colour}-${animal}`;
    status.textContent = "3-digit number · colour · animal";
    copyButton.textContent = "Copy password";
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

    copyButton.textContent = "Copied!";
    status.textContent = "Password copied to clipboard";
  }

  generateButton.addEventListener("click", generatePassword);
  copyButton.addEventListener("click", copyPassword);
  generatePassword();
})();
