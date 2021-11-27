const canvas = document.getElementById("gameContainer");
const lost = document.getElementById("lost");
const scoreText = document.getElementById("scoreText");
const speedInput = document.getElementById("speedInput");
const scoreBox = document.getElementById("scoreBox");

const scaleFactor = 2;

var highscore = 0;
let highscoresResult = localStorage.getItem("snakeHighscore");
if (highscoresResult){
    highscore = highscoresResult;
}

var gamesPlayed = 0;
let gamesPlayedResult = localStorage.getItem("snakeGamesPlayed");
if (gamesPlayedResult){
    gamesPlayed = gamesPlayedResult;
}


var player = [];
var heigth;
var width;
var speedX = 0;
var activeSpeedX = 0;
var activeSpeedY = 0;
var speedY = 0;
var timer;
const states = {
	NEWGAME: "new game",
	PLAYING: "playing",
	PAUSED: "paused",
	LOST: "new game",
}
var state = states.NEWGAME;
var bug = {
    domElement: null,
    posX: 0,
    posY: 0
}
var score = 0;
var gameSpeed = 100;
var canvasPos = canvas.getBoundingClientRect();
heigth = canvasPos.height;
width = canvasPos.width;


let snakePart = {
    domElement: createSnakeBlock(true, 100 * scaleFactor, 50 * scaleFactor),
    posX: 100 * scaleFactor,
    posY: 50 * scaleFactor,
};
player.push(snakePart);

setEventListeners();
displayHistory(highscore, gamesPlayed);

function setup(){
    player = [];
    speedX = 0;
    activeSpeedX = 0;
    activeSpeedY = 0;
    speedY = 0;
    state = states.NEWGAME;
    bug = {
        domElement: null,
        posX: 0,
        posY: 0
    }
    score = 0;
    gameSpeed = 100;

    snakePart = {
        domElement: createSnakeBlock(true, 100 * scaleFactor, 50 * scaleFactor),
        posX: 100 * scaleFactor,
        posY: 50 * scaleFactor,
    };
    player.push(snakePart);
    displayHistory(highscore, gamesPlayed);
}


