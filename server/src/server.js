import express from 'express';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import addWebpackMiddleware from './addWebpackMiddleware.js';
import Vector from '../../client/src/Vector.js';
import playerData from '../../client/src/PlayerData.js';
import getRandomInt from '../../client/src/getRandomInt.js';
import Leaderboard from '../../client/src/Leaderboard.js';

const app = express(),
	httpServer = http.createServer(app);

addWebpackMiddleware(app); // compilation js client
app.use(express.static('client/public')); // fichiers statiques (html, css, js)

const io = new IOServer(httpServer);


	  
	  class dataBlob {
	constructor() {

		this.x = getRandomInt(-actualWidth / 2, actualWidth / 2);
		this.y = getRandomInt(-actualHeight / 2, actualHeight / 2);
		this.color = 'hsl(' + Math.floor(255 * Math.random()) + ',100%,50%)';

	}
}
let scores = [
	{ score: 1000, name: 'à battre' },
	{ score: 750, name: 'à battre.' },
	{ score: 500, name: 'à battre.' },
	{ score: 250, name: 'à battre' },
	{ score: 100, name: 'à battre' },
	{ score: 50, name: 'à battre' },
	{ score: 25, name: 'à battre' },
	{ score: 10, name: 'à battre.' },
	{ score: 6, name: 'à battre' },
	{ score: 0, name: 'à battre' },
]; 


let leaderboard = new Leaderboard();

let actualWidth = 30000;
let actualHeight = 30000;

let blobs = [];
let eaten_blob_indices = [];
let players = [];

let maxBlobs = 2000;
	  
	  for (let x = 0; x < maxBlobs; x++) {
	  
		blobs.push(new dataBlob(getRandomInt(-actualWidth / 2, actualWidth / 2), getRandomInt(-actualHeight / 2, actualHeight / 2)));
	  
	  }
	  
	  function findPlayerIndex(id) {
		let index = 0;
		let response;
		players.forEach(player => {
		  if (player.id == id) {
			response = index;
		  }
		  index++;
		});
		return response;
	  
	  }
	  function isAlive(playerid) {
		  let resp=false;
		  players.forEach(pl =>{
			  if(playerid==pl.id){
				  resp=true
			  }
		  })
		  return resp;
	  }
	  function secondOperations() {
	  
		players.forEach(player => {
		  player.shrink();
		});
		io.emit('ladderUpdate', scores);
		io.emit('leaderboardData', leaderboard.board);
		leaderboard.organize();
	  
	  }
	  
	  setInterval(secondOperations, 1000);
	 
	  io.on('connection', socket => {
		console.log(`Nouvelle connexion du client ${socket.id}`);
	
		// recept player name
		socket.on('init', (data) => {
	  
			let newPlayer = new playerData(socket.id, data.name, data.canvas.w, data.canvas.h,actualWidth,actualHeight);
		
			players.push(newPlayer);
		
			leaderboard.add(data.name, 5, socket.id);
		
			socket.emit('playerData', newPlayer);
		
			socket.emit('blobData', blobs);
		
		  });
		socket.on('ladder', (data) => {
			scores.push({ score: data.score, name: data.name });
			scores.sort(function(a, b){return b.score-a.score});
			scores.splice(10,1);
		  });

		
		socket.on('mouseData', (data) => {

			if(isAlive(socket.id))  {
			let player = players[findPlayerIndex(socket.id)];
		
			let vel = new Vector(data.mX - player.canvasW / 2, data.mY - player.canvasH / 2);
		
			vel.setMag(2.2 * Math.pow(player.r, -0.439) * 40);
		
			player.acc(vel,actualWidth,actualHeight);
		
			let index = 0;
			blobs.forEach(blob => {
		
			if (player.see(blob)) {
		
				if (player.collideBlob(blob)) {
		
				blobs.splice(index, 1);
				eaten_blob_indices.push(index);
		
				player.addMass(1);
		
				}
			}
			index++;
		
			});
		
			players.forEach(otherplayer => {
		
			if (otherplayer.id != player.id) {
		
				if(player.checkEat(otherplayer)) {
				player.addMass(otherplayer.m);
				//otherplayer.reset(actualWidth,actualHeight);
				players.splice(findPlayerIndex(otherplayer.id), 1);
				leaderboard.remove(otherplayer.id);
				io.to(otherplayer.id).emit('death', otherplayer);
		
				}
		
			}
		
			});
		
			leaderboard.update(player.id, player.m);
		
			socket.emit('playerData', player);
			io.emit('eatenBlobs', eaten_blob_indices);
			io.emit('Players', players);
		
			eaten_blob_indices = [];
		}
	});

	  
		// déconnexion
		socket.on('disconnect', () => {
			leaderboard.remove(socket.id);
			// console.log(socket.id);
			// console.log(findPlayerIndex(socket.id))
			// console.log(players)
			// console.log(players.at(findPlayerIndex(socket.id)));
			// io.emit('death', players.at(findPlayerIndex(socket.id)));
			players.splice(findPlayerIndex(socket.id), 1);
			console.log(`Déconnexion du client ${socket.id}`);
			console.log(players);
		});
	});



const port = process.env.PORT || 8000;
httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});
