// Catch query values passed from input HTML.
const params = new URLSearchParams(window.location.search);
const ax = parseFloat(params.get("ax"));
const ay = parseFloat(params.get("ay"));
const bx = parseFloat(params.get("bx"));
const by = parseFloat(params.get("by"));
const cx = parseFloat(params.get("cx"));
const cy = parseFloat(params.get("cy"));

document.getElementById("coords").textContent =
    `Points Draws: A(${ax}, ${ay}), B(${bx}, ${by}), C(${cx}, ${cy})`;

const canvas = document.getElementById("triangleCanvas");
const ctx = canvas.getContext("2d");
const scale = 40;

// Compute centroid for centering the triangle in the middle of the canvas
const centerX = (ax + bx + cx) / 3;
const centerY = (ay + by + cy) / 3;

function toCanvasX(x) { return canvas.width / 2 + (x - centerX) * scale; }
function toCanvasY(y) { return canvas.height / 2 - (y - centerY) * scale; }

// Draw triangle
ctx.beginPath();
ctx.moveTo(toCanvasX(ax), toCanvasY(ay));
ctx.lineTo(toCanvasX(bx), toCanvasY(by));
ctx.lineTo(toCanvasX(cx), toCanvasY(cy));
ctx.closePath();
ctx.strokeStyle = "blue";
ctx.lineWidth = 2;
ctx.stroke();
ctx.fillStyle = "rgba(0, 150, 255, 0.3)";
ctx.fill();


function drawPoint(px, py, label, dx = 1, dy = -1, offset = 15) {
    const cxPos = toCanvasX(px);
    const cyPos = toCanvasY(py);
    // Draw point
    ctx.beginPath();
    ctx.arc(cxPos, cyPos, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    // Draw label outside the triangle
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(label, cxPos + dx * offset, cyPos + dy * offset);
}

// Adjust label positions for clarity
drawPoint(ax, ay, "A", -1, -1); // top-left offset
drawPoint(bx, by, "B", 1, -1);  // top-right offset
drawPoint(cx, cy, "C", 1, 1);   // bottom-right offset

function drawAngleArc(px, py, p1x, p1y, p2x, p2y, radius = 25) {
    const cx = toCanvasX(px);
    const cy = toCanvasY(py);

    const v1x = p1x - px, v1y = p1y - py;
    const v2x = p2x - px, v2y = p2y - py;

    let a1 = Math.atan2(-v1y, v1x);
    let a2 = Math.atan2(-v2y, v2x);

    let diff = a2 - a1;
    if (diff < 0) diff += 2 * Math.PI;
    if (diff > Math.PI) {
        [a1, a2] = [a2, a1];
        diff = 2 * Math.PI - diff;
    }

    ctx.beginPath();
    ctx.arc(cx, cy, radius, a1, a2);
    ctx.strokeStyle = "darkgreen";
    ctx.lineWidth = 2;
    ctx.stroke();
}

drawAngleArc(ax, ay, bx, by, cx, cy);
drawAngleArc(bx, by, ax, ay, cx, cy);
drawAngleArc(cx, cy, ax, ay, bx, by);

// Calculate angle values using the Cosine Rule
function distance(x1, y1, x2, y2) { return Math.hypot(x2 - x1, y2 - y1); }

function calcAngle(a, b, c) {
    const ab = distance(a.x, a.y, b.x, b.y);
    const bc = distance(b.x, b.y, c.x, c.y);
    const ac = distance(a.x, a.y, c.x, c.y);
    return Math.acos((ab**2 + bc**2 - ac**2) / (2 * ab * bc));
}

const angleA = calcAngle({x:bx,y:by}, {x:ax,y:ay}, {x:cx,y:cy});
const angleB = calcAngle({x:ax,y:ay}, {x:bx,y:by}, {x:cx,y:cy});
const angleC = calcAngle({x:ax,y:ay}, {x:cx,y:cy}, {x:bx,y:by});

// Draw angle values outside vertices
function drawAngleOutside(px, py, angleRad, offset = 25, dx = 1, dy = -1) {
    const textX = px + dx * offset / scale;
    const textY = py + dy * offset / scale;
    ctx.font = "16px Arial";
    ctx.fillStyle = "darkgreen";
    ctx.fillText((angleRad * 180 / Math.PI).toFixed(1) + "°", toCanvasX(textX), toCanvasY(textY));
}

drawAngleOutside(ax, ay, angleA, 25, -1, -1);
drawAngleOutside(bx, by, angleB, 25, 1, -1);
drawAngleOutside(cx, cy, angleC, 25, 1, 1);
