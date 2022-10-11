require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

// your API calls

// example API call

app.get("/rover", async (req, res) => {
    let roverName = req.query.rover;
    try {
        let data = await Promise.all([
            fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${roverName}/?api_key=${process.env.API_KEY}`).then(res => res.json()),

            fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/latest_photos?api_key=${process.env.API_KEY}`).then(res => res.json())
        ]).then((res) => res);

        res.send(data);

    } catch (err) {
        console.log("error:", err);
    }
}
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
