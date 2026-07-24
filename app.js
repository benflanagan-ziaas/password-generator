(() => {
  "use strict";

  const passwordOutput = document.getElementById("password");
  const status = document.getElementById("status");
  const generateButton = document.getElementById("generate");
  const copyButton = document.getElementById("copy");

  const adjectives = Object.freeze([
    "Able", "Agile", "Airy", "Amazing", "Awesome", "Balanced", "Bold", "Bouncy",
    "Brave", "Breezy", "Bright", "Brisk", "Bubbly", "Calm", "Careful", "Caring",
    "Charming", "Cheerful", "Chipper", "Clever", "Cozy", "Creative", "Crisp", "Curious",
    "Daring", "Dazzling", "Delightful", "Dreamy", "Dynamic", "Eager", "Earnest", "Easygoing",
    "Electric", "Elegant", "Epic", "Excellent", "Fabulous", "Fair", "Fancy", "Fearless",
    "Festive", "Fluffy", "Focused", "Friendly", "Fresh", "Fun", "Fuzzy", "Gentle",
    "Glad", "Gleaming", "Glowing", "Golden", "Graceful", "Grand", "Grateful", "Great",
    "Handy", "Happy", "Hearty", "Helpful", "Honest", "Hopeful", "Humble", "Inventive",
    "Jolly", "Joyful", "Keen", "Kind", "Lively", "Lovely", "Lucky", "Magical",
    "Marvelous", "Mellow", "Merry", "Mighty", "Musical", "Neat", "Nimble", "Noble",
    "Patient", "Peaceful", "Playful", "Plucky", "Polite", "Proud", "Quick", "Quiet",
    "Radiant", "Rapid", "Ready", "Relaxed", "Reliable", "Robust", "Rosy", "Safe",
    "Sandy", "Sensible", "Shiny", "Silky", "Sincere", "Sleek", "Smart", "Smooth",
    "Snappy", "Snug", "Soft", "Sparkling", "Sparkly", "Speedy", "Spry", "Steady",
    "Sturdy", "Sunny", "Super", "Swift", "Thoughtful", "Tidy", "Tiny", "Trusty",
    "Upbeat", "Vibrant", "Vivid", "Warm", "Whimsical", "Wise", "Witty", "Wonderful"
  ]);

  const nouns = Object.freeze([
    "Acorn", "Airship", "Anchor", "Apple", "Apron", "Arrow", "Backpack", "Balloon",
    "Bamboo", "Basket", "Beacon", "Bell", "Bench", "Berry", "Bicycle", "Blanket",
    "Boat", "Book", "Bottle", "Boulder", "Bridge", "Bubble", "Bucket", "Button",
    "Cabin", "Cactus", "Camera", "Candle", "Canoe", "Carousel", "Castle", "Chalk",
    "Chestnut", "Clover", "Cloud", "Comet", "Compass", "Cookie", "Coral", "Crayon",
    "Crown", "Crystal", "Cupcake", "Daisy", "Dandelion", "Drum", "Echo", "Feather",
    "Fern", "Firefly", "Firework", "Flag", "Flower", "Flute", "Forest", "Fountain",
    "Frisbee", "Garden", "Garland", "Gem", "Glacier", "Globe", "Guitar", "Hammock",
    "Harbor", "Hat", "Helmet", "Hill", "Horizon", "Icicle", "Igloo", "Island",
    "Jacket", "Jewel", "Key", "Kite", "Lagoon", "Lake", "Lantern", "Leaf",
    "Lemon", "Library", "Lighthouse", "Maple", "Marble", "Meadow", "Melody", "Moon",
    "Mountain", "Muffin", "Mushroom", "Notebook", "Ocean", "Orchard", "Paintbox", "Paintbrush",
    "Paper", "Pebble", "Pencil", "Piano", "Picnic", "Pinecone", "Pinwheel", "Planet",
    "Pocket", "Pond", "Postcard", "Puzzle", "Rainbow", "Raindrop", "Ribbon", "River",
    "Rocket", "Sailboat", "Sandcastle", "Scarf", "Shell", "Ship", "Skateboard", "Snowball",
    "Snowflake", "Spark", "Spoon", "Sprout", "Star", "Sticker", "Stone", "Story"
  ]);

  const symbols = Object.freeze(["!", "@", "#", "$", "%", "&", "*", "+", "="]);

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
