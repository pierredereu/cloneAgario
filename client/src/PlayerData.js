import Vector from './Vector.js';
import getRandomInt from './getRandomInt.js';

export default class playerData {
    constructor(id, name, canvasW, canvasH,actualWidth,actualHeight) {

        this.pos = new Vector(getRandomInt(-actualWidth / 2, actualWidth / 2), getRandomInt(-actualHeight / 2, actualHeight / 2));

        this.m = 5;
        this.originalM = 5;

        this.r = Math.sqrt(this.m / Math.PI) * 40;
        this.originalR = this.r;

        this.color = 'hsl(' + Math.floor(255 * Math.random()) + ',100%,50%)';

        this.id = id;

        this.name = name;
        this.canvasW = canvasW;
        this.canvasH = canvasH;
        //this.canvas = { w: canvasW, h: canvasH };
    }
    acc(v,actualWidth,actualHeight) {

        this.pos.add(v);

        this.pos.limitX(-actualWidth / 2, actualWidth / 2);

        this.pos.limitY(-actualHeight / 2, actualHeight / 2);

    }
    addMass(m) {

        this.m += m;
        this.r = Math.sqrt(this.m / Math.PI) * 40;

    }
    shrink() {

        if (this.m > this.originalM + this.m / 20000) {

            this.addMass(-this.m / 20000);

        }

    }
    reset(actualWidth,actualHeight) {

        this.pos.set(getRandomInt(-actualWidth / 2, actualWidth / 2), getRandomInt(-actualHeight / 2, actualHeight / 2));

        this.m = 5;

        this.r = Math.sqrt(this.m / Math.PI) * 40;

        this.color = 'hsl(' + Math.floor(255 * Math.random()) + ',100%,50%)';


    }
    see(blob) {

        return (blob.x >= this.pos.x - this.r && blob.x <= this.pos.x + this.r && blob.y >= this.pos.y - this.r && blob.y <= this.pos.y + this.r);

    }
    collideBlob(blob) {

        let side1 = blob.x - this.pos.x;

        let side2 = blob.y - this.pos.y;

        return (Math.sqrt(side1 * side1 + side2 * side2) < this.r + Math.sqrt(1 / Math.PI) * 40);

    }
    checkEat(otherplayer) {

        let side1 = otherplayer.pos.x - this.pos.x;

        let side2 = otherplayer.pos.y - this.pos.y;

        if (Math.sqrt(side1 * side1 + side2 * side2) < this.r && this.m > otherplayer.m * 1.25) {

            return true;

        }

        return false;

    }
}
  
  
  
  
  
  
  
