/// <reference path ="../Geometry.ts" />

class Cell {
    pos: Vec2;
    payload: Payload;

    constructor(pos: Vec2, payload: Payload = Payload.Default) {
        this.pos = pos;
        this.payload = payload;
    }
}