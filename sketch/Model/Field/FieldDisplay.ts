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

    constructor(canvasManager: CanvasManager, width: number = 0, height: number = 0, step: number = 1, payload: Payload = undefined) {
        super(width, height, payload);
        this.canvasManager = canvasManager;
        this._step = step;
    }

    ResizeCanvas(width: number, height: number, step: number, clear = false, filler: Payload = undefined) {
        this.Resize(width, height, clear, filler);
        this._step = step;
        this.canvasManager.Resize(this.width * this._step, this.height * this._step);
        this.Display();
    }

    Palette(payload: Payload) {
        let p5 = this.canvasManager.p5;
        if (payload.isVisited) {
            p5.fill(0, 0, 255).stroke(0, 0, 255);
        } else {
            let v = payload.isWall ? 0 : 255;
            p5.fill(v).stroke(v);
        }
    }

    DrawCell(cell: Cell) {
        this.Palette(cell.payload);
        this.canvasManager.p5.rect(cell.pos.x * this._step, cell.pos.y * this._step, this._step, this._step);
    }
    
    MarkCell(p: Vec2, paylod: Payload) {
        let cell = this.cells[p.x][p.y];
        cell.payload = paylod;
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