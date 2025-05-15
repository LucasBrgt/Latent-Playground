inlets = 1;
outlets = 1;

var states = [0, 0, 0];
var prevStates = [0, 0, 0];
var names = ["MOD", "CONTROL", "BEND"];
var refSizes = {};
var refY = {};
var coreRight = 0;
var presetActive = false;
var lastStates = [0, 0, 0];
var lastPreset = 0;


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

	for (var i = 0; i < 3; i++) {
		if (lastStates[i] !== args[i]) {
			msg_int(args[i], i);
			lastStates[i] = args[i];
		}
	}

	var presetVal = args[3];
	if (lastPreset !== presetVal) {
		msg_int(presetVal, 3);
		lastPreset = presetVal;
	}
}

function msg_int(val, idx) {
	
	if (idx < 3) {
		var name = names[idx];
		if (presetActive) {
			states[idx] = val;
			return;
		}
		if (states[idx] !== val) {
			states[idx] = val;
			outlet(0, ['script', val ? 'show' : 'hide', name]);
			reposition();
		}
	} else {
		if (val === 1) {
			presetActive = true;
			for (var j = 0; j < 3; j++) {
				if (states[j]) outlet(0, ['script', 'hide', names[j]]);
			}
			outlet(0, ['script', 'show', 'PRESET']);
			outlet(0, ['width', 273]);
		} else {
			presetActive = false;
			for (var k = 0; k < 3; k++) {
				if (states[k]) outlet(0, ['script', 'show', names[k]]);
			}
			outlet(0, ['script', 'hide', 'PRESET']);
			reposition();
		}
	}
}

function reposition() {
	var x = coreRight;
	var totalWidth = coreRight;

	for (var i = 0; i < names.length; i++) {
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
