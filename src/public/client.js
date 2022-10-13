//Key infomaitons
const store = Immutable.Map({
    dataFromAPI: null,
    rovers: Immutable.List(["Curiosity", "Opportunity", "Spirit"])
});

// add our markup to the page
const root = document.getElementById("root");

//update Store data
const updateStore = (storeOld, newState) => {
    const updatedStore = store.merge(storeOld, newState);
    render(root, updatedStore);
    return;
};

// render the UI of the App
const render = (root, state) => {
    root.innerHTML = App(state.toJS());
};


// create content for the App
const App = (state) => {
    let { rovers, dataFromAPI } = state;

    return `
            <header id="headerToolbar">
                <h2>Mars Rover</h2>
                <div id="btnContainer">
                    ${createRoverButtons(rovers)}
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
    createBtnRoverEventListener(store.toJS());
});

// ------------------------------------------------------  COMPONENTS

const createRoverButtons = function (rovers){
    return rovers.map(x => {
        return `<div class="btn" id=${x}>${x}</div>`;
    }).join(" ");
};

//create buttons for the event and the functions which has to run after clicking
const createBtnRoverEventListener = (stats) => {
    let { rovers, dataFromAPI } = stats;

    const btn1 = document.getElementById(rovers[0]);
    const btn2 = document.getElementById(rovers[1]);
    const btn3 = document.getElementById(rovers[2]);

    [btn1, btn2, btn3].map((x, i) => {
        x.addEventListener("click", () => {

            // don´t request API again if data from the rover already loaded
            if (dataFromAPI) {
                if (dataFromAPI.manifesto.name == [rovers[i]]) {
                    return;
                }
            }
            //Update data in store with the loading screen and render UI and start the API request
            updateStore(stats, getRoverData(stats, rovers[i]));
        });
    });
};

//Data for the loading screen
const loadingScreen = (roverName) => {
    return { dataFromAPI: ["loading", roverName] };
};

/** 
 * create data for the data UI with infomaitons from dataFromAPI
*/
const createRoverData = (dataFromAPI) => {

    // Return welcome massage on first enter
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
    <p>Staus is ${dataFromAPI.manifesto.status} and the rover toke ${dataFromAPI.manifesto.total_photos} photos.</p>
    `;
};

//Create the IMG + infomaitons in div container if needed
const createRoverPhotos = (dataFromAPI) => {

    //Max Photos displayed to UI
    const maxPhotos = 200;

    //returns if data in dataFromApi is empty or it is preparing for loading screen
    if (!dataFromAPI || dataFromAPI[0] == "loading") {
        return "";
    }

    //create a string with all needed Photos in a div container which hast the img and a spin with infomaitons in it
    return dataFromAPI.photos.map((x, i) => {
        if (i >= maxPhotos) {
            return;
        }
        return createPhotosHTMLElements(x);

    }).join(" ");
};

const createPhotosHTMLElements = (photoObject) => {
    return `
        <div>
        <img src="${photoObject.img_src}" alt="">
        <span>Date: ${photoObject.earth_date}<br>Camera: ${photoObject.camera.name}<br>Sol: ${photoObject.sol}<br>ID: ${photoObject.id}</span>
        </div>`;
};

// ------------------------------------------------------  API CALL
/**
 * request data from Server return a array with 3 Object
 * -Rover Manifesto with key information´s
 * -Array of Photos with min 200 current Photos
 * -Timestamp
 * 
 * return data for the loading screen UI
 */
const getRoverData = (stats, roverName) => {

    fetch(`http://localhost:3000/data?rover=${roverName}`)
        .then(res => res.json())
        .then(dataFromAPI => {
            //update store with data from api and render UI
            updateStore(stats, { dataFromAPI });
            createBtnRoverEventListener(stats);
        });
    return loadingScreen(roverName);
};