/// <reference path = "Field.ts" />

class FieldDisplay extends Field implements IFieldDisplay {
    canvasManager: CanvasManager;
    private _step: number;

    public get step(): number {
        return this._step;
    }

    public set step(v: number) {
        this._step = v;
        this.canvasManager.Resize();
    }

    Quantiz(v: number) {
        let q = Math.round(v / this._step);
        return Calc.Odd(q);
    }

    constructor(canvasManager: CanvasManager, width: number = 0, height: number = 0, step: number = 1) {
        super(width, height);
        this.canvasManager = canvasManager;
        this._step = step;
    }

    ResizeCanvas(width: number, height: number, step: number, clear = false) {
        this.Resize(width, height, clear);
        this._step = step;
        this.canvasManager.Resize(this.width * this._step, this.height * this._step);
        this.Display();
    }

    Palette(state: States) {
        let p5 = this.canvasManager.p5;
        let v: number;
        switch (state) {
            case States.empty:
                v = 0;
                p5.fill(v).stroke(v);
                break;
            case States.frozen:
                p5.fill(0, 0, 255).stroke(0, 0, 255);
                break;
            case States.particle:
                v = 255;
                p5.fill(v).stroke(v);
                break;

            default:
                break;
        }
    }

    DrawCell(cell: Cell) {
        this.Palette(cell.state);
        this.canvasManager.p5.rect(cell.pos.x * this._step + 1, cell.pos.y * this._step + 1, this._step - 1, this._step - 1);
    }

    MarkCell(p: Vec2, state: States) {
        let cell = this.cells[p.x][p.y];
        cell.state = state;
        this.DrawCell(cell);
    }

    Display() {
        for (let arr of this.cells) {
            for (let cell of arr) {
                this.DrawCell(cell);
            }
        }
    }
}