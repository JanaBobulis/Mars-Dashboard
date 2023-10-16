let store = Immutable.Map({
    project: Immutable.Map({ name: "Mars Dashboard" }),
    rovers: ["Curiosity", "Opportunity", "Perseverance"],
    roverName: "",
});

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (store, newState) => {
    store = Object.assign(store, newState);
    render(root, store);
};

const render = async (root, state) => {
    root.innerHTML = renderRoverInfo(state);
    root.innerHTML = renderRoverData(state);
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
    getRoverData("Perseverance");
    getRoverData("Opportunity");
    getRoverData("Curiosity");
});

//dynamic navigation menu(Higher order function)
const navMenu = () => {
    const navArray = () => store.get("rovers");
    return navArray().map(element => {
        return `<div class = rover>
        <button type="button" id="${element.toLowerCase()}" href=${element} onclick="roverButton(${element.toLowerCase()})"><img id='${element.toLowerCase()}-img'><h2>${element}</h2></img></button>
        </div>
        `;
    }).join(" ");//concatenating all of the elements in an array with space between and no coma
};

const Greeting = (name) => {
    if (name) {
        return `
            <h1>${name}</h1>
        `;
    }
    return `
        <h1>Hello!</h1>
    `;
};

//rover data
const renderRoverInfo = (state) => {
    const roverData = state.latest_photos;
    const roverDetails = ` 
    <div id="roverInfo">
        <table>
            <tr>
                <th>Name</th>
                <td>${roverData[0].rover.name}</td>
            </tr>
            <tr>
                <th>Launch date</th>
                <td>${roverData[0].rover.launch_date}</td>
            </tr>
            <tr>
                <th>Landing date</th>
                <td>${roverData[0].rover.landing_date}</td>
            </tr>
            <tr>
                <th>Status</th>
                <td>${roverData[0].rover.status}</td>
            </tr>
            <tr>
                <th>Most recent photos taken on</th>
                <td>${roverData.slice(-1).pop().earth_date}</td>
            </tr>
        </table>
    </div>
        `;
    return roverDetails;
};

//get up to 4 rover images(Higher Order function)
const getRoverImage = (state) => {
    const roverData = () => state.latest_photos;
    const roverDataSlice = roverData().slice(0, 4);
    return roverDataSlice.map(e => {
        return (`
            <div id='img-container'>
                <img src="${e.img_src}" id="${e.rover.name.toLowerCase()}-img"></img>
            </div>
            `);
    }).join(" ");
};

//display data
const renderRoverData = (state) => {
    return (`
    <main>
        ${Greeting(store.get("project").get("name"))}
        <nav>
            ${navMenu()}
        </nav>
        <div id="content" style="display:none">
        <div id="roverDetails">
            ${roverFact(state)}
            ${renderRoverInfo(state)}
        </div>
        <div id="roverPhotos">
            ${getRoverImage(state)}
        </div>
    </div>
   </main>
    `);       
 };

//fact depending on the rover
const roverFact = (state) => {
    const roverData = state.latest_photos;
    if (roverData[0].rover.name == "Curiosity") {
        return `
        <p id='fact'>Part of NASA's Mars Science Laboratory mission, Curiosity is the largest and most capable rover ever sent to Mars. Curiosity explores Gale Crater and acquires rock, soil, and air samples for onboard analysis. The car-size rover is about as tall as a basketball player and uses a 7 foot-long arm to place tools close to rocks selected for study. Curiosity's large size allows it to carry an advanced kit of 10 science instruments. It has tools including 17 cameras, a laser to vaporize and study small pinpoint spots of rocks at a distance, and a drill to collect powdered rock samples. It hunts for special rocks that formed in water and/or have signs of organics.</p>
        `;
    } else if (roverData[0].rover.name == "Perseverance") {
        return `
        <p id='fact'>The Perseverance Mars rover is part of NASA’s Mars Exploration Program, a long-term effort of robotic exploration of the Red Planet. A key objective for Perseverance’s mission on Mars is astrobiology, including the search for signs of ancient microbial life. <br/> Perseverance is investigating Jezero Crater – a region of Mars where the ancient environment may have been favorable for microbial life – probing the Martian rocks for evidence of past life. The rover carries an entirely new subsystem to collect and prepare Martian rocks and sediment samples that includes a coring drill on its arm and a rack of sample titanium tubes in its chassis. Throughout its exploration of the region, the rover will collect promising samples, sealing them are tubes and storing them in its chassis until Perseverance deposits them on the Martian surface to be retrieved by a future mission. </p>
        `;
    } else if (roverData[0].rover.name == "Opportunity") {
        return `
        <p id='fact'>Opportunity was the second of the two rovers(twin rover of Spirit) launched in 2003 to land on Mars and begin traversing the Red Planet in search of signs of past life. The rover is still actively exploring the Martian terrain, having far outlasted her planned 90-day mission.
        Since landing on Mars in 2004, Opportunity has made a number of discoveries about the Red Planet including dramatic evidence that long ago at least one area of Mars stayed wet for an extended period and that conditions could have been suitable for sustaining microbial life.
        The Opportunity rover stopped communicating with Earth when a severe Mars-wide dust storm blanketed its location in June 2018. After more than a thousand commands to restore contact, engineers in the Space Flight Operations Facility at NASA's Jet Propulsion Laboratory (JPL) made their last attempt to revive Opportunity Tuesday, February 13, 2019, to no avail. The solar-powered rover's final communication was received June 10.</p>
        `;
    }
};

//button
function roverButton(button) {
    const selectedRover = button.id;
    getRoverData(selectedRover, true);
}

const getRoverData = (roverName, show) => {
    console.log(roverName, show)
    fetch(`https://mars-dashboard-1.vercel.app/rover/${roverName.toLowerCase()}`)
        .then(res => res.json())
        .then((roverData) => {
            const latest_photos = roverData.latest_photos;
            updateStore(store, { latest_photos });
            render(root, store);
            if (show) {
                document.getElementById("content").style.display = "grid";
            }
        });
};
