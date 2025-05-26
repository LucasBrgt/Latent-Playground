inlets = 1;
outlets = 1;

var states = [0, 0, 0, 0];
var prevStates = [0, 0, 0, 0];
var names = ["MOD", "CONTROL", "BEND", "PRESET"];
var refSizes = {};
var refY = {};
var coreRight = 0;
var lastStates = [0, 0, 0, 0];


function bang() {
	init();
}

function findInParents(name) {
	var p = this.patcher;
	while (p) {
		try {
			var box = p.getnamed(name);
			if (box) return box;
		} catch (e) {}
		p = p.parentpatcher;
	}
	post("Warning: '" + name + "' not found\n");
	return null;
}

function init() {
	var core = findInParents("CORE");
	if (core) {
		var r = core.presentation_rect || core.rect;
		coreRight = r[2];
	}

	for (var i = 0; i < names.length; i++) {
		var name = names[i];
		var box = findInParents(name);
		if (box) {
			var r2 = box.presentation_rect || box.rect;
			refSizes[name] = [r2[2] - r2[0], r2[3] - r2[1]];
			refY[name] = r2[1];
		}
	}
}


function list() {
	var args = arrayfromargs(arguments);
	if (args.length < 4) return;

	for (var i = 0; i < 4; i++) {
		if (lastStates[i] !== args[i]) {
			msg_int(args[i], i);
			lastStates[i] = args[i];
		}
	}
}

function msg_int(val, idx) {
	var name = names[idx];
	if (states[idx] !== val) {
		states[idx] = val;
		outlet(0, ['script', val ? 'show' : 'hide', name]);
		reposition();
	}
}

function reposition() {
	var x = coreRight;
	var totalWidth = coreRight;
	
	if (states[3]) { // index de PRESET
		var name = "PRESET";
		var size = refSizes[name];
		var y = refY[name];
		if (size && typeof y === "number") {
			var w = size[0];
			var h = size[1];
			outlet(0, ['script', 'sendbox', name, 'presentation_rect', x, y, w, h]);
			x += w;
			totalWidth += w;
		}
	}

	for (var i = 0; i < names.length; i++) {
		if (i === 3) continue;
		if (!states[i]) continue;
		var name = names[i];
		var size = refSizes[name];
		var y = refY[name];
		if (!size || typeof y !== "number") continue;

		var w = size[0];
		var h = size[1];
		outlet(0, ['script', 'sendbox', name, 'presentation_rect', x, y, w, h]);
		x += w;
		totalWidth += w;
	}
	outlet(0, ['width', totalWidth]);
}
