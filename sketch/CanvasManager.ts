class CanvasManager {
    width: number;
    height: number;
    p5: p5;

    constructor(width: number, height: number, p5: p5) {
        this.width = width;
        this.height = height;
        this.p5 = p5;
    }

    Resize(width = this.width, height = this.height) {
        this.width = width;
        this.height = height;
        this.p5.resizeCanvas(this.width, this.height);
        this.p5.background(0);
        this.p5.fill(255);
        this.p5.stroke(0);
        this.p5.strokeWeight(2);
    }
}