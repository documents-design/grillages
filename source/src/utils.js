/**
 * Generates a 2D array, initalizes it to black
 * @param {Number} x 
 * @param {Number} y 
 */
export const generateCloud = (x, y) => {
    const outArr = new Array(y);
    for (let yCord = 0; yCord < y; yCord++) {
        outArr[yCord] = new Array(x);
        for (let xCord = 0; xCord < x; xCord++) {
            outArr[yCord][xCord] = 0;
        }
    }
    return outArr;
};

/**
 * Returns positions to check
 * @param {Number} y 
 * @param {Number} x 
 * @param {Number} y0 
 * @param {Number} x0 
 * @return {Array<[Number, Number]>}
 */
export const getNeighbors = (y, x, y0, x0) => {
    const positions = [];
    if (y0 > 0) { positions.push([y0 - 1, x0]); }
    if (x0 > 0) { positions.push([y0 , x0 - 1]); }
    if (y0 < (y - 1)) { positions.push([y0 + 1, x0]); }
    if (x0 < (x - 1)) { positions.push([y0, x0 + 1]); }
    return positions;
};

/**
 * Returns positions to check
 * @param {Number} y 
 * @param {Number} x 
 * @param {Number} y0 
 * @param {Number} x0 
 * @return {Array<[Number, Number]>}
 */
export const getDiagonalNeighbors = (y, x, y0, x0) => {
    const positions = [];
    if (x0 > 0) {
        if (y0 > 0) {
            positions.push([y0 - 1, x0 - 1]);
        }
        if (y0 < ( y - 1)) {
            positions.push([y0 + 1, x0 - 1]);
        }
    }
    if (x0 < (x - 1)) {
        if (y0 > 0) {
            positions.push([y0 - 1, x0 + 1]);
        }
        if (y0 < (y - 1)) {
            positions.push([y0 + 1, x0 + 1]);
        }
    }
    return positions;
};

/**
 * Do we have neighbors ?
 * @param {Array<Array<Number>>} cloud 
 * @param {Array<[Number, Number>]} neighbors 
 */
export const hasCheckedNeighbors = (cloud, neighbors) => {
    return neighbors.map(n => cloud[n[0]][n[1]]).filter(cell => cell === 1).length > 0;
};

/**
 * 
 * @param {Array<Array<Number>>} cloud 
 * @param {Number} percent 
 * @param {Boolean} checkJuxtapositions
 * @param {Boolean} checkDiagonalJuxtapositions
 * @param {Number} juxtapositionsTolerance
 * @param {Number} diagonalJuxtapositionsTolerance
 */
export const randomizeCloud = (cloud, percent, checkJuxtapositions = false, checkDiagonalJuxtapositions = false, juxtapositionsTolerance = 0, diagonalJuxtapositionsTolerance = 0) => {
    const y = cloud.length;
    let x;
    let neighbors = [];
    for (let yCord = 0; yCord < y; yCord++) {
        x = cloud[yCord].length;
        for (let xCord = 0; xCord < x; xCord++) {
            if (!checkJuxtapositions && !checkDiagonalJuxtapositions) {
                cloud[yCord][xCord] = ((Math.random() * 100) > percent ? 0 : 1);
                continue;
            }
            if (checkJuxtapositions) {
                neighbors = getNeighbors(y, x, yCord, xCord);
                if (hasCheckedNeighbors(cloud, neighbors) && Math.random() * 100 > juxtapositionsTolerance) continue;
            }
            if (checkDiagonalJuxtapositions) {
                neighbors = getDiagonalNeighbors(y, x, yCord, xCord);
                if (hasCheckedNeighbors(cloud, neighbors) && Math.random() * 100 > diagonalJuxtapositionsTolerance) continue;
            }
            cloud[yCord][xCord] = ((Math.random() * 100) > percent ? 0 : 1);
        }
    }
    return cloud;
};

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Array<Array<Number>>} cloud 
 * @param {Number} w
 * @param {Number} h
 * @param {Number} multiplier 1
 */
export const drawCloudPoint = (ctx, cloud, w, h, multiplier = 1, color = 'black') => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, w * multiplier, h * multiplier);
    ctx.fillStyle = color;
    const y = cloud.length;
    for (let yCord = 0; yCord < y; yCord++) {
        const x = cloud[yCord].length;
        for (let xCord = 0; xCord < x; xCord++) {
            if (cloud[yCord][xCord] === 1) {
                ctx.fillRect(xCord * multiplier, yCord * multiplier, 1 * multiplier, 1 * multiplier);
            } 
        }
    }
};

/**
 * Removes the pound of hex colors
 * @param {String} str 
 * @returns {String}
 */
const unsharp = str => str.replace('#', '');

/**
 * Makes a totally-descriptive filename
 * @param {*} options 
 * @param {String} extension 
 */
export const makeFilename = ({
    divH = 30,
    divV = 30,
    color = '#000000',
    percent = 50,
    multiplier = 1,
    index = 0}, extension) => {
    return `${divH * multiplier}-x-${divV * multiplier}-${unsharp(color)}-${percent}p100-${index}.${extension}`;
};

/**
 *  Triggers download of a PNG render
 * @param {HTMLCanvasElement} canvas 
 * @param {Document} document
 * @param {*} param1 
 */
export const downloadPNG = (canvas, document, options) => {
        const dUrl = canvas.toDataURL();
        const link = document.createElement('a');
        link.href = dUrl;
        link.download = makeFilename(options, 'png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

/**
 * Returns a string of <rect/> svg elements
 * @param {Array<Array<Number>>} cloud 
 * @param {Number} multiplier 
 * @param {String} color 
 */
export const cloudPointsToRects = (cloud, multiplier, color) => {
    const rects = [];
    const y = cloud.length;
    for (let yCord = 0; yCord < y; yCord++) {
        const x = cloud[yCord].length;
        for (let xCord = 0; xCord < x; xCord++) {
            if (cloud[yCord][xCord] === 1) {
                rects.push(`<rect x="${xCord * multiplier}" y="${yCord * multiplier}" width="${1 * multiplier}" height="${1 * multiplier}" fill="${color}"/>`);
            }
        }
    }
    return rects.join('');
};

/**
 * Returns a svg document with the illustration
 * @param {Array<Array<Number>>} cloud 
 * @param {*} options 
 */
export const cloudToSVG = (cloud, {
    divH = 30,
    divV = 30,
    color = '#000000',
    multiplier = 1,
}) => {
    return `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" width="${divH * multiplier}" height="${divV * multiplier}" viewBox="0 0 ${divH * multiplier} ${divV * multiplier}">
    <rect  width="${divH * multiplier}" height="${divV * multiplier}" fill="#ffffff"/>
    ${cloudPointsToRects(cloud, multiplier, color)}
</svg>`;
};

/**
 * Triggers download of a SVG Render
 * @param {Array<Array<Number>>} cloud
 * @param {Document} document 
 * @param {*} options 
 */
export const downloadSVG = (cloud, document, options) => {
    const link = document.createElement('a');
    const svg = cloudToSVG(cloud, options);
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(svg);
    link.download = makeFilename(options, 'svg');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Returns the computed percentage of colored cells
 * @param {Array<Array<Number>>} cloud 
 */
export const computedPercentage = (cloud) => {
    let total = 0;
    const count = cloud.reduce((sum, row) => {
        total += row.length;
        return sum + row.reduce((line, cell) => {
            return line + cell;
        }, 0);
    }, 0);
    return ((count / total) * 100).toFixed(2);
};