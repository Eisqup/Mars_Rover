let store = {
    user: { name: "Student" },
    dataFromAPI: "",
    rovers: ["Curiosity", "Opportunity", "Spirit"],
    openSide: { home: true, Curiosity: false, Opportunity: false, Spirit: false }
};

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (store, newState) => {
    store = Object.assign(store, newState);
    console.log(store);
    //render(root, store);
};

const render = async (root, state) => {
    root.innerHTML = App(state);
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
            ${containerData(state)}
            </div>
            <div id="containerGallery">
                <div class="row">
                    <div class="column">
                        ImageOfTheDay(dataFromAPI)
                    </div>
                </div>
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
});



// ------------------------------------------------------  COMPONENTS

const containerData = (state) => {
    let { dataFromAPI, openSide } = state;

    if (openSide.home === true) {
        return `
        <h2>Hello 
        ${state.user.name}
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

    if (dataFromAPI) {
        return `
            <h1>Welcome, ${name}!</h1>
        `;
    }
};

// Example of a pure function that renders information requested from the backend
const loadPhotos = (dataFromAPI) => {
    return dataFromAPI;
};
// ------------------------------------------------------  API CALL

//API call

/**
* request data from Server return a array with 2 Objects
* Rover Manifesto and Last Rover Photos
*/
const getRoverData = (roverName) => {

    /**
     * don´t request API again if data from the rover already loaded
     */
    if (store.dataFromAPI) {
        if (store.dataFromAPI[0].photo_manifest.name == roverName) {
            return;
        }
    }
    fetch("http://localhost:3000/rover?rover=" + roverName)
        .then(res => res.json())
        .then(dataFromAPI => {
            console.log(dataFromAPI);
            updateStore(store, { dataFromAPI });
        });

    return;
};