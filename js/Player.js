import ObjectGraphique from "./ObjectGraphique.js";

export default class Player extends ObjectGraphique {
    constructor(x, y) {
        super(x, y, 55, 55); // Ajusté pour une tête seule
        this.vitesseX = 0;
        this.vitesseY = 0;
        this.couleur = "#3b3b3b"; // Couleur de la tête
        this.angle = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.translate(-this.w / 2, -this.h / 2);

        // Tête du chat (cercle)
        ctx.fillStyle = "#3b3b3b";
        ctx.beginPath();
        ctx.arc(this.w / 2, this.h / 2, this.w * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Oreilles (écartées vers les bords du cercle)
        this.drawTriangle(ctx, this.w * 0.05, this.h * 0.15, this.w * 0.25, this.h * 0.05, this.w * 0.2, this.h * 0.3, "#3b3b3b");
        this.drawTriangle(ctx, this.w * 0.75, this.h * 0.05, this.w * 0.95, this.h * 0.15, this.w * 0.8, this.h * 0.3, "#3b3b3b");

        // Oreilles internes (roses)
        this.drawTriangle(ctx, this.w * 0.1, this.h * 0.15, this.w * 0.2, this.h * 0.1, this.w * 0.18, this.h * 0.25, "#e06b75");
        this.drawTriangle(ctx, this.w * 0.8, this.h * 0.1, this.w * 0.9, this.h * 0.15, this.w * 0.82, this.h * 0.25, "#e06b75");

        // Yeux (noirs)
        this.drawCircle(ctx, this.w * 0.35, this.h * 0.45, this.w * 0.07, "black");
        this.drawCircle(ctx, this.w * 0.65, this.h * 0.45, this.w * 0.07, "black");

        // Reflets des yeux (blancs)
        this.drawCircle(ctx, this.w * 0.38, this.h * 0.42, this.w * 0.02, "white");
        this.drawCircle(ctx, this.w * 0.68, this.h * 0.42, this.w * 0.02, "white");

        // Joues roses
        this.drawCircle(ctx, this.w * 0.25, this.h * 0.5, this.w * 0.04, "#ff8888");
        this.drawCircle(ctx, this.w * 0.75, this.h * 0.5, this.w * 0.04, "#ff8888");

        // Bouche (simple ligne courbée)
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.w * 0.45, this.h * 0.55);
        ctx.quadraticCurveTo(this.w * 0.5, this.h * 0.6, this.w * 0.55, this.h * 0.55);
        ctx.stroke();

        // Queue (proche de la tête)
        ctx.strokeStyle = "black";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this.w * 0.7, this.h * 0.8);  // Départ plus proche du bas de la tête
        ctx.quadraticCurveTo(this.w * 1.1, this.h * 0.7, this.w * 0.9, this.h * 0.5);
        ctx.stroke();

        ctx.restore();
        super.draw(ctx);
    }

    drawCircle(ctx, x, y, radius, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    drawTriangle(ctx, x1, y1, x2, y2, x3, y3, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    move() {
        this.x += this.vitesseX;
        this.y += this.vitesseY;
    }
}
