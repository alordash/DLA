let playTimer: NodeJS.Timer;
let playing = false;
let playStep = 50;

let speed = parseInt((<HTMLInputElement>document.getElementById('speedrange')).value);
let speedDivision = 20;

abstract class UIControl {
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
        let width = parseInt((<HTMLInputElement>document.getElementById("WidthInput")).value);
        let height = parseInt((<HTMLInputElement>document.getElementById("HeightInput")).value);
        let step = parseInt((<HTMLInputElement>document.getElementById("StepInput")).value);
        fieldDisplay.ResizeCanvas(width, height, step);
        (<DLA>fieldDisplay).Fill();
        fieldDisplay.Display();
    }

    static InitInputs() {
        document.getElementById("WidthInput").onchange = document.getElementById("HeightInput").onchange = document.getElementById("StepInput").onchange = ev => {
            UIControl.UpdateField();
        };

        document.getElementById("EvolveButton").onclick = () => { UIControl.UIEvolve(); };

        document.getElementById("ResetButton").onclick = ev => {
            fieldDisplay.Clear();
            fieldDisplay.canvasManager.Clear();
            (<DLA>fieldDisplay).Fill(true);
            fieldDisplay.Display();
        };

        document.getElementById("defaultCanvas0").onclick = ev => {
            let x = fieldDisplay.Quantiz(ev.offsetX);
            let y = fieldDisplay.Quantiz(ev.offsetY);
            fieldDisplay.setCell(States.frozen, x, y);
            console.log(`Created frozen point at ${x}, ${y}`);
            fieldDisplay.Display();
        }
    }

    static TimeRangeClick = () => {
        let playButton = <HTMLInputElement>document.getElementById('PlayButton');
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
        } else {
            playButton.style.backgroundColor = "#32d01b";
            playButton.textContent = "Play";
            clearInterval(playTimer);
        }
    }

    static SpeedChange = () => {
        speed = +(<HTMLInputElement>document.getElementById('speedrange')).value;
        document.getElementById("speeddiv").innerHTML = `Speed: ${speed}`;
        if (playing) {
            UIControl.TimeRangeClick();
            UIControl.TimeRangeClick();
        }
    }

    static InitTimeRange() {
        let timeCheckbox = <HTMLInputElement>document.getElementById('TimeCheckbox');
        let speedDiv = document.getElementById('timediv');
        let speedRange = <HTMLInputElement>document.getElementById('speedrange');
        timeCheckbox.onchange = () => {
            speedDiv.style.visibility = timeCheckbox.checked ? '' : 'hidden';
        }
        speedRange.onchange = UIControl.SpeedChange;
        speedRange.onmousemove = (e) => {
            if (e.buttons) {
                UIControl.SpeedChange();
            }
        }

        let playButton = <HTMLInputElement>document.getElementById('PlayButton');
        playButton.onclick = UIControl.TimeRangeClick;
    }

    static IdFormat(s: string) {
        return `${s}range`;
    }

    static NameFormat(s: string) {
        let letters = s.match(/[A-Z]/g);
        let parts = s.split(/[A-Z]/g);
        parts[0] = parts[0][0].toUpperCase() + parts[0].substring(1);
        for (let i = 1; i < parts.length; i++) {
            parts[i] = letters[i - 1].toLowerCase() + parts[i];
        }
        return parts.join(' ');
    }

    static CreateNumberParameter(fieldDisplay: FieldDisplay, key: string) {
        const params = document.getElementById('Params');

        params.appendChild(document.createElement('br'));
        params.appendChild(document.createTextNode(`${UIControl.NameFormat(key.substring(1))} `));

        let range = document.createElement("input");
        range.id = UIControl.IdFormat(key.substring(1));
        range.type = 'text';
        range.className = 'textInput';
        range.value = (<any>fieldDisplay)[key].toString();

        range.onchange = () => {
            (<any>fieldDisplay)[key] = +range.value;
        }
        range.onmousemove = (e) => {
            if (e.buttons) {
                (<any>fieldDisplay)[key] = +range.value;
            }
        }
        params.appendChild(range);
    }

    static CreateParametersPanel(fieldDisplay: FieldDisplay) {
        let ranges = Array.from(document.getElementById('Params').childNodes.values()).filter(x => {
            return (<HTMLElement>x).className == 'rangeParam';
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