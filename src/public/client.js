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
        <button id="${element}" href=# onclick="buttonClick()">${element}</button>
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

const renderRoverData = (state) => {
    const roverData = state.photo_manifest;
    console.log(roverData, 'roverData');
    return (
    `
    <header></header>
    <main>
        <h1>${Greeting(store.get('project').get('name'))}</h1>
        <nav>
            ${navMenu()}
        </nav> 
        <div id="roverInfo" style = "display: none">
            <p>Landing date: ${roverData.landing_date}</p>
            <p>Launch date: ${roverData.launch_date}</p>
            <p>Status: ${roverData.status}</p>
        </div>
        </main>
    `
    )       
}

function roverButton() {
    let element = document.getElementById('roverInfo');
    if(element.style.display = 'none') {
        element.style.display = 'block')
}
}

const getRoverData = () => { //'name' as an argument
    fetch(`http://localhost:3000/rover/curiosity`) //${name} instead of curiosity
    .then(res => res.json())
    .then((roverData) => {
        let photo_manifest = roverData.photo_manifest
        updateStore(store, {photo_manifest});
        render(root, store);
    })
}
