import _ from "lodash";
import {
  BRANDS,
  DESCRIPTIONS,
  IMGS,
  CATEGORIES,
  COLORS,
  TITLES,
  REVIEWS,
  SIZES,
} from "./data.js";
import fs from "fs";

function generateId() {
  let randomString = "";
  const characters = "0123456789";
  const length = 12;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  return randomString;
}

const generateProduct = () => {
  const id = generateId();
  const images = _.sampleSize(
    Array(IMGS.length)
      .fill(0)
      .map((_, i) => i + 12),
    Math.floor(Math.random() * 3) + 2
  );
  const brand = _.sample(BRANDS);
  // const reviews = _.sampleSize(REVIEWS, Math.floor(Math.random() * 40)).map(
  //   (review) => ({ ...review, product: id })
  // );
  const product = {
    title:
      TITLES[brand.toLocaleLowerCase()] +
      " " +
      Math.floor(Math.random() * 10000),
    price: Math.floor(Math.random() * 900) + 100,
    image: _.sample(IMGS),
    images,
    discount: Math.floor(Math.random() * 10) + 15,
    brand,
    category: _.sample(CATEGORIES),
    freeShipping: Math.random() > 0.5,
    colors: _.sampleSize(COLORS, Math.floor(Math.random() * 3) + 1),
    sizes: SIZES.slice(0, Math.floor(Math.random() * SIZES.length) + 2),
    available: Math.random() > 0.1,
    label: Math.random() > 0.8 ? "HOT" : undefined,
    // evaluation: reviews,
    // reviewsCount: reviews.length,
    description: DESCRIPTIONS[brand.toLocaleLowerCase()],
    selled: 0,
    active: true,
  };

  return product;
};

function getLastNumberInFileName() {
  const files = fs.readdirSync("./");

  let lastNumber = 0;

  for (const file of files) {
    if (file.startsWith("products-") && file.endsWith(".json")) {
      const number = parseInt(file.match(/products-(\d+)\.json/)[1]);
      if (number > lastNumber) {
        lastNumber = number;
      }
    }
  }

  return lastNumber;
}

const wantedProductsNumber = parseInt(process.argv[2]);

if (typeof wantedProductsNumber !== "number") {
  throw new Error("Invalid products number");
}

let products = [];
for (let i = 0; i < wantedProductsNumber; i++) {
  products.push(generateProduct());
}
fs.writeFileSync(
  `./products-${getLastNumberInFileName() + 1}.json`,
  JSON.stringify(products, null, "\t"),
  "utf-8"
);
console.log("Products Generated Successfully ✅");
