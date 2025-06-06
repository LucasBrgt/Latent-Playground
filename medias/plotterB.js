autowatch = 1;
mgraphics.init();
mgraphics.relative_coords = 1;
mgraphics.autofill = 0;

inlets = 2; // 1 pour les commandes, 2 pour [x, y]
outlets = 1; // Renvoie l'ID du point le plus proche

var points = {};
var pointColors = {};
var pointSizes = {};
var defaultColor = [0.118, 0.757, 1., 1.];
var defaultSize = 0.7;
var _xmin = 0, _xmax = 1, _ymin = 0, _ymax = 1;
var _bgcolor = [0, 0, 0, 0];
var _render_scale = 0.9;
var _detection_margin = 0.03;

render_scale(_render_scale);

function render_scale(factor) {
    _render_scale = factor;
    half_range = 0.5 / _render_scale;
    _xmin = 0.5 - half_range;
    _xmax = 0.5 + half_range;
    _ymin = 0.5 - half_range;
    _ymax = 0.5 + half_range;
    mgraphics.redraw();
}

function paint() {
    mgraphics.set_source_rgba(_bgcolor);
    mgraphics.rectangle(-1, 1, 2, 2);
    mgraphics.fill();

    for (var id in points) {
        var pt = points[id];
        var size = pointSizes[id] || defaultSize;
        var color = pointColors[id] || defaultColor;

        var psize = size * 0.075;
        var cx = scale(pt.x, _xmin, _xmax, -1, 1);
        var cy = scale(pt.y, _ymin, _ymax, -1, 1);

        mgraphics.set_source_rgba(color);
        mgraphics.arc(cx, cy, psize, 0, 2 * Math.PI);
        mgraphics.fill();
    }
}

// Inlet 1: coordonnées [x, y] (normalisées 0-1)
function list() {
    if (inlet !== 1) return;

    var args = arrayfromargs(arguments);
    if (args.length < 2) return;

    var rx = args[0];
    var ry = args[1];

    var closest_id = null;
    var closest_dist = Infinity;

    for (var id in points) {
        var pt = points[id];
        var dx = pt.x - rx;
        var dy = pt.y - ry;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < _detection_margin && dist < closest_dist) {
            closest_dist = dist;
            closest_id = id;
        }
    }

    if (closest_id !== null) {
        outlet(0, closest_id);
    }
}

function set() {
    var args = arrayfromargs(arguments);
    if (args.length < 3) return;

    var id = args[0];
    var x = args[1];
    var y = args[2];
    var size = args.length >= 4 ? args[3] : defaultSize;
    var color = args.length >= 8 ? args.slice(4, 8) : defaultColor;

    points[id] = { x: x, y: y };
    pointSizes[id] = size;
    pointColors[id] = color;
    mgraphics.redraw();
}

function remove(id) {
    delete points[id];
    delete pointSizes[id];
    delete pointColors[id];
    mgraphics.redraw();
}

function clear() {
    points = {};
    pointSizes = {};
    pointColors = {};
    mgraphics.redraw();
}

function scale(v, inMin, inMax, outMin, outMax) {
    return ((v - inMin) / (inMin === inMax ? 1 : inMax - inMin)) * (outMax - outMin) + outMin;
}

function bgcolor(r, g, b, a) {
    _bgcolor = [r, g, b, a];
    mgraphics.redraw();
}
