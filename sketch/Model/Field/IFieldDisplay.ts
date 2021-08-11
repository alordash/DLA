interface IFieldDisplay extends IField {
    canvasManager: CanvasManager;
    readonly step: number;
    Quantiz(v: number): number;

    ResizeCanvas(width: number, height: number, step: number, clear: boolean): void;

    Palette(state: States): void;
    DrawCell(state_cell: States | Cell, _x: number | Vec2, _y?: number): void;
    MarkCell(p: Vec2, state: States): void;
    Display(): void;
}