let store = Immutable.Map({
    project: Immutable.Map({ name: "Mars Dashboard" }),
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
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
    getRoverData()
})


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
    <p>${roverData.landing_date}</p>
        <p>${roverData.name}</p>
    `
        
    )       
}

const getRoverData = () => {
    fetch(`http://localhost:3000/rover/curiosity`)
    .then(res => res.json())
    .then((roverData) => {
        let photo_manifest = roverData.photo_manifest
        updateStore(store, {photo_manifest});
        render(root, store);
    })
}
