import puppeteer from "puppeteer";
import { writeFileSync } from "node:fs";

const URL = "https://www.instagram.com/ulavetclinicaveterinaria";
const browser = await puppeteer.launch({ headless: "new" });
const page = await browser.newPage();

await page.goto(URL);
await page.waitForSelector("article");

const posts = await page.evaluate(() => {
  const maxPosts = 9;
  const images = document.querySelectorAll("img[srcset]");
  return [].slice
    .call(images, 0, maxPosts)
    .map((img) => ({ url: img.src, alt: img.alt }));
});

const viewportSize = 300;

for (let i = 0; i < posts.length; i++) {
  const { alt } = posts[i];
  const filename = `post-${i + 1}.jpg`;

  await page.setViewport({ width: viewportSize, height: viewportSize });

  await page.goto(posts[i].url);
  await page.screenshot({ path: `./public/posts/${filename}`, type: "jpeg" });

  posts[i] = { alt, src: `./posts/${filename}` };
}

const json = JSON.stringify(posts, null, 2);
writeFileSync("./src/assets/posts.json", json, "utf-8");

await browser.close();
