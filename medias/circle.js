autowatch = 1;

var thickness = 10;
var offset_step = 0.0005;
var point_radius = 0.03;

function circle(x, y) {
    outlet(0, "moveto", x, y, 0);
	outlet(0, "glcolor", 0.118, 0.757, 1.0, 1.0);
    outlet(0, "circle", point_radius);
}

function draw(resolution) {
	// Reset 
	outlet(0, "reset");
    // Couleur
    outlet(0, "glcolor", 0, 0, 0, 0);

    // Cercles
    var radii = [0.2, 0.4, 0.6, 0.8, 1.];

   for (var r = 0; r < radii.length; r++) {
        for (var t = 0; t < thickness; t++) {
            // On écarte légèrement chaque tracé radialement pour simuler l'épaisseur
            var radius = radii[r] + (t - (thickness - 1) / 2) * offset_step;

            outlet(0, "glbegin", "line_loop");

            for (var i = 0; i < resolution; i++) {
                var angle = (i / resolution) * Math.PI * 2;
                var x = radius * Math.cos(angle);
                var y = radius * Math.sin(angle);
                outlet(0, "glvertex", x, y);
            }

            outlet(0, "glend");
        }
    }

    // Lignes radiales épaisses
    var spokes = 8;
    var max_radius = Math.SQRT2;

    for (var i = 0; i < spokes; i++) {
        var angle = (i / spokes) * Math.PI * 2;
        var dx = Math.cos(angle);
        var dy = Math.sin(angle);

        // vecteur perpendiculaire normalisé
        var perp_x = -dy;
        var perp_y = dx;

        for (var t = 0; t < thickness; t++) {
            var offset = (t - (thickness - 1) / 2) * offset_step;
            var ox = perp_x * offset;
            var oy = perp_y * offset;

            outlet(0, "linesegment",
                0 + ox, 0 + oy, 0,
                dx * max_radius + ox, dy * max_radius + oy, 0);
        }
    }
}