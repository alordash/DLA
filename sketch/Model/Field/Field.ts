/// <reference path = "../../CanvasManager.ts"/>
/// <reference path = "Cell.ts"/>


class Field implements IField {
    size: Vec2;
    cells: Array<Cell>;

    grid: Array<Array<Cell>>;

    getCell(_x: number | Vec2, _y?: number) {
        const p = Calc.toVec2(_x, _y);
        if (this.grid[p.x] == undefined)
            return undefined;
        return this.grid[p.x][p.y];
    }
    setCell(state_cell: States | Cell, _x?: number | Vec2, _y?: number) {
        if(state_cell instanceof Cell) {
            const p = state_cell.pos;
            if(this.grid[p.x] == undefined)
                this.grid[p.x] = new Array<Cell>();
            this.grid[p.x][p.y] = state_cell;
            return state_cell;
        }
        const state = <States>state_cell;
        const p = Calc.toVec2(_x, _y);
        if (this.grid[p.x] == undefined) {
            this.grid[p.x] = new Array<Cell>();
            let cell = this.grid[p.x][p.y] = new Cell(p, state);
            this.cells.push(cell);
            return cell;
        }
        let cell = this.grid[p.x][p.y];
        if (cell == undefined) {
            this.grid[p.x][p.y] = cell = new Cell(p, state);
            this.cells.push(cell);
            return cell;
        }
        cell.state = state;
        return cell;
    }

    constructor(width: number, height: number) {
        this.size = new Vec2(width, height);
        this.grid = new Array<Array<Cell>>();
        this.cells = new Array<Cell>();
    }

    Clear() {
        this.cells = new Array<Cell>();
        this.grid = new Array<Array<Cell>>();
    }

    static DefaultPredicate = (cell: Cell) => { return cell.state == States.empty; };

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
            if (!Calc.IsInside(newPoint, this.size))
                continue;
            let cell = this.grid[newPoint.x][newPoint.y];
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
        for (let x = 1; x < this.size.x; x += 2) {
            for (let y = 1; y < this.size.y; y += 2) {
                let cell = this.grid[x][y];
                if (predicate(cell)) {
                    points.push(cell);
                }
            }
        }
        return points;
    }

    MarkCell(p: Vec2, state: States) {
        if (this.grid[p.x] == undefined)
            this.grid[p.x] = new Array<Cell>();
        this.grid[p.x][p.y].state = state;
    }

    stage = 0;
    stageActions: Array<() => boolean> = [];
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