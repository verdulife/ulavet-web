import puppeteer from "puppeteer";
import { writeFileSync } from "node:fs";

const URL = "https://www.instagram.com/ulavetclinicaveterinaria";
const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();

// simulate a regular desktop browser and set a reasonable viewport
await page.setUserAgent(
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
);
await page.setViewport({ width: 1280, height: 800 });

// wait longer and for network idle to ensure the article bloc has rendered
await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
await page.waitForSelector("article", { timeout: 60000 });

const posts = await page.evaluate(() => {
  const maxPosts = 9;
  const images = document.querySelectorAll('div._aagv img[src]');
  return [].slice
    .call(images, 0, maxPosts)
    .map((img) => ({ url: img.src, alt: img.alt }));
});

const viewportSize = 400;

for (let i = 0; i < posts.length; i++) {
  const { alt } = posts[i];
  const filename = `post-${i + 1}.jpg`;

  await page.setViewport({ width: viewportSize, height: viewportSize });

  await page.goto(posts[i].url);
  await page.screenshot({ path: `./public/posts/${filename}`, type: "jpeg" });

  posts[i] = { alt, src: `./posts/${filename}` };

  console.log(`${i + 1}/${posts.length}`);
}

const json = JSON.stringify(posts, null, 2);
writeFileSync("./src/assets/posts.json", json, "utf-8");

await browser.close();