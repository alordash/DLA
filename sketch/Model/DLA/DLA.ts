/// <reference path = "../Field/FieldDisplay.ts" />

class DLA extends FieldDisplay {
    particles: Array<Cell>;
    fillment = 30;

    Fill() {
        let chance = this.fillment / 100;
        for (let x = 0; x < this.width; x++)
            for (let y = 0; y < this.height; y++) {
                if (Math.random() <= chance) {
                    let cell = this.cells[x][y];
                    this.particles.push(cell);
                    cell.state = States.particle;
                }
            }
    }
    constructor(canvasManager: CanvasManager, width: number = 0, height: number = 0, step: number = 1) {
        super(canvasManager, width, height, step);
        this.particles = new Array<Cell>();
        this.Fill();
    }
    stageActions = [
        () => {
            for (let i = 0; i < this.particles.length; i++) {
                let p = this.particles[i];
                let moves = World.MoveDirections.slice();
                Calc.Shuffle(moves);
                let skip = false;
                for (let move of moves) {
                    let _p = p.pos.Sum(move);
                    if (!Calc.IsInside(_p.x, _p.y, this.cells))
                        continue;
                    let cell = this.cells[_p.x][_p.y];
                    if (cell.state == States.frozen) {
                        p.state = States.frozen;
                        skip = true;
                        this.DrawCell(p);
                        break;
                    }
                }
                if (skip) {
                    this.particles.splice(i, 1);
                    i--;
                    continue;
                }
                let move = moves.popRandom();
                let _p = p.pos.Sum(move);
                if (!Calc.IsInside(_p.x, _p.y, this.cells)) {
                    continue;
                }
                this.MarkCell(_p, States.particle);
                this.MarkCell(p.pos, States.empty);
                this.particles[i] = this.cells[_p.x][_p.y];
            }
            return false;
        }
    ]
}