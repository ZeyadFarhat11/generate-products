import puppeteer from "puppeteer-core";
import { readFileSync, readdirSync } from "fs";
import { Presets, SingleBar } from "cli-progress";
import { EMAIL, PASSWORD } from "./data.js";

const lastProductsFile = readdirSync(".")
  .filter((file) => file.includes("products-"))
  .at(-1);
const productsString = readFileSync(lastProductsFile, "utf-8");
const products = JSON.parse(productsString);

const bar = new SingleBar({}, Presets.shades_classic);
bar.start(products.length);

const brands = {
  Adidas: "1",
  Puma: "2",
  Converse: "3",
  Nike: "4",
  Vans: "5",
};
const categories = {
  Shoes: "1",
  Belts: "2",
  Bags: "3",
};
const colors = {
  red: "1",
  blue: "2",
  green: "3",
  black: "4",
  white: "5",
  violet: "6",
  yellow: "7",
};
const sizes = {
  SM: "1",
  MD: "2",
  LG: "3",
  XL: "4",
  "2XL": "5",
};

const isTest = process.argv.includes("--test");

const main = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe",
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1600,
    height: 720,
    deviceScaleFactor: 2,
  });
  await page.goto("http://127.0.0.1:8000/admin/");
  await page.waitForSelector("#login-form");
  await page.type("#id_username", EMAIL);
  await page.type("#id_password", PASSWORD);
  await page.click('input[type="submit"]');
  await page.goto("http://127.0.0.1:8000/admin/store/product/add/");
  await page.waitForSelector('input[name="title"]');

  let maxIterations = isTest ? 1 : products.length;
  for (let i = 0; i < maxIterations; i++) {
    const product = products[i];
    try {
      await page.type('input[name="title"]', product.title);
      await page.type('textarea[name="description"]', product.description);
      await page.type('input[name="price"]', product.price.toString());
      await page.type('input[name="discount"]', product.discount.toString());
      await page.type('input[name="selled"]', product.selled.toString());
      await page.type('input[name="label"]', product.label || "");

      const freeShippingCheckbox = await page.$("#id_free_shipping");
      if (product.freeShipping) await freeShippingCheckbox.click();

      const brandSelect = await page.$('select[name="brand"]');
      await brandSelect.select(brands[product.brand]);

      const colorsSelect = await page.$('select[name="colors"]');
      await colorsSelect.select(
        ...product.colors.map((color) => colors[color])
      );

      const imagesSelect = await page.$('select[name="images"]');
      await imagesSelect.select(...product.images.map((e) => String(e)));

      const sizesSelect = await page.$('select[name="sizes"]');
      await sizesSelect.select(...product.sizes.map((size) => sizes[size]));

      const imageInput = await page.$('input[name="image"]');
      await imageInput.uploadFile(product.image);

      const categorySelect = await page.$('select[name="category"]');
      await categorySelect.select(categories[product.category]);

      if (!isTest) {
        await page.click('input[name="_addanother"]');
      }

      bar.update(i + 1);
      await sleep(300);
    } catch (err) {
      console.log(`${product.title} Failed💥`);
      console.log(err);
    }
  }

  bar.stop();
  await browser.close();
};
main();

const sleep = (time) => new Promise((res) => setTimeout(res, time));
