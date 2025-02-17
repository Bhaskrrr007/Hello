const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/api/mines", async (req, res) => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        await page.goto("https://stake.ac/casino/games/mines");

        await page.waitForSelector(".some-grid-class"); // Adjust this selector

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
        res.status(500).json({ error: "Failed to fetch mines" });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
