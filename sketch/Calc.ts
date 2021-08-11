abstract class Calc {
    static IsInside(_x: number | Vec2, _y: number | Vec2, w: number = 0, h: number = 0) {
        let p: Vec2;
        let size: Vec2;
        if(_x instanceof Vec2) {
            p = _x;
            size = <Vec2>_y;
        } else {
            p = new Vec2(_x, <number>_y);
            size = new Vec2(w, h);
        }
        return 0 <= p.x && p.x < size.x && 0 <= p.y && p.y < size.y;
    }

    static Random(min: number, max: number) {
        if (min > max) {
            [min, max] = [max, min];
        }
        return Math.random() * (max - min) + min;
    }

    static IntRand(min: number, max: number) {
        return Math.round(Calc.Random(min, max));
    }

    static Shuffle<T>(a: Array<T>) {
        let m = a.length, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            [a[m], a[i]] = [a[i], a[m]];
        }
    }

    static Odd(v: number) {
        if ((v & 0b1) == 0) {
            if (v <= 0) {
                return ++v;
            }
            return --v;
        }
        return v;
    }

    static toVec2(_x: number | Vec2, _y?: number) {
        if (_x instanceof Vec2) {
            return _x;
        } else {
            return new Vec2(_x, _y);
        }
    }

    static RandomPoint(size: Vec2) {
        return new Vec2(Calc.IntRand(0, size.x - 1), Calc.IntRand(0, size.y - 1));
    }
}

interface Array<T> {
    popRandom(): T;
}

Array.prototype.popRandom = function () {
    let i = Calc.IntRand(0, this.length - 1);
    let v = this[i];
    this.splice(i, 1);
    return v;
}