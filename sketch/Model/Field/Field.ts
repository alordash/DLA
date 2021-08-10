/// <reference path = "../../CanvasManager.ts"/>
/// <reference path = "Cell.ts"/>

class Field implements IField {
    private _width: number;
    private _height: number;
    cells: Array<Array<Cell>>;

    constructor(width: number, height: number, payload: Payload = undefined) {
        this.cells = new Array<Array<Cell>>();
        this.Resize(width, height, true, payload);
    }

    Resize(width: number = this._width, height: number = this._height, clear: boolean = false, filler: Payload = undefined) {
        this._width = width;
        this._height = height;

        let newCells = new Array<Array<Cell>>(this._width);
        for (let x = 0; x < this._width; x++) {
            newCells[x] = new Array<Cell>(this._height);
            for (let y = 0; y < this._height; y++) {
                if (!clear && Calc.IsInside(x, y, this.cells)) {
                    newCells[x][y] = this.cells[x][y];
                } else {
                    newCells[x][y] = new Cell(new Vec2(x, y));
                }
            }
        }
        this.cells = newCells;
    }

    get width() {
        return this._width;
    }
    set width(v: number) {
        this._width = v;
        this.Resize();
    }
    get height() {
        return this._height;
    }
    set height(v: number) {
        this._height = v;
        this.Resize();
    }

    Clear() {
        for (let x = 0; x < this._width; x++)
            for (let y = 0; y < this._height; y++)
                this.cells[x][y] = new Cell(new Vec2(x, y));
    }

    static DefaultPredicate = (cell: Cell) => { return cell.payload.isEmpty; };

    GetAvailableNeighbours(p: Vec2, count = -1, predicate = Field.DefaultPredicate) {
        let points = new Array<Cell>();
        let order = new Array<number>(World.MoveDirections.length);
        for (let i = 0; i < order.length; i++) {
            order[i] = i;
        }
        Calc.Shuffle(order);
        for (const i of order) {
            const direction = World.MoveDirections[i];
            let newPoint = p.Sum(direction);
            if (!Calc.IsPointInside(newPoint, this.cells))
                continue;
            let cell = this.cells[newPoint.x][newPoint.y];
            if (predicate(cell)) {
                points.push(cell);
                if (count != -1 && points.length >= count) {
                    return points;
                }
            }
        }
        return points;
    }

    GetAvailableCells(predicate = Field.DefaultPredicate) {
        let points = new Array<Cell>();
        for (let x = 1; x < this._width; x += 2) {
            for (let y = 1; y < this._height; y += 2) {
                let cell = this.cells[x][y];
                if (predicate(cell)) {
                    points.push(cell);
                }
            }
        }
        return points;
    }

    MarkCell(p: Vec2, paylod: Payload) {
        this.cells[p.x][p.y].payload = paylod;
    }

    stage = 0;
    stageActions: Array<() => boolean> = [
        () => {
            for (let cells of this.cells)
                for (let cell of cells)
                    cell.payload = Payload.Random();
            return false;
        }
    ];
    Evolve() {
        if (this.stage >= this.stageActions.length) {
            console.log('Done evolving');
        } else {
            while (this.stageActions[this.stage]()) {
                if (this.stage == this.stageActions.length) {
                    return true;
                }
            }
        }
        return false;
    }
}