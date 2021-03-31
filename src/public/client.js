let store = Immutable.Map({
    project: Immutable.Map({ name: "Mars Dashboard" }),
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    roverName: ''
})

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = renderRoverInfo(state)
    root.innerHTML = renderRoverData(state)
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    getRoverData('Spirit')
    getRoverData('Opportunity')
    getRoverData('Curiosity')
                 
})

const navMenu = () => {
    const navArray = store.get('rovers');
    return navArray.map(element => {
        return `<div class = rover>
        <button id="${element}" href=# onclick="roverButton(${element})">${element}</button>
        </div>
        `
    }).join(' ');//concatenating all of the elements in an array with space between and no coma
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
    const roverData = state.photo_manifest;
    let roverDetails = ` 
        <div id="roverInfo" style=display:none>
            <p><b>Name:</b> ${roverData[0].rover.name}</p>
            <p><b>Launch date:</b> ${roverData[0].rover.launch_date}
            <p><b>Landing date:</b> ${roverData[0].rover.landing_date}</p>
            <p><b>Status:</b> ${roverData[0].rover.status}
            <p><b>Most recent photos taken on:</b> ${roverData.slice(-1).pop().earth_date}</p>
        </div>
        `
        return roverDetails;
}

const getRoverImage = (state) => {
    const roverData = state.latest_photos;
    const sliceRoverData = roverData.slice(0, 6)
    return sliceRoverData.map(e => {
        return(`
            <img src="${e.img_src}" style="width: 100%; height: auto" alt="Mars location"></img>
`)
    }).join(' ')
}

const renderRoverData = (state) => {
    return (
    `
    <header></header>
    <main>
        <h1>${Greeting(store.get('project').get('name'))}</h1>
        <nav>
            ${navMenu()}
        </nav> 
        <div id='roverDetails'>
            ${renderRoverInfo(state)}
        </div>
        <div id='roverPhotos'>
            ${getRoverImage(state)}
        </div>
        </main>
    `
    )       
}

function roverButton(button) {
    let element = document.getElementById('roverInfo');
    if(element.style.display = 'none') {
        element.style.display = 'block'
    }
    let selectedRover = button.id;
    getRoverData(selectedRover)
}

const getRoverData = (roverName) => { 
    fetch(`http://localhost:3000/rover/${roverName}`)
    .then(res => res.json())
    .then((roverData) => {
        let latest_photos = roverData.latest_photos
        updateStore(store, {latest_photos});
        render(root, store);
    })
}
