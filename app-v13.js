(() => {
  "use strict";

  const passwordOutput = document.getElementById("password");
  const status = document.getElementById("status");
  const generateButton = document.getElementById("generate");
  const randomiseAllButton = document.getElementById("randomise-all");
  const copyButton = document.getElementById("copy");
  const wordCountInput = document.getElementById("word-count");
  const wordCountValue = document.getElementById("word-count-value");
  const numberCountInput = document.getElementById("number-count");
  const numberCountValue = document.getElementById("number-count-value");
  const specialCountInput = document.getElementById("special-count");
  const specialCountValue = document.getElementById("special-count-value");
  const separatorInput = document.getElementById("separator");
  const orderList = document.getElementById("order-list");
  const dropIndicator = document.getElementById("drop-indicator");
  const orderCountElements = {
    words: document.getElementById("order-words-count"),
    numbers: document.getElementById("order-numbers-count"),
    specials: document.getElementById("order-specials-count")
  };
  const { adjectives, nouns } = globalThis.PASSWORD_WORDS;
  const symbols = Object.freeze(["!", "@", "#", "$", "%", "&", "*", "+", "="]);
  const separators = Object.freeze(["-", "_", ".", ":", "~"]);
  const rangeAnimationTokens = new WeakMap();
  let draggedOrderItem = null;
  let pointerDragState = null;
  let randomiseRun = 0;

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
      words: Math.round(Number(wordCountInput.value)),
      numbers: Math.round(Number(numberCountInput.value)),
      specials: Math.round(Number(specialCountInput.value))
    };
  }

  function secureDifferentCount(input) {
    const currentCount = Math.round(Number(input.value));
    const alternatives = [1, 2, 3].filter((count) => count !== currentCount);
    return alternatives[secureInteger(alternatives.length)];
  }

  function secureDifferentSeparator() {
    const currentSeparator = selectedSeparator();
    const alternatives = separators.filter((separator) => separator !== currentSeparator);
    return alternatives[secureInteger(alternatives.length)];
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

    updateMoveButtons();
  }

  function joinGroups(order, groups, separator) {
    return order.map((group) => groups[group]).join(separator);
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
    passwordOutput.textContent = joinGroups(manualOrderTypes(), groups, separator);
    status.textContent = "";
  }

  function updateSlider(input, output) {
    rangeAnimationTokens.delete(input);
    input.step = "1";
    restartAnimation(input, "is-adjusting");
    output.value = input.value;
    output.textContent = input.value;
    updateOrderEditor();
    generatePassword();
  }

  function updateControlValues() {
    wordCountValue.value = wordCountInput.value;
    wordCountValue.textContent = wordCountInput.value;
    numberCountValue.value = numberCountInput.value;
    numberCountValue.textContent = numberCountInput.value;
    specialCountValue.value = specialCountInput.value;
    specialCountValue.textContent = specialCountInput.value;
  }

  function updateSeparator() {
    restartAnimation(separatorInput, "is-changing");
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
    showMovedFeedback(item);
  }

  function showMovedFeedback(item) {
    const itemName = item.querySelector(".order-name").textContent;
    item.classList.remove("just-dropped");
    requestAnimationFrame(() => item.classList.add("just-dropped"));
    setTimeout(() => item.classList.remove("just-dropped"), 550);
    status.textContent = `${itemName} moved`;
  }

  function positionDropIndicator(pointerY, pointerX = null) {
    if (pointerX !== null) {
      const listBounds = orderList.getBoundingClientRect();
      const outsideList = pointerX < listBounds.left - 24
        || pointerX > listBounds.right + 24
        || pointerY < listBounds.top - 24
        || pointerY > listBounds.bottom + 24;

      if (outsideList) {
        dropIndicator.hidden = true;
        return;
      }
    }

    const remainingItems = activeOrderItems().filter((item) => item !== draggedOrderItem);
    const nextItem = remainingItems.find((item) => {
      const bounds = item.getBoundingClientRect();
      return pointerY < bounds.top + bounds.height / 2;
    });

    dropIndicator.hidden = false;
    orderList.insertBefore(dropIndicator, nextItem || null);
  }

  function beginDragging(item) {
    if (draggedOrderItem) {
      return;
    }

    draggedOrderItem = item;
    item.setAttribute("aria-grabbed", "true");
    orderList.classList.add("drag-active");
    status.textContent = `Moving ${item.querySelector(".order-name").textContent}`;
    requestAnimationFrame(() => {
      if (draggedOrderItem === item) {
        item.classList.add("dragging");
      }
    });
  }

  function finishDragging(commitMove) {
    if (!draggedOrderItem) {
      return;
    }

    const movedItem = draggedOrderItem;

    if (commitMove && !dropIndicator.hidden) {
      orderList.insertBefore(movedItem, dropIndicator);
    }

    movedItem.classList.remove("dragging");
    movedItem.setAttribute("aria-grabbed", "false");
    orderList.classList.remove("drag-active");
    dropIndicator.hidden = true;
    draggedOrderItem = null;
    updateMoveButtons();

    if (commitMove) {
      generatePassword();
      showMovedFeedback(movedItem);
    }
  }

  function shuffledOrderItems() {
    const items = orderItems();
    let shuffledItems = secureShuffle(items);
    const orderDidNotChange = items.every((item, index) => item === shuffledItems[index]);

    if (orderDidNotChange && items.length > 1) {
      const offset = 1 + secureInteger(items.length - 1);
      shuffledItems = [...items.slice(offset), ...items.slice(0, offset)];
    }

    return shuffledItems;
  }

  function animateRangeTo(input, output, targetValue) {
    const startValue = Number(input.value);
    const token = {};
    const duration = 520 + (Math.abs(targetValue - startValue) * 120);

    rangeAnimationTokens.set(input, token);
    restartAnimation(input, "is-adjusting");

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      input.value = String(targetValue);
      output.value = String(targetValue);
      output.textContent = String(targetValue);
      rangeAnimationTokens.delete(input);
      return Promise.resolve();
    }

    input.step = "any";

    return new Promise((resolve) => {
      requestAnimationFrame((startTime) => {
        function moveSlider(currentTime) {
          if (rangeAnimationTokens.get(input) !== token) {
            resolve();
            return;
          }

          const progress = Math.min((currentTime - startTime) / duration, 1);
          const easedProgress = 1 - ((1 - progress) ** 3);
          const animatedValue = startValue + ((targetValue - startValue) * easedProgress);
          const displayedValue = String(Math.round(animatedValue));

          input.value = String(animatedValue);

          if (output.textContent !== displayedValue) {
            output.value = displayedValue;
            output.textContent = displayedValue;
            restartAnimation(output, "is-changing");
          }

          if (progress < 1) {
            requestAnimationFrame(moveSlider);
            return;
          }

          input.step = "1";
          input.value = String(targetValue);
          output.value = String(targetValue);
          output.textContent = String(targetValue);
          rangeAnimationTokens.delete(input);
          resolve();
        }

        moveSlider(startTime);
      });
    });
  }

  function shuffleOrderEditor() {
    const items = orderItems();
    const initialPositions = new Map(
      items.map((item) => [item, item.getBoundingClientRect().top])
    );
    const shuffledItems = shuffledOrderItems();

    for (const item of shuffledItems) {
      orderList.insertBefore(item, dropIndicator);
    }

    updateMoveButtons();
    restartAnimation(orderList, "is-shuffling");

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    shuffledItems.forEach((item, index) => {
      const distance = initialPositions.get(item) - item.getBoundingClientRect().top;

      if (Math.abs(distance) < 1 || typeof item.animate !== "function") {
        return;
      }

      item.animate(
        [
          { transform: `translateY(${distance}px)` },
          { transform: "translateY(0)" }
        ],
        {
          duration: 650 + (index * 45),
          easing: "cubic-bezier(0.22, 1, 0.36, 1)"
        }
      );
    });
  }

  async function randomiseAll() {
    const currentRun = ++randomiseRun;
    const targetCounts = {
      words: secureDifferentCount(wordCountInput),
      numbers: secureDifferentCount(numberCountInput),
      specials: secureDifferentCount(specialCountInput)
    };

    separatorInput.value = secureDifferentSeparator();
    restartAnimation(separatorInput, "is-changing");
    shuffleOrderEditor();
    status.textContent = "Randomising settings and order";

    await Promise.all([
      animateRangeTo(wordCountInput, wordCountValue, targetCounts.words),
      animateRangeTo(numberCountInput, numberCountValue, targetCounts.numbers),
      animateRangeTo(specialCountInput, specialCountValue, targetCounts.specials)
    ]);

    if (currentRun !== randomiseRun) {
      return;
    }

    updateControlValues();
    updateOrderEditor();
    generatePassword();
    status.textContent = "All settings and the order were randomised";
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

  function restartAnimation(element, className) {
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
  }

  generateButton.addEventListener("click", () => {
    restartAnimation(generateButton, "is-regenerating");
    generatePassword();
  });
  randomiseAllButton.addEventListener("click", () => {
    restartAnimation(randomiseAllButton, "is-randomising");
    randomiseAll();
  });
  copyButton.addEventListener("click", () => {
    restartAnimation(copyButton, "is-copying");
    copyPassword();
  });
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
    event.dataTransfer.dropEffect = "move";
    positionDropIndicator(event.clientY);
  });

  orderList.addEventListener("dragleave", (event) => {
    if (draggedOrderItem && !orderList.contains(event.relatedTarget)) {
      dropIndicator.hidden = true;
    }
  });

  orderList.addEventListener("drop", (event) => {
    event.preventDefault();
    finishDragging(!dropIndicator.hidden);
  });

  for (const item of orderItems()) {
    const dragHandle = item.querySelector(".drag-handle");

    dragHandle.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) {
        return;
      }

      event.preventDefault();
      dragHandle.setPointerCapture(event.pointerId);
      pointerDragState = {
        active: false,
        item,
        pointerId: event.pointerId,
        startY: event.clientY
      };
    });

    dragHandle.addEventListener("pointermove", (event) => {
      if (!pointerDragState || event.pointerId !== pointerDragState.pointerId) {
        return;
      }

      if (!pointerDragState.active && Math.abs(event.clientY - pointerDragState.startY) < 5) {
        return;
      }

      if (!pointerDragState.active) {
        pointerDragState.active = true;
        beginDragging(pointerDragState.item);
      }

      event.preventDefault();
      positionDropIndicator(event.clientY, event.clientX);
    });

    dragHandle.addEventListener("pointerup", (event) => {
      if (!pointerDragState || event.pointerId !== pointerDragState.pointerId) {
        return;
      }

      const commitMove = pointerDragState.active && !dropIndicator.hidden;
      pointerDragState = null;
      finishDragging(commitMove);
    });

    dragHandle.addEventListener("pointercancel", (event) => {
      if (!pointerDragState || event.pointerId !== pointerDragState.pointerId) {
        return;
      }

      pointerDragState = null;
      finishDragging(false);
    });

    item.addEventListener("dragstart", (event) => {
      beginDragging(item);
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", item.dataset.group);
    });

    item.addEventListener("dragend", () => {
      finishDragging(false);
    });
  }

  updateControlValues();
  updateOrderEditor();
  generatePassword();
})();

