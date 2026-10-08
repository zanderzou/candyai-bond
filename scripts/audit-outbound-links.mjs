import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist", "client");
const read = (route = "") => readFileSync(path.join(dist, route, "index.html"), "utf8");
const sources = new Map([
  ["candy-ai-vs-crushon-ai", ["candy.ai", "crushon.ai"]],
  ["candy-ai-vs-dreamgf", ["candy.ai", "dreamgf.ai"]],
  ["candy-ai-vs-girlfriendgpt", ["candy.ai", "www.gptgirlfriend.online"]],
  ["candy-ai-vs-lovescape", ["candy.ai", "candy.ai", "lovescape.com"]],
  ["candy-ai-vs-ourdream-ai", ["candy.ai", "candy.ai", "ourdream.ai"]],
]);

for (const [slug, expectedHosts] of sources) {
  const html = read(path.join("blog", slug));
  const section = html.match(/<section class="sources" id="sources">([\s\S]*?)<\/section>/)?.[1];
  assert.ok(section, `${slug}: citation section missing`);
  const links = [...section.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/g)];
  assert.deepEqual(links.map((match) => new URL(match[1]).hostname), expectedHosts, `${slug}: cited provider changed`);
  assert.ok(links.every((match) => match[1].startsWith("https://")), `${slug}: citation must use HTTPS`);
  assert.ok(!html.includes("DIRECT ANSWER"), `${slug}: removed answer box returned`);
  assert.ok(!section.includes("ref=zanderzou"), `${slug}: referral replaced citations`);
}

const home = read();
assert.match(home, /<title>Candy AI<\/title>/, "homepage title must match the exact domain keyword");
assert.match(home, /href="https:\/\/candy\.ai\/"/, "official Candy AI destination missing");
const privacy = read("privacy");
assert.match(privacy, /href="https:\/\/policies\.google\.com\/privacy"/, "Google privacy citation missing");
assert.match(read("contact"), /support@candyai\.bond is not configured to receive mail yet/, "mailbox status unclear");

function walk(folder) {
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const filename = path.join(folder, entry.name);
    if (entry.isDirectory()) walk(filename);
    else if (entry.name.endsWith(".html")) {
      const html = readFileSync(filename, "utf8");
      for (const link of html.matchAll(/<a\b[^>]*href="[^"]*ref=zanderzou[^>]*>/g)) {
        assert.match(link[0], /rel="[^"]*sponsored/, `${filename}: promotion is not labeled sponsored`);
        assert.match(link[0], /rel="[^"]*nofollow/, `${filename}: promotion missing nofollow`);
      }
      for (const citation of html.matchAll(/<section class="sources" id="sources">([\s\S]*?)<\/section>/g)) {
        assert.ok(!citation[1].includes("ref=zanderzou"), `${filename}: referral replaced citations`);
      }
      assert.ok(!html.includes("DIRECT ANSWER"), `${filename}: removed answer box remains`);
    }
  }
}
walk(dist);
console.log(`Outbound citation audit passed for ${sources.size} Candy AI comparisons and all English pages.`);
