const MIN_VALUE = 1;
const MAX_VALUE = 100;
const N = 50;
interface DrawInformation {
    canvas: HTMLCanvasElement;
    black: string;
    white: string;
    green: string;
    red: string;
    height: number;
    width: number;
    list: number[];
    blockWidth: number;
    blockHeight: number;
    array: number[];
    ctx: CanvasRenderingContext2D;
    columnColors: string[];
}
class DrawInformation implements DrawInformation {
    public black = `rgb(0,0,0)`;
    public white = `rgb(255,255,255)`;
    public green = `rgb(0,255,0)`;
    public red = `rgb(255,0,0)`;
    public columnColors = [`rgb(128, 128, 128)`, `rgb(192, 192, 192)`];
    constructor(
        width: number,
        height: number,
        canvas: HTMLCanvasElement,
        array: number[]
    ) {
        this.width = width;
        this.height = height;
        this.canvas = canvas;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d")!;
        this.setArray(array);
        this.calculatePixels();
    }
    public drawRect(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        color: string
    ) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x1, y1, x2, y2);
    }
    private calculatePixels() {
        this.blockWidth = Math.floor(this.width / this.array.length);
        this.blockHeight = Math.floor(this.height * 0.9);
    }
    public setArray(array: number[]) {
        this.array = array;
    }
    public resize(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.calculatePixels();
    }
}
const randomIntBetween = (minValue: number, maxValue: number): number => {
    return Math.floor(Math.random() * (maxValue - minValue + 1) + minValue);
};

const generateStartingList = (
    n: number,
    minValue: number,
    maxValue: number
): number[] => {
    const array: number[] = [];
    for (let i = 0; i < n; i++) {
        const value = randomIntBetween(minValue, maxValue);
        array.push(value);
    }
    return array;
};
function* bubbleSort(drawInfo: DrawInformation, ascending = true) {
    for (let i = 0; i < drawInfo.array.length - 1; i++) {
        for (let j = 0; j < drawInfo.array.length - 1 - i; j++) {
            const nextJ = j + 1;
            const number1 = drawInfo.array[j];
            const number2 = drawInfo.array[nextJ];
            if (
                (number1 > number2 && ascending) ||
                (number1 < number2 && !ascending)
            ) {
                drawInfo.array[nextJ] = number1;
                drawInfo.array[j] = number2;
                let colors: any = {};
                colors[j] = drawInfo.green;
                colors[nextJ] = drawInfo.red;
                drawList(drawInfo, colors, true);
                yield true;
            }
        }
    }
    return drawInfo.array;
}
function* insertionSort(drawInfo: DrawInformation, ascending = true) {
    for (let i = 1; i < drawInfo.array.length; i++) {
        let current = drawInfo.array[i];
        while (true) {
            const ascendingSort =
                i > 0 && drawInfo.array[i - 1] > current && ascending;
            const descendingSort =
                i > 0 && drawInfo.array[i - 1] < current && !ascending;
            if (!ascendingSort && !descendingSort) break;
            drawInfo.array[i] = drawInfo.array[i - 1];
            i -= 1;
            drawInfo.array[i] = current;
            let colors: any = {};
            colors[i - 1] = drawInfo.green;
            colors[i] = drawInfo.red;
            drawList(drawInfo, colors, true);
            yield true;
        }
    }
    return drawInfo.array;
}
const clear = (drawInfo: DrawInformation) => {
    drawInfo.drawRect(0, 0, drawInfo.width, drawInfo.height, drawInfo.white);
    // drawList(drawInfo);
};
const draw = (drawInfo: DrawInformation) => {
    clear(drawInfo);
    drawList(drawInfo);
};
const drawList = (
    drawInfo: DrawInformation,
    colors: any = {},
    clearBg = false
) => {
    if (clearBg) {
        clear(drawInfo);
    }
    for (let i = 0; i < drawInfo.array.length; i++) {
        const val = drawInfo.array[i] / MAX_VALUE;
        const x = i * drawInfo.blockWidth;
        const y = drawInfo.height - val * drawInfo.blockHeight;
        let color = drawInfo.columnColors[i % 2];
        if (colors[i.toString()]) {
            color = colors[i];
        }
        drawInfo.drawRect(
            x,
            y,
            drawInfo.blockWidth,
            drawInfo.blockHeight,
            color
        );
    }
};

const init = () => {
    const drawInfo = new DrawInformation(
        window.innerWidth,
        window.innerHeight,
        document.querySelector("#canvas")! as HTMLCanvasElement,
        generateStartingList(N, MIN_VALUE, MAX_VALUE)
    );
    const descendingElement = document.querySelector(
        ".descending"
    )! as HTMLSpanElement;
    const ascendingElement = document.querySelector(
        ".ascending"
    )! as HTMLSpanElement;
    const bubbleSortElement = document.querySelector(
        ".bubbleSort"
    )! as HTMLSpanElement;
    const insertionSortElement = document.querySelector(
        ".insertionSort"
    )! as HTMLSpanElement;
    let sorting = false;
    let ascending = true;
    ascendingElement.style.color = "green";
    bubbleSortElement.style.color = "green";

    let sortingAlgorithm = bubbleSort;
    let sortingAlgorithmGenerator: any = null;
    const handleKeyDown = (event: KeyboardEvent) => {
        const key = event.key;
        if (key === "r") {
            drawInfo.setArray(generateStartingList(N, MIN_VALUE, MAX_VALUE));
            sorting = false;
        } else if (key === " " && !sorting) {
            sorting = true;
            sortingAlgorithmGenerator = sortingAlgorithm(drawInfo, ascending);
        } else if (key === "a" && !sorting) {
            ascending = true;
            ascendingElement.style.color = "green";
            descendingElement.style.color = "black";
        } else if (key === "d" && !sorting) {
            ascending = false;
            ascendingElement.style.color = "black";
            descendingElement.style.color = "green";
        } else if (key === "b" && !sorting) {
            insertionSortElement.style.color = "black";
            bubbleSortElement.style.color = "green";
            sortingAlgorithm = bubbleSort;
        } else if (key === "i" && !sorting) {
            insertionSortElement.style.color = "green";
            bubbleSortElement.style.color = "black";
            sortingAlgorithm = insertionSort;
        }
    };
    const handleResize = () =>
        drawInfo.resize(window.innerWidth, window.innerHeight);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    const run = () => {
        if (sorting) {
            const result = sortingAlgorithmGenerator.next();
            if (result.done) {
                sorting = false;
            }
        } else {
            draw(drawInfo);
        }
        requestAnimationFrame(run);
    };
    run();
};

init();
