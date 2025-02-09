import Player from "./Player.js";
import Obstacle from "./Obstacle.js";
import ObstacleDangereux from "./ObstacleDangereux.js";
import Sortie from "./sortie.js";
import obstacleAnime from "./ObstacleAnime.js";  // Corrigé ici
import { rectsOverlap } from "./collisions.js";
import { initListeners } from "./ecouteurs.js";

export default class Game {
    objetsGraphiques = [];
    niveau = 1;

    constructor(canvas) {
        this.canvas = canvas;
        // etat du clavier
        this.inputStates = {
            mouseX: 0,
            mouseY: 0,
        };
        // Ajout d'un écouteur pour la touche 'N'
        window.addEventListener('keydown', (event) => {
            if(event.key === 'n' || event.key === 'N') {
                this.passerAuNiveauSuivant();
            }
        });
    } 

    async init(canvas) {
        this.ctx = this.canvas.getContext("2d");

        this.player = new Player(100, 100); 
        this.objetsGraphiques.push(this.player);

        // Configuration du niveau initial
        this.passerAuNiveauSuivant();

        // On initialise les écouteurs de touches, souris, etc.
        initListeners(this.inputStates, this.canvas);

        console.log("Game initialisé");
    }

    updateFPS() {
        const now = performance.now();
        const deltaTime = now - this.lastFrameTime;

        if (deltaTime > 0) {
            this.fps = Math.min(60, Math.round(1000 / deltaTime)); // Limite à 60 images par secondes pour éviter que cela crée des problèmes
        } else {
            this.fps = 60; // Pour éviter les erreurs vu qu'on ne peut pas diviser par zéro
        }
    
        // Affichage des FPS
        document.getElementById('fpsCounter').textContent = `FPS: ${this.fps}`;
    }

    start() {
        console.log("Game démarré");

        // On démarre une animation à 60 images par seconde
        requestAnimationFrame(this.mainAnimationLoop.bind(this));
    }

    mainAnimationLoop() {
        // 1 - on efface le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 2 - on dessine les objets à animer dans le jeu
        this.drawAllObjects();

        // 3 - On regarde l'état du clavier, manette, souris et on met à jour
        // l'état des objets du jeu en conséquence
        this.update();

        // 4 - on demande au navigateur d'appeler la fonction mainAnimationLoop
        // à nouveau dans 1/60 de seconde
        requestAnimationFrame(this.mainAnimationLoop.bind(this));

            const now = performance.now();
            const deltaTime = now - this.lastFrameTime;
        
            if (deltaTime >= 16.67) { // Environ 60 FPS (1s / 60 = 16.67ms) car sur pc 144hz le perso se dééplace plus vite sinon
                this.lastFrameTime = now;
        
        }
        
    }

    drawAllObjects() {
        // Dessine tous les objets du jeu
        this.objetsGraphiques.forEach(obj => {
            obj.draw(this.ctx);
        });
    }

    update() {
        // Appelée par mainAnimationLoop
        // donc tous les 1/60 de seconde
        
        // Déplacement du joueur
        this.movePlayer();

        // Mise à jour des obstacles animés
        this.objetsGraphiques.forEach(obj => {
        if (obj instanceof obstacleAnime) {
            obj.update();
            }
         });
        
        
    }

    movePlayer() {
        this.player.vitesseX = 0;
        this.player.vitesseY = 0;
        
        if(this.inputStates.ArrowRight) {
            this.player.vitesseX = 3;
        } 
        if(this.inputStates.ArrowLeft) {
            this.player.vitesseX = -3;
        } 

        if(this.inputStates.ArrowUp) {
            this.player.vitesseY = -3;
        } 

        if(this.inputStates.ArrowDown) {
            this.player.vitesseY = 3;
        } 

        this.player.move();

        this.testCollisionsPlayer();
    }

    testCollisionsPlayer() {
        // Teste collision avec les bords du canvas
        this.testCollisionPlayerBordsEcran();

        // Teste collision avec les obstacles
        this.testCollisionPlayerObstacles();
    }

