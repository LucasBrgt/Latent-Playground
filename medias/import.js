autowatch = 1;

var master_name = "master_buffer";
var index = [];
var json_path = "";

function setpath(path) {
    import_json_path = path;
}

function bang() {
	read_index();
}

function read_index() {
    var f = new File(import_json_path, "read");
    if (f.isopen) {
        var str = f.readstring(f.eof);
        f.close();
        index = JSON.parse(str);
		
		var num_layers = index.length;
		outlet(0, num_layers);
	
        load_master_wav();

    } else {
        post("Error: Cannot open JSON file.\n");
    }
}

function load_master_wav() {
    var wav_path = import_json_path.replace(/\.json$/, ".wav");
    messnamed(master_name, "replace", wav_path);
}

function ready() {
    recreate_buffers();
}


function recreate_buffers() {
    var master = new Buffer(master_name);
	
    for (var i = 0; i < index.length; i++) {
        var entry = index[i];

		var tmp_name = entry.name
		var main_name = tmp_name.replace("-tmp", "");
		
        var dest_tmp = new Buffer(tmp_name);
		var dest_main = new Buffer(main_name);

        dest_tmp.send("sizeinsamps", entry.length_sample);
		dest_main.send("sizeinsamps", entry.length_sample);

        for (var s = 0; s < entry.length_sample; s++) {
            var val = master.peek(1, entry.start_sample + s);
            dest_tmp.poke(1, s, val);
			dest_main.poke(1, s, val);
        }
    }
}
