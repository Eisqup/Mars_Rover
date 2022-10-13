let store = {
    dataFromAPI: "",
    rovers: ["Curiosity", "Opportunity", "Spirit"]
};

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (store, newState) => {
    store = Object.assign(store, newState);
    render(root, store);
};

const render = (root, state) => {
    root.innerHTML = App(state);
};


// create content
const App = (state) => {
    let { rovers, dataFromAPI } = state;

    return `
            <header id="headerToolbar">
                <h2>Mars Rover</h2>
                <div id="btnContainer">
                    <div class="btn" id=${rovers[0]}>${rovers[0]}</div>
                    <div class="btn" id=${rovers[1]}>${rovers[1]}</div>
                    <div class="btn" id=${rovers[2]}>${rovers[2]}</div>
                </div>
            </header>
            <div id="containerData">
                ${createRoverData(dataFromAPI)}
            </div>
            <div id="containerGallery">
                ${createRoverPhotos(dataFromAPI)}
            </div>
        <footer>
        from Steven
        </footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
    render(root, store);
    createBtnRoverEventListener(store);
});

// ------------------------------------------------------  COMPONENTS

const createBtnRoverEventListener = (stats) => {
    let { rovers } = stats;

    const btn1 = document.getElementById(rovers[0]);
    const btn2 = document.getElementById(rovers[1]);
    const btn3 = document.getElementById(rovers[2]);

    [btn1, btn2, btn3].map((x, i) => {
        x.addEventListener("click", () => {
            getRoverData(rovers[i]);
            loadingScreen(stats, rovers[i]);
        });
    });
};

const loadingScreen = (state, roverName) => {
    updateStore(state, { dataFromAPI: ["loading", roverName] });

};

const createRoverData = (dataFromAPI) => {

    if (!dataFromAPI) {
        return `
        <h2>
            Hello
        </h2>
        <p>
            Welcome to explore the information's about the Mars rovers.
        </p>
        <p>
            I will prevent you some key information´s and the current 200 photos.
        </p>
            Click on the buttons in the top to choose the Mars rover. :)
        </p>`;
    }
    //return loading for the loading screen
    if (dataFromAPI[0] == "loading") {
        return `${dataFromAPI[0]} data from ${dataFromAPI[1]}...`;
    }
    // returns the rover infomaitons
    return `<h2><u>${dataFromAPI.manifesto.name}</u></h2>
    <p>This Rover was started at ${dataFromAPI.manifesto.launch_date} and landed on ${dataFromAPI.manifesto.landing_date} on the Mars.</p>
    <p>Last day of records is ${dataFromAPI.manifesto.max_date} which are overall ${dataFromAPI.manifesto.max_sol} sol.</p>
    <p>Staus is ${dataFromAPI.manifesto.status} and I toke ${dataFromAPI.manifesto.total_photos} photos.</p>
    `;
};

/** 
 * Create a string with a column and row pattern 
 * to display the Photos from the rover (4 Photos per row)
 * if dataFromApi is empty it return nothing
*/
const createRoverPhotos = (dataFromAPI) => {

    const maxPhotos = 200;

    if (!dataFromAPI || dataFromAPI[0] == "loading") {
        return "";
    }

    let imgArray = dataFromAPI.photos.map((x, i) => {
        if (i >= maxPhotos) {
            return;
        }
        return `
        <div class="row">
        <img src="${x.img_src}" alt="">
        <span>Date: ${x.earth_date}<br>Camera: ${x.camera.name}<br>Sol: ${x.sol}<br>ID: ${x.id}</span>
        </div>`;

    }).join(" ");

    return imgArray;
};

// ------------------------------------------------------  API CALL
/**
 * request data from Server return a array with 3 Object
 * -Rover Manifesto with key information´s
 * -Array of Photos with min 200 current Photos
 * -Timestamp
 */
const getRoverData = (roverName) => {

    /**
     * don´t request API again if data from the rover already loaded
     */
    if (store.dataFromAPI) {
        if (store.dataFromAPI.manifesto.name == [roverName]) {
            return;
        }
    }
    fetch(`http://localhost:3000/data?rover=${roverName}`)
        .then(res => res.json())
        .then(dataFromAPI => {
            updateStore(store, { dataFromAPI });
            createBtnRoverEventListener(store);
        });
    return;
};