import express from "express";
import { chromium } from "playwright";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;


app.use(cors());
app.use(express.json());

app.post("/api/scrape-image", async (req, res) => {
    try {
        const { communityURL } = req.body;
        if (!communityURL || !communityURL.includes("x.com/i/communities/")) {
            return res.status(400).json({ error: "Invalid X community URL" });
        }

        console.log("Scraping:", communityURL);
        const browser = await chromium.launch({ headless: true });
        let page;

        try {
            page = await browser.newPage();
            await page.goto(communityURL, { waitUntil: "domcontentloaded", timeout: 30000 });
            await page.waitForSelector('h2', { timeout: 20000 });

            const scrapedData = await page.evaluate(() => {
                const imageSelectors = [
                    'img[src*="pbs.twimg.com"]', 
                    'img[alt*="community"]', 
                    'img[data-testid="communityAvatar"]'
                ];

                let profileImage = null;
                for (const selector of imageSelectors) {
                    const img = document.querySelector(selector);
                    if (img && img.src) {
                        profileImage = img.src;
                        break;
                    }
                }

                let communityName = null;
                const primaryColumn = document.querySelector('div[data-testid="primaryColumn"]');
                if (primaryColumn) {
                    const nameElement = primaryColumn.querySelector('h2');
                    if (nameElement) {
                        communityName = nameElement.textContent?.trim();
                    }
                }

                return { imageUrl: profileImage, communityName };
            });

            console.log("Scraped:", scrapedData);
            return res.json(scrapedData);

        } catch (err) {
            console.error("Scraping error:", err);
            return res.status(500).json({ error: err.message });
        } finally {
            if (page) await page.close();
            await browser.close();
        }

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Server error", details: error.message });

    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
