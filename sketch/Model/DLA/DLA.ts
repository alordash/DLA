/// <reference path = "../Field/FieldDisplay.ts" />

class DLA extends FieldDisplay {
    particles: Array<Cell>;
    fillment = 10;

    Fill() {
        let chance = this.fillment / 100;
        for (let x = 0; x < this.width; x++)
            for (let y = 0; y < this.height; y++) {
                if (Math.random() <= chance) {
                    let cell = this.cells[x][y];
                    this.particles.push(cell);
                    cell.payload.isEmpty = false;
                }
            }
    }
    constructor(canvasManager: CanvasManager, width: number = 0, height: number = 0, step: number = 1, payload: Payload = undefined) {
        super(canvasManager, width, height, step, payload);
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
                    if (!cell.payload.isEmpty) {
                        p.payload.isFrozen = true;
                        skip = true;
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
                let cell = this.cells[_p.x][_p.y];
                cell.payload.isEmpty = false;
                p.payload.isEmpty = true;
                this.particles[i] = cell;
            }
            return false;
        }
    ]
}