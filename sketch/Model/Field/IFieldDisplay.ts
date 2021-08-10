interface IFieldDisplay extends IField {
    canvasManager: CanvasManager;
    readonly step: number;
    Quantiz(v: number): number;

    ResizeCanvas(width: number, height: number, step: number, clear: boolean, filler: Payload): void;

    Palette(payload: Payload): void;
    DrawCell(cell: Cell): void;
    MarkCell(p: Vec2, payload: Payload): void;
    Display(): void;
}