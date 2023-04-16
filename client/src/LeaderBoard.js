export default class Leaderboard {
    constructor() {

        this.board = [];

    }
    add(name, score, id) {

        this.board.push({ name: name, score: score, id: id });

    }
    remove(id) {

        let index = 0;
        this.board.forEach(player => {
            if (player.id == id) {
                this.board.splice(index, 1);
            }
            index++;
        });

    }
    update(id, score) {

        let index = 0;
        this.board.forEach(player => {
            if (player.id == id) {
                player.score = Math.floor(score);
            }
            index++;

        });

    }
    organize() {

        this.board.sort(function (a, b) {

            return (a.score < b.score);

        });

    }
}
  
  
  
  
