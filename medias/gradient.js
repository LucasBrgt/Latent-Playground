autowatch = 1;
outlets = 1;

//var color1 = [0.572549, 0.572549, 0.572549, 1.];  // gray
var color1 = [0, 0, 0, 1.];
var color2 = [1.0, 0.34902, 0.372549, 1.];        // pinkish red
var dim = 256;
var k = 4;

function set_color1(r, g, b, a) {
    color1 = [r, g, b, a];
}

function set_k(x) {
	k = x;
}

function set_color2(r, g, b, a) {
    color2 = [r, g, b, a];
}

function set_dim(n) {
    dim = Math.max(1, Math.floor(n));
}

function bang() {
    var m = new JitterMatrix(4, "float32", [dim, dim]);
    m.adapt = 0;

    // IMPORTANT : Jitter is ARGB by default, so we write a r g b (plan 0 = alpha)
    for (var i = 0; i < dim; i++) {
        var t = i / (dim - 1);
        var a = lerp(color1[3], color2[3], t);
        var r = lerp(color1[0], color2[0], t);
        var g = lerp(color1[1], color2[1], t);
        var b = lerp(color1[2], color2[2], t);

		for (var j = 0; j < dim; i++) {
			m.setcell(i, j, "val", a, r, g, b);  // ARGB
		}
    }

    outlet(0, "jit_matrix", m.name);
}


function remap_t(t, k) {
    t = Math.max(0, Math.min(1, t)); // clamp
    return 1 / (1 + Math.exp(-k * (Math.tan(t) - 0.5)));
}


function lerp(a, b, t) {
	t = remap_t(t, k);
    return a + (b - a) * t ;
}
