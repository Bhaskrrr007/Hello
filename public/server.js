const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/api/mines", async (req, res) => {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto("https://stake.com/casino/games/mines");

        await page.waitForSelector(".grid-class", { timeout: 5000 });

        const mines = await page.evaluate(() => {
            let mineIndexes = [];
            document.querySelectorAll(".mine-class").forEach((el, index) => {
                mineIndexes.push(index);
            });
            return mineIndexes;
        });

        const gems = [...Array(25).keys()].filter(i => !mines.includes(i));

        await browser.close();
        res.json({ mines, gems });

    } catch (error) {
        console.error("Puppeteer failed:", error);
        res.status(500).json({ error: "Failed to fetch mines" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
