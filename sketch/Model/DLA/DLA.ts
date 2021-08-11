/// <reference path = "../Field/FieldDisplay.ts" />

class DLA extends FieldDisplay {
    particles: Array<Cell>;
    fillment = 10;

    Fill() {
        let chance = this.fillment / 100;
        for (let x = 0; x < this.size.x; x++)
            for (let y = 0; y < this.size.y; y++) {
                if (Math.random() > chance) {
                    continue;
                }
                this.particles.push(new Cell(new Vec2(x, y), States.particle));
            }
        this.cells.push(...this.particles);
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
                if(!Calc.IsInside(p.pos, this.size)) {
                    p.pos = Calc.RandomPoint(this.size);
                    continue;
                }
                let moves = World.MoveDirections.slice();
                Calc.Shuffle(moves);
                let skip = false;
                for (let move of moves) {
                    let _p = p.pos.Sum(move);
                    if (!Calc.IsInside(_p, this.size))
                        continue;
                    let cell = this.getCell(_p);
                    if (cell == undefined)
                        continue;
                    if (cell.state == States.frozen) {
                        p.state = States.frozen;
                        skip = true;
                        break;
                    }
                }
                if (skip) {
                    this.particles.splice(i, 1);
                    i--;
                    this.setCell(p);
                    continue;
                }
                let move = moves.popRandom();
                let _p = p.pos.Sum(move);
                if (!Calc.IsInside(_p, this.size)) {
                    continue;
                }
                this.DrawCell(States.empty, p.pos);
                p.pos = _p;
            }
            return false;
        }
    ];
}