function setEventListeners(){
    document.addEventListener('keydown', getKey);
    lost.addEventListener('click', restart);
    window.addEventListener("keydown", function(e) {
        if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);
    document.getElementById("arrowUp").addEventListener("click", () => {
        document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode':'38'} ))
    })
    document.getElementById("arrowLeft").addEventListener("click", () => {
        document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode':'37'} ))
    })
    document.getElementById("arrowRight").addEventListener("click", () => {
        document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode':'39'} ))
    })
    document.getElementById("arrowDown").addEventListener("click", () => {
        document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode':'40'} ))
    })
    document.getElementById("pauseButton").addEventListener("click", () => {
        document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode':'80'} ))
    })
    document.getElementById("restartButton").addEventListener("click", () => {
        document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode':'32'} ))
    })


    var action = true;
    var timeElapsed = false;
    var pressTimer;
    document.addEventListener('keydown', function (event) {
        let code = event.keyCode;
        if (code == 82 && action === true && state == states.LOST) {
            action = false;
            pressTimer = setInterval(function () {
                timeElapsed = true;
            }, 3000);
        }
    });
    document.addEventListener('keyup', function (event) {
        let code = event.keyCode;
        if (code == 82){
            action = true;
            clearInterval(pressTimer);
            if (timeElapsed){
                clearBrowserData();
            }
            timeElapsed = false;
        }
    });

}


function getKey(event){
    let code = event.keyCode;

    if (code == 49){
        speedInput.value = 1;
    } else if (code == 50){
        speedInput.value = 2;
    } else if (code == 51){
        speedInput.value = 3;
    } else if (code == 52){
        speedInput.value = 4;
    } else if (code == 53){
        speedInput.value = 5;
    }
    
    
    else if (code == 73){
        document.getElementById("guideDiv").classList.toggle("hide");
    }
    
    else if (code == 32){
        //restart();
    } else if (code == 80 && (state == states.PLAYING || state == states.PAUSED)){
        pause();
    }
    
    
    else if ((code == 37 || code == 38 || code == 39 || code == 40
                        ||code == 87 || code == 68 || code == 83 || code == 65)) {
        if (state == states.NEWGAME){
            restart();
            gameSpeed = (6 - speedInput.value) * 50 * scaleFactor;
            state = states.PLAYING;
            gamesPlayed++;
            localStorage.setItem("snakeGamesPlayed", gamesPlayed);
            timer = setInterval(refreshScreen, gameSpeed);
            spawnRandomBugs();
        }
        if (state == states.PLAYING){
            if( code == 38 || code == 87 ){
                keyUpPressed();
            } else if ( code == 39 || code == 68 ){
                keyRightPressed();
            } else if ( code == 40 || code == 83 ){
                keyDownPressed();
            } else if ( code == 37 || code == 65 ){
                keyLeftPressed();
            }
        }
    }
}

function keyLeftPressed(){
    if(activeSpeedX == 0){
        speedX = -5 * scaleFactor;
        speedY = 0;
    }
}
function keyRightPressed(){
    if(activeSpeedX == 0){
        speedX = 5 * scaleFactor;
        speedY = 0;
    }
}
function keyDownPressed(){
    if(activeSpeedY == 0){
        speedX = 0;
        speedY = 5 * scaleFactor;
    }
}
function keyUpPressed(){
    if(activeSpeedY == 0){
        speedX = 0;
        speedY = -5 * scaleFactor;
    }
}

function pause(){
    if(state == states.PLAYING){
        document.getElementById("pauseDiv").classList.remove("hide");
        state = states.PAUSED;
        clearInterval(timer);
    } else {
        state = states.PLAYING;
        timer = setInterval(refreshScreen, gameSpeed);
        if (!document.getElementById("pauseDiv").classList.contains("hide")){
            document.getElementById("pauseDiv").classList.add("hide");
        }
    }
    
}





function getLonger(){
    let last = player.length-1

    let snakePart = {
        domElement : createSnakeBlock(false, player[last].posX, player[last].posY),
        posX : player[last].posX,
        posY : player[last].posY,
    };
    
    player.push(snakePart);
    score += 550 - gameSpeed;
    if (score > highscore){
        highscore = score;
        
    }
}

function hasLostForBounds(){
    if( (speedY < 0 && player[0].posY <= 5 * scaleFactor) || (speedY > 0 && player[0].posY >= heigth-5 * scaleFactor) ){
       return true;
    }
    if( (speedX < 0 && player[0].posX <= 5 * scaleFactor) || (speedX > 0 && player[0].posX >= width-5 * scaleFactor) ){
        return true;
    }
}

function hasLostForSelfEat(){
    for (let i = 1; i < player.length; i++){
        if(player[0].posY == player[i].posY && player[0].posX == player[i].posX){
            return true;
        }
    }
}

function refreshScreen(){
    activeSpeedX = speedX;
    activeSpeedY = speedY;

    if (hasLostForBounds() || hasLostForSelfEat()){
        localStorage.setItem("snakeHighscore", highscore);
        lost.classList.remove("hide");
        clearInterval(timer);
        setTimeout(() => { //prevents restarting the game too soon.
            state = states.LOST;
        }, 1000);

    } else {

        if(player[0].posY == bug.posY && player[0].posX == bug.posX){
            getLonger();
            spawnRandomBugs();
            scoreText.innerText = score;
        }

        if (player.length > 1){
            let lastBlock = player[player.length - 1];
            lastBlock.posX = player[0].posX;
            lastBlock.posY = player[0].posY;
            array_move(player, player.length - 1, 1)

            function array_move(arr, old_index, new_index) {
                if (new_index >= arr.length) {
                    var k = new_index - arr.length + 1;
                    while (k--) {
                        arr.push(undefined);
                    }
                }
                arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
            };
        }
        

        player[0].posY += speedY;
        player[0].posX += speedX;

        printSnake();
    }

    
}

function printSnake(){
    for(let i = 0; i < Math.min(player.length, 2); i++){
        player[i].domElement.style.top = player[i].posY;
        player[i].domElement.style.left = player[i].posX;
    }
}

function removeBug(){
    if(bug.domElement && bug.domElement != ""){
        bug.domElement.remove();
    }
}

function printBug(bugX, bugY){
    let newDiv = document.createElement("div");
    newDiv.classList.add("bug");
    bug.domElement = newDiv;
    bug.domElement.style.top = bug.posY;
    bug.domElement.style.left = bug.posX;
    canvas.appendChild(bug.domElement);
}

function spawnRandomBugs(){
    removeBug();
    let busy = false;
    
    do{
        bug.posX = (Math.floor(Math.random() * 40) + 1)*5 * scaleFactor;
        bug.posY = (Math.floor(Math.random() * 20) + 1)*5 * scaleFactor;
        for (let i = 0; i < player.length; i++){
            if (player[i].posX == bug.posX && player[i].posY == bug.posY){
                busy = true;
                break;
            }
        }
    } while (busy);

    printBug();
}

function cleanInfographics(){
    let pauseMessage = document.getElementById("pauseDiv");
    let lostMessage = document.getElementById("lost");
    if (!pauseMessage.classList.contains("hide")){
        pauseMessage.classList.add("hide");
    }
    if (!lostMessage.classList.contains("hide")){
        lostMessage.classList.add("hide");
    }

    score = 0;
    scoreText.innerText = score;
}

function cleanObjectsGraphics(){
    var snakeElements = document.getElementsByClassName("player");
    if (snakeElements){
        Array.from(snakeElements).forEach(element => {
            element.remove()
        });
    }

    var bugsElements = document.getElementsByClassName("bug")
    if (bugsElements){
        Array.from(bugsElements).forEach(element => {
            element.remove()
        });
    }
}

function cleanCanvas(){
    clearInterval(timer);
    cleanInfographics();
    cleanObjectsGraphics();
}

function clearBrowserData(){
    localStorage.clear();
    highscore = 0;
    gamesPlayed = 0;
    document.getElementById("resetDiv").classList.remove("hide");
    setTimeout(() => {
        document.getElementById("resetDiv").classList.add("hide");
    }, 1000);
}

function restart(){
    cleanCanvas();
    setup();
}






function displayHistory(highscore, gamesPlayed){
    document.getElementById("highscore").innerText = highscore;
    document.getElementById("numOfGames").innerText = gamesPlayed;
}

function createSnakeBlock(isHead, posX, posY){

    let newDiv = document.createElement("div");
    newDiv.classList.add("player");
    if(isHead){
        newDiv.id = "head";
    }

    newDiv.style.top = posY;
    newDiv.style.left = posX;
    canvas.appendChild(newDiv);

    return newDiv;
}