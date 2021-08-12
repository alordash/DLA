/// <reference path = "../Field/FieldDisplay.ts" />

class DLA extends FieldDisplay {
    particles: Array<Cell>;
    $fillment = 10;
    $stickines = 0.9;

    Fill(clear = false) {
        if (clear) {
            for (let cell of this.particles)
            cell.state = States.empty;
            this.particles = new Array<Cell>();
        }
        let chance = this.$fillment / 100;
        let max = this.size.x * this.size.y * chance;
        const dif = this.particles.length - max;
        for (let i = 0; i < dif; i++) {
            let index = Calc.IntRand(0, this.particles.length - 1);
            let cell = this.particles.splice(index, 1)[0];
            cell.state = States.empty;
        }
        let end = false;
        for (let x = 0; !end && x < this.size.x; x++)
            for (let y = 0; y < this.size.y; y++) {
                if (Math.random() > chance) {
                    continue;
                }
                this.particles.push(new Cell(new Vec2(x, y), States.particle));
                if (this.particles.length >= max) {
                    end = true;
                    break;
                }
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
                if (!Calc.IsInside(p.pos, this.size)) {
                    p.pos = Calc.RandomPoint(this.size);
                    continue;
                }
                let moves = World.NeighboursLocs.slice();
                Calc.Shuffle(moves);
                let skip = false;
                for (let move of moves) {
                    let _p = p.pos.Sum(move);
                    if (!Calc.IsInside(_p, this.size))
                        continue;
                    let cell = this.getCell(_p);
                    if (cell == undefined)
                        continue;
                    if (cell.state == States.frozen && Math.random() <= this.$stickines) {
                        p.state = States.frozen;
                        skip = true;
                        break;
                    }
                }
                if (skip) {
                    this.particles.splice(i, 1);
                    i--;
                    this.setCell(p);
                    this.DrawCell(p);
                    continue;
                }
                let move = moves.popRandom();
                let _p = p.pos.Sum(move);
                if (!Calc.IsInside(_p, this.size)) {
                    continue;
                }
                this.DrawCell(States.empty, p.pos);
                p.pos = _p;
                this.DrawCell(p);
            }
            return false;
        }
    ];
}