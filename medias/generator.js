autowatch = 1;

// Paramètres initiaux
var mean = 0;
var std = 1;
var skew = 1;
var kurtosis = 1;
var median = 0;
var c25 = -0.5;
var c75 = 0.5;
var dist = 0; // 0=uniforme, 1=gaussienne, 2=beta, 3=laplace
var seed = 1;
var size = 256;
var desordre = 0;


// Fonction pour setter les paramètres
function list() {
    if (arguments.length >= 10) {
        mean = arguments[0];
        std = arguments[1];
        skew = arguments[2];
        kurtosis = arguments[3];
        median = arguments[4];
        c25 = arguments[5];
        c75 = arguments[6];
        dist = arguments[7];
        seed = arguments[8];
        size = arguments[9];
		desordre = arguments[10];
		maxIn = arguments[11];
		minIn = arguments[12];
    }
}

// Fonction random basique avec seed
function rand() {
    seed = Math.sin(seed + 1) * 43758.5453;
    return seed - Math.floor(seed);
}

// Distributions
function gaussian() {
    var u1 = rand();
    var u2 = rand();
    return Math.sqrt(-2 * Math.log(u1 + 0.00001)) * Math.cos(2 * Math.PI * u2);
}

function beta() {
    var u1 = rand();
    var u2 = rand();
    return (u1 * u2 * 4) - 1; // [-1,1]
}

function laplace() {
    var u = rand() - 0.5;
    return sign(u) * Math.log(1 - 2 * Math.abs(u));
}

// Fonction principale (bang)
function bang() {
    matrix = new JitterMatrix(1, "float32", size);

	var m = lerp(mean, randRange(-3, 3), desordre);
    var s = lerp(std, randRange(0.1, 3), desordre);
    var sk = lerp(skew, randRange(0.5, 3), desordre);
    var ku = lerp(kurtosis, randRange(0.5, 5), desordre);
    var med = lerp(median, randRange(-1, 1), desordre);
    var q25 = lerp(c25, randRange(-1, 0), desordre);
    var q75 = lerp(c75, randRange(0, 1), desordre);

    for (var i = 0; i < size; i++) {
        var raw = 0;

        // Choix distribution
        if (dist == 0) {
            raw = (rand() * 2) - 1;
        } else if (dist == 1) {
            raw = gaussian();
        } else if (dist == 2) {
            raw = beta();
        } else if (dist == 3) {
            raw = laplace();
        }

        // Skew et Kurtosis (warp non-linéaire)
        var skewed = Math.pow(Math.abs(raw), sk) * sign(raw);
        var warped = tanh(ku * skewed);

        // Remap en split autour de la médiane
        if (warped < med) {
            warped = remap(warped, -1, med, q25, med);
        } else {
            warped = remap(warped, med, 1, med, q75);
        }

        // Scaling final
        var val = warped * s + m;
		val = Math.max(-3, Math.min(3, val));
        matrix.setcell1d(i, val);
    }

    // Sortie groupée
    outlet(0, "jit_matrix", matrix.name);
}


function lerp(a, b, t) {
    return a + (b - a) * t;
}

function randRange(min, max) {
    return min + rand() * (max - min);
}

function remap(x, inMin, inMax, outMin, outMax) {
    return outMin + ((x - inMin) / (inMax - inMin)) * (outMax - outMin);
}

function sign(x) {
	return (x > 0) - (x < 0);
}

function tanh(x) {
    var e1 = Math.exp(x);
    var e2 = Math.exp(-x);
    return (e1 - e2) / (e1 + e2);
}

