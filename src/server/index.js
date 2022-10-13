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

app.get("/data", async (req, res) => {

    let roverName = req.query.rover;
    let minPhotosCount = 200;

    try {

        //Fetch the manifesto Data from Rover
        let manifesto = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${roverName}/?api_key=${process.env.API_KEY}`)
            .then(res => res.json()).then(res => res.photo_manifest);


        //create a array with sol number we have to go back to get min 200 pictures from the rover  
        let solNumbersToGoBackArray = manifesto.photos.reverse().reduce((x, c, i, a) => {
            if (i + 1 == a.length) {
                return x.array;
            }
            if (x.count > minPhotosCount) {
                return { count: x.count, sol: x.sol, array: x.array };
            }
            x.array.push(c.sol);
            return { count: x.count += c.total_photos, sol: c.sol, array: x.array };
        }, { count: 0, sol: 0, array: [] });

        // fetch each infomaitons from the sol number in the array. After it change the array so its just one long array with all photos objects
        let photos = (await Promise.all(solNumbersToGoBackArray.map(x =>
            fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/photos?sol=${x}&api_key=${process.env.API_KEY}`)
                .then(res => res.json())
                .then(res => res)
        ))).map(x => {
            return x.photos;
        }).flat();

        let date = new Date().toDateString();

        //send data back
        res.send({ photos: photos, manifesto: manifesto, timeStamp: date });

    } catch (err) {
        console.log("error:", err);
    }
}
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
