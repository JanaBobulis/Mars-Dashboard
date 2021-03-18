let store = Immutable.Map({
    project: Immutable.Map{ name: "Mars Dashboard" },
    apod: '',
    rovers: ['Curiosity'],
    roverInfo: []
})

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state, renderRoverData)
}


// create content 
const App = (state, renderRoverData) => {
    let { rovers } = state;
    let roverInfo = state.get('roverInfo');

    return `
        <header></header>
        <main>
            ${Greeting(store.get('name'))}
            <section>
                <div>
                    <button><h3>${store.get('rovers')}</h3></button>

                </div>
                
                <div>${renderRoverInfo(renderRoverData, roverInfo)}</div>
                <div>${renderRoverData(rovers)}</div>
                
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
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


const renderRoverInfo = (renderRoverData, roverInfo) => {
    const roverHtml = renderRoverData(roverInfo)
    console.log(roverHtml);
    return `
    <div>${roverHtml}</div>
    
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


const getRoverData = (state) => {
    let { roverData } = state
    fetch(`http://localhost:3000/rover/curiosity`)
    .then(res => res.json())
    .then((roverData) => {
        console.log(roverData);
        updateStore(store, { roverData })
    })
}
