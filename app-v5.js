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
  const randomOrderInput = document.getElementById("random-order");
  const manualOrder = document.getElementById("manual-order");
  const orderList = document.getElementById("order-list");
  const orderCountElements = {
    words: document.getElementById("order-words-count"),
    numbers: document.getElementById("order-numbers-count"),
    specials: document.getElementById("order-specials-count")
  };
  const { adjectives, nouns } = globalThis.PASSWORD_WORDS;
  const symbols = Object.freeze(["!", "@", "#", "$", "%", "&", "*", "+", "="]);
  const groupTypes = Object.freeze(["numbers", "words", "specials"]);
  let draggedOrderItem = null;

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

  function secureShuffle(items) {
    const shuffledItems = [...items];

    for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
      const randomIndex = secureInteger(index + 1);
      [shuffledItems[index], shuffledItems[randomIndex]] = [
        shuffledItems[randomIndex],
        shuffledItems[index]
      ];
    }

    return shuffledItems;
  }

  function selectedSeparator() {
    const [separator = "-"] = Array.from(separatorInput.value);
    return separator || "-";
  }

  function selectedCounts() {
    return {
      words: Number(wordCountInput.value),
      numbers: Number(numberCountInput.value),
      specials: Number(specialCountInput.value)
    };
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

  function orderItems() {
    return Array.from(orderList.querySelectorAll(".order-item"));
  }

  function activeOrderItems() {
    const counts = selectedCounts();
    return orderItems().filter((item) => counts[item.dataset.group] > 0);
  }

  function manualOrderTypes() {
    return activeOrderItems().map((item) => item.dataset.group);
  }

  function updateMoveButtons() {
    const visibleItems = activeOrderItems();

    visibleItems.forEach((item, index) => {
      item.querySelector('[data-direction="up"]').disabled = index === 0;
      item.querySelector('[data-direction="down"]').disabled = index === visibleItems.length - 1;
    });
  }

  function updateOrderEditor() {
    const counts = selectedCounts();

    for (const item of orderItems()) {
      const group = item.dataset.group;
      const count = counts[group];
      const label = group === "specials"
        ? `special character${count === 1 ? "" : "s"}`
        : `${group.slice(0, -1)}${count === 1 ? "" : "s"}`;

      item.hidden = count === 0;
      orderCountElements[group].textContent = `×${count}`;
      orderCountElements[group].setAttribute("aria-label", `${count} ${label}`);
    }

    manualOrder.hidden = randomOrderInput.checked;
    randomOrderInput.setAttribute("aria-expanded", String(!randomOrderInput.checked));
    updateMoveButtons();
  }

  function joinGroups(order, groups, separator) {
    let password = "";

    order.forEach((group, index) => {
      if (index === 0) {
        password = groups[group];
        return;
      }

      const previousGroup = order[index - 1];
      const joiner = group === "specials" || previousGroup === "specials"
        ? ""
        : separator;

      password += `${joiner}${groups[group]}`;
    });

    return password;
  }

  function generatePassword() {
    const counts = selectedCounts();
    const separator = selectedSeparator();
    const groups = {
      numbers: Array.from({ length: counts.numbers }, secureDigit).join(""),
      words: generateWords(counts.words).join(separator),
      specials: Array.from(
        { length: counts.specials },
        () => symbols[secureInteger(symbols.length)]
      ).join("")
    };
    const activeGroups = groupTypes.filter((group) => groups[group]);
    const order = randomOrderInput.checked
      ? secureShuffle(activeGroups)
      : manualOrderTypes();

    passwordOutput.textContent = joinGroups(order, groups, separator);
    status.textContent = "";
  }

  function updateSlider(input, output) {
    output.value = input.value;
    output.textContent = input.value;
    updateOrderEditor();
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

  function moveOrderItem(item, direction) {
    const visibleItems = activeOrderItems();
    const currentIndex = visibleItems.indexOf(item);
    const adjacentIndex = direction === "up"
      ? currentIndex - 1
      : currentIndex + 1;

    if (currentIndex < 0 || adjacentIndex < 0 || adjacentIndex >= visibleItems.length) {
      return;
    }

    const adjacentItem = visibleItems[adjacentIndex];

    if (direction === "up") {
      orderList.insertBefore(item, adjacentItem);
    } else {
      orderList.insertBefore(adjacentItem, item);
    }

    updateMoveButtons();
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
  randomOrderInput.addEventListener("change", () => {
    updateOrderEditor();
    generatePassword();
  });

  orderList.addEventListener("click", (event) => {
    const moveButton = event.target.closest(".order-move");

    if (!moveButton) {
      return;
    }

    moveOrderItem(
      moveButton.closest(".order-item"),
      moveButton.dataset.direction
    );
  });

  orderList.addEventListener("dragover", (event) => {
    if (!draggedOrderItem) {
      return;
    }

    event.preventDefault();
    const targetItem = event.target.closest(".order-item");

    if (!targetItem || targetItem === draggedOrderItem || targetItem.hidden) {
      return;
    }

    const targetBounds = targetItem.getBoundingClientRect();
    const insertAfter = event.clientY > targetBounds.top + targetBounds.height / 2;
    orderList.insertBefore(
      draggedOrderItem,
      insertAfter ? targetItem.nextElementSibling : targetItem
    );
  });

  orderList.addEventListener("drop", (event) => {
    event.preventDefault();
  });

  for (const item of orderItems()) {
    item.addEventListener("dragstart", (event) => {
      draggedOrderItem = item;
      item.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", item.dataset.group);
    });

    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
      draggedOrderItem = null;
      updateMoveButtons();
      generatePassword();
    });
  }

  wordCountValue.value = wordCountInput.value;
  numberCountValue.value = numberCountInput.value;
  specialCountValue.value = specialCountInput.value;
  updateOrderEditor();
  generatePassword();
})();
