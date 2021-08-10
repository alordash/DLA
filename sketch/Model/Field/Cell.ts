/// <reference path ="../Geometry.ts" />

enum States {
    empty,
    particle,
    frozen
}

class Cell {
    pos: Vec2;
    state: States;

    constructor(pos: Vec2, state: States = States.empty) {
        this.pos = pos;
        this.state = state;
    }
}