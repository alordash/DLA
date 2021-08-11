interface IField {
    size: Vec2;

    getCell(_x: number | Vec2, _y?: number): Cell;
    setCell(state: States | Cell, _x?: number | Vec2, _y?: number): Cell;

    Clear(): void;

    //    optionalReset?(hard: boolean): void;
    MarkCell(p: Vec2, state: States): void;
    GetAvailableNeighbours(p: Vec2, count: number, predicate: (cell: Cell) => boolean): Array<Cell>;
    GetAvailableCells(predicate: (cell: Cell) => boolean): Array<Cell>;

    stage?: number;
    stageActions?: Array<() => boolean>;

    Evolve?(): void;
}