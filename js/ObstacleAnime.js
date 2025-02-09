import ObstacleDangereux from "./ObstacleDangereux.js";

/**
 * Classe obstacleAnime : Un obstacle qui se déplace automatiquement et qui est dangereux.
 */
export default class obstacleAnime extends ObstacleDangereux {
    constructor(x, y, w, h, couleur, speedX, speedY, rangeX, rangeY) {
        super(x, y, w, h, couleur);  // Appel du constructeur parent (ObstacleDangereux)
        this.couleur = couleur; // Couleur de l'obstacle
        this.speedX = speedX;  // Vitesse de déplacement horizontal
        this.speedY = speedY;  // Vitesse de déplacement vertical
        this.rangeX = rangeX;  // Amplitude du déplacement horizontal
        this.rangeY = rangeY;  // Amplitude du déplacement vertical
        this.startY = y;  // Position initiale
        this.startX = x;  // Position initiale en X
        this.directionX = 1; // Direction du mouvement horizontal (1 = droite, -1 = gauche)
        this.directionY = 1; // Direction du mouvement vertical (1 = descend, -1 = monte)
        this.alive = true; // Indique si l'obstacle est actif
    }

    /**
     * Met à jour la position de l'obstacle.
     */
    update() {
        if (!this.alive) return; // Stoppe l'animation si l'objet est détruit
        this.y += this.speedY * this.directionY;
        this.x += this.speedX * this.directionX;

        // Change de direction lorsqu'il atteint les limites de son mouvement vertical
        if (this.y > this.startY + this.rangeY || this.y < this.startY) {
            this.directionY *= -1;
        }

        // Change de direction lorsqu'il atteint les limites de son mouvement horizontal
        if (this.x > this.startX + this.rangeX || this.x < this.startX) {
            this.directionX *= -1;
        }
    }

    /**
     * Dessine l'obstacle sur le canvas.
     */
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.couleur;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.restore();
    }

    destroy() {
        console.log("Destruction de :", this);
        this.alive = false;
    }
    
}
