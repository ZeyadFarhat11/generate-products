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

const generateProduct = () => {
  const imgs = _.sampleSize(IMGS, 4);
  const brand = _.sample(BRANDS);
  const reviews = _.sampleSize(REVIEWS, Math.floor(Math.random() * 40));
  const product = {
    title: TITLES[brand.toLocaleLowerCase()],
    rating: (Math.floor(Math.random() * 20) + 30) / 10,
    price: Math.floor(Math.random() * 900) + 100,
    img: imgs[0],
    imgs: imgs.slice(1),
    discount: Math.floor(Math.random() * 10) + 15,
    brand,
    category: _.sample(CATEGORIES),
    freeShipping: Math.random() > 0.5,
    colors: Array(Math.floor(Math.random() * 3) + 1)
      .fill(0)
      .map(() => _.sample(COLORS)),
    sizes: SIZES.slice(0, Math.floor(Math.random() * SIZES.length) + 2),
    available: Math.random() > 0.1,
    label: Math.random() > 0.8 ? "HOT" : undefined,
    reviews,
    reviewsCount: reviews.length,
    description: DESCRIPTIONS[brand.toLocaleLowerCase()],

    active: true,
  };

  return product;
};

function getLastNumberInFileName() {
  const files = fs.readdirSync("./"); // Assuming the files are in the current directory

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
  JSON.stringify(products),
  "utf-8"
);
console.log("Products Generated Successfully ✅");
