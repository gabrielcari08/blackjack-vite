import './style.css'
import _ from "underscore";

(() => {
  'use strict';

  let deck = [];
  const tipos = ['C', 'D', 'H', 'S'],
        especiales = ['A', 'J', 'Q', 'K'];

  let puntosJugador = 0, puntosComputadora = 0;

  // Referencias del HTML
  const btnPedir = document.querySelector('#btnPedir'),
        btnDetener = document.querySelector('#btnDetener'),
        btnNuevo = document.querySelector('#btnNuevo'),
        divCartasJugador = document.querySelector('#jugador-cartas'),
        divCartasComputadora = document.querySelector('#computadora-cartas'),
        puntosHtml = document.querySelectorAll('small');

  const inicializarJuego = () => {
      deck = crearDeck();
      puntosJugador = puntosComputadora = 0;
      actualizarUI();
      habilitarBotones();
  };

  const crearDeck = () => {
      let nuevoDeck = [];
      for (let i = 2; i <= 10; i++) {
          tipos.forEach(tipo => nuevoDeck.push(i + tipo));
      }
      tipos.forEach(tipo => especiales.forEach(esp => nuevoDeck.push(esp + tipo)));
      return _.shuffle(nuevoDeck);
  };

  const pedirCarta = () => {
      if (!deck.length) throw 'No quedan cartas en la baraja';
      return deck.pop();
  };

  const valorCarta = carta => {
      const valor = carta.slice(0, -1);
      return isNaN(valor) ? (valor === 'A' ? 11 : 10) : parseInt(valor);
  };

  const turnoComputadora = puntosMinimos => {
      while (puntosComputadora < puntosMinimos && puntosMinimos <= 21) {
          const carta = pedirCarta();
          agregarCarta(carta, divCartasComputadora);
          puntosComputadora += valorCarta(carta);
          puntosHtml[1].innerText = puntosComputadora;
      }
      setTimeout(() => determinarGanador(puntosMinimos), 500);
  };

  const determinarGanador = puntosMinimos => {
      let mensaje = (puntosComputadora === puntosMinimos) ? 'Empate!' :
                    (puntosMinimos > 21 || puntosComputadora <= 21 && puntosComputadora > puntosMinimos) ? 'Computadora gana!' :
                    'Ganaste!';
      alert(mensaje);
  };

  const agregarCarta = (carta, contenedor) => {
      const imgCarta = document.createElement('img');
      imgCarta.src = `assets/cartas/${carta}.png`;
      imgCarta.classList.add('carta');
      contenedor.append(imgCarta);
  };

  const actualizarUI = () => {
      puntosHtml[0].innerText = puntosJugador;
      puntosHtml[1].innerText = puntosComputadora;
      divCartasJugador.innerHTML = '';
      divCartasComputadora.innerHTML = '';
  };

  const habilitarBotones = () => {
      btnPedir.disabled = false;
      btnDetener.disabled = false;
  };

  // Eventos
  btnPedir.addEventListener('click', () => {
      const carta = pedirCarta();
      agregarCarta(carta, divCartasJugador);
      puntosJugador += valorCarta(carta);
      puntosHtml[0].innerText = puntosJugador;

      if (puntosJugador > 21 || puntosJugador === 21) {
          btnPedir.disabled = true;
          btnDetener.disabled = true;
          turnoComputadora(puntosJugador);
      }
  });

  btnDetener.addEventListener('click', () => {
      btnPedir.disabled = true;
      btnDetener.disabled = true;
      turnoComputadora(puntosJugador);
  });

  btnNuevo.addEventListener('click', inicializarJuego);

  inicializarJuego();
})();
