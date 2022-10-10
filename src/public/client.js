let store = {
    user: { name: "Student" },
    apod: "",
    rovers: ["Curiosity", "Opportunity", "Spirit"],
};

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (store, newState) => {
    store = Object.assign(store, newState);
    render(root, store);
};

const render = async (root, state) => {
    root.innerHTML = App(state);
};


// create content
const App = (state) => {
    let { rovers, apod } = state;

    return `
    <main>
        <div id="root">
            <header id="headerToolbar">
                <h2>Mars Rover</h2>
                <div id="btnContainer">
                    <div class="btn" id="btnCuriosity">${rovers[0]}</div>
                    <div class="btn" id="btnOpportunity">${rovers[1]}</div>
                    <div class="btn" id="btnSpirit">${rovers[2]}</div>
                </div>
            </header>
            <div id="containerData">
                <h2>Hello ${state.user.name}
                </h2>
                <p>
                    Hier sehen sie die Daten
                </p>
            </div>
            <div id="containerGallery">
                <div class="row">
                    <div class="colume">
                        <img src="https://previews.123rf.com/images/studiobarcelona/studiobarcelona1404/studiobarcelona140400019/27345037-zeichnung-von-gl%C3%BCcklich-l%C3%A4chelnden-sonne-.jpg"
                            alt="">
                    </div>
                </div>
            </div>
        </div>
    </main>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
    render(root, store);
});

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `;
    }

    return `
        <h1>Hello!</h1>
    `;
};

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date();
    const photodate = new Date(apod.date);
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate()) {
        getImageOfTheDay(store);
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `);
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `);
    }
};

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state;
    console.log("here");

    fetch("http://localhost:3000/apod")
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }));

    console.log(apod);

    return apod;
};