    testCollisionPlayerBordsEcran() {
        // Rappel : le x, y du joueur est en son centre, pas dans le coin en haut à gauche!
        if(this.player.x - this.player.w/2 < 0) {
            // On stoppe le joueur
            this.player.vitesseX = 0;
            // on le remet au point de contact
            this.player.x = this.player.w/2;
        }
        if(this.player.x + this.player.w/2 > this.canvas.width) {
            this.player.vitesseX = 0;
            // on le remet au point de contact
            this.player.x = this.canvas.width - this.player.w/2;
        }

        if(this.player.y - this.player.h/2 < 0) {
            this.player.y = this.player.h/2;
            this.player.vitesseY = 0;
        }
       
        if(this.player.y + this.player.h/2 > this.canvas.height) {
            this.player.vitesseY = 0;
            this.player.y = this.canvas.height - this.player.h/2;
        }
    }

    testCollisionPlayerObstacles() {
        this.objetsGraphiques.forEach(obj => {
            if(obj instanceof Obstacle) {
                if(rectsOverlap(this.player.x - this.player.w/2 + 5, this.player.y - this.player.h/2 + 5, 
                                this.player.w - 10, this.player.h - 10, obj.x, obj.y, obj.w, obj.h)) {
                    // Empêcher le joueur d'avancer dans l'obstacle
                    // Annule le dernier déplacement
                    this.player.x -= this.player.vitesseX;
                    this.player.y -= this.player.vitesseY;
    
                    // Stoppe le mouvement
                    this.player.vitesseX = 0;
                    this.player.vitesseY = 0;
                }
            }
    
            // Pour les obstacles dangereux ou animés, réinitialiser la position du joueur
            if(obj instanceof ObstacleDangereux || obj instanceof obstacleAnime) {
                if(rectsOverlap(this.player.x - this.player.w/2 + 5, this.player.y - this.player.h/2 + 5, 
                                this.player.w - 10, this.player.h - 10, obj.x, obj.y, obj.w, obj.h)) {
                    // Collision avec un obstacle dangereux ou animé
                    console.log("Collision avec obstacle dangereux ou animé");
                    
                    // Réinitialisation de la position du joueur à (100, 100)
                    this.player.x = 100;
                    this.player.y = 100;
                    this.player.vitesseX = 0;
                    this.player.vitesseY = 0;
                }
            }
    
            // Test de collision avec la sortie
            if(obj instanceof Sortie) {
                if(rectsOverlap(this.player.x - this.player.w/2 + 5, this.player.y - this.player.h/2 + 5, 
                                this.player.w - 10, this.player.h - 10, obj.x, obj.y, obj.w, obj.h)) {
                    console.log("Niveau terminé !");
                    this.passerAuNiveauSuivant();
                }
            }
        });
    
        // Vérification supplémentaire si le joueur est près d'un obstacle dynamique (de tous côtés)
        if (this.player.vitesseX !== 0 || this.player.vitesseY !== 0) {
            this.objetsGraphiques.forEach(obj => {
                if ((obj instanceof obstacleAnime || obj instanceof ObstacleDangereux) &&
                    rectsOverlap(this.player.x - this.player.w/2, this.player.y - this.player.h/2,
                                 this.player.w, this.player.h, obj.x, obj.y, obj.w, obj.h)) {
                    // Réinitialisation de la position à (100, 100) en cas de collision
                    this.player.x = 100;
                    this.player.y = 100;
                    this.player.vitesseX = 0;
                    this.player.vitesseY = 0;
                }
            });
        }
    }
    
