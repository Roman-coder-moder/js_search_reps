let input = document.querySelector('.input');
let results = document.querySelector('.search-results');
let savedReps = document.querySelector('.saved-reps');

function debounce(func, ms) {
    let timeout;

    return function debounceFunction(...args) {
        const fn = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(fn, ms);
    };
}

function clear() {
    while (results.hasChildNodes()) {
        results.removeChild(results.firstChild);
    }
}

function saveRep(rep) {
    let card = document.createElement('div');
    card.classList.add('saved-rep');
    let name = document.createElement('div');
    name.textContent = 'Name: ' + rep.name;
    card.appendChild(name);
    let owner = document.createElement('div');
    owner.textContent = 'Owner: ' + rep.owner.login;
    card.appendChild(owner);
    let stars = document.createElement('div');
    stars.textContent = 'Stars: ' + rep.stargazers_count;
    card.appendChild(stars);
    let removeButton = document.createElement('button');
    removeButton.classList.add('card-removeButton');
    removeButton.addEventListener('click', () => {
        savedReps.removeChild(card);
    });
    card.appendChild(removeButton);
    savedReps.appendChild(card);
}

function createFragmentSearchResults (reps) {
    let fragment = document.createDocumentFragment();
    let searchList = document.createElement('ul');
    searchList.classList.add('search-list');
    for (let i = 0; i < 5; i++) {
        let elementSearch = document.createElement('li');
        let button = document.createElement('button');
        button.textContent = reps[i].name;
        console.log(reps[i]);
        button.classList.add('search-button');
        button.addEventListener('click', () => {
            input.value = '';
            clear();
            saveRep(reps[i]);
        });
        elementSearch.appendChild(button);
        elementSearch.classList.add('elementSearch');
        searchList.appendChild(elementSearch);
    }
    fragment.appendChild(searchList);
    return fragment;
}

async function search(body) {
    clear();

    if (body !== '') {
        let response = await fetch(`https://api.github.com/search/repositories?q=${body}`);
        let reps = await response.json();
        let fragment = createFragmentSearchResults(reps.items);
        results.appendChild(fragment);
    }
}

let debounceSearch = debounce(search, 500);

input.addEventListener('input', () => {
    debounceSearch(input.value);
});





