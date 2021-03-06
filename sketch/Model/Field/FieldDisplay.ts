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
        return Math.round(v / this._step);
    }

    constructor(canvasManager: CanvasManager, width: number = 0, height: number = 0, step: number = 1) {
        super(width, height);
        this.canvasManager = canvasManager;
        this._step = step;
    }

    ResizeCanvas(width: number, height: number, step: number) {
        this.size.x = width;
        this.size.y = height;
        this._step = step;
        this.canvasManager.Resize(this.size.x * this._step, this.size.y * this._step);
    }

    Palette(state: States) {
        let p5 = this.canvasManager.p5;
        switch (state) {
            case States.empty:
                p5.fill(0);
                break;
            case States.frozen:
                p5.fill(0, 0, 255);
                break;
            case States.particle:
                p5.fill(255);
                break;

            default:
                break;
        }
    }

    DrawCell(state_cell: States | Cell, _x?: number | Vec2, _y?: number) {
        let p: Vec2;
        let state: States;
        if (state_cell instanceof Cell) {
            p = state_cell.pos;
            state = state_cell.state;
        } else {
            p = Calc.toVec2(_x, _y);
            state = state_cell;
        }
        this.Palette(state);
        this.canvasManager.p5.rect(p.x * this._step, p.y * this._step, this._step, this._step);
    }

    MarkCell(p: Vec2, state: States) {
        let cell = this.getCell(p);
        cell.state = state;
        this.DrawCell(cell);
    }

    Display() {
        for (let cell of this.cells) {
            this.DrawCell(cell);
        }
    }
}