    passerAuNiveauSuivant() {

        
        document.body.classList.remove("niveau5");

    
        if (this.niveau >5) {
            this.niveau = 1;}
    
        /// 1. Appeler `destroy()` sur chaque objet avant suppression
            this.objetsGraphiques.forEach(obj => {
             if (typeof obj.destroy === "function") {
            obj.destroy();
             }
         });

         // 2. Vider complètement le tableau d'objets
         this.objetsGraphiques.length = 0;

        // 3. Supprimer la référence à la sortie
        this.sortie = null;
    
        // On garde le joueur
        this.objetsGraphiques.push(this.player);
    
        switch (this.niveau) {
            case 1:
                document.body.classList.add("niveau1");
                this.objetsGraphiques.push(new Obstacle(0, 0, 200, 30, "#800080"));
                this.objetsGraphiques.push(new Obstacle(0, 790, 800, 30, "#800080"));
                this.objetsGraphiques.push(new Obstacle(160, 0, 40, 680, "#800080"));
                this.objetsGraphiques.push(new Obstacle(0, 0, 30, 800, "#800080"));
                this.objetsGraphiques.push(new Obstacle(160, 680, 700, 30, "#800080"));
                this.sortie = new Sortie(750, 750, 30, 30, "green"); this.niveau++;
                break;
            case 2:
                this.objetsGraphiques.push(new Obstacle(200, 0, 40, 600, "#800080"));
                this.objetsGraphiques.push(new obstacleAnime(0, 300, 40, 80, "#c232ac", 2, 2, 160, 160));
                this.objetsGraphiques.push(new obstacleAnime(200, 600, 40, 80, "#c232ac", 0, 2, 0, 100)); 
                this.objetsGraphiques.push(new Obstacle(400, 200, 40, 600, "#800080"));
                this.objetsGraphiques.push(new obstacleAnime(400, 0, 40, 50, "#c232ac", 0, 2, 0, 150)); 
                this.objetsGraphiques.push(new Obstacle(400, 200, 600, 40, "#800080"));
                this.objetsGraphiques.push(new obstacleAnime(240, 240, 40, 50, "#c232ac", 1, 0, 120, 0)); 
                this.sortie = new Sortie(700, 100, 30, 30, "green"); this.niveau++;
                break;
            case 3:
                this.objetsGraphiques.push(new Obstacle(0, 0, 800, 40, "#800080"));
                this.objetsGraphiques.push(new Obstacle(0, 200, 800, 40, "#800080"));
                this.objetsGraphiques.push(new obstacleAnime(200, 40, 30, 30, "#c232ac", 0, 2, 0, 118));
                this.objetsGraphiques.push(new obstacleAnime(450, 40, 30, 30, "#c232ac", 0, 2, 0, 118));
                this.objetsGraphiques.push(new ObstacleDangereux(320, 40, 40, 40, "#c90644"));
                this.objetsGraphiques.push(new ObstacleDangereux(600, 160, 40, 40, "#c90644"));
                this.sortie = new Sortie(700, 100, 30, 30, "green"); this.niveau++;
                break;
            case 4:
                this.objetsGraphiques.push(new ObstacleDangereux(0, 0, 800, 40, "#c90644"));
                this.objetsGraphiques.push(new ObstacleDangereux(0, 130, 700, 40, "#c90644"));
                this.objetsGraphiques.push(new ObstacleDangereux(700, 130, 40, 600, "#c90644"));
                this.objetsGraphiques.push(new ObstacleDangereux(140, 700, 600, 40, "#c90644"));
                this.objetsGraphiques.push(new ObstacleDangereux(140, 280, 40, 450, "#c90644"));
                this.objetsGraphiques.push(new obstacleAnime(0, 650, 20, 20, "#c232ac", 2, 0, 120, 0));
                this.objetsGraphiques.push(new obstacleAnime(185, 350, 50, 50, "#c232ac", 2, 0, 460, 0));
                this.objetsGraphiques.push(new obstacleAnime(185, 500, 50, 50, "#c232ac", 3, 0, 460, 0));
                this.objetsGraphiques.push(new obstacleAnime(185, 270, 50, 50, "#c232ac", 3, 0, 460, 0));
                this.objetsGraphiques.push(new obstacleAnime(185, 420, 50, 50, "#c232ac", 4, 0, 460, 0));
                this.sortie = new Sortie(600, 600, 30, 30, "green"); this.niveau++;
                break;
            
            case 5:
                // Appliquer la classe niveau5 au body lorsque le joueur atteint le niveau 5
                document.body.classList.add("niveau5");
                this.sortie = new Sortie(100, 700, 30, 30, "green");
                this.niveau++;
                 break; 
        }
    
        // On ajoute la sortie
        this.objetsGraphiques.push(this.sortie);
    
        // Réinitialisation de la position du joueur
        this.player.x = 100;
        this.player.y = 100;
        this.player.vitesseX = 0;
        this.player.vitesseY = 0;
    
        console.log("Passage au niveau " + this.niveau);
    }

    
    
}