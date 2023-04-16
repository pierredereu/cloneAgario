import { io } from 'socket.io-client';
import Popup from './Popup.js';
import Player from './playerblob.js';
import food from './food.js';

const canvas = document.getElementById('game');

const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const actualWidth = 30000;
const actualHeight = 30000;

let blobs = [];
let name= "";
let player = new Player(0, 0, 5, 0, 'a');
let time;
let otherPlayers = [];

let leaderboard = [];

let mouseX = null;
let mouseY = null;

document.addEventListener('mousemove', (e) => {

	mouseX = e.clientX;
	mouseY = e.clientY;
  
  });

const socket = io();

//init menu
const Respawnpopup = new Popup(`.popup`);
const Respawncontent = document.querySelector(`.popup .popupContent .score`);
const EmplacementScores = document.querySelector(`.popupLadder .scoresContainer`);
const Respawncontenttime = document.querySelector(`.popup .popupContent .time`);
const RespawnButton = document.querySelector('.RespawnButton');
const RetourLink = document.querySelector('.popup .retourButton');
const Menupopup = new Popup(`.popupMenu`);
const Creditspopup = new Popup(`.popupCredits`);
const Ladderpopup = new Popup(`.popupLadder`);
const CreditsLink = document.querySelector('.CreditsButton');
const LadderLink = document.querySelector('.ClassementButton');
const RetourCreditsLink = document.querySelector('.popupCredits .retourButton');
const RetourLadderLink = document.querySelector('.popupLadder .retourButton');
const PlayButton = document.querySelector('.PlayButton');

Menupopup.open();

//event for menu
RespawnButton.addEventListener('click', event => {
	event.preventDefault();
	time =Date.now();
	socket.emit('init', {
		name: name , canvas: {
		  w: canvas.width,
		  h: canvas.height
		}
	});
	Respawnpopup.close();
});
RetourLink.addEventListener('click', event => {
	event.preventDefault();
	Respawnpopup.close();
	Menupopup.open();
});
CreditsLink.addEventListener('click', event => {
	event.preventDefault();
	Menupopup.close();
	Creditspopup.open();
});

LadderLink.addEventListener('click', event => {
	event.preventDefault();
	Menupopup.close();
	Ladderpopup.open();
});
RetourCreditsLink.addEventListener('click', event => {
	event.preventDefault();
	Creditspopup.close();
	Menupopup.open();
});
RetourLadderLink.addEventListener('click', event => {
	event.preventDefault();
	Ladderpopup.close();
	Menupopup.open();
});

PlayButton.addEventListener('click', event => {
	event.preventDefault();
	Menupopup.close();
	name = document.getElementById('name').value;
	time =Date.now();
	socket.emit('init', {
		name: name , canvas: {
		  w: canvas.width,
		  h: canvas.height
		}
	});
	setInterval(main, 10);
});

socket.on('playerData', (data) => {

	player.setData(data);
  
  });

  socket.on('Players', (data) => {

	otherPlayers = [];
	for (let i = 0; i < data.length; i++) {
  
	  if (data[i].id != player.id) {
  
		let newPlayer = new Player(data[i].pos.x, data[i].pos.y, data[i].m, data[i].id, data[i].name);
		newPlayer.color = data[i].color;
		newPlayer.originalR = data.originalR;
  
		otherPlayers.push(newPlayer);
  
	  }
	}
});

socket.on('blobData', (data) => {

blobs = [];
for (let x = 0; x < data.length; x++) {

	let b = new food(data[x].x, data[x].y, 1);
	b.color = data[x].color;

	blobs.push(b);

}

});

socket.on('eatenBlobs', (data) => {

data.forEach(index => {
	blobs.splice(index, 1);
});
});

socket.on('leaderboardData', (data)=> {
leaderboard=data;
});
socket.on('death', (data) => {
	let score =Math.floor(player.mass);
	let  conthtml =`Score : ${score}`;
	Respawncontent.innerHTML += conthtml;
	Respawncontenttime.innerHTML +=`Temps en vie : ${(Date.now() -time)/100} sec`;
	socket.emit('ladder', {
		name: name , score: score 
	});
	Respawnpopup.open();
	});
	
	
	socket.on('ladderUpdate', (data) => {
		let html = '';
		let RankScore = 1;
		data.forEach(score => {
			html += `<p>${RankScore} : ${score.name} : ${score.score}</p>`
			RankScore++;
		});
		EmplacementScores.innerHTML = html;
	});
	



function main() {
	ctx.fillStyle = 'white';
	ctx.rect(0, 0, canvas.width, canvas.height);
	ctx.fill();
  
	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.scale(player.originalR / player.r, player.originalR / player.r);
	ctx.translate(-player.pos.x, -player.pos.y);
  
	ctx.beginPath();
	ctx.fillStyle = 'black';
	ctx.strokeRect(-actualWidth / 2, -actualHeight / 2, actualWidth, actualHeight);
	ctx.stroke();
	ctx.closePath();
	blobs.forEach(blob => {
		if (blob.inWindow(player.pos.x, player.pos.y, canvas.width * (player.r / player.originalR), canvas.height * (player.r / player.originalR))) {
			blob.show(ctx);
		  }
	});
	otherPlayers.forEach(oplayer =>{
		oplayer.show(ctx);
	});
  
	player.show(ctx);
  
	ctx.setTransform(1, 0, 0, 1, 0, 0);
  
	ctx.fillStyle = 'black';
	ctx.font = "bold 15px arcade_interlacedregular";
  
	ctx.fillText("Leaderboard", canvas.width-295, 30);
  
	for (let i = 0; i < leaderboard.length; i++) {
  
	  ctx.fillText(i+1+". "+leaderboard[i].name+": "+leaderboard[i].score, canvas.width-340, 70+i*30);
  
	}
  
	socket.emit('mouseData', {
	  mX: mouseX,
	  mY: mouseY,
	});
}