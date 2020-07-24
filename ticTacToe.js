const Gameboard = (function () {
    let board = ["", "", "", "", "", "", "", "", ""]
    let boardDisplayCache;
    window.onload = () => boardDisplayCache = Array.from(document.querySelectorAll(".board-place"))
    const render = () => {
        boardDisplayCache.forEach((e) => e.textContent = board[e.getAttribute("data")]);
    }
    const addMark = (i, playerMark) => {
        board[i] = playerMark;
        render();
    }
    const resetBoard = () => {
        for (let i = 0; i < boardDisplayCache.length; i++) {
            addMark(i, "")
        }

    }
    return {
        render,
        addMark,
        resetBoard,
        get boardDisplayCache() { return boardDisplayCache },
        get board() { return board }
    }
})()

const Player = (aName, aMark) => {
    let points = 0;
    let places = [];
    const name = aName;
    const mark = aMark;
    return {
        get points() {
            return points;
        },
        set points(value) {
            points = value;
        },
        get name() {
            return name;
        },
        get mark() {
            return mark;
        },
        AddPlace(place) {
            places.push(place)

        },
        get places() {
            return places
        },
        resetPlaces() {
            places = []
        }
    };
}


const Game = () => {
    const player1 = (() => { const name = document.getElementById("player-one").value; return Player(name, "X"); })()
    const player2 = (() => { const name = document.getElementById("player-two").value; return Player(name, "O"); })()

    const turn = (() => {
        const MAXTURN = 8;
        number = 0,
            player = player1
        const actualizeTurn = () => {
            number++;
            player === player1 ? player = player2 : player = player1;
        }
        const turnLimit = () => {
            let limit = false
            if (number === MAXTURN) {
                limit = true;
            }
            return limit;

        }

        const resetTurns = () => {
            number = 0;
            player = player1;

        }
        return { get number() { return number }, get player() { return player }, turnLimit, actualizeTurn, resetTurns }

    })()

    const htmlCache = (() => {
        const gameOverWall = document.getElementById("gameOver")
        const gameOverBtn = document.getElementById("gameOverBtn")
        const gameOverMesagge = document.getElementById("gameOverMesagge")
        const playerOneStats = (() => {
            let nameP = document.getElementById("player-one-name");
            let pointsP = document.getElementById("player-one-points");
            let markP = document.getElementById("player-one-mark");
            return { nameP, pointsP, markP }
        })()
        const playerTwoStats = (() => {
            let nameP = document.getElementById("player-two-name");
            let pointsP = document.getElementById("player-two-points");
            let markP = document.getElementById("player-two-mark");
            return { nameP, pointsP, markP }

        })()


        return {
            gameOverWall
            , gameOverBtn, gameOverMesagge, playerOneStats, playerTwoStats
        }
    })()

    const play = (i) => {
        if (Gameboard.board[i] === "") {
            Gameboard.addMark(i, player.mark);
            turn.player.AddPlace(+i);
            if (checkWinner()) {
                console.log(gameOver(true))
            } else if (turn.turnLimit()) {
                console.log(gameOver(false));
            } else turn.actualizeTurn();

        }
    }

    const checkWinner = () => {
        const winCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [2, 4, 6],
            [0, 4, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8]];
        const used = turn.player.places;
        let winner = false;
        winCombos.forEach(combo => {
            if (combo.every((x) => used.includes(x))) {
                winner = true;
            }

        });
        return winner;
    }

    const gameOver = (winner) => {
        let message;
        if (winner) { player.points++; message = player.name + " wins!"; }
        else { message = "it's a tie"; }

        htmlCache.gameOverMesagge.textContent = message;
        htmlCache.gameOverWall.style.display = "flex";
        Gameboard.boardDisplayCache.forEach((e) => {
            e.style.pointerEvents = "none"
        })

        render();
        return message;


    }

    const restart = () => {
        player1.resetPlaces();
        player2.resetPlaces();
        Gameboard.resetBoard();
        turn.resetTurns();
        htmlCache.gameOverWall.style.display = "none";
        Gameboard.boardDisplayCache.forEach((e) => {
            e.style.pointerEvents = "auto"
        })


    }

    const render = () => {
        htmlCache.playerOneStats.nameP.textContent = player1.name;
        htmlCache.playerOneStats.pointsP.textContent = "Points: " + player1.points;
        htmlCache.playerOneStats.markP.textContent = player1.mark;
        htmlCache.playerTwoStats.nameP.textContent = player2.name;
        htmlCache.playerTwoStats.pointsP.textContent = "Points: " + player2.points;
        htmlCache.playerTwoStats.markP.textContent = player2.mark;
    }
    render()



    return { play, htmlCache, restart };
}


window.addEventListener("load", function () {
    const start = () => {
        document.getElementById("board").style.display = "grid";
        const game = Game()
        Gameboard.boardDisplayCache.forEach((e) => {
            e.addEventListener("click", function (e) {
                i = e.target.getAttribute("data");
                game.play(i);
            })
        })
        game.htmlCache.gameOverBtn.addEventListener("click", game.restart)
        document.getElementById("playersFrom").remove();
        document.getElementById("tic-tac-toe-title").remove();

    }
    document.getElementById("startBtn").addEventListener("click", start)

});



