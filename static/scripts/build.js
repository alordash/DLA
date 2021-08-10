class Calc {
    static IsInside(x, y, a) {
        return a.length > 0 && 0 <= x && x < a.length && 0 <= y && y < a[0].length;
    }
    static IsPointInside(p, a) {
        return this.IsInside(p.x, p.y, a);
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
    Resize(width = this.width, height = this.height) {
        this.width = width;
        this.height = height;
        this.p5.resizeCanvas(this.width, this.height);
        this.p5.background(0);
        this.p5.fill(255);
        this.p5.stroke(0);
        this.p5.strokeWeight(2);
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
        UIControl.CreateOptions();
    }
    static UIUpdate() {
        let stageDiv = document.getElementById("StageDiv");
        stageDiv.innerHTML = `<b>Stage: ${fieldDisplay.stage}</b>`;
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
            }, Math.min(4000, Math.max(500, fieldDisplay.cells.length * fieldDisplay.cells[0].length / 2.178)));
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
    }
    static InitInputs() {
        document.getElementById("WidthInput").onchange = document.getElementById("HeightInput").onchange = document.getElementById("StepInput").onchange = ev => {
            UIControl.UpdateField();
        };
        document.getElementById("EvolveButton").onclick = () => { UIControl.UIEvolve(); };
        document.getElementById("ResetButton").onclick = ev => {
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
    static CreateOptions() {
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
    fieldDisplay = new FieldDisplay(canvasManager, w, h, step);
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
class Payload {
    constructor(isWall = true, isVisited = false) {
        this.isWall = isWall;
        this.isVisited = isVisited;
    }
    Copy() {
        return new Payload(this.isWall);
    }
    static get Default() {
        return this._Default.Copy();
    }
}
Payload._Default = new Payload(true);
class Cell {
    constructor(pos, payload = Payload.Default) {
        this.pos = pos;
        this.payload = payload;
    }
}
class Field {
    constructor(width, height, payload = undefined) {
        this.stage = 0;
        this.stageActions = [];
        this.cells = new Array();
        this.Resize(width, height, true, payload);
    }
    Resize(width = this._width, height = this._height, clear = false, filler = undefined) {
        this._width = width;
        this._height = height;
        let newCells = new Array(this._width);
        for (let x = 0; x < this._width; x++) {
            newCells[x] = new Array(this._height);
            for (let y = 0; y < this._height; y++) {
                if (!clear && Calc.IsInside(x, y, this.cells)) {
                    newCells[x][y] = this.cells[x][y];
                }
                else {
                    newCells[x][y] = new Cell(new Vec2(x, y));
                }
            }
        }
        this.cells = newCells;
    }
    get width() {
        return this._width;
    }
    set width(v) {
        this._width = v;
        this.Resize();
    }
    get height() {
        return this._height;
    }
    set height(v) {
        this._height = v;
        this.Resize();
    }
    Clear() {
        for (let x = 0; x < this._width; x++)
            for (let y = 0; y < this._height; y++)
                this.cells[x][y] = new Cell(new Vec2(x, y));
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
            if (!Calc.IsPointInside(newPoint, this.cells))
                continue;
            let cell = this.cells[newPoint.x][newPoint.y];
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
        for (let x = 1; x < this._width; x += 2) {
            for (let y = 1; y < this._height; y += 2) {
                let cell = this.cells[x][y];
                if (predicate(cell)) {
                    points.push(cell);
                }
            }
        }
        return points;
    }
    MarkCell(p, paylod) {
        this.cells[p.x][p.y].payload = paylod;
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
Field.DefaultPredicate = (cell) => { return cell.payload.isWall; };
class FieldDisplay extends Field {
    constructor(canvasManager, width = 0, height = 0, step = 1, payload = undefined) {
        super(width, height, payload);
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
    ResizeCanvas(width, height, step, clear = false, filler = undefined) {
        this.Resize(width, height, clear, filler);
        this._step = step;
        this.canvasManager.Resize(this.width * this._step, this.height * this._step);
        this.Display();
    }
    Palette(payload) {
        let p5 = this.canvasManager.p5;
        if (payload.isVisited) {
            p5.fill(0, 0, 255).stroke(0, 0, 255);
        }
        else {
            let v = payload.isWall ? 0 : 255;
            p5.fill(v).stroke(v);
        }
    }
    DrawCell(cell) {
        this.Palette(cell.payload);
        this.canvasManager.p5.rect(cell.pos.x * this._step, cell.pos.y * this._step, this._step, this._step);
    }
    MarkCell(p, paylod) {
        let cell = this.cells[p.x][p.y];
        cell.payload = paylod;
        this.DrawCell(cell);
    }
    Display() {
        for (let arr of this.cells) {
            for (let cell of arr) {
                this.DrawCell(cell);
            }
        }
    }
}
//# sourceMappingURL=build.js.map