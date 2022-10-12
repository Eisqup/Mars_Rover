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

const render = async (root, state) => {
    root.innerHTML = App(state);
    createBtnEventListener();
};


// create content
const App = (state) => {
    let { rovers } = state;

    return `
    <main>
        <div id="root">
            <header id="headerToolbar">
                <h2>Mars Rover</h2>
                <div id="btnContainer">
                    <div class="btn" id=${rovers[0]}>${rovers[0]}</div>
                    <div class="btn" id=${rovers[1]}>${rovers[1]}</div>
                    <div class="btn" id=${rovers[2]}>${rovers[2]}</div>
                </div>
            </header>
            <div id="containerData">
                ${createRoverData(state)}
            </div>
            <div id="containerGallery">
                ${createRoverPhotos(state)}
            </div>
        </div>
    </main>
        <footer>
        from Steven</footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
    render(root, store);
});



// ------------------------------------------------------  COMPONENTS

const createBtnEventListener = () => {
    const btn1 = document.getElementById(store.rovers[0]);
    const btn2 = document.getElementById(store.rovers[1]);
    const btn3 = document.getElementById(store.rovers[2]);



    btn1.addEventListener("click", () => {
        getRoverData(store.rovers[0]);
    });
    btn2.addEventListener("click", () => {
        getRoverData(store.rovers[1]);
    });
    btn3.addEventListener("click", () => {
        getRoverData(store.rovers[2]);
    });
};

const createRoverData = (state) => {
    let { dataFromAPI } = state;

    if (!dataFromAPI) {
        return `
        <h2>
            Hello
        </h2>
        <p>
            Welcome to explore inforastions about the mars rovers.
        </p>
        <p>
            I prevent some kex inforastions and photos for u on this side.
        </p>
            Click on the buttons in the top to chose the Mars rover. :)
        </p>`;
    }
    return `<h2>${dataFromAPI.manifesto.name}</h2>
            <p>This Rover was started at ${dataFromAPI.manifesto.launch_date} and landed on ${dataFromAPI.manifesto.landing_date} on the Mars.</p>
            `;
};

const createRoverPhotos = (state) => {

    let { dataFromAPI } = state;

    if (!dataFromAPI) {
        return "";
    }

    let imgArray = dataFromAPI.photos.map((x, i, array) => {
        let string = "";

        if (i >= 100) {
            return;
        }

        if (i === 0) {
            string += "<div class=\"row\">";
        }
        if (i % 4 === 0 && i !== 0) {
            string += "</div class=\"row\"><div class=\"row\">";
        }

        string += `<div class="column"><img src="${x.img_src}" alt=""></div>`;

        if (i === array.length) {
            string += "</div class=\"row\">";
        }
        return string;

    }).join(" ");
    return imgArray;
};
// ------------------------------------------------------  API CALL

//API call

/**
* request data from Server return a array with 3 Objects
* Rover Manifesto and Last 5 sol Rover Photos and time stamp
*/
const getRoverData = (roverName) => {

    /**
     * don´t request API again if data from the rover already loaded
     */
    if (store.dataFromAPI[roverName]) {
        return;
    }
    fetch(`http://localhost:3000/data?rover=${roverName}`)
        .then(res => res.json())
        .then(dataFromAPI => {
            updateStore(store, { dataFromAPI });
            console.log(store);
        });
    return;
};