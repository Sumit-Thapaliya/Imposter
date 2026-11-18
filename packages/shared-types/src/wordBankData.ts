// Shared word bank. Hints describe broad groups, never the answer itself.
import type { DomainId } from './localConfig';
export type WordEntry = { word: string; hint: string };
export const WORD_BANK: Record<DomainId, readonly WordEntry[]> = {
  "food": [
    {
      "word": "Apple",
      "hint": "A fruit"
    },
    {
      "word": "Banana",
      "hint": "A fruit"
    },
    {
      "word": "Orange",
      "hint": "A fruit"
    },
    {
      "word": "Mango",
      "hint": "A fruit"
    },
    {
      "word": "Pineapple",
      "hint": "A fruit"
    },
    {
      "word": "Grapes",
      "hint": "A fruit"
    },
    {
      "word": "Watermelon",
      "hint": "A fruit"
    },
    {
      "word": "Strawberry",
      "hint": "A fruit"
    },
    {
      "word": "Blueberry",
      "hint": "A fruit"
    },
    {
      "word": "Raspberry",
      "hint": "A fruit"
    },
    {
      "word": "Blackberry",
      "hint": "A fruit"
    },
    {
      "word": "Peach",
      "hint": "A fruit"
    },
    {
      "word": "Pear",
      "hint": "A fruit"
    },
    {
      "word": "Plum",
      "hint": "A fruit"
    },
    {
      "word": "Apricot",
      "hint": "A fruit"
    },
    {
      "word": "Cherry",
      "hint": "A fruit"
    },
    {
      "word": "Kiwi",
      "hint": "A fruit"
    },
    {
      "word": "Papaya",
      "hint": "A fruit"
    },
    {
      "word": "Guava",
      "hint": "A fruit"
    },
    {
      "word": "Pomegranate",
      "hint": "A fruit"
    },
    {
      "word": "Coconut",
      "hint": "A fruit"
    },
    {
      "word": "Lemon",
      "hint": "A fruit"
    },
    {
      "word": "Lime",
      "hint": "A fruit"
    },
    {
      "word": "Grapefruit",
      "hint": "A fruit"
    },
    {
      "word": "Mandarin",
      "hint": "A fruit"
    },
    {
      "word": "Lychee",
      "hint": "A fruit"
    },
    {
      "word": "Dragon fruit",
      "hint": "A fruit"
    },
    {
      "word": "Passion fruit",
      "hint": "A fruit"
    },
    {
      "word": "Avocado",
      "hint": "A fruit"
    },
    {
      "word": "Fig",
      "hint": "A fruit"
    },
    {
      "word": "Date",
      "hint": "A fruit"
    },
    {
      "word": "Melon",
      "hint": "A fruit"
    },
    {
      "word": "Cantaloupe",
      "hint": "A fruit"
    },
    {
      "word": "Honeydew",
      "hint": "A fruit"
    },
    {
      "word": "Tangerine",
      "hint": "A fruit"
    },
    {
      "word": "Nectarine",
      "hint": "A fruit"
    },
    {
      "word": "Carrot",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Potato",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Tomato",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Cucumber",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Broccoli",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Cauliflower",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Spinach",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Lettuce",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Cabbage",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Onion",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Garlic",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Ginger",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Pumpkin",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Peas",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Corn",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Eggplant",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Zucchini",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Radish",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Beetroot",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Celery",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Mushroom",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Bell pepper",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Chili pepper",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Sweet potato",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Asparagus",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Green beans",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Turnip",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Leek",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Okra",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Artichoke",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Kale",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Brussels sprouts",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Parsley",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Cilantro",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Basil",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Mint",
      "hint": "A vegetable or plant food"
    },
    {
      "word": "Pizza",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Burger",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Sandwich",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Pasta",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Spaghetti",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Lasagna",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Ravioli",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Noodles",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Fried rice",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Sushi",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Ramen",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Curry",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Tacos",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Burrito",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Quesadilla",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Nachos",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Dumplings",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Momo",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Samosa",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Spring roll",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Fried chicken",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Roast chicken",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Steak",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Meatballs",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Hot dog",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Kebab",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Falafel",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Hummus",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Omelet",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Scrambled eggs",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Pancakes",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Waffles",
      "hint": "A meal or savory dish"
    },
    {
      "word": "French toast",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Porridge",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Soup",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Salad",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Mashed potatoes",
      "hint": "A meal or savory dish"
    },
    {
      "word": "French fries",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Fish and chips",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Macaroni and cheese",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Grilled cheese",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Risotto",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Paella",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Biryani",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Dal",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Thukpa",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Chow mein",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Pad thai",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Pho",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Tikka masala",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Butter chicken",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Fajitas",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Enchilada",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Chili",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Shepherd’s pie",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Meatloaf",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Pot pie",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Shawarma",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Gyro",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Quiche",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Casserole",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Stuffed peppers",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Lentil soup",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Tomato soup",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Onion soup",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Roti",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Naan",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Paratha",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Pita bread",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Bagel",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Toast",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Croissant",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Bread",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Rice",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Couscous",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Oatmeal",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Cereal",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Popcorn",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Pretzel",
      "hint": "A meal or savory dish"
    },
    {
      "word": "Chocolate",
      "hint": "A sweet treat"
    },
    {
      "word": "Ice cream",
      "hint": "A sweet treat"
    },
    {
      "word": "Cake",
      "hint": "A sweet treat"
    },
    {
      "word": "Cupcake",
      "hint": "A sweet treat"
    },
    {
      "word": "Cookie",
      "hint": "A sweet treat"
    },
    {
      "word": "Brownie",
      "hint": "A sweet treat"
    },
    {
      "word": "Doughnut",
      "hint": "A sweet treat"
    },
    {
      "word": "Candy",
      "hint": "A sweet treat"
    },
    {
      "word": "Lollipop",
      "hint": "A sweet treat"
    },
    {
      "word": "Jelly beans",
      "hint": "A sweet treat"
    },
    {
      "word": "Marshmallow",
      "hint": "A sweet treat"
    },
    {
      "word": "Pudding",
      "hint": "A sweet treat"
    },
    {
      "word": "Custard",
      "hint": "A sweet treat"
    },
    {
      "word": "Cheesecake",
      "hint": "A sweet treat"
    },
    {
      "word": "Apple pie",
      "hint": "A sweet treat"
    },
    {
      "word": "Pumpkin pie",
      "hint": "A sweet treat"
    },
    {
      "word": "Fruit tart",
      "hint": "A sweet treat"
    },
    {
      "word": "Muffin",
      "hint": "A sweet treat"
    },
    {
      "word": "Macaron",
      "hint": "A sweet treat"
    },
    {
      "word": "Biscuit",
      "hint": "A sweet treat"
    },
    {
      "word": "Chocolate bar",
      "hint": "A sweet treat"
    },
    {
      "word": "Caramel",
      "hint": "A sweet treat"
    },
    {
      "word": "Fudge",
      "hint": "A sweet treat"
    },
    {
      "word": "Honey",
      "hint": "A sweet treat"
    },
    {
      "word": "Jam",
      "hint": "A sweet treat"
    },
    {
      "word": "Jelly",
      "hint": "A sweet treat"
    },
    {
      "word": "Popsicle",
      "hint": "A sweet treat"
    },
    {
      "word": "Sorbet",
      "hint": "A sweet treat"
    },
    {
      "word": "Milkshake",
      "hint": "A sweet treat"
    },
    {
      "word": "Yogurt",
      "hint": "A sweet treat"
    },
    {
      "word": "Rice pudding",
      "hint": "A sweet treat"
    },
    {
      "word": "Churros",
      "hint": "A sweet treat"
    },
    {
      "word": "Baklava",
      "hint": "A sweet treat"
    },
    {
      "word": "Gulab jamun",
      "hint": "A sweet treat"
    },
    {
      "word": "Jalebi",
      "hint": "A sweet treat"
    },
    {
      "word": "Laddu",
      "hint": "A sweet treat"
    },
    {
      "word": "Halwa",
      "hint": "A sweet treat"
    },
    {
      "word": "Cotton candy",
      "hint": "A sweet treat"
    },
    {
      "word": "Gingerbread",
      "hint": "A sweet treat"
    },
    {
      "word": "Tiramisu",
      "hint": "A sweet treat"
    },
    {
      "word": "Cheese",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Butter",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Milk",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Egg",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Tofu",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Peanut butter",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Peanuts",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Almonds",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Walnuts",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Cashews",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Pistachios",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Raisins",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Crackers",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Potato chips",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Tortilla chips",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Granola",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Trail mix",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Yogurt dip",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Olives",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Pickles",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Salt",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Sugar",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Flour",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Pepper",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Cinnamon",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Vanilla",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Mustard",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Ketchup",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Mayonnaise",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Soy sauce",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Vinegar",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Olive oil",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Maple syrup",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Sesame seeds",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Chickpeas",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Lentils",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Black beans",
      "hint": "An ingredient or snack"
    },
    {
      "word": "Kidney beans",
      "hint": "An ingredient or snack"
    }
  ],
  "animals": [
    {
      "word": "Dog",
      "hint": "A mammal"
    },
    {
      "word": "Cat",
      "hint": "A mammal"
    },
    {
      "word": "Lion",
      "hint": "A mammal"
    },
    {
      "word": "Tiger",
      "hint": "A mammal"
    },
    {
      "word": "Elephant",
      "hint": "A mammal"
    },
    {
      "word": "Giraffe",
      "hint": "A mammal"
    },
    {
      "word": "Zebra",
      "hint": "A mammal"
    },
    {
      "word": "Horse",
      "hint": "A mammal"
    },
    {
      "word": "Donkey",
      "hint": "A mammal"
    },
    {
      "word": "Cow",
      "hint": "A mammal"
    },
    {
      "word": "Buffalo",
      "hint": "A mammal"
    },
    {
      "word": "Goat",
      "hint": "A mammal"
    },
    {
      "word": "Sheep",
      "hint": "A mammal"
    },
    {
      "word": "Pig",
      "hint": "A mammal"
    },
    {
      "word": "Rabbit",
      "hint": "A mammal"
    },
    {
      "word": "Hare",
      "hint": "A mammal"
    },
    {
      "word": "Mouse",
      "hint": "A mammal"
    },
    {
      "word": "Rat",
      "hint": "A mammal"
    },
    {
      "word": "Squirrel",
      "hint": "A mammal"
    },
    {
      "word": "Chipmunk",
      "hint": "A mammal"
    },
    {
      "word": "Hamster",
      "hint": "A mammal"
    },
    {
      "word": "Guinea pig",
      "hint": "A mammal"
    },
    {
      "word": "Hedgehog",
      "hint": "A mammal"
    },
    {
      "word": "Bat",
      "hint": "A mammal"
    },
    {
      "word": "Bear",
      "hint": "A mammal"
    },
    {
      "word": "Panda",
      "hint": "A mammal"
    },
    {
      "word": "Polar bear",
      "hint": "A mammal"
    },
    {
      "word": "Koala",
      "hint": "A mammal"
    },
    {
      "word": "Kangaroo",
      "hint": "A mammal"
    },
    {
      "word": "Wallaby",
      "hint": "A mammal"
    },
    {
      "word": "Deer",
      "hint": "A mammal"
    },
    {
      "word": "Moose",
      "hint": "A mammal"
    },
    {
      "word": "Elk",
      "hint": "A mammal"
    },
    {
      "word": "Reindeer",
      "hint": "A mammal"
    },
    {
      "word": "Camel",
      "hint": "A mammal"
    },
    {
      "word": "Llama",
      "hint": "A mammal"
    },
    {
      "word": "Alpaca",
      "hint": "A mammal"
    },
    {
      "word": "Monkey",
      "hint": "A mammal"
    },
    {
      "word": "Gorilla",
      "hint": "A mammal"
    },
    {
      "word": "Chimpanzee",
      "hint": "A mammal"
    },
    {
      "word": "Orangutan",
      "hint": "A mammal"
    },
    {
      "word": "Sloth",
      "hint": "A mammal"
    },
    {
      "word": "Otter",
      "hint": "A mammal"
    },
    {
      "word": "Beaver",
      "hint": "A mammal"
    },
    {
      "word": "Raccoon",
      "hint": "A mammal"
    },
    {
      "word": "Fox",
      "hint": "A mammal"
    },
    {
      "word": "Wolf",
      "hint": "A mammal"
    },
    {
      "word": "Coyote",
      "hint": "A mammal"
    },
    {
      "word": "Jackal",
      "hint": "A mammal"
    },
    {
      "word": "Hyena",
      "hint": "A mammal"
    },
    {
      "word": "Leopard",
      "hint": "A mammal"
    },
    {
      "word": "Cheetah",
      "hint": "A mammal"
    },
    {
      "word": "Jaguar",
      "hint": "A mammal"
    },
    {
      "word": "Cougar",
      "hint": "A mammal"
    },
    {
      "word": "Lynx",
      "hint": "A mammal"
    },
    {
      "word": "Bobcat",
      "hint": "A mammal"
    },
    {
      "word": "Rhinoceros",
      "hint": "A mammal"
    },
    {
      "word": "Hippopotamus",
      "hint": "A mammal"
    },
    {
      "word": "Wild boar",
      "hint": "A mammal"
    },
    {
      "word": "Warthog",
      "hint": "A mammal"
    },
    {
      "word": "Antelope",
      "hint": "A mammal"
    },
    {
      "word": "Gazelle",
      "hint": "A mammal"
    },
    {
      "word": "Bison",
      "hint": "A mammal"
    },
    {
      "word": "Yak",
      "hint": "A mammal"
    },
    {
      "word": "Seal",
      "hint": "A mammal"
    },
    {
      "word": "Sea lion",
      "hint": "A mammal"
    },
    {
      "word": "Walrus",
      "hint": "A mammal"
    },
    {
      "word": "Dolphin",
      "hint": "A mammal"
    },
    {
      "word": "Whale",
      "hint": "A mammal"
    },
    {
      "word": "Orca",
      "hint": "A mammal"
    },
    {
      "word": "Porpoise",
      "hint": "A mammal"
    },
    {
      "word": "Manatee",
      "hint": "A mammal"
    },
    {
      "word": "Armadillo",
      "hint": "A mammal"
    },
    {
      "word": "Anteater",
      "hint": "A mammal"
    },
    {
      "word": "Meerkat",
      "hint": "A mammal"
    },
    {
      "word": "Mole",
      "hint": "A mammal"
    },
    {
      "word": "Badger",
      "hint": "A mammal"
    },
    {
      "word": "Skunk",
      "hint": "A mammal"
    },
    {
      "word": "Weasel",
      "hint": "A mammal"
    },
    {
      "word": "Ferret",
      "hint": "A mammal"
    },
    {
      "word": "Mongoose",
      "hint": "A mammal"
    },
    {
      "word": "Possum",
      "hint": "A mammal"
    },
    {
      "word": "Opossum",
      "hint": "A mammal"
    },
    {
      "word": "Wombat",
      "hint": "A mammal"
    },
    {
      "word": "Platypus",
      "hint": "A mammal"
    },
    {
      "word": "Lemur",
      "hint": "A mammal"
    },
    {
      "word": "Baboon",
      "hint": "A mammal"
    },
    {
      "word": "Gibbon",
      "hint": "A mammal"
    },
    {
      "word": "Marmot",
      "hint": "A mammal"
    },
    {
      "word": "Groundhog",
      "hint": "A mammal"
    },
    {
      "word": "Porcupine",
      "hint": "A mammal"
    },
    {
      "word": "Tapir",
      "hint": "A mammal"
    },
    {
      "word": "Aardvark",
      "hint": "A mammal"
    },
    {
      "word": "Red panda",
      "hint": "A mammal"
    },
    {
      "word": "Snow leopard",
      "hint": "A mammal"
    },
    {
      "word": "African elephant",
      "hint": "A mammal"
    },
    {
      "word": "Arctic fox",
      "hint": "A mammal"
    },
    {
      "word": "Eagle",
      "hint": "A bird"
    },
    {
      "word": "Hawk",
      "hint": "A bird"
    },
    {
      "word": "Falcon",
      "hint": "A bird"
    },
    {
      "word": "Owl",
      "hint": "A bird"
    },
    {
      "word": "Parrot",
      "hint": "A bird"
    },
    {
      "word": "Penguin",
      "hint": "A bird"
    },
    {
      "word": "Flamingo",
      "hint": "A bird"
    },
    {
      "word": "Peacock",
      "hint": "A bird"
    },
    {
      "word": "Duck",
      "hint": "A bird"
    },
    {
      "word": "Goose",
      "hint": "A bird"
    },
    {
      "word": "Swan",
      "hint": "A bird"
    },
    {
      "word": "Chicken",
      "hint": "A bird"
    },
    {
      "word": "Rooster",
      "hint": "A bird"
    },
    {
      "word": "Turkey",
      "hint": "A bird"
    },
    {
      "word": "Pigeon",
      "hint": "A bird"
    },
    {
      "word": "Dove",
      "hint": "A bird"
    },
    {
      "word": "Crow",
      "hint": "A bird"
    },
    {
      "word": "Raven",
      "hint": "A bird"
    },
    {
      "word": "Sparrow",
      "hint": "A bird"
    },
    {
      "word": "Robin",
      "hint": "A bird"
    },
    {
      "word": "Blue jay",
      "hint": "A bird"
    },
    {
      "word": "Cardinal",
      "hint": "A bird"
    },
    {
      "word": "Woodpecker",
      "hint": "A bird"
    },
    {
      "word": "Hummingbird",
      "hint": "A bird"
    },
    {
      "word": "Ostrich",
      "hint": "A bird"
    },
    {
      "word": "Emu",
      "hint": "A bird"
    },
    {
      "word": "Pelican",
      "hint": "A bird"
    },
    {
      "word": "Seagull",
      "hint": "A bird"
    },
    {
      "word": "Heron",
      "hint": "A bird"
    },
    {
      "word": "Stork",
      "hint": "A bird"
    },
    {
      "word": "Crane",
      "hint": "A bird"
    },
    {
      "word": "Kingfisher",
      "hint": "A bird"
    },
    {
      "word": "Toucan",
      "hint": "A bird"
    },
    {
      "word": "Macaw",
      "hint": "A bird"
    },
    {
      "word": "Cockatoo",
      "hint": "A bird"
    },
    {
      "word": "Budgie",
      "hint": "A bird"
    },
    {
      "word": "Canary",
      "hint": "A bird"
    },
    {
      "word": "Finch",
      "hint": "A bird"
    },
    {
      "word": "Vulture",
      "hint": "A bird"
    },
    {
      "word": "Condor",
      "hint": "A bird"
    },
    {
      "word": "Albatross",
      "hint": "A bird"
    },
    {
      "word": "Puffin",
      "hint": "A bird"
    },
    {
      "word": "Quail",
      "hint": "A bird"
    },
    {
      "word": "Pheasant",
      "hint": "A bird"
    },
    {
      "word": "Magpie",
      "hint": "A bird"
    },
    {
      "word": "Swan goose",
      "hint": "A bird"
    },
    {
      "word": "Snake",
      "hint": "A reptile or amphibian"
    },
    {
      "word": "Cobra",
      "hint": "A reptile or amphibian"
    },
    {
      "word": "Python",
      "hint": "A reptile or amphibian"
    },
    {
      "word": "Rattlesnake",
      "hint": "A reptile or amphibian"
    },
    {
      "word": "Viper",
      "hint": "A reptile or amphibian"
    },
    {
      "word": "Lizard",
      "hint": "A reptile or amphibian"
    },
    {
      "word": "Gecko",
      "hint": "A reptile or amphibian"
    },
    {
      "word": "Iguana",
      "hint": "A reptile or amphibian"
    },
    {
      "word": "Chameleon",
      "hint": "A reptile or amphibian"
    },
    {
      "word": "Crocodile",
      "hint": "A reptile or amphibian"
    },
    {
      "word": "Alligator",
      "hint": "A reptile or amphibian"
    },
    {
      "word": "Turtle",
      "hint": "A reptile or amphibian"
    },
    {
      "word": "Tortoise",
      "hint": "A reptile or amphibian"
    },
    {
      "word": "Sea turtle",
      "hint": "A reptile or amphibian"
    },
    {
      "word": "Komodo dragon",
      "hint": "A reptile or amphibian"
    },
    {
      "word": "Frog",
      "hint": "A reptile or amphibian"
    },
    {
      "word": "Toad",
      "hint": "A reptile or amphibian"
    },
    {
      "word": "Salamander",
      "hint": "A reptile or amphibian"
    },
    {
      "word": "Newt",
      "hint": "A reptile or amphibian"
    },
    {
      "word": "Tree frog",
      "hint": "A reptile or amphibian"
    },
    {
      "word": "Bullfrog",
      "hint": "A reptile or amphibian"
    },
    {
      "word": "Poison dart frog",
      "hint": "A reptile or amphibian"
    },
    {
      "word": "Shark",
      "hint": "A creature found in water"
    },
    {
      "word": "Goldfish",
      "hint": "A creature found in water"
    },
    {
      "word": "Salmon",
      "hint": "A creature found in water"
    },
    {
      "word": "Tuna",
      "hint": "A creature found in water"
    },
    {
      "word": "Trout",
      "hint": "A creature found in water"
    },
    {
      "word": "Clownfish",
      "hint": "A creature found in water"
    },
    {
      "word": "Seahorse",
      "hint": "A creature found in water"
    },
    {
      "word": "Octopus",
      "hint": "A creature found in water"
    },
    {
      "word": "Squid",
      "hint": "A creature found in water"
    },
    {
      "word": "Jellyfish",
      "hint": "A creature found in water"
    },
    {
      "word": "Starfish",
      "hint": "A creature found in water"
    },
    {
      "word": "Crab",
      "hint": "A creature found in water"
    },
    {
      "word": "Lobster",
      "hint": "A creature found in water"
    },
    {
      "word": "Shrimp",
      "hint": "A creature found in water"
    },
    {
      "word": "Prawn",
      "hint": "A creature found in water"
    },
    {
      "word": "Oyster",
      "hint": "A creature found in water"
    },
    {
      "word": "Clam",
      "hint": "A creature found in water"
    },
    {
      "word": "Mussel",
      "hint": "A creature found in water"
    },
    {
      "word": "Sea urchin",
      "hint": "A creature found in water"
    },
    {
      "word": "Stingray",
      "hint": "A creature found in water"
    },
    {
      "word": "Manta ray",
      "hint": "A creature found in water"
    },
    {
      "word": "Eel",
      "hint": "A creature found in water"
    },
    {
      "word": "Catfish",
      "hint": "A creature found in water"
    },
    {
      "word": "Swordfish",
      "hint": "A creature found in water"
    },
    {
      "word": "Pufferfish",
      "hint": "A creature found in water"
    },
    {
      "word": "Angelfish",
      "hint": "A creature found in water"
    },
    {
      "word": "Guppy",
      "hint": "A creature found in water"
    },
    {
      "word": "Sardine",
      "hint": "A creature found in water"
    },
    {
      "word": "Anchovy",
      "hint": "A creature found in water"
    },
    {
      "word": "Cod",
      "hint": "A creature found in water"
    },
    {
      "word": "Haddock",
      "hint": "A creature found in water"
    },
    {
      "word": "Tilapia",
      "hint": "A creature found in water"
    },
    {
      "word": "Carp",
      "hint": "A creature found in water"
    },
    {
      "word": "Barracuda",
      "hint": "A creature found in water"
    },
    {
      "word": "Narwhal",
      "hint": "A creature found in water"
    },
    {
      "word": "Beluga whale",
      "hint": "A creature found in water"
    },
    {
      "word": "Humpback whale",
      "hint": "A creature found in water"
    },
    {
      "word": "Blue whale",
      "hint": "A creature found in water"
    },
    {
      "word": "Sperm whale",
      "hint": "A creature found in water"
    },
    {
      "word": "Electric eel",
      "hint": "A creature found in water"
    },
    {
      "word": "Coral",
      "hint": "A creature found in water"
    },
    {
      "word": "Sea cucumber",
      "hint": "A creature found in water"
    },
    {
      "word": "Ant",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Bee",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Butterfly",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Moth",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Dragonfly",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Ladybug",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Beetle",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Grasshopper",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Cricket",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Mosquito",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Housefly",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Firefly",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Cockroach",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Termite",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Wasp",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Hornet",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Caterpillar",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Praying mantis",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Stick insect",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Spider",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Tarantula",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Scorpion",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Centipede",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Millipede",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Earthworm",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Snail",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Slug",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Tick",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Flea",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Aphid",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Bumblebee",
      "hint": "An insect or small invertebrate"
    },
    {
      "word": "Cicada",
      "hint": "An insect or small invertebrate"
    }
  ],
  "places": [
    {
      "word": "Kathmandu",
      "hint": "A city or town"
    },
    {
      "word": "Pokhara",
      "hint": "A city or town"
    },
    {
      "word": "New York",
      "hint": "A city or town"
    },
    {
      "word": "London",
      "hint": "A city or town"
    },
    {
      "word": "Paris",
      "hint": "A city or town"
    },
    {
      "word": "Tokyo",
      "hint": "A city or town"
    },
    {
      "word": "Delhi",
      "hint": "A city or town"
    },
    {
      "word": "Mumbai",
      "hint": "A city or town"
    },
    {
      "word": "Beijing",
      "hint": "A city or town"
    },
    {
      "word": "Shanghai",
      "hint": "A city or town"
    },
    {
      "word": "Hong Kong",
      "hint": "A city or town"
    },
    {
      "word": "Singapore",
      "hint": "A city or town"
    },
    {
      "word": "Bangkok",
      "hint": "A city or town"
    },
    {
      "word": "Dubai",
      "hint": "A city or town"
    },
    {
      "word": "Sydney",
      "hint": "A city or town"
    },
    {
      "word": "Melbourne",
      "hint": "A city or town"
    },
    {
      "word": "Rome",
      "hint": "A city or town"
    },
    {
      "word": "Venice",
      "hint": "A city or town"
    },
    {
      "word": "Milan",
      "hint": "A city or town"
    },
    {
      "word": "Florence",
      "hint": "A city or town"
    },
    {
      "word": "Madrid",
      "hint": "A city or town"
    },
    {
      "word": "Barcelona",
      "hint": "A city or town"
    },
    {
      "word": "Lisbon",
      "hint": "A city or town"
    },
    {
      "word": "Amsterdam",
      "hint": "A city or town"
    },
    {
      "word": "Berlin",
      "hint": "A city or town"
    },
    {
      "word": "Munich",
      "hint": "A city or town"
    },
    {
      "word": "Vienna",
      "hint": "A city or town"
    },
    {
      "word": "Prague",
      "hint": "A city or town"
    },
    {
      "word": "Budapest",
      "hint": "A city or town"
    },
    {
      "word": "Athens",
      "hint": "A city or town"
    },
    {
      "word": "Istanbul",
      "hint": "A city or town"
    },
    {
      "word": "Cairo",
      "hint": "A city or town"
    },
    {
      "word": "Nairobi",
      "hint": "A city or town"
    },
    {
      "word": "Cape Town",
      "hint": "A city or town"
    },
    {
      "word": "Johannesburg",
      "hint": "A city or town"
    },
    {
      "word": "Lagos",
      "hint": "A city or town"
    },
    {
      "word": "Marrakech",
      "hint": "A city or town"
    },
    {
      "word": "Toronto",
      "hint": "A city or town"
    },
    {
      "word": "Vancouver",
      "hint": "A city or town"
    },
    {
      "word": "Montreal",
      "hint": "A city or town"
    },
    {
      "word": "Los Angeles",
      "hint": "A city or town"
    },
    {
      "word": "San Francisco",
      "hint": "A city or town"
    },
    {
      "word": "Chicago",
      "hint": "A city or town"
    },
    {
      "word": "Miami",
      "hint": "A city or town"
    },
    {
      "word": "Las Vegas",
      "hint": "A city or town"
    },
    {
      "word": "Seattle",
      "hint": "A city or town"
    },
    {
      "word": "Boston",
      "hint": "A city or town"
    },
    {
      "word": "Washington DC",
      "hint": "A city or town"
    },
    {
      "word": "Mexico City",
      "hint": "A city or town"
    },
    {
      "word": "Rio de Janeiro",
      "hint": "A city or town"
    },
    {
      "word": "São Paulo",
      "hint": "A city or town"
    },
    {
      "word": "Buenos Aires",
      "hint": "A city or town"
    },
    {
      "word": "Lima",
      "hint": "A city or town"
    },
    {
      "word": "Santiago",
      "hint": "A city or town"
    },
    {
      "word": "Havana",
      "hint": "A city or town"
    },
    {
      "word": "Dublin",
      "hint": "A city or town"
    },
    {
      "word": "Edinburgh",
      "hint": "A city or town"
    },
    {
      "word": "Glasgow",
      "hint": "A city or town"
    },
    {
      "word": "Manchester",
      "hint": "A city or town"
    },
    {
      "word": "Liverpool",
      "hint": "A city or town"
    },
    {
      "word": "Oxford",
      "hint": "A city or town"
    },
    {
      "word": "Cambridge",
      "hint": "A city or town"
    },
    {
      "word": "Zurich",
      "hint": "A city or town"
    },
    {
      "word": "Geneva",
      "hint": "A city or town"
    },
    {
      "word": "Oslo",
      "hint": "A city or town"
    },
    {
      "word": "Stockholm",
      "hint": "A city or town"
    },
    {
      "word": "Copenhagen",
      "hint": "A city or town"
    },
    {
      "word": "Helsinki",
      "hint": "A city or town"
    },
    {
      "word": "Reykjavik",
      "hint": "A city or town"
    },
    {
      "word": "Warsaw",
      "hint": "A city or town"
    },
    {
      "word": "Krakow",
      "hint": "A city or town"
    },
    {
      "word": "Moscow",
      "hint": "A city or town"
    },
    {
      "word": "Kyiv",
      "hint": "A city or town"
    },
    {
      "word": "Seoul",
      "hint": "A city or town"
    },
    {
      "word": "Busan",
      "hint": "A city or town"
    },
    {
      "word": "Taipei",
      "hint": "A city or town"
    },
    {
      "word": "Manila",
      "hint": "A city or town"
    },
    {
      "word": "Jakarta",
      "hint": "A city or town"
    },
    {
      "word": "Kuala Lumpur",
      "hint": "A city or town"
    },
    {
      "word": "Hanoi",
      "hint": "A city or town"
    },
    {
      "word": "Ho Chi Minh City",
      "hint": "A city or town"
    },
    {
      "word": "Phnom Penh",
      "hint": "A city or town"
    },
    {
      "word": "Colombo",
      "hint": "A city or town"
    },
    {
      "word": "Dhaka",
      "hint": "A city or town"
    },
    {
      "word": "Islamabad",
      "hint": "A city or town"
    },
    {
      "word": "Karachi",
      "hint": "A city or town"
    },
    {
      "word": "Lahore",
      "hint": "A city or town"
    },
    {
      "word": "Bengaluru",
      "hint": "A city or town"
    },
    {
      "word": "Chennai",
      "hint": "A city or town"
    },
    {
      "word": "Kolkata",
      "hint": "A city or town"
    },
    {
      "word": "Hyderabad",
      "hint": "A city or town"
    },
    {
      "word": "Agra",
      "hint": "A city or town"
    },
    {
      "word": "Jaipur",
      "hint": "A city or town"
    },
    {
      "word": "Varanasi",
      "hint": "A city or town"
    },
    {
      "word": "Lhasa",
      "hint": "A city or town"
    },
    {
      "word": "Thimphu",
      "hint": "A city or town"
    },
    {
      "word": "Doha",
      "hint": "A city or town"
    },
    {
      "word": "Abu Dhabi",
      "hint": "A city or town"
    },
    {
      "word": "Jerusalem",
      "hint": "A city or town"
    },
    {
      "word": "Beirut",
      "hint": "A city or town"
    },
    {
      "word": "Auckland",
      "hint": "A city or town"
    },
    {
      "word": "Wellington",
      "hint": "A city or town"
    },
    {
      "word": "Perth",
      "hint": "A city or town"
    },
    {
      "word": "Brisbane",
      "hint": "A city or town"
    },
    {
      "word": "Honolulu",
      "hint": "A city or town"
    },
    {
      "word": "Orlando",
      "hint": "A city or town"
    },
    {
      "word": "New Orleans",
      "hint": "A city or town"
    },
    {
      "word": "San Diego",
      "hint": "A city or town"
    },
    {
      "word": "Houston",
      "hint": "A city or town"
    },
    {
      "word": "Dallas",
      "hint": "A city or town"
    },
    {
      "word": "Detroit",
      "hint": "A city or town"
    },
    {
      "word": "Philadelphia",
      "hint": "A city or town"
    },
    {
      "word": "Atlanta",
      "hint": "A city or town"
    },
    {
      "word": "Portland",
      "hint": "A city or town"
    },
    {
      "word": "Denver",
      "hint": "A city or town"
    },
    {
      "word": "Brussels",
      "hint": "A city or town"
    },
    {
      "word": "Nice",
      "hint": "A city or town"
    },
    {
      "word": "Marseille",
      "hint": "A city or town"
    },
    {
      "word": "Naples",
      "hint": "A city or town"
    },
    {
      "word": "Bergen",
      "hint": "A city or town"
    },
    {
      "word": "Quebec City",
      "hint": "A city or town"
    },
    {
      "word": "Cusco",
      "hint": "A city or town"
    },
    {
      "word": "Cartagena",
      "hint": "A city or town"
    },
    {
      "word": "Quito",
      "hint": "A city or town"
    },
    {
      "word": "Medellín",
      "hint": "A city or town"
    },
    {
      "word": "School",
      "hint": "A place you can visit"
    },
    {
      "word": "Library",
      "hint": "A place you can visit"
    },
    {
      "word": "Museum",
      "hint": "A place you can visit"
    },
    {
      "word": "Hospital",
      "hint": "A place you can visit"
    },
    {
      "word": "Airport",
      "hint": "A place you can visit"
    },
    {
      "word": "Train station",
      "hint": "A place you can visit"
    },
    {
      "word": "Bus station",
      "hint": "A place you can visit"
    },
    {
      "word": "Park",
      "hint": "A place you can visit"
    },
    {
      "word": "Playground",
      "hint": "A place you can visit"
    },
    {
      "word": "Zoo",
      "hint": "A place you can visit"
    },
    {
      "word": "Aquarium",
      "hint": "A place you can visit"
    },
    {
      "word": "Cinema",
      "hint": "A place you can visit"
    },
    {
      "word": "Theater",
      "hint": "A place you can visit"
    },
    {
      "word": "Stadium",
      "hint": "A place you can visit"
    },
    {
      "word": "Swimming pool",
      "hint": "A place you can visit"
    },
    {
      "word": "Gym",
      "hint": "A place you can visit"
    },
    {
      "word": "Restaurant",
      "hint": "A place you can visit"
    },
    {
      "word": "Cafe",
      "hint": "A place you can visit"
    },
    {
      "word": "Bakery",
      "hint": "A place you can visit"
    },
    {
      "word": "Supermarket",
      "hint": "A place you can visit"
    },
    {
      "word": "Market",
      "hint": "A place you can visit"
    },
    {
      "word": "Shopping mall",
      "hint": "A place you can visit"
    },
    {
      "word": "Bookstore",
      "hint": "A place you can visit"
    },
    {
      "word": "Toy store",
      "hint": "A place you can visit"
    },
    {
      "word": "Pharmacy",
      "hint": "A place you can visit"
    },
    {
      "word": "Bank",
      "hint": "A place you can visit"
    },
    {
      "word": "Post office",
      "hint": "A place you can visit"
    },
    {
      "word": "Police station",
      "hint": "A place you can visit"
    },
    {
      "word": "Fire station",
      "hint": "A place you can visit"
    },
    {
      "word": "Hotel",
      "hint": "A place you can visit"
    },
    {
      "word": "Hostel",
      "hint": "A place you can visit"
    },
    {
      "word": "Beach",
      "hint": "A place you can visit"
    },
    {
      "word": "Island",
      "hint": "A place you can visit"
    },
    {
      "word": "Mountain",
      "hint": "A place you can visit"
    },
    {
      "word": "Forest",
      "hint": "A place you can visit"
    },
    {
      "word": "Jungle",
      "hint": "A place you can visit"
    },
    {
      "word": "Desert",
      "hint": "A place you can visit"
    },
    {
      "word": "Waterfall",
      "hint": "A place you can visit"
    },
    {
      "word": "River",
      "hint": "A place you can visit"
    },
    {
      "word": "Lake",
      "hint": "A place you can visit"
    },
    {
      "word": "Ocean",
      "hint": "A place you can visit"
    },
    {
      "word": "Valley",
      "hint": "A place you can visit"
    },
    {
      "word": "Cave",
      "hint": "A place you can visit"
    },
    {
      "word": "Volcano",
      "hint": "A place you can visit"
    },
    {
      "word": "Farm",
      "hint": "A place you can visit"
    },
    {
      "word": "Garden",
      "hint": "A place you can visit"
    },
    {
      "word": "Castle",
      "hint": "A place you can visit"
    },
    {
      "word": "Palace",
      "hint": "A place you can visit"
    },
    {
      "word": "Temple",
      "hint": "A place you can visit"
    },
    {
      "word": "Church",
      "hint": "A place you can visit"
    },
    {
      "word": "Mosque",
      "hint": "A place you can visit"
    },
    {
      "word": "Monastery",
      "hint": "A place you can visit"
    },
    {
      "word": "Bridge",
      "hint": "A place you can visit"
    },
    {
      "word": "Lighthouse",
      "hint": "A place you can visit"
    },
    {
      "word": "Harbor",
      "hint": "A place you can visit"
    },
    {
      "word": "Campground",
      "hint": "A place you can visit"
    },
    {
      "word": "Village",
      "hint": "A place you can visit"
    },
    {
      "word": "City",
      "hint": "A place you can visit"
    },
    {
      "word": "Town",
      "hint": "A place you can visit"
    },
    {
      "word": "Suburb",
      "hint": "A place you can visit"
    },
    {
      "word": "University",
      "hint": "A place you can visit"
    },
    {
      "word": "Classroom",
      "hint": "A place you can visit"
    },
    {
      "word": "Office",
      "hint": "A place you can visit"
    },
    {
      "word": "Factory",
      "hint": "A place you can visit"
    },
    {
      "word": "Warehouse",
      "hint": "A place you can visit"
    },
    {
      "word": "Garage",
      "hint": "A place you can visit"
    },
    {
      "word": "Workshop",
      "hint": "A place you can visit"
    },
    {
      "word": "Bakery shop",
      "hint": "A place you can visit"
    },
    {
      "word": "Hair salon",
      "hint": "A place you can visit"
    },
    {
      "word": "Dentist office",
      "hint": "A place you can visit"
    },
    {
      "word": "Courthouse",
      "hint": "A place you can visit"
    },
    {
      "word": "Town hall",
      "hint": "A place you can visit"
    },
    {
      "word": "Amusement park",
      "hint": "A place you can visit"
    },
    {
      "word": "Water park",
      "hint": "A place you can visit"
    },
    {
      "word": "Botanical garden",
      "hint": "A place you can visit"
    },
    {
      "word": "National park",
      "hint": "A place you can visit"
    },
    {
      "word": "Ski resort",
      "hint": "A place you can visit"
    },
    {
      "word": "Train platform",
      "hint": "A place you can visit"
    },
    {
      "word": "Bus stop",
      "hint": "A place you can visit"
    },
    {
      "word": "Gas station",
      "hint": "A place you can visit"
    },
    {
      "word": "Parking lot",
      "hint": "A place you can visit"
    },
    {
      "word": "Book fair",
      "hint": "A place you can visit"
    },
    {
      "word": "Camp",
      "hint": "A place you can visit"
    },
    {
      "word": "Picnic area",
      "hint": "A place you can visit"
    },
    {
      "word": "Sports arena",
      "hint": "A place you can visit"
    },
    {
      "word": "Art gallery",
      "hint": "A place you can visit"
    },
    {
      "word": "Concert hall",
      "hint": "A place you can visit"
    },
    {
      "word": "Planetarium",
      "hint": "A place you can visit"
    },
    {
      "word": "Observatory",
      "hint": "A place you can visit"
    },
    {
      "word": "Wedding hall",
      "hint": "A place you can visit"
    },
    {
      "word": "Farmers market",
      "hint": "A place you can visit"
    },
    {
      "word": "Ice rink",
      "hint": "A place you can visit"
    },
    {
      "word": "Beach resort",
      "hint": "A place you can visit"
    },
    {
      "word": "Castle courtyard",
      "hint": "A place you can visit"
    },
    {
      "word": "Train tunnel",
      "hint": "A place you can visit"
    },
    {
      "word": "Mountain trail",
      "hint": "A place you can visit"
    },
    {
      "word": "Desert oasis",
      "hint": "A place you can visit"
    },
    {
      "word": "Coral reef",
      "hint": "A place you can visit"
    },
    {
      "word": "Glacier",
      "hint": "A place you can visit"
    },
    {
      "word": "Canyon",
      "hint": "A place you can visit"
    },
    {
      "word": "Cliff",
      "hint": "A place you can visit"
    },
    {
      "word": "Meadow",
      "hint": "A place you can visit"
    },
    {
      "word": "Swamp",
      "hint": "A place you can visit"
    },
    {
      "word": "Wetland",
      "hint": "A place you can visit"
    },
    {
      "word": "Rainforest",
      "hint": "A place you can visit"
    },
    {
      "word": "Savanna",
      "hint": "A place you can visit"
    },
    {
      "word": "Waterfront",
      "hint": "A place you can visit"
    },
    {
      "word": "Riverbank",
      "hint": "A place you can visit"
    },
    {
      "word": "Countryside",
      "hint": "A place you can visit"
    },
    {
      "word": "Port",
      "hint": "A place you can visit"
    },
    {
      "word": "Village square",
      "hint": "A place you can visit"
    },
    {
      "word": "City center",
      "hint": "A place you can visit"
    },
    {
      "word": "Bridge crossing",
      "hint": "A place you can visit"
    },
    {
      "word": "Rooftop",
      "hint": "A place you can visit"
    },
    {
      "word": "Basement",
      "hint": "A place you can visit"
    },
    {
      "word": "Attic",
      "hint": "A place you can visit"
    },
    {
      "word": "Kitchen",
      "hint": "A place you can visit"
    },
    {
      "word": "Living room",
      "hint": "A place you can visit"
    },
    {
      "word": "Bedroom",
      "hint": "A place you can visit"
    },
    {
      "word": "Bathroom",
      "hint": "A place you can visit"
    },
    {
      "word": "Dining room",
      "hint": "A place you can visit"
    },
    {
      "word": "Backyard",
      "hint": "A place you can visit"
    },
    {
      "word": "Balcony",
      "hint": "A place you can visit"
    },
    {
      "word": "Porch",
      "hint": "A place you can visit"
    },
    {
      "word": "Garden shed",
      "hint": "A place you can visit"
    },
    {
      "word": "Garage workshop",
      "hint": "A place you can visit"
    },
    {
      "word": "Office lobby",
      "hint": "A place you can visit"
    },
    {
      "word": "Reception desk",
      "hint": "A place you can visit"
    },
    {
      "word": "Bus depot",
      "hint": "A place you can visit"
    },
    {
      "word": "Eiffel Tower",
      "hint": "A famous landmark"
    },
    {
      "word": "Taj Mahal",
      "hint": "A famous landmark"
    },
    {
      "word": "Great Wall of China",
      "hint": "A famous landmark"
    },
    {
      "word": "Statue of Liberty",
      "hint": "A famous landmark"
    },
    {
      "word": "Big Ben",
      "hint": "A famous landmark"
    },
    {
      "word": "Colosseum",
      "hint": "A famous landmark"
    },
    {
      "word": "Pyramids of Giza",
      "hint": "A famous landmark"
    },
    {
      "word": "Mount Everest",
      "hint": "A famous landmark"
    },
    {
      "word": "Machu Picchu",
      "hint": "A famous landmark"
    },
    {
      "word": "Grand Canyon",
      "hint": "A famous landmark"
    },
    {
      "word": "Niagara Falls",
      "hint": "A famous landmark"
    },
    {
      "word": "Great Barrier Reef",
      "hint": "A famous landmark"
    },
    {
      "word": "Christ the Redeemer",
      "hint": "A famous landmark"
    },
    {
      "word": "Golden Gate Bridge",
      "hint": "A famous landmark"
    },
    {
      "word": "Sydney Opera House",
      "hint": "A famous landmark"
    },
    {
      "word": "Petra",
      "hint": "A famous landmark"
    },
    {
      "word": "Stonehenge",
      "hint": "A famous landmark"
    },
    {
      "word": "Leaning Tower of Pisa",
      "hint": "A famous landmark"
    },
    {
      "word": "Acropolis",
      "hint": "A famous landmark"
    },
    {
      "word": "Angkor Wat",
      "hint": "A famous landmark"
    },
    {
      "word": "Burj Khalifa",
      "hint": "A famous landmark"
    },
    {
      "word": "Sphinx",
      "hint": "A famous landmark"
    },
    {
      "word": "Louvre",
      "hint": "A famous landmark"
    },
    {
      "word": "Disneyland",
      "hint": "A famous landmark"
    },
    {
      "word": "Times Square",
      "hint": "A famous landmark"
    },
    {
      "word": "Central Park",
      "hint": "A famous landmark"
    },
    {
      "word": "Buckingham Palace",
      "hint": "A famous landmark"
    },
    {
      "word": "Mount Fuji",
      "hint": "A famous landmark"
    },
    {
      "word": "Victoria Falls",
      "hint": "A famous landmark"
    },
    {
      "word": "Forbidden City",
      "hint": "A famous landmark"
    },
    {
      "word": "Sagrada Familia",
      "hint": "A famous landmark"
    },
    {
      "word": "Tower Bridge",
      "hint": "A famous landmark"
    },
    {
      "word": "Chichen Itza",
      "hint": "A famous landmark"
    },
    {
      "word": "Yellowstone",
      "hint": "A famous landmark"
    },
    {
      "word": "Yosemite",
      "hint": "A famous landmark"
    },
    {
      "word": "Iguazu Falls",
      "hint": "A famous landmark"
    },
    {
      "word": "Empire State Building",
      "hint": "A famous landmark"
    },
    {
      "word": "Red Square",
      "hint": "A famous landmark"
    },
    {
      "word": "Trevi Fountain",
      "hint": "A famous landmark"
    },
    {
      "word": "Mount Rushmore",
      "hint": "A famous landmark"
    },
    {
      "word": "Hollywood Sign",
      "hint": "A famous landmark"
    }
  ],
  "movies": [
    {
      "word": "The Lion King",
      "hint": "An animated or family film"
    },
    {
      "word": "Toy Story",
      "hint": "An animated or family film"
    },
    {
      "word": "Finding Nemo",
      "hint": "An animated or family film"
    },
    {
      "word": "Frozen",
      "hint": "An animated or family film"
    },
    {
      "word": "Shrek",
      "hint": "An animated or family film"
    },
    {
      "word": "Aladdin",
      "hint": "An animated or family film"
    },
    {
      "word": "The Little Mermaid",
      "hint": "An animated or family film"
    },
    {
      "word": "Beauty and the Beast",
      "hint": "An animated or family film"
    },
    {
      "word": "Cinderella",
      "hint": "An animated or family film"
    },
    {
      "word": "Snow White",
      "hint": "An animated or family film"
    },
    {
      "word": "The Jungle Book",
      "hint": "An animated or family film"
    },
    {
      "word": "Moana",
      "hint": "An animated or family film"
    },
    {
      "word": "Encanto",
      "hint": "An animated or family film"
    },
    {
      "word": "Coco",
      "hint": "An animated or family film"
    },
    {
      "word": "Up",
      "hint": "An animated or family film"
    },
    {
      "word": "Inside Out",
      "hint": "An animated or family film"
    },
    {
      "word": "Cars",
      "hint": "An animated or family film"
    },
    {
      "word": "Ratatouille",
      "hint": "An animated or family film"
    },
    {
      "word": "The Incredibles",
      "hint": "An animated or family film"
    },
    {
      "word": "Monsters Inc",
      "hint": "An animated or family film"
    },
    {
      "word": "WALL-E",
      "hint": "An animated or family film"
    },
    {
      "word": "The Princess and the Frog",
      "hint": "An animated or family film"
    },
    {
      "word": "Tangled",
      "hint": "An animated or family film"
    },
    {
      "word": "Zootopia",
      "hint": "An animated or family film"
    },
    {
      "word": "Big Hero 6",
      "hint": "An animated or family film"
    },
    {
      "word": "Brave",
      "hint": "An animated or family film"
    },
    {
      "word": "Turning Red",
      "hint": "An animated or family film"
    },
    {
      "word": "Luca",
      "hint": "An animated or family film"
    },
    {
      "word": "Soul",
      "hint": "An animated or family film"
    },
    {
      "word": "Elemental",
      "hint": "An animated or family film"
    },
    {
      "word": "Kung Fu Panda",
      "hint": "An animated or family film"
    },
    {
      "word": "How to Train Your Dragon",
      "hint": "An animated or family film"
    },
    {
      "word": "Madagascar",
      "hint": "An animated or family film"
    },
    {
      "word": "Ice Age",
      "hint": "An animated or family film"
    },
    {
      "word": "Despicable Me",
      "hint": "An animated or family film"
    },
    {
      "word": "Minions",
      "hint": "An animated or family film"
    },
    {
      "word": "The Secret Life of Pets",
      "hint": "An animated or family film"
    },
    {
      "word": "The Lego Movie",
      "hint": "An animated or family film"
    },
    {
      "word": "The Super Mario Bros Movie",
      "hint": "An animated or family film"
    },
    {
      "word": "Shrek 2",
      "hint": "An animated or family film"
    },
    {
      "word": "Toy Story 2",
      "hint": "An animated or family film"
    },
    {
      "word": "Toy Story 3",
      "hint": "An animated or family film"
    },
    {
      "word": "Finding Dory",
      "hint": "An animated or family film"
    },
    {
      "word": "Frozen 2",
      "hint": "An animated or family film"
    },
    {
      "word": "The Lion King 2",
      "hint": "An animated or family film"
    },
    {
      "word": "The Emperor’s New Groove",
      "hint": "An animated or family film"
    },
    {
      "word": "Mulan",
      "hint": "An animated or family film"
    },
    {
      "word": "Pocahontas",
      "hint": "An animated or family film"
    },
    {
      "word": "Hercules",
      "hint": "An animated or family film"
    },
    {
      "word": "Tarzan",
      "hint": "An animated or family film"
    },
    {
      "word": "Bambi",
      "hint": "An animated or family film"
    },
    {
      "word": "Dumbo",
      "hint": "An animated or family film"
    },
    {
      "word": "Pinocchio",
      "hint": "An animated or family film"
    },
    {
      "word": "Peter Pan",
      "hint": "An animated or family film"
    },
    {
      "word": "Alice in Wonderland",
      "hint": "An animated or family film"
    },
    {
      "word": "Lady and the Tramp",
      "hint": "An animated or family film"
    },
    {
      "word": "101 Dalmatians",
      "hint": "An animated or family film"
    },
    {
      "word": "The Aristocats",
      "hint": "An animated or family film"
    },
    {
      "word": "The Fox and the Hound",
      "hint": "An animated or family film"
    },
    {
      "word": "Lilo and Stitch",
      "hint": "An animated or family film"
    },
    {
      "word": "The Hunchback of Notre Dame",
      "hint": "An animated or family film"
    },
    {
      "word": "The Iron Giant",
      "hint": "An animated or family film"
    },
    {
      "word": "Spirited Away",
      "hint": "An animated or family film"
    },
    {
      "word": "My Neighbor Totoro",
      "hint": "An animated or family film"
    },
    {
      "word": "Howl’s Moving Castle",
      "hint": "An animated or family film"
    },
    {
      "word": "Kiki’s Delivery Service",
      "hint": "An animated or family film"
    },
    {
      "word": "Ponyo",
      "hint": "An animated or family film"
    },
    {
      "word": "The Boy and the Heron",
      "hint": "An animated or family film"
    },
    {
      "word": "Paddington",
      "hint": "An animated or family film"
    },
    {
      "word": "Paddington 2",
      "hint": "An animated or family film"
    },
    {
      "word": "The Polar Express",
      "hint": "An animated or family film"
    },
    {
      "word": "The Grinch",
      "hint": "An animated or family film"
    },
    {
      "word": "The Lorax",
      "hint": "An animated or family film"
    },
    {
      "word": "The Cat in the Hat",
      "hint": "An animated or family film"
    },
    {
      "word": "The Croods",
      "hint": "An animated or family film"
    },
    {
      "word": "Sing",
      "hint": "An animated or family film"
    },
    {
      "word": "Trolls",
      "hint": "An animated or family film"
    },
    {
      "word": "Rio",
      "hint": "An animated or family film"
    },
    {
      "word": "Rango",
      "hint": "An animated or family film"
    },
    {
      "word": "Puss in Boots",
      "hint": "An animated or family film"
    },
    {
      "word": "Chicken Run",
      "hint": "An animated or family film"
    },
    {
      "word": "Wallace and Gromit",
      "hint": "An animated or family film"
    },
    {
      "word": "The Nightmare Before Christmas",
      "hint": "An animated or family film"
    },
    {
      "word": "Coraline",
      "hint": "An animated or family film"
    },
    {
      "word": "The Peanuts Movie",
      "hint": "An animated or family film"
    },
    {
      "word": "The Smurfs",
      "hint": "An animated or family film"
    },
    {
      "word": "Sonic the Hedgehog",
      "hint": "An animated or family film"
    },
    {
      "word": "Detective Pikachu",
      "hint": "An animated or family film"
    },
    {
      "word": "The Bad Guys",
      "hint": "An animated or family film"
    },
    {
      "word": "The Wild Robot",
      "hint": "An animated or family film"
    },
    {
      "word": "Star Wars",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Empire Strikes Back",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Return of the Jedi",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Avatar",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Avatar The Way of Water",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Jurassic Park",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Jurassic World",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Jaws",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Titanic",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Avengers",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Avengers Endgame",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Avengers Infinity War",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Iron Man",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Thor",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Black Panther",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Captain America The First Avenger",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Spider-Man",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Spider-Man Homecoming",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Spider-Man No Way Home",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Doctor Strange",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Guardians of the Galaxy",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Wonder Woman",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Batman Begins",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Dark Knight",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Batman",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Superman",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Man of Steel",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Aquaman",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Flash",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Deadpool",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Logan",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Matrix",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Matrix Reloaded",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Inception",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Interstellar",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Dune",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Dune Part Two",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Lord of the Rings The Fellowship of the Ring",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Lord of the Rings The Two Towers",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Lord of the Rings The Return of the King",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Hobbit",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Harry Potter and the Sorcerer’s Stone",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Harry Potter and the Chamber of Secrets",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Harry Potter and the Prisoner of Azkaban",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Harry Potter and the Goblet of Fire",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Pirates of the Caribbean",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Indiana Jones and the Raiders of the Lost Ark",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Indiana Jones and the Last Crusade",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Mummy",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Hunger Games",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Catching Fire",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Divergent",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Maze Runner",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Twilight",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Chronicles of Narnia",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Princess Bride",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Jumanji",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Jumanji Welcome to the Jungle",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Back to the Future",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Back to the Future Part II",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Ghostbusters",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Goonies",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "E.T.",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "King Kong",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Godzilla",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Godzilla vs Kong",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Transformers",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Pacific Rim",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Mission Impossible",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Top Gun",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Top Gun Maverick",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Fast and Furious",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Furious 7",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "John Wick",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Die Hard",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Terminator",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Terminator 2",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Predator",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Alien",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Aliens",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Gladiator",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "300",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Troy",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Braveheart",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Last Samurai",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Karate Kid",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Rocky",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Creed",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Meg",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "National Treasure",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Da Vinci Code",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Sherlock Holmes",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Mask of Zorro",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Robin Hood",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Three Musketeers",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Jungle Cruise",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Uncharted",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Tomb Raider",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Bourne Identity",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Casino Royale",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Skyfall",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "No Time to Die",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "The Mummy Returns",
      "hint": "An action, adventure or fantasy film"
    },
    {
      "word": "Home Alone",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Home Alone 2",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Forrest Gump",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Shawshank Redemption",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Godfather",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Godfather Part II",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Green Mile",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Pursuit of Happyness",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Truman Show",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Grand Budapest Hotel",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Sound of Music",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Grease",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Mamma Mia",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "La La Land",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Greatest Showman",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Wizard of Oz",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Mary Poppins",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Matilda",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Charlie and the Chocolate Factory",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Wonka",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "School of Rock",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Mrs Doubtfire",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Parent Trap",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Mean Girls",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Clueless",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Legally Blonde",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Barbie",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Devil Wears Prada",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Princess Diaries",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Holiday",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Love Actually",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Notting Hill",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Pretty Woman",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Notebook",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "A Star Is Born",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Fault in Our Stars",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Little Women",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Help",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Hidden Figures",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Good Will Hunting",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Social Network",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Cast Away",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Life of Pi",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Slumdog Millionaire",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "3 Idiots",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Dangal",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Lagaan",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Dilwale Dulhania Le Jayenge",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Kabhi Khushi Kabhie Gham",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "PK",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Lion",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Coco Before Chanel",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Intern",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Secret Life of Walter Mitty",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Catch Me If You Can",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Terminal",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Curious Case of Benjamin Button",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The King’s Speech",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Imitation Game",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Theory of Everything",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Bohemian Rhapsody",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Rocketman",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Oppenheimer",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "A Beautiful Mind",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Dead Poets Society",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Breakfast Club",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Ferris Bueller’s Day Off",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Groundhog Day",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Chariots of Fire",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Cool Runnings",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Blind Side",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Julie and Julia",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Chef",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The King and I",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "West Side Story",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Hairspray",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Les Misérables",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Moulin Rouge",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "Pitch Perfect",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Wedding Planner",
      "hint": "A comedy, drama or musical film"
    },
    {
      "word": "The Proposal",
      "hint": "A comedy, drama or musical film"
    }
  ],
  "objects": [
    {
      "word": "Chair",
      "hint": "Something used at home"
    },
    {
      "word": "Table",
      "hint": "Something used at home"
    },
    {
      "word": "Sofa",
      "hint": "Something used at home"
    },
    {
      "word": "Couch",
      "hint": "Something used at home"
    },
    {
      "word": "Bed",
      "hint": "Something used at home"
    },
    {
      "word": "Pillow",
      "hint": "Something used at home"
    },
    {
      "word": "Blanket",
      "hint": "Something used at home"
    },
    {
      "word": "Mattress",
      "hint": "Something used at home"
    },
    {
      "word": "Wardrobe",
      "hint": "Something used at home"
    },
    {
      "word": "Closet",
      "hint": "Something used at home"
    },
    {
      "word": "Dresser",
      "hint": "Something used at home"
    },
    {
      "word": "Bookshelf",
      "hint": "Something used at home"
    },
    {
      "word": "Mirror",
      "hint": "Something used at home"
    },
    {
      "word": "Lamp",
      "hint": "Something used at home"
    },
    {
      "word": "Light bulb",
      "hint": "Something used at home"
    },
    {
      "word": "Clock",
      "hint": "Something used at home"
    },
    {
      "word": "Alarm clock",
      "hint": "Something used at home"
    },
    {
      "word": "Wall calendar",
      "hint": "Something used at home"
    },
    {
      "word": "Curtain",
      "hint": "Something used at home"
    },
    {
      "word": "Rug",
      "hint": "Something used at home"
    },
    {
      "word": "Carpet",
      "hint": "Something used at home"
    },
    {
      "word": "Doormat",
      "hint": "Something used at home"
    },
    {
      "word": "Door",
      "hint": "Something used at home"
    },
    {
      "word": "Window",
      "hint": "Something used at home"
    },
    {
      "word": "Door handle",
      "hint": "Something used at home"
    },
    {
      "word": "Key",
      "hint": "Something used at home"
    },
    {
      "word": "Lock",
      "hint": "Something used at home"
    },
    {
      "word": "Shelf",
      "hint": "Something used at home"
    },
    {
      "word": "Picture frame",
      "hint": "Something used at home"
    },
    {
      "word": "Candle",
      "hint": "Something used at home"
    },
    {
      "word": "Vase",
      "hint": "Something used at home"
    },
    {
      "word": "Flowerpot",
      "hint": "Something used at home"
    },
    {
      "word": "Fan",
      "hint": "Something used at home"
    },
    {
      "word": "Heater",
      "hint": "Something used at home"
    },
    {
      "word": "Air conditioner",
      "hint": "Something used at home"
    },
    {
      "word": "Remote control",
      "hint": "Something used at home"
    },
    {
      "word": "Television",
      "hint": "Something used at home"
    },
    {
      "word": "Radio",
      "hint": "Something used at home"
    },
    {
      "word": "Speaker",
      "hint": "Something used at home"
    },
    {
      "word": "Headphones",
      "hint": "Something used at home"
    },
    {
      "word": "Telephone",
      "hint": "Something used at home"
    },
    {
      "word": "Mobile phone",
      "hint": "Something used at home"
    },
    {
      "word": "Charger",
      "hint": "Something used at home"
    },
    {
      "word": "Power cable",
      "hint": "Something used at home"
    },
    {
      "word": "Battery",
      "hint": "Something used at home"
    },
    {
      "word": "Flashlight",
      "hint": "Something used at home"
    },
    {
      "word": "Umbrella",
      "hint": "Something used at home"
    },
    {
      "word": "Backpack",
      "hint": "Something used at home"
    },
    {
      "word": "Suitcase",
      "hint": "Something used at home"
    },
    {
      "word": "Wallet",
      "hint": "Something used at home"
    },
    {
      "word": "Purse",
      "hint": "Something used at home"
    },
    {
      "word": "Handbag",
      "hint": "Something used at home"
    },
    {
      "word": "Water bottle",
      "hint": "Something used at home"
    },
    {
      "word": "Thermos",
      "hint": "Something used at home"
    },
    {
      "word": "Lunchbox",
      "hint": "Something used at home"
    },
    {
      "word": "Basket",
      "hint": "Something used at home"
    },
    {
      "word": "Box",
      "hint": "Something used at home"
    },
    {
      "word": "Trash can",
      "hint": "Something used at home"
    },
    {
      "word": "Broom",
      "hint": "Something used at home"
    },
    {
      "word": "Mop",
      "hint": "Something used at home"
    },
    {
      "word": "Bucket",
      "hint": "Something used at home"
    },
    {
      "word": "Vacuum cleaner",
      "hint": "Something used at home"
    },
    {
      "word": "Dustpan",
      "hint": "Something used at home"
    },
    {
      "word": "Sponge",
      "hint": "Something used at home"
    },
    {
      "word": "Soap",
      "hint": "Something used at home"
    },
    {
      "word": "Towel",
      "hint": "Something used at home"
    },
    {
      "word": "Toothbrush",
      "hint": "Something used at home"
    },
    {
      "word": "Toothpaste",
      "hint": "Something used at home"
    },
    {
      "word": "Hairbrush",
      "hint": "Something used at home"
    },
    {
      "word": "Comb",
      "hint": "Something used at home"
    },
    {
      "word": "Shampoo",
      "hint": "Something used at home"
    },
    {
      "word": "Toilet paper",
      "hint": "Something used at home"
    },
    {
      "word": "Tissue",
      "hint": "Something used at home"
    },
    {
      "word": "Toilet",
      "hint": "Something used at home"
    },
    {
      "word": "Sink",
      "hint": "Something used at home"
    },
    {
      "word": "Bathtub",
      "hint": "Something used at home"
    },
    {
      "word": "Shower",
      "hint": "Something used at home"
    },
    {
      "word": "Soap dispenser",
      "hint": "Something used at home"
    },
    {
      "word": "Laundry basket",
      "hint": "Something used at home"
    },
    {
      "word": "Washing machine",
      "hint": "Something used at home"
    },
    {
      "word": "Dryer",
      "hint": "Something used at home"
    },
    {
      "word": "Iron",
      "hint": "Something used at home"
    },
    {
      "word": "Ironing board",
      "hint": "Something used at home"
    },
    {
      "word": "Hanger",
      "hint": "Something used at home"
    },
    {
      "word": "Sewing machine",
      "hint": "Something used at home"
    },
    {
      "word": "Needle",
      "hint": "Something used at home"
    },
    {
      "word": "Thread",
      "hint": "Something used at home"
    },
    {
      "word": "Button",
      "hint": "Something used at home"
    },
    {
      "word": "Zipper",
      "hint": "Something used at home"
    },
    {
      "word": "Clothes peg",
      "hint": "Something used at home"
    },
    {
      "word": "Clothesline",
      "hint": "Something used at home"
    },
    {
      "word": "Scissors",
      "hint": "Something used at home"
    },
    {
      "word": "Tape",
      "hint": "Something used at home"
    },
    {
      "word": "Glue",
      "hint": "Something used at home"
    },
    {
      "word": "Rope",
      "hint": "Something used at home"
    },
    {
      "word": "String",
      "hint": "Something used at home"
    },
    {
      "word": "Ladder",
      "hint": "Something used at home"
    },
    {
      "word": "Toolbox",
      "hint": "Something used at home"
    },
    {
      "word": "Hammer",
      "hint": "Something used at home"
    },
    {
      "word": "Screwdriver",
      "hint": "Something used at home"
    },
    {
      "word": "Wrench",
      "hint": "Something used at home"
    },
    {
      "word": "Pliers",
      "hint": "Something used at home"
    },
    {
      "word": "Nail",
      "hint": "Something used at home"
    },
    {
      "word": "Screw",
      "hint": "Something used at home"
    },
    {
      "word": "Drill",
      "hint": "Something used at home"
    },
    {
      "word": "Paintbrush",
      "hint": "Something used at home"
    },
    {
      "word": "Paint roller",
      "hint": "Something used at home"
    },
    {
      "word": "Tape measure",
      "hint": "Something used at home"
    },
    {
      "word": "Saw",
      "hint": "Something used at home"
    },
    {
      "word": "Shovel",
      "hint": "Something used at home"
    },
    {
      "word": "Rake",
      "hint": "Something used at home"
    },
    {
      "word": "Garden hose",
      "hint": "Something used at home"
    },
    {
      "word": "Watering can",
      "hint": "Something used at home"
    },
    {
      "word": "Wheelbarrow",
      "hint": "Something used at home"
    },
    {
      "word": "Flower vase",
      "hint": "Something used at home"
    },
    {
      "word": "Plate",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Bowl",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Cup",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Mug",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Glass",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Fork",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Spoon",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Knife",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Chopsticks",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Straw",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Napkin",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Tray",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Serving spoon",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Pot",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Pan",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Frying pan",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Saucepan",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Kettle",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Teapot",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Coffee maker",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Toaster",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Blender",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Microwave",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Oven",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Stove",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Refrigerator",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Freezer",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Dishwasher",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Cutting board",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Rolling pin",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Whisk",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Ladle",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Spatula",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Grater",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Peeler",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Colander",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Can opener",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Bottle opener",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Corkscrew",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Measuring cup",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Measuring spoon",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Kitchen scale",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Lunch tray",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Apron",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Oven mitt",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Dishcloth",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Food container",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Ice tray",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Salt shaker",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Pepper mill",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Cake tin",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Baking sheet",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Strainer",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Chopping knife",
      "hint": "Something used in a kitchen"
    },
    {
      "word": "Book",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Notebook",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Textbook",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Dictionary",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Magazine",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Newspaper",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Paper",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Pencil",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Pen",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Eraser",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Ruler",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Marker",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Highlighter",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Crayon",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Colored pencil",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Paint",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Canvas",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Glue stick",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Stapler",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Staple",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Paper clip",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Binder",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Folder",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Envelope",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Stamp",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Postcard",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Letter",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Calculator",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Computer",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Laptop",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Keyboard",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Mouse",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Monitor",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Printer",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Scanner",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Tablet",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Webcam",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Microphone",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "USB drive",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Hard drive",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Game controller",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Video game console",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Camera",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Tripod",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Binoculars",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Telescope",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Microscope",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Magnifying glass",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Compass",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Map",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Globe",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Puzzle",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Board game",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Playing cards",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Dice",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Chessboard",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Chess piece",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Domino",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Toy car",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Doll",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Teddy bear",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Kite",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Balloon",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Yo-yo",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Frisbee",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Hula hoop",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Jump rope",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Bicycle",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Skateboard",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Scooter",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Helmet",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Basketball",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Football",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Tennis racket",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Baseball bat",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Golf club",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Fishing rod",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Guitar",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Piano",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Drum",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Violin",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Flute",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Trumpet",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Harmonica",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Ukulele",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Sunglasses",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Watch",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Ring",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Necklace",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Bracelet",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Hat",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Cap",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Shoe",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Boot",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Sock",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Glove",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Scarf",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Coat",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Jacket",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "T-shirt",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Dress",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Jeans",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Belt",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Tie",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Raincoat",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Slippers",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Sandals",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Toothpick",
      "hint": "Something used for work, school or play"
    },
    {
      "word": "Safety pin",
      "hint": "Something used for work, school or play"
    }
  ],
  "sports": [
    {
      "word": "Football",
      "hint": "A team ball sport"
    },
    {
      "word": "Basketball",
      "hint": "A team ball sport"
    },
    {
      "word": "Volleyball",
      "hint": "A team ball sport"
    },
    {
      "word": "Cricket",
      "hint": "A team ball sport"
    },
    {
      "word": "Baseball",
      "hint": "A team ball sport"
    },
    {
      "word": "Softball",
      "hint": "A team ball sport"
    },
    {
      "word": "Rugby union",
      "hint": "A team ball sport"
    },
    {
      "word": "Rugby league",
      "hint": "A team ball sport"
    },
    {
      "word": "American football",
      "hint": "A team ball sport"
    },
    {
      "word": "Canadian football",
      "hint": "A team ball sport"
    },
    {
      "word": "Australian rules football",
      "hint": "A team ball sport"
    },
    {
      "word": "Gaelic football",
      "hint": "A team ball sport"
    },
    {
      "word": "Handball",
      "hint": "A team ball sport"
    },
    {
      "word": "Netball",
      "hint": "A team ball sport"
    },
    {
      "word": "Water polo",
      "hint": "A team ball sport"
    },
    {
      "word": "Field hockey",
      "hint": "A team ball sport"
    },
    {
      "word": "Ice hockey",
      "hint": "A team ball sport"
    },
    {
      "word": "Floorball",
      "hint": "A team ball sport"
    },
    {
      "word": "Lacrosse",
      "hint": "A team ball sport"
    },
    {
      "word": "Polo",
      "hint": "A team ball sport"
    },
    {
      "word": "Beach volleyball",
      "hint": "A team ball sport"
    },
    {
      "word": "Indoor volleyball",
      "hint": "A team ball sport"
    },
    {
      "word": "Futsal",
      "hint": "A team ball sport"
    },
    {
      "word": "Beach soccer",
      "hint": "A team ball sport"
    },
    {
      "word": "Indoor soccer",
      "hint": "A team ball sport"
    },
    {
      "word": "Fistball",
      "hint": "A team ball sport"
    },
    {
      "word": "Sepak takraw",
      "hint": "A team ball sport"
    },
    {
      "word": "Kabaddi",
      "hint": "A team ball sport"
    },
    {
      "word": "Dodgeball",
      "hint": "A team ball sport"
    },
    {
      "word": "Kickball",
      "hint": "A team ball sport"
    },
    {
      "word": "Rounders",
      "hint": "A team ball sport"
    },
    {
      "word": "Ultimate frisbee",
      "hint": "A team ball sport"
    },
    {
      "word": "Hurling",
      "hint": "A team ball sport"
    },
    {
      "word": "Camogie",
      "hint": "A team ball sport"
    },
    {
      "word": "Bandy",
      "hint": "A team ball sport"
    },
    {
      "word": "Roller hockey",
      "hint": "A team ball sport"
    },
    {
      "word": "Street hockey",
      "hint": "A team ball sport"
    },
    {
      "word": "Underwater hockey",
      "hint": "A team ball sport"
    },
    {
      "word": "Broomball",
      "hint": "A team ball sport"
    },
    {
      "word": "Kin-ball",
      "hint": "A team ball sport"
    },
    {
      "word": "Tchoukball",
      "hint": "A team ball sport"
    },
    {
      "word": "Korfball",
      "hint": "A team ball sport"
    },
    {
      "word": "Intercrosse",
      "hint": "A team ball sport"
    },
    {
      "word": "Ringette",
      "hint": "A team ball sport"
    },
    {
      "word": "Touch rugby",
      "hint": "A team ball sport"
    },
    {
      "word": "Flag football",
      "hint": "A team ball sport"
    },
    {
      "word": "Tag rugby",
      "hint": "A team ball sport"
    },
    {
      "word": "Wheelchair basketball",
      "hint": "A team ball sport"
    },
    {
      "word": "Wheelchair rugby",
      "hint": "A team ball sport"
    },
    {
      "word": "Wheelchair football",
      "hint": "A team ball sport"
    },
    {
      "word": "Sitting volleyball",
      "hint": "A team ball sport"
    },
    {
      "word": "Powerchair football",
      "hint": "A team ball sport"
    },
    {
      "word": "Goalball",
      "hint": "A team ball sport"
    },
    {
      "word": "Blind football",
      "hint": "A team ball sport"
    },
    {
      "word": "Canoe polo",
      "hint": "A team ball sport"
    },
    {
      "word": "Cycle ball",
      "hint": "A team ball sport"
    },
    {
      "word": "Ice sledge hockey",
      "hint": "A team ball sport"
    },
    {
      "word": "Beach handball",
      "hint": "A team ball sport"
    },
    {
      "word": "Beach rugby",
      "hint": "A team ball sport"
    },
    {
      "word": "Snow volleyball",
      "hint": "A team ball sport"
    },
    {
      "word": "Teqball",
      "hint": "A team ball sport"
    },
    {
      "word": "Footvolley",
      "hint": "A team ball sport"
    },
    {
      "word": "Bossaball",
      "hint": "A team ball sport"
    },
    {
      "word": "Paddle tennis",
      "hint": "A team ball sport"
    },
    {
      "word": "Pickleball doubles",
      "hint": "A team ball sport"
    },
    {
      "word": "Basketball 3x3",
      "hint": "A team ball sport"
    },
    {
      "word": "Streetball",
      "hint": "A team ball sport"
    },
    {
      "word": "Tennis",
      "hint": "A racket or paddle sport"
    },
    {
      "word": "Table tennis",
      "hint": "A racket or paddle sport"
    },
    {
      "word": "Badminton",
      "hint": "A racket or paddle sport"
    },
    {
      "word": "Squash",
      "hint": "A racket or paddle sport"
    },
    {
      "word": "Pickleball",
      "hint": "A racket or paddle sport"
    },
    {
      "word": "Padel",
      "hint": "A racket or paddle sport"
    },
    {
      "word": "Racquetball",
      "hint": "A racket or paddle sport"
    },
    {
      "word": "Beach tennis",
      "hint": "A racket or paddle sport"
    },
    {
      "word": "Platform tennis",
      "hint": "A racket or paddle sport"
    },
    {
      "word": "Real tennis",
      "hint": "A racket or paddle sport"
    },
    {
      "word": "Soft tennis",
      "hint": "A racket or paddle sport"
    },
    {
      "word": "Rackets",
      "hint": "A racket or paddle sport"
    },
    {
      "word": "Pelota",
      "hint": "A racket or paddle sport"
    },
    {
      "word": "Jai alai",
      "hint": "A racket or paddle sport"
    },
    {
      "word": "Frontenis",
      "hint": "A racket or paddle sport"
    },
    {
      "word": "Basque pelota",
      "hint": "A racket or paddle sport"
    },
    {
      "word": "Crossminton",
      "hint": "A racket or paddle sport"
    },
    {
      "word": "Speed badminton",
      "hint": "A racket or paddle sport"
    },
    {
      "word": "Ping pong doubles",
      "hint": "A racket or paddle sport"
    },
    {
      "word": "Tennis doubles",
      "hint": "A racket or paddle sport"
    },
    {
      "word": "Badminton doubles",
      "hint": "A racket or paddle sport"
    },
    {
      "word": "Squash doubles",
      "hint": "A racket or paddle sport"
    },
    {
      "word": "Boxing",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Wrestling",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Judo",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Karate",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Taekwondo",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Fencing",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Sumo",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Kickboxing",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Muay Thai",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Mixed martial arts",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Brazilian jiu-jitsu",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Jiu-jitsu",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Aikido",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Kendo",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Kung fu",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Wushu",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Sambo",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Freestyle wrestling",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Greco-Roman wrestling",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Olympic boxing",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Sanda",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Savate",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Capoeira",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Jujutsu",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Hapkido",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Tai chi",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Kyokushin karate",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Taido",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Pencak silat",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Krav maga",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Kumite",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Kata",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Epee fencing",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Foil fencing",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Sabre fencing",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Arm wrestling",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Submission grappling",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Belt wrestling",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Beach wrestling",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Amateur wrestling",
      "hint": "A combat sport or martial art"
    },
    {
      "word": "Running",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Sprinting",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Marathon",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Half marathon",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Relay race",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Hurdles",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Steeplechase",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Race walking",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Long jump",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "High jump",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Triple jump",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Pole vault",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Shot put",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Discus throw",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Javelin throw",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Hammer throw",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Decathlon",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Heptathlon",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Pentathlon",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Cross-country running",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Trail running",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Road running",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Orienteering",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Mountain running",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Ultra marathon",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "100 meter sprint",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "200 meter sprint",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "400 meter sprint",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "800 meter race",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "1500 meter race",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "5000 meter race",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "10000 meter race",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "4 by 100 relay",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "4 by 400 relay",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "110 meter hurdles",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "400 meter hurdles",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Indoor track",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Wheelchair racing",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Para athletics",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Obstacle course racing",
      "hint": "An athletic race, jump or throw"
    },
    {
      "word": "Swimming",
      "hint": "A water sport"
    },
    {
      "word": "Diving",
      "hint": "A water sport"
    },
    {
      "word": "Water skiing",
      "hint": "A water sport"
    },
    {
      "word": "Surfing",
      "hint": "A water sport"
    },
    {
      "word": "Bodyboarding",
      "hint": "A water sport"
    },
    {
      "word": "Paddleboarding",
      "hint": "A water sport"
    },
    {
      "word": "Kayaking",
      "hint": "A water sport"
    },
    {
      "word": "Canoeing",
      "hint": "A water sport"
    },
    {
      "word": "Rowing",
      "hint": "A water sport"
    },
    {
      "word": "Sailing",
      "hint": "A water sport"
    },
    {
      "word": "Windsurfing",
      "hint": "A water sport"
    },
    {
      "word": "Kitesurfing",
      "hint": "A water sport"
    },
    {
      "word": "Wakeboarding",
      "hint": "A water sport"
    },
    {
      "word": "Snorkeling",
      "hint": "A water sport"
    },
    {
      "word": "Scuba diving",
      "hint": "A water sport"
    },
    {
      "word": "Freediving",
      "hint": "A water sport"
    },
    {
      "word": "Synchronized swimming",
      "hint": "A water sport"
    },
    {
      "word": "Open water swimming",
      "hint": "A water sport"
    },
    {
      "word": "Marathon swimming",
      "hint": "A water sport"
    },
    {
      "word": "Freestyle swimming",
      "hint": "A water sport"
    },
    {
      "word": "Breaststroke",
      "hint": "A water sport"
    },
    {
      "word": "Backstroke",
      "hint": "A water sport"
    },
    {
      "word": "Butterfly stroke",
      "hint": "A water sport"
    },
    {
      "word": "Medley swimming",
      "hint": "A water sport"
    },
    {
      "word": "High diving",
      "hint": "A water sport"
    },
    {
      "word": "Synchronized diving",
      "hint": "A water sport"
    },
    {
      "word": "Springboard diving",
      "hint": "A water sport"
    },
    {
      "word": "Platform diving",
      "hint": "A water sport"
    },
    {
      "word": "Dragon boat racing",
      "hint": "A water sport"
    },
    {
      "word": "Whitewater rafting",
      "hint": "A water sport"
    },
    {
      "word": "Whitewater kayaking",
      "hint": "A water sport"
    },
    {
      "word": "Canoe sprint",
      "hint": "A water sport"
    },
    {
      "word": "Canoe slalom",
      "hint": "A water sport"
    },
    {
      "word": "Ocean rowing",
      "hint": "A water sport"
    },
    {
      "word": "Surf lifesaving",
      "hint": "A water sport"
    },
    {
      "word": "Jet skiing",
      "hint": "A water sport"
    },
    {
      "word": "Water aerobics",
      "hint": "A water sport"
    },
    {
      "word": "Underwater rugby",
      "hint": "A water sport"
    },
    {
      "word": "Lifesaving sport",
      "hint": "A water sport"
    },
    {
      "word": "Outrigger canoeing",
      "hint": "A water sport"
    },
    {
      "word": "River surfing",
      "hint": "A water sport"
    },
    {
      "word": "Skiing",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Snowboarding",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Ice skating",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Figure skating",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Speed skating",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Short track speed skating",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Curling",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Ice dancing",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Alpine skiing",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Cross-country skiing",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Ski jumping",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Nordic combined",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Freestyle skiing",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Mogul skiing",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Aerial skiing",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Slalom skiing",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Giant slalom",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Downhill skiing",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Super-G skiing",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Snowboard cross",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Snowboard slopestyle",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Snowboard halfpipe",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Biathlon",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Bobsled",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Luge",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Skeleton",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Sled dog racing",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Ice climbing",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Snowshoe racing",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Ski mountaineering",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Ice sailing",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Snowkiting",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Ski cross",
      "hint": "A winter, snow or ice sport"
    },
    {
      "word": "Cycling",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Road cycling",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Mountain biking",
      "hint": "An individual sport or activity"
    },
    {
      "word": "BMX racing",
      "hint": "An individual sport or activity"
    },
    {
      "word": "BMX freestyle",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Track cycling",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Cyclocross",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Downhill mountain biking",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Bike trials",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Triathlon",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Duathlon",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Gymnastics",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Artistic gymnastics",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Rhythmic gymnastics",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Trampoline",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Parkour",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Acrobatic gymnastics",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Aerobic gymnastics",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Cheerleading",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Climbing",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Sport climbing",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Bouldering",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Rock climbing",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Mountaineering",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Archery",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Target shooting",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Darts",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Bowling",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Golf",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Mini golf",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Disc golf",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Billiards",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Pool",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Snooker",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Croquet",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Bocce",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Boules",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Petanque",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Lawn bowls",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Horse racing",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Horse riding",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Show jumping",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Dressage",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Eventing",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Equestrian vaulting",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Weightlifting",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Powerlifting",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Bodybuilding",
      "hint": "An individual sport or activity"
    },
    {
      "word": "CrossFit",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Strongman",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Tug of war",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Highland games",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Skateboarding",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Roller skating",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Inline skating",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Roller derby",
      "hint": "An individual sport or activity"
    },
    {
      "word": "Roller speed skating",
      "hint": "An individual sport or activity"
    }
  ]
};
