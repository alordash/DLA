interface IField {
    readonly width: number;
    readonly height: number;

    cells: Array<Array<Cell>>;

    Resize(width: number, height: number, clear: boolean, filler: Payload): void;
    Clear(): void;

    //    optionalReset?(hard: boolean): void;
    MarkCell(p: Vec2, payload: Payload): void;
    GetAvailableNeighbours(p: Vec2, count: number, predicate: (cell: Cell) => boolean): Array<Cell>;
    GetAvailableCells(predicate: (cell: Cell) => boolean): Array<Cell>;

    stage?: number;
    stageActions?: Array<() => boolean>;
    
    Evolve?(): void;
}