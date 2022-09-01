
const myModule = (() => {
    'use strict';

    //Referencias DOM
    
    const btnNuevo          = document.querySelector('#btnNuevo'),
          btnPedir          = document.querySelector('#btnPedir'),
          btnDetener        = document.querySelector('#btnDetener'),
          small             = document.querySelectorAll('small'),
          barajasJugadores = document.querySelectorAll('.divCartas');

    const types             = ['C', 'D', 'H', 'S'],
          especiales        = ['A', 'J', 'Q', 'K'];
        
    let deck         = [],
        gamersPoint  = [];

    //Esta funcion inicia el juego
    const startGame = (numOfPlayers = 2) => {
        deck = createDeck();
        gamersPoint  = [];
        for(let i = 0; i < numOfPlayers; i++){
            gamersPoint.push(0)
        };

        small.forEach(elem => elem.innerText = 0);
        barajasJugadores.forEach(elem => elem.innerHTML = '<img src="assets/cartas/grey_back.png" alt="" class="carta">');
    
        btnPedir.disabled   = false;
        btnDetener.disabled = false;
    };

    const createDeck = () => {
        deck = [];
        for(let i = 2; i <= 10 ; i++){
            for(let type of types){
                deck.push(i + type)
            }
        };
    
        for(let type of types){
            for(let especial of especiales){
                deck.push(especial + type)
            }
        }
        return _.shuffle(deck);
    };
    
    // Tomar una carta de la baraja
    
    const takeCard = () => {
        if(deck.length === 0){
            throw 'No hay cartas en la baraja';
        }
        return deck.pop();
    };
    
    //Saber el valor de la carta
    const cardValue = (card) => {
        const value = card.substring(0, card.length -1);
        return (isNaN(value)) ?
                    (value === 'A') ? 11 : 10
                    : value * 1
    };

    //Turno: 0 = primer jugador, ultimo: computadora
    const accumulatePoints = (card, turn) => {
        gamersPoint[turn] = gamersPoint[turn] + cardValue(card);
        small[turn].innerText = gamersPoint[turn];
        return gamersPoint[turn];
    };

    const createImgCard = (card, turn) => {
        const carta = document.createElement('img');
            carta.src = `assets/cartas/${card}.png`
            carta.classList.add('carta');
            barajasJugadores[turn].append(carta);
    };

    const winner = () => {

        const [puntosMinimos, puntosComputadora] = gamersPoint;

        setTimeout(() => {
            if(puntosComputadora === puntosMinimos){
                alert('Juego empatado');
            }else if(puntosMinimos > 21){
                alert('Ha ganado la computadora')
            }else if(puntosComputadora > 21){
                alert('Ha ganado el jugador')
            }else {
                alert('Ha ganado la computadora')
            }
        }, 100)

    }
    
    //? Turno Computadora
    
    const turnoComputadora = (puntosMinimos) => {

        let puntosComputadora = 0;

        do {
            const card = takeCard();
            puntosComputadora = accumulatePoints(card, gamersPoint.length - 1 );

            createImgCard(card, gamersPoint.length - 1 );
            
        }while( (puntosComputadora < puntosMinimos) && (puntosMinimos <= 21))

        winner();
    };
    
    //Eventos
    
    btnPedir.addEventListener('click', () => {
        
        const card = takeCard();
        const puntosJugador = accumulatePoints(card, 0);

        createImgCard(card, 0);
    
        if(puntosJugador > 21){
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador)
    
        }else if(puntosJugador === 21){
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador)
        }
    });
    
    btnDetener.addEventListener('click', () => {
        btnPedir.disabled   = true;
        btnDetener.disabled = true;
        turnoComputadora(gamersPoint[0]);
    });
    
    // btnNuevo.addEventListener('click', () => {
    //     startGame();
    // });

    return {
        newGame : startGame
    }

})();

