(() => {
  "use strict";

  const adjectives = Object.freeze([
    // Positive qualities
    "Able", "Accomplished", "Adaptable", "Admirable", "Adventurous", "Agreeable", "Alert", "Amazing",
    "Ambitious", "Amiable", "Appreciative", "Attentive", "Authentic", "Awesome", "Balanced", "Bold",
    "Brave", "Brilliant", "Buoyant", "Calm", "Capable", "Careful", "Caring", "Charitable",
    "Charming", "Cheerful", "Civil", "Clever", "Collaborative", "Committed", "Compassionate", "Confident",
    "Considerate", "Cooperative", "Courageous", "Courteous", "Creative", "Curious", "Daring", "Dedicated",
    "Dependable", "Determined", "Diligent", "Diplomatic", "Earnest", "Easygoing", "Efficient", "Encouraging",
    "Energetic", "Enthusiastic", "Excellent", "Fair", "Faithful", "Fearless", "Flexible", "Focused",
    "Friendly", "Generous", "Gentle", "Genuine", "Graceful", "Gracious", "Grateful", "Helpful",

    // Happy and welcoming
    "Happy", "Heartening", "Hopeful", "Humble", "Imaginative", "Inventive", "Jolly", "Joyful",
    "Kind", "Kindly", "Lively", "Lovely", "Loyal", "Lucky", "Merry", "Mindful",
    "Motivated", "Neighbourly", "Noble", "Optimistic", "Patient", "Peaceful", "Playful", "Pleasant",
    "Polite", "Positive", "Proud", "Radiant", "Ready", "Reliable", "Respectful", "Sincere",
    "Talented", "Sociable", "Spirited", "Steady", "Supportive", "Thoughtful", "Tidy", "Trustworthy",
    "Trusty", "Upbeat", "Vibrant", "Warm", "Welcoming", "Wise", "Witty", "Wonderful",
    "Worthy", "Affable", "Amusing", "Blissful", "Bright", "Celebrated", "Content", "Cordial",
    "Delightful", "Eager", "Fabulous", "Festive", "Glad", "Goodhearted", "Harmonious", "Hearty",

    // Movement and energy
    "Active", "Agile", "Airy", "Animated", "Bouncy", "Breezy", "Brisk", "Bustling",
    "Chipper", "Dancing", "Dashing", "Dynamic", "Effervescent", "Electric", "Flowing", "Fluttering",
    "Flying", "Galloping", "Gliding", "Hopping", "Jaunty", "Jazzy", "Jiggly", "Leaping",
    "Lightfooted", "Nimble", "Peppy", "Bobbing", "Quick", "Rapid", "Rolling", "Sailing",
    "Skipping", "Snappy", "Soaring", "Speedy", "Spinning", "Sprightly", "Springy", "Spry",
    "Swift", "Swinging", "Twirling", "Upward", "Wavy", "Whirling", "Whizzing", "Zippy",
    "Zooming", "Bubbly", "Bursting", "Chirpy", "Crisp", "Fizzy", "Flashing", "Floating",
    "Freewheeling", "Humming", "Kinetic", "Lyrical", "Musical", "Rhythmic", "Singing", "Tuneful",

    // Light and colour
    "Amber", "Azure", "Beaming", "Blue", "Bronze", "Cerulean", "Clear", "Colourful",
    "Coral", "Creamy", "Crimson", "Crystalline", "Dappled", "Dazzling", "Emerald", "Frosted",
    "Gilded", "Gleaming", "Glittering", "Glowing", "Golden", "Green", "Indigo", "Iridescent",
    "Ivory", "Lavender", "Luminous", "Minty", "Moonlit", "Opalescent", "Orange", "Pearly",
    "Pink", "Polished", "Prismatic", "Purple", "Rainbowed", "Red", "Roseate", "Rosy",
    "Ruby", "Sapphire", "Scarlet", "Shimmering", "Shiny", "Silver", "Sparkling", "Starry",
    "Sunlit", "Sunny", "Teal", "Twinkling", "Violet", "Pearlescent", "Yellow", "Aglow",
    "Candlelit", "Chromatic", "Coppery", "Glassy", "Illuminated", "Lucent", "Multicoloured", "Translucent",

    // Shape and texture
    "Angular", "Arched", "Broad", "Circular", "Compact", "Curved", "Deep", "Delicate",
    "Feathery", "Firm", "Flat", "Fluffy", "Fuzzy", "Glossy", "Granular", "Hollow",
    "Layered", "Lightweight", "Elongated", "Miniature", "Narrow", "Oval", "Pointed", "Puffy",
    "Round", "Rounded", "Silky", "Sleek", "Streamlined", "Smooth", "Soft", "Solid",
    "Spacious", "Square", "Sturdy", "Textured", "PocketSized", "Velvety", "Expansive", "Woolly",
    "Zigzag", "Wooden", "Metallic", "Papery", "Rubbery", "Sandy", "Satiny", "Spongy",
    "Stony", "Striped", "Spotted", "Tapered", "Tessellated", "Triangular", "Woven", "Braided",
    "Brushed", "Chiselled", "Coiled", "Cushioned", "Folded", "Pleated", "Quilted", "Ridged",

    // Nature and weather
    "Alpine", "Arctic", "Autumnal", "Balmy", "Blooming", "Blossoming", "Botanical", "Cloudless",
    "Coastal", "Cool", "Dewy", "Earthy", "Evergreen", "Floral", "Flowery", "Foggy",
    "Forested", "Fresh", "Frosty", "GardenFresh", "Grassy", "Herbal", "Lakeside", "Leafy",
    "Mild", "Misty", "Mossy", "Mountainous", "Oceanic", "Rainy", "Rainwashed", "Riverine",
    "Rocky", "Seaside", "Seasonal", "Snowy", "Solar", "Starlit", "Summery", "Temperate",
    "Tropical", "Verdant", "Watery", "Windy", "Wintry", "Woodland", "Budding", "Dawnlit",
    "Drizzly", "Dusky", "Ferny", "Frostbound", "Gardenlike", "Leaflike", "Meadowy", "Moonless",
    "Riverlike", "Saltwater", "Shoreward", "Skyward", "Sunward", "Tidal", "Treelined", "Windswept",

    // Flavour, sound and comfort
    "Aromatic", "Creamlike", "Caramelised", "Citrusy", "CocoaScented", "Crispy", "Crunchy", "Fragrant",
    "Fruity", "Gingery", "Honeyed", "Juicy", "Lemony", "MapleScented", "Peachy", "Pepperminty",
    "Savoury", "Spiced", "Sugary", "Sweet", "Tangy", "Toasty", "VanillaScented", "Zesty",
    "AppleScented", "BerryScented", "CinnamonScented", "CoconutScented", "LimeScented", "OrangeScented", "RoseScented", "StrawberryScented",
    "BellLike", "Chiming", "Crackling", "Drumming", "Echoing", "Fluting", "Hushed", "Melodic",
    "Resonant", "Ringing", "Rustling", "Sonorous", "Tinkling", "Warbling", "Whispering", "Whistling",
    "Comforting", "Cosy", "Cushy", "Icy", "Refreshing", "Restful", "Silken", "Snug",
    "Soothing", "Tranquil", "AppleFresh", "BerrySweet", "Chocolatey", "Coconutty", "Oaty", "ToffeeLike",

    // Art and imagination
    "Abstract", "Artful", "Artistic", "Bookish", "Cartoonlike", "Celebratory", "Classic", "Decorative",
    "Detailed", "Dreamlike", "Enchanting", "Fairytale", "Fantastic", "Folksy", "Geometric", "HandDrawn",
    "Illustrated", "Intricate", "Legendary", "Magical", "Marvellous", "Minimal", "Mosaic", "Mythical",
    "Ornamental", "Orderly", "Original", "Painted", "Painterly", "Pastel", "Patterned", "PicturePerfect",
    "Poetic", "Printed", "Sculpted", "Sketched", "Storybook", "Stylish", "Symmetrical", "Theatrical",
    "Timeless", "Watercolour", "Whimsical", "WonderFilled", "ColourWashed", "ConfettiBright", "CrayonDrawn", "DoodleFilled",
    "DreamFilled", "FeatherLight", "FestivalReady", "GlitterTopped", "HandLettered", "JoyFilled", "LanternLit", "MelodyFilled",
    "MoonTopped", "NeatlyMade", "PaperCrafted", "RainbowBright", "RibbonTied", "SongFilled", "SparkleTopped", "StarPainted"
  ]);

  const nouns = Object.freeze([
    // Nature and landscapes
    "Acorn", "Alder", "AppleTree", "Aspen", "Bamboo", "Bay", "Beach", "Birch",
    "Blossom", "Brook", "Canyon", "Cedar", "CherryTree", "Clover", "Coast", "Coral",
    "Cove", "Daisy", "Dandelion", "Dune", "Elm", "Fern", "Field", "Flower",
    "Forest", "Garden", "Glacier", "Grove", "Harbor", "HazelTree", "Heather", "Hill",
    "Holly", "Island", "Ivy", "Lagoon", "Lake", "Lavender", "Leaf", "Maple",
    "Meadow", "Moss", "Mountain", "Oak", "Ocean", "Orchard", "PalmTree", "Pebble",
    "Pine", "Pinecone", "Pond", "Poppy", "Rainforest", "Reed", "River", "Rose",
    "Sandbar", "Seaside", "Shore", "Sprout", "Stream", "Sunflower", "Valley", "Waterfall",

    // Sky, weather and space
    "Aurora", "Breeze", "Cloud", "Comet", "Constellation", "Dawn", "Daybreak", "Dewdrop",
    "Drizzle", "Eclipse", "Evening", "Fog", "Frost", "Galaxy", "Hailstone", "Horizon",
    "Icicle", "Lightning", "Meteor", "Moon", "Moonbeam", "Moonlight", "Morning", "Nebula",
    "Nightfall", "Orbit", "Planet", "Rainbow", "Raindrop", "Rainfall", "Rainshower", "Sky",
    "Snow", "Snowball", "Snowdrift", "Snowflake", "Starlight", "Star", "Sun", "Sunbeam",
    "Sundown", "Sunrise", "Sunset", "Sunshine", "Twilight", "Wind", "Winter", "Zephyr",
    "Asteroid", "Crater", "Earth", "Jupiter", "Mars", "Mercury", "Neptune", "Satellite",
    "Saturn", "Spacecraft", "Telescope", "Universe", "Venus", "MilkyWay", "NorthStar", "StarCluster",

    // Home and stationery
    "Backpack", "Basket", "Bell", "Blanket", "Book", "Bookmark", "Bottle", "Bowl",
    "Box", "Broom", "Brush", "Bucket", "Badge", "Calendar", "Candle", "Chair",
    "Clock", "Coat", "Comb", "Cushion", "Desk", "Door", "Drawer", "Envelope",
    "Eraser", "Folder", "Frame", "Glass", "Glove", "Hat", "Jacket", "Jar",
    "Key", "Lamp", "Lantern", "Mirror", "Mug", "Notebook", "Paper", "Pen",
    "Pencil", "Pillow", "Plate", "Pocket", "Postcard", "Ribbon", "Ruler", "Scarf",
    "Shelf", "Shirt", "Shoe", "Spoon", "Stamp", "Sticker", "Table", "Teacup",
    "Towel", "Umbrella", "Vase", "Wallet", "Window", "Zipper", "Apron", "Napkin",

    // Food and treats
    "Apple", "Apricot", "Bagel", "Banana", "Berry", "Biscuit", "Blackberry", "Blueberry",
    "Bread", "Breadstick", "Brioche", "Cake", "Candy", "Caramel", "Carrot", "Cereal",
    "Cherry", "Chocolate", "Cinnamon", "Cocoa", "Coconut", "Cookie", "Cornflake", "Croissant",
    "Cupcake", "Custard", "Doughnut", "Gingerbread", "Grape", "Grapefruit", "Granola", "Honeycomb",
    "IceCream", "Jam", "Jelly", "Kiwi", "Lemon", "Lime", "Lollipop", "Mango",
    "Marshmallow", "Nectarine", "Muffin", "Oatmeal", "Orange", "Pancake", "Peach", "Pear",
    "Peppermint", "Pie", "Pineapple", "Plum", "Popcorn", "Pretzel", "Pudding", "Raspberry",
    "Shortbread", "Smoothie", "Strawberry", "Toffee", "Tomato", "Vanilla", "Waffle", "Watermelon",

    // Transport and places
    "Airplane", "Airport", "Airship", "Aquarium", "Barn", "Bicycle", "Boat", "Boathouse",
    "Bookshop", "Bridge", "Bus", "Cabin", "Cafe", "Camper", "Campsite", "Canoe",
    "Carousel", "Castle", "Clocktower", "Conservatory", "Cottage", "Courtyard", "Dock", "Farmhouse",
    "Ferry", "Firehouse", "Footbridge", "Footpath", "Fountain", "Gallery", "GardenGate", "Gazebo",
    "Greenhouse", "Hall", "Hangar", "House", "Igloo", "Library", "Lighthouse", "Market",
    "Museum", "Observatory", "Park", "Pathway", "Pavilion", "Pier", "Planetarium", "Playground",
    "Porch", "Railway", "Rocket", "Sailboat", "Schoolhouse", "Seaport", "Stadium", "Station",
    "Tent", "Tower", "Trail", "Train", "Tram", "Treehouse", "Tunnel", "Wagon",

    // Toys, music and art
    "Balloon", "Bead", "Block", "BoardGame", "Bongo", "Bubble", "Card", "Chalk",
    "Chessboard", "Clay", "CraftPaper", "Crayon", "Doodle", "Domino", "Drum", "Easel",
    "Figurine", "Flute", "Frisbee", "Gameboard", "GlueStick", "Guitar", "Harmonica", "Hopscotch",
    "Jigsaw", "JumpRope", "Kaleidoscope", "Kazoo", "Kite", "Maraca", "Marker", "Marble",
    "Melody", "Mosaic", "MusicBox", "Paint", "Paintbox", "Paintbrush", "Palette", "PaperPlane",
    "Piano", "Pinwheel", "Playdough", "Puppet", "Puzzle", "Rattle", "Recorder", "Sandbox",
    "Sketchbook", "Slide", "Song", "SpinningTop", "StickerBook", "Storybook", "Swing", "Tambourine",
    "ToyBoat", "ToyCar", "ToyTrain", "Trumpet", "Ukulele", "Watercolour", "Whistle", "Xylophone",

    // Science, tools and making
    "Beaker", "Binoculars", "Calculator", "Camera", "Circuit", "Compass", "Computer", "Gear",
    "Globe", "Lightbulb", "Magnet", "Magnifier", "Map", "Microscope", "Prism", "Robot",
    "Stopwatch", "Sundial", "Thermometer", "Timer", "ToolBox", "Wheel", "Pulley", "Lever",
    "Spring", "Battery", "Keyboard", "Screen", "Speaker", "Spade", "Shovel", "Rake",
    "WateringCan", "Wheelbarrow", "Trowel", "Hose", "SeedPacket", "PlantPot", "Whisk", "Spatula",
    "Ladle", "Colander", "Kettle", "Toaster", "Blender", "RollingPin", "OvenMitt", "ChoppingBoard",
    "CookieCutter", "Hammer", "Screwdriver", "Wrench", "Pliers", "TapeMeasure", "PaintRoller", "Clamp",
    "Mallet", "Anemometer", "Barometer", "Periscope", "Projector", "Protractor", "StarChart", "WeatherVane",

    // Friendly objects and ideas
    "Adventure", "Amber", "Anchor", "Arrow", "Beacon", "Boulder", "Brick", "Bronze",
    "Chapter", "Coin", "Confetti", "Copper", "Crystal", "Diamond", "Dream", "Emerald",
    "Feather", "Firework", "Flag", "Garland", "Gem", "GiftBox", "Granite", "Idea",
    "Jewel", "Journey", "Knot", "Laughter", "Letter", "Magic", "Medal", "Opal",
    "Ornament", "Paperclip", "PartyHat", "Patch", "Pearl", "PostageStamp", "Quartz", "Rhyme",
    "Ruby", "Sapphire", "Seashell", "Silver", "Sparkler", "Stone", "Story", "Ticket",
    "Treasure", "Tune", "Wish", "Wonder", "Wreath", "CompassRose", "Doorbell", "Flagpole",
    "Handbell", "Keyring", "Mailbox", "NameTag", "Noticeboard", "PuzzleBox", "Sail", "Windchime"
  ]);

  globalThis.PASSWORD_WORDS = Object.freeze({ adjectives, nouns });
})();
