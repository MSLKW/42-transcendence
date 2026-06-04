import * as THREE from 'three';
import { Card, CardRank, CardSuite } from './Card.ts';
import { CardManager } from './CardManager.ts';
import { CardHand, HandType, PentupleType } from './CardHand.ts';
import { socket } from './ClientWebsocket.ts';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// const allCards: Array<Card> = [];
// const cardManagers: Array<CardManager> = [];
// let y = -4;
// for (let s = 0; s < 4; s++) {
// 	let cards: Array<Card> = [];
// 	for (let i = 0; i < 13; i++) {
// 		let card = new Card(i, s);
// 		scene.add(card.object);
// 		allCards.push(card);
// 		cards.push(card);
// 	}
// 	let cardManager = new CardManager(new THREE.Vector3(-5, y, 0), new THREE.Vector3(5, y, 0), cards);
// 	cardManagers.push(cardManager)
// 	y += 2;
// }

let cardManager = new CardManager(new THREE.Vector3(-5, 0, 0), new THREE.Vector3(5, 0, 0));
for (let i = 0; i < 13; i++) {
	let card = new Card(i, CardSuite.Spade);
	scene.add(card.object);
	cardManager.receiveCard(card);
}

// const cards1: Array<Card> = [
// 	new Card(CardRank.Two, CardSuite.Heart), 
// 	new Card(CardRank.Three, CardSuite.Spade),
// 	new Card(CardRank.Two, CardSuite.Heart),
// 	new Card(CardRank.Three, CardSuite.Heart),
// 	new Card(CardRank.Three, CardSuite.Heart), 
// ];
// const cardHand = new CardHand(cards1);
// console.log(cards1);
// console.log(`${HandType[cardHand.handType]}, ${PentupleType[cardHand.pentupleType]}`);

camera.position.set(0, 0, 10);

const raycaster = new THREE.Raycaster();
function eventClick(event: PointerEvent) {
	const canvas = renderer.domElement.getBoundingClientRect();
	const mouse = new THREE.Vector2();
	mouse.x = ((event.clientX - canvas.left) / canvas.width) * 2 - 1;
	mouse.y = -((event.clientY - canvas.top) / canvas.height) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);
	// console.log(`${mouse.x} | ${mouse.y}`);
	cardManager.selectCard(raycaster);
}

function resize() {
	const width = window.innerWidth;
	const height = window.innerHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize(width, height);
}

renderer.domElement.addEventListener('click', eventClick);

window.addEventListener('resize', resize);

const button = document.getElementById('ui-button');
button?.addEventListener('click', () => {
	const cardsJson: string = cardManager.selectedCardsToJSON();
	socket.emit('msg', cardsJson);
})

function animate(time: DOMHighResTimeStamp) {
	renderer.render(scene, camera);
	// for (let i: number = 0; i < allCards.length; i++) {
	// 	let card = allCards.at(i);
	// 	if (card) {
	// 		card.object.rotation.y = time / 1000;
	// 	}
	// }
	// console.log(renderer.info.render.calls);
}
renderer.setAnimationLoop(animate);
