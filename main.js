//---STORAGE
class Storage {
    constructor(key) {
        this.key = key;
    }
    getStorage() {
        const data = window.localStorage.getItem(this.key);
        if (data) {
            return JSON.parse(data);
        }
        return data;
    }
    save(data) {
        window.localStorage.setItem(this.key, JSON.stringify(data))
    }
}

//---API CALL

//---API CALL - NEW DECK
const getNewDeck = (cb) => {
    const url = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1
            `;

    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.addEventListener('load', e => {
        const data = JSON.parse(e.currentTarget.response);
        cb(data);
    });


    request.addEventListener('error', e => {
        console.log(e, 'something failed!')
    })
    request.send();
}

//---API CALL - DRAW CARD
const getDraw = (id, cb) => {
    const url = `https://deckofcardsapi.com/api/deck/${id}/draw/?count=1`;

    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.addEventListener('load', e => {
        const data = JSON.parse(e.currentTarget.response);
        cb(data);
    });


    request.addEventListener('error', e => {
        console.log(e, 'something failed!')
    })
    request.send();
}

//---API CALL - Shuffle CARD
const getShuffle = (id, cb) => {
    const url = `https://deckofcardsapi.com/api/deck/${id}/shuffle/
            1`;

    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.addEventListener('load', e => {
        const data = JSON.parse(e.currentTarget.response);
        
        cb(data); 
    });


    request.addEventListener('error', e => {
        console.log(e, 'something failed!');
    })
    
       
    request.send();
}

//---GLOBALS

//---BUTTONS
const newDeckBtn1 = document.querySelector('.js-newDeck1');
const newDeckBtn2 = document.querySelector('.js-newDeck2');
const drawCard = document.querySelector('.js-DrawCard');


//---CONTAINERS
const jumbo1 = document.querySelector('.js-jumbo1');
const jumbo2 = document.querySelector('.js-jumbo2');

let idContainer = document.querySelector('.js-idContainer');
const cardDisplay = document.querySelector('.js-cardDisplay');
const cardUsed = document.querySelector('.js-cardUsed');



//---STATE

const state = {

    id: null,
    remaining: 0,
    cardUsed: [],


}

//---TOHTML

let idToHTML = id => {
    return `
    <p>Deck ID: ${id.id}</p>
    <p>Cards Left In Deck ${id.remaining}</p>
    `
}

let cardToHTML = (card) => {
            return `
            <div class="js-card">
            <p class="text-center" style="display:none">${card[1]} of ${card[2]}</p>
            <img src=${card[0]}>
            <p class="text-center">${card[1]} of ${card[2]}</p>
            </div>
            `
    }


const render = (state) => {
    let idHTML = '';
    idHTML += idToHTML(state);
    idContainer.innerHTML = idHTML;

    let cardUsedHTML = '';
    for (let i = 0; i < state.cardUsed.length; i++) {
        cardUsedHTML += cardToHTML(state.cardUsed[i]);
    }
    cardUsed.innerHTML = cardUsedHTML;
}


//---EVENTS

newDeckBtn1.addEventListener('click', (e) => {
    jumbo1.classList.add('d-none');
    jumbo2.classList.remove('d-none');

    getNewDeck(data => {
        state.id = data.deck_id; 
        state.remaining = data.remaining;
        render(state);
    });

});

newDeckBtn2.addEventListener('click', (e) => {

    getNewDeck(data => {
        state.id = data.deck_id;
        state.remaining = data.remaining;
        state.cardUsed = [];
        render(state);
    });

});

drawCard.addEventListener('click', (e) => {
    const displayForState = [];
    const cardSeen = [];

    getDraw(state.id, data => {
        if(data.error) {
            alert("No cards remaining. Select New Deck")
        }
        const playCard = data.cards;

       
        const cardArr = [];
        cardArr[0] = playCard[0]['image'];
        cardArr[1] = playCard[0]['value'];
        cardArr[2] = playCard[0]['suit'];
        cardArr[3] = playCard[0]['code'];
      

        displayForState.unshift(cardArr);
        cardSeen.unshift(cardArr);

        state.cardDeck = displayForState;
        state.cardUsed.unshift(cardArr);
        state.remaining = data.remaining;
        console.log(state);
        render(state);

    })

})

document.addEventListener('click', (e)=>{
    const div = e.target.parentElement;
    if(div.className === 'js-card'){
    const p1 = div.children[0];
    const p2 = div.children[2];
    console.log(div)
    if (p1.style.display === "none"){
        p1.style.display = "block";
        p2.style.display ="none";
    }
    else if(p1.style.display !== "none"){
        p1.style.display = "none";
        p2.style.display="block";
    }
}
})



