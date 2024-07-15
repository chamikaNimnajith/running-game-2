
const Fps = 30;
 
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let speed= 0; 

class BG{
    constructor(){
        this.x = 0;
        this.img = new Image();
        this.img.src = 'bg/bg.png';
        this.img.onload = () =>{
            this.draw();
        }
    }
    draw(){
        this.x -= speed;
        if(this.x <= -canvas.width){
            this.x = 0;
        }
        ctx.drawImage(this.img,this.x,0,canvas.width,canvas.height);
        ctx.drawImage(this.img,this.x + canvas.width,0,canvas.width,canvas.height);
    }
     
}




const bg = new BG();

class player{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;
        this.width = 250;
        this.height = 250;
        this.frame = 0;
        this.animation = "Idle";
        this.animations = {
            Dead:{
                frames: 15,
                images: []
            },
            Idle:{
                frames: 15,
                images: []
            },
            Jump:{
                frames: 15,
                images: []
            },
            Run:{
                frames: 15,
                images: []
            },
            Walk:{
                frames: 15,
                images: []
            },
        }

        this.loadImages();

        //------------------------------------SOUNDS_____________________

        this.runningSound = new Audio();
        this.runningSound.src = "sounds/running.mp3";

        this.jumpSound = new Audio();
        this.jumpSound.src = "sounds/jump.mp3";

        this.deadSound = new Audio();
        this.deadSound.src = "sounds/dead.mp3";

        this.music = new Audio();
        this.music.src = "sounds/billa.mp3";
        this.music.volume = 0.2;
    }

    loadImages(){
       Object.entries(this.animations).forEach(animation =>{
        //console.log(animation);
        for(let i = 1; i<= animation[1].frames; i++){
        let img = new Image();
        img.src = `player/${animation[0]} (${i}).png`;
        this.animations[animation[0]].images.push(img);
    }
       })   
    }

    draw(){
        
        if(!(this.animation == "Dead" && this.frame ==14)){
            this.frame++;
        }
        if(this.frame >= this.animations[this.animation].frames){
             this.frame = 0; 
        }

        if(this.speedY > 0 && this.y < 150){
           this.y += this.speedY;
        }
        if(this.speedY < 0 && this.y > 50){
           this.y += this.speedY;
        }
        ctx.drawImage(this.animations[this.animation].images[this.frame],
                      this.x,
                      this.y,
                      this.width,
                      this.height   
                      );

        //ctx.strokeStyle = "red";
        //ctx.strokeRect(this.x ,this.y + this.height/1.3,this.width/3,this.height/8);
        
        if(this.x + this.width/3  > obstacle.x  &&
            obstacle.x + obstacle.width > this.x &&
           this.y + this.height/1.3 < obstacle.y + obstacle.height &&
           this.y + this.height/1.3 + this.height/8 > obstacle.y){
                         //this.animation = "Dead"
                         speed = 0;
                         
                         if(this.animation != "Dead"){
                             this.animation = "Dead";
                             this.runningSound.pause();
                             this.music.pause();
                             this.deadSound.play();
                         }
        }

        let zoom = this.y - 50;
        this.width = 200 + zoom;
        this.height = 200 + zoom;
        player1.runningSound.volume = 0.3 + (zoom/400); 
        
        //play running sound
        if(this.animation == "Run"){
            this.runningSound.loop = true;
            this.runningSound.play();
        }
    }


}

const player1 = new player(100,130);

class Button {
    constructor(){
        this.show = true;
        this.width = 200;
        this.height = 100;
        this.img = new Image();
        this.img.src = "bg/start.png";
        this.img.onload = () => {        // it may be some time to load the image
            this.draw();
        }
    }

    draw(){
        if(this.show){
            ctx.drawImage(
            this.img,
            canvas.width/2 - this.width/2,
            canvas.height/2 - this.height/2,
            this.width,
            this.height
        )
        }
    }
}

//obstacle

class Obstacle {
    constructor(){
        this.x = canvas.width;
        this.y = 300;
        this.width = 100;
        this.height = 100;
        this.imgs = [];
        this.currentImg = 0;
        this.loadImages()
    }

    loadImages(){
        for(let i = 1; i<=4; i++){
            let img = new Image();
            img.src = `Stone/Stone ${i}.png`;
            this.imgs.push(img);
        }
    }
    
    randomnumber(min,max){
         return Math.floor(Math.random()* (max -min + 1) + min);
    }
    draw(){
        this.x -= speed;
        if(this.x < -this.width){
            this.x = canvas.width;
            this.y = 300 + this.randomnumber(-200,100);
            this.currentImg = this.randomnumber(0,3);
            speed++;
            score.points++
        }
        ctx.drawImage(this.imgs[this.currentImg],this.x,this.y,this.width,this.height);
    }
}

const obstacle = new Obstacle();

const score = {
    points: 0,
    draw: function(){
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${this.points}`,30,480);

        if(player1.animation == "Dead"){
             
            ctx.fillStyle = 'white';
            ctx.font = '70px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`Game Over`,canvas.width/2,canvas.height/2); 
        }
    }
    
    

}

const startBtn = new Button()
setInterval(()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height); // clear the canvas before every daraw
    bg.draw();
    obstacle.draw();
    player1.draw();
    startBtn.draw();
    score.draw();
}, 1000/Fps)


document.addEventListener("keydown",(e)=>{
    if(e.key == "ArrowUp"){
        player1.speedY = -10;
    }
    if(e.key == "ArrowDown"){
        player1.speedY = 10;
    }
    if(e.key == " "){
        player1.animation = "Jump";
        player1.jumpSound.play();
        player1.y -= 50;
        player1.frame = 0;
        setTimeout(() => {
           player1.y += 50;
           player1.animation = "Run"
        },500)
    }
})

document.addEventListener("keyup",(e)=>{
    if(e.key == "ArrowUp"){
        player1.speedY = 0;
    }
    if(e.key == "ArrowDown"){
        player1.speedY = 0;
    }
})
canvas.addEventListener("click", (e)=>{
     
    let x = e.clientX - canvas.getBoundingClientRect().x;
    let y = e.clientY - canvas.getBoundingClientRect().y;

    if( x > canvas.width/2 -startBtn.width/2 &&
        x < canvas.width/2 +startBtn.width/2 && 
        y > canvas.height/2 -startBtn.height/2 &&
        y < canvas.height/2 +startBtn.height/2 
    ){
        speed = 10;
        startBtn.show = false;
        player1.animation = "Run"
        player1.music.play();
    }

})