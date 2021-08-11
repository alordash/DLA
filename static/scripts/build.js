class Calc {
    static IsInside(_x, _y, w = 0, h = 0) {
        let p;
        let size;
        if (_x instanceof Vec2) {
            p = _x;
            size = _y;
        }
        else {
            p = new Vec2(_x, _y);
            size = new Vec2(w, h);
        }
        return 0 <= p.x && p.x < size.x && 0 <= p.y && p.y < size.y;
    }
    static Random(min, max) {
        if (min > max) {
            [min, max] = [max, min];
        }
        return Math.random() * (max - min) + min;
    }
    static IntRand(min, max) {
        return Math.round(Calc.Random(min, max));
    }
    static Shuffle(a) {
        let m = a.length, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            [a[m], a[i]] = [a[i], a[m]];
        }
    }
    static Odd(v) {
        if ((v & 0b1) == 0) {
            if (v <= 0) {
                return ++v;
            }
            return --v;
        }
        return v;
    }
    static toVec2(_x, _y) {
        if (_x instanceof Vec2) {
            return _x;
        }
        else {
            return new Vec2(_x, _y);
        }
    }
    static RandomPoint(size) {
        return new Vec2(Calc.IntRand(0, size.x - 1), Calc.IntRand(0, size.y - 1));
    }
}
Array.prototype.popRandom = function () {
    let i = Calc.IntRand(0, this.length - 1);
    let v = this[i];
    this.splice(i, 1);
    return v;
};
class CanvasManager {
    constructor(width, height, p5) {
        this.width = width;
        this.height = height;
        this.p5 = p5;
    }
    Clear() {
        this.p5.background(0);
        this.p5.fill(255);
        this.p5.stroke(0);
        this.p5.strokeWeight(2);
    }
    Resize(width = this.width, height = this.height) {
        this.width = width;
        this.height = height;
        this.p5.resizeCanvas(this.width, this.height);
        this.Clear();
    }
}
let playTimer;
let playing = false;
let playStep = 50;
let speed = parseInt(document.getElementById('speedrange').value);
let speedDivision = 20;
class UIControl {
    static Init() {
        UIControl.InitInputs();
        UIControl.InitTimeRange();
    }
    static UIUpdate() {
        fieldDisplay.Display();
    }
    static UIEvolve(update = true) {
        let stageDiv = document.getElementById("StageDiv");
        let res = false;
        if (fieldDisplay.Evolve()) {
            clearInterval(playTimer);
            stageDiv.style.background = `#1dd12c`;
            setTimeout(() => {
                stageDiv.style.background = ``;
                if (playing) {
                    UIControl.TimeRangeClick();
                    UIControl.TimeRangeClick();
                }
            }, Math.min(4000, Math.max(500, fieldDisplay.size.x * fieldDisplay.size.y / 2.178)));
            res = true;
        }
        if (update) {
            UIControl.UIUpdate();
        }
        return res;
    }
    static UpdateField() {
        let width = parseInt(document.getElementById("WidthInput").value);
        let height = parseInt(document.getElementById("HeightInput").value);
        let step = parseInt(document.getElementById("StepInput").value);
        fieldDisplay.ResizeCanvas(width, height, step);
        fieldDisplay.Fill();
        fieldDisplay.Display();
    }
    static InitInputs() {
        document.getElementById("WidthInput").onchange = document.getElementById("HeightInput").onchange = document.getElementById("StepInput").onchange = ev => {
            UIControl.UpdateField();
        };
        document.getElementById("EvolveButton").onclick = () => { UIControl.UIEvolve(); };
        document.getElementById("ResetButton").onclick = ev => {
            fieldDisplay.Fill(true);
            fieldDisplay.Display();
        };
    }
    static InitTimeRange() {
        let timeCheckbox = document.getElementById('TimeCheckbox');
        let speedDiv = document.getElementById('timediv');
        let speedRange = document.getElementById('speedrange');
        timeCheckbox.onchange = () => {
            speedDiv.style.visibility = timeCheckbox.checked ? '' : 'hidden';
        };
        speedRange.onchange = UIControl.SpeedChange;
        speedRange.onmousemove = (e) => {
            if (e.buttons) {
                UIControl.SpeedChange();
            }
        };
        let playButton = document.getElementById('PlayButton');
        playButton.onclick = UIControl.TimeRangeClick;
    }
    static IdFormat(s) {
        return `${s}range`;
    }
    static NameFormat(s) {
        let letters = s.match(/[A-Z]/g);
        let parts = s.split(/[A-Z]/g);
        parts[0] = parts[0][0].toUpperCase() + parts[0].substring(1);
        for (let i = 1; i < parts.length; i++) {
            parts[i] = letters[i - 1].toLowerCase() + parts[i];
        }
        return parts.join(' ');
    }
    static CreateNumberParameter(fieldDisplay, key) {
        const params = document.getElementById('Params');
        params.appendChild(document.createElement('br'));
        params.appendChild(document.createTextNode(`${UIControl.NameFormat(key.substring(1))} `));
        let range = document.createElement("input");
        range.id = UIControl.IdFormat(key.substring(1));
        range.type = 'text';
        range.className = 'textInput';
        range.value = fieldDisplay[key].toString();
        range.onchange = () => {
            fieldDisplay[key] = +range.value;
        };
        range.onmousemove = (e) => {
            if (e.buttons) {
                fieldDisplay[key] = +range.value;
            }
        };
        params.appendChild(range);
    }
    static CreateParametersPanel(fieldDisplay) {
        let ranges = Array.from(document.getElementById('Params').childNodes.values()).filter(x => {
            return x.className == 'rangeParam';
        });
        for (let range of ranges) {
            range.remove();
        }
        document.getElementById('Params').innerHTML = `<b>Parameters</b>`;
        for (let [key, value] of Object.entries(fieldDisplay)) {
            if (key[0] == World.paramMark) {
                UIControl.CreateNumberParameter(fieldDisplay, key);
            }
        }
    }
}
UIControl.TimeRangeClick = () => {
    let playButton = document.getElementById('PlayButton');
    playing = !playing;
    if (playing) {
        playButton.style.backgroundColor = "#d0451b";
        playButton.textContent = "Stop";
        let fps = Math.min(speed, speedDivision);
        playTimer = setInterval(() => {
            let end = Math.max(1, speed - speedDivision);
            for (let i = 0; i < end; i++) {
                if (UIControl.UIEvolve(i == (end - 1))) {
                    UIControl.UIUpdate();
                    return;
                }
            }
        }, 1000 / fps);
    }
    else {
        playButton.style.backgroundColor = "#32d01b";
        playButton.textContent = "Play";
        clearInterval(playTimer);
    }
};
UIControl.SpeedChange = () => {
    speed = +document.getElementById('speedrange').value;
    document.getElementById("speeddiv").innerHTML = `Speed: ${speed}`;
    if (playing) {
        UIControl.TimeRangeClick();
        UIControl.TimeRangeClick();
    }
};
let canvasManager;
let fieldDisplay;
var p5Sketch = (_p) => {
    _p.setup = () => {
        let canvasElement = _p.createCanvas(parseInt(document.getElementById("WidthInput").value), parseInt(document.getElementById("HeightInput").value));
        let htmlElement = canvasElement.elt;
        document.getElementById('Editor').appendChild(htmlElement);
        _p.fill(255);
        _p.stroke(0);
        _p.strokeWeight(2);
    };
};
let _p = new p5(p5Sketch);
function main() {
    const w = parseInt(document.getElementById("WidthInput").value);
    const h = parseInt(document.getElementById("HeightInput").value);
    const step = parseInt(document.getElementById("StepInput").value);
    canvasManager = new CanvasManager(w, h, _p);
    fieldDisplay = new DLA(canvasManager, w, h, step);
    UIControl.UpdateField();
    fieldDisplay.Display();
    console.log('main done');
    UIControl.Init();
    UIControl.CreateParametersPanel(fieldDisplay);
}
setTimeout(main, 10);
class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    Sum(p) {
        return new Vec2(this.x + p.x, this.y + p.y);
    }
    Mul(k) {
        return new Vec2(this.x * k, this.y * k);
    }
}
class World {
    static GetSpawn(w, h, step) {
        let x = Calc.Odd(Calc.IntRand(1, Math.floor(w / step) - 1));
        let y = Calc.Odd(Calc.IntRand(1, Math.floor(h / step) - 1));
        return new Vec2(x, y);
    }
}
World.paramMark = '$';
World.MoveDirections = [new Vec2(1, 0), new Vec2(0, -1), new Vec2(-1, 0), new Vec2(0, 1)];
World.NeighboursLocs = [
    new Vec2(1, 0),
    new Vec2(1, -1),
    new Vec2(0, -1),
    new Vec2(-1, -1),
    new Vec2(-1, 0),
    new Vec2(-1, 1),
    new Vec2(0, 1),
    new Vec2(1, 1)
];
var States;
(function (States) {
    States[States["empty"] = 0] = "empty";
    States[States["particle"] = 1] = "particle";
    States[States["frozen"] = 2] = "frozen";
})(States || (States = {}));
class Cell {
    constructor(pos, state = States.empty) {
        this.pos = pos;
        this.state = state;
    }
}
class Field {
    constructor(width, height) {
        this.stage = 0;
        this.stageActions = [];
        this.size = new Vec2(width, height);
        this.grid = new Array();
        this.cells = new Array();
    }
    getCell(_x, _y) {
        const p = Calc.toVec2(_x, _y);
        if (this.grid[p.x] == undefined)
            return undefined;
        return this.grid[p.x][p.y];
    }
    setCell(state_cell, _x, _y) {
        if (state_cell instanceof Cell) {
            const p = state_cell.pos;
            if (this.grid[p.x] == undefined)
                this.grid[p.x] = new Array();
            this.grid[p.x][p.y] = state_cell;
            return state_cell;
        }
        const state = state_cell;
        const p = Calc.toVec2(_x, _y);
        if (this.grid[p.x] == undefined) {
            this.grid[p.x] = new Array();
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
    Clear() {
        this.cells = new Array();
        this.grid = new Array();
    }
    GetAvailableNeighbours(p, count = -1, predicate = Field.DefaultPredicate) {
        let points = new Array();
        let order = new Array(World.MoveDirections.length);
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
        let points = new Array();
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
    MarkCell(p, state) {
        if (this.grid[p.x] == undefined)
            this.grid[p.x] = new Array();
        this.grid[p.x][p.y].state = state;
    }
    Evolve() {
        if (this.stage >= this.stageActions.length) {
            console.log('Done evolving');
        }
        else {
            while (this.stageActions[this.stage]()) {
                if (this.stage == this.stageActions.length) {
                    return true;
                }
            }
        }
        return false;
    }
}
Field.DefaultPredicate = (cell) => { return cell.state == States.empty; };
class FieldDisplay extends Field {
    constructor(canvasManager, width = 0, height = 0, step = 1) {
        super(width, height);
        this.canvasManager = canvasManager;
        this._step = step;
    }
    get step() {
        return this._step;
    }
    set step(v) {
        this._step = v;
        this.canvasManager.Resize();
    }
    Quantiz(v) {
        let q = Math.round(v / this._step);
        return Calc.Odd(q);
    }
    ResizeCanvas(width, height, step) {
        this.size.x = width;
        this.size.y = height;
        this._step = step;
        this.canvasManager.Resize(this.size.x * this._step, this.size.y * this._step);
    }
    Palette(state) {
        let p5 = this.canvasManager.p5;
        let v;
        switch (state) {
            case States.empty:
                v = 0;
                p5.fill(v).stroke(v);
                break;
            case States.frozen:
                p5.fill(0, 0, 255).stroke(0, 0, 255);
                break;
            case States.particle:
                v = 255;
                p5.fill(v).stroke(v);
                break;
            default:
                break;
        }
    }
    DrawCell(state_cell, _x, _y) {
        let p;
        let state;
        if (state_cell instanceof Cell) {
            p = state_cell.pos;
            state = state_cell.state;
        }
        else {
            p = Calc.toVec2(_x, _y);
            state = state_cell;
        }
        this.Palette(state);
        this.canvasManager.p5.rect(p.x * this._step + 1, p.y * this._step + 1, this._step - 1, this._step - 1);
    }
    MarkCell(p, state) {
        let cell = this.getCell(p);
        cell.state = state;
        this.DrawCell(cell);
    }
    Display() {
        for (let cell of this.cells) {
            this.DrawCell(cell);
        }
    }
}
class DLA extends FieldDisplay {
    constructor(canvasManager, width = 0, height = 0, step = 1) {
        super(canvasManager, width, height, step);
        this.$fillment = 10;
        this.stageActions = [
            () => {
                for (let i = 0; i < this.particles.length; i++) {
                    let p = this.particles[i];
                    if (!Calc.IsInside(p.pos, this.size)) {
                        p.pos = Calc.RandomPoint(this.size);
                        continue;
                    }
                    let moves = World.MoveDirections.slice();
                    Calc.Shuffle(moves);
                    let skip = false;
                    for (let move of moves) {
                        let _p = p.pos.Sum(move);
                        if (!Calc.IsInside(_p, this.size))
                            continue;
                        let cell = this.getCell(_p);
                        if (cell == undefined)
                            continue;
                        if (cell.state == States.frozen) {
                            p.state = States.frozen;
                            skip = true;
                            break;
                        }
                    }
                    if (skip) {
                        this.particles.splice(i, 1);
                        i--;
                        this.setCell(p);
                        continue;
                    }
                    let move = moves.popRandom();
                    let _p = p.pos.Sum(move);
                    if (!Calc.IsInside(_p, this.size)) {
                        continue;
                    }
                    this.DrawCell(States.empty, p.pos);
                    p.pos = _p;
                }
                return false;
            }
        ];
        this.particles = new Array();
        this.Fill();
    }
    Fill(clear = false) {
        if (clear) {
            for (let cell of this.particles)
                cell.state = States.empty;
            this.particles = new Array();
        }
        let chance = this.$fillment / 100;
        let max = this.size.x * this.size.y * chance;
        const dif = this.particles.length - max;
        for (let i = 0; i < dif; i++) {
            let index = Calc.IntRand(0, this.particles.length - 1);
            let cell = this.particles.splice(index, 1)[0];
            cell.state = States.empty;
        }
        let end = false;
        for (let x = 0; !end && x < this.size.x; x++)
            for (let y = 0; y < this.size.y; y++) {
                if (Math.random() > chance) {
                    continue;
                }
                this.particles.push(new Cell(new Vec2(x, y), States.particle));
                if (this.particles.length >= max) {
                    end = true;
                    break;
                }
            }
        this.cells.push(...this.particles);
    }
}
//# sourceMappingURL=build.js.map