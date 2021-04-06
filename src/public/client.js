let store = Immutable.Map({
    project: Immutable.Map({ name: "Mars Dashboard" }),
    rovers: ["Curiosity", "Opportunity", "Spirit"],
    roverName: "",
})

// add our markup to the page
const root = document.getElementById("root")

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = renderRoverInfo(state)
    root.innerHTML = renderRoverData(state)
}

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
    getRoverData("Spirit")
    getRoverData("Opportunity")
    getRoverData("Curiosity")
})


const navMenu = () => {
    const navArray = () => store.get("rovers");
    return navArray().map(element => {
        return `<div class = rover>
        <button type="button" id="${element}" href=${element} onclick="roverButton(${element})"><img id="${element}-img"><h2>${element}</h2></button>
        </div>
        `
    }).join(" ");//concatenating all of the elements in an array with space between and no coma
}

const Greeting = (name) => {
    if (name) {
        return `
            <h1>${name}</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}
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
        `
  return roverDetails;
}

const getRoverImage = (state) => {
    const roverData = () => state.latest_photos;
    console.log(roverData.length);
        const roverDataSlice = roverData().slice(0, 4)
        return roverDataSlice.map (e => {
            console.log(e.img_src)
            return(`
            <div id="img-container">
                <img src="${e.img_src}"></img>
            </div>
            `)
        }).join(' ')
    }



const renderRoverData = (state) => {
    return (
    `
    <header></header>
    <main>
            ${Greeting(store.get("project").get("name"))}
        <nav>
            ${navMenu()}
        </nav> 
        <div id="roverDetails">
            ${renderRoverInfo(state)}
        </div>
        <div id="roverPhotos">
            ${getRoverImage(state)}
        </div>
        </main>
    `
    )       
    }



function roverButton(button) {
    let element = document.getElementById("roverInfo");
    if(element.style.display = "none") {
        element.style.display = "block"
    }
    const selectedRover = button.id;
    console.log(selectedRover)
    getRoverData(selectedRover)    
}


const getRoverData = (roverName) => { 
    fetch(`http://localhost:3000/rover/${roverName}`)
    .then(res => res.json())
    .then((roverData) => {
        const latest_photos = roverData.latest_photos
        updateStore(store, {latest_photos});
        render(root, store)
    })
}

