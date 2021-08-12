/// <reference path="CanvasManager.ts" />
/// <reference path="UIControl.ts" />

let canvasManager: CanvasManager;
let fieldDisplay: FieldDisplay;

var p5Sketch = (_p: p5) => {
    _p.setup = () => {
        let canvasElement = _p.createCanvas(parseInt((<HTMLInputElement>document.getElementById("WidthInput")).value), parseInt((<HTMLInputElement>document.getElementById("HeightInput")).value));
        let htmlElement = <HTMLElement>canvasElement.elt;
        document.getElementById('Editor').appendChild(htmlElement);
        _p.fill(255);
        _p.stroke(0);
        _p.strokeWeight(0);
    };
};

let _p = new p5(p5Sketch);

function main() {
    const w = parseInt((<HTMLInputElement>document.getElementById("WidthInput")).value);
    const h = parseInt((<HTMLInputElement>document.getElementById("HeightInput")).value);
    const step = parseInt((<HTMLInputElement>document.getElementById("StepInput")).value);
    canvasManager = new CanvasManager(w, h, _p);

    fieldDisplay = new DLA(canvasManager, w, h, step);
    UIControl.UpdateField();
    fieldDisplay.Display();
    console.log('main done');

    UIControl.Init();
    UIControl.CreateParametersPanel(fieldDisplay);
}

setTimeout(main, 10);