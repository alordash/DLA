/// <reference path ="Geometry.ts"/>

abstract class World {
    static paramMark = '$';
    static MoveDirections = [new Vec2(1, 0), new Vec2(0, -1), new Vec2(-1, 0), new Vec2(0, 1)];
    static NeighboursLocs = [
        new Vec2(1, 0),
        new Vec2(1, -1),
        new Vec2(0, -1),
        new Vec2(-1, -1),
        new Vec2(-1, 0),
        new Vec2(-1, 1),
        new Vec2(0, 1),
        new Vec2(1, 1)
    ];

    static GetSpawn(w: number, h: number, step: number) {
        let x = Calc.Odd(Calc.IntRand(1, Math.floor(w / step) - 1));
        let y = Calc.Odd(Calc.IntRand(1, Math.floor(h / step) - 1));
        return new Vec2(x, y);
    }
}