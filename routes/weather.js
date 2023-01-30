const express = require('express');
const env = require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

const router = express.Router();

const cacheName = 'weather.json';
const cachePath = './database';
const cacheTime = 4 * 60 * 60 * 1000;

const readJsonCache = (name) => {
    try {
        return JSON.parse(fs.readFileSync(`${cachePath}/${name}`, `utf-8`))
    } catch (err) {
        return undefined;
    }
}

const writeJsonCache = (name, data) => {
    if (!fs.existsSync(cachePath)) {
        fs.mkdirSync(cachePath);
    }
    fs.writeFile(`${cachePath}/${name}`, JSON.stringify(data), (err) => {
        if (err) console.log(err);
    });
}

const isCacheOld = (date) => {
    return (new Date().getTime()) - new Date(date) > cacheTime;
}

router.get('/', (req, res) => {
    const cachedData = readJsonCache(cacheName);
    if (!cachedData || isCacheOld(cachedData.date)) {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${process.env.OPENWEATHER_LAT}&lon=${process.env.OPENWEATHER_LON}&appid=${process.env.OPENWEATHER_API}&units=metric&lang=de`).then(response => {
            const { name, main, weather} = response.data;
            const data = {
                date: new Date().getTime(),
                data: { name, main, weather}
            }
            writeJsonCache(cacheName, data);
            res.setHeader('Content-Type', 'application/json');
            res.json(JSON.stringify(readJsonCache(cacheName)));
        });
    } else {
        res.json(cachedData.data);
    }
});

module.exports = router;