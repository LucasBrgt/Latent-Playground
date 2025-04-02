autowatch = 1;

var num_buffers = 62;
var base_name = "layer_weights_tmp.";
var master_name = "master_buffer";
var offset_samples = 0;
var index = [];


function numbuffers(n) {
    num_buffers = n;
}

function setpath(path) {
    export_base_path = path;
}

function bang() {
	var master = new Buffer(master_name);
    master.send("clear");
	messnamed("master_buffer", "format", "float32");

	var total_samples = 0;
	
	for (var i = 1; i <= num_buffers; i++) {
        var buf = new Buffer(base_name + i);
        total_samples += buf.framecount();
    }
	
	master.send("sizeinsamps", total_samples);
	
    for (var i = 1; i <= num_buffers; i++) {
        var buffer_name = base_name + i;
        var buf = new Buffer(buffer_name);
        var num_samples = buf.framecount() ;

        if (num_samples > 0) {
            for (var s = 0; s < num_samples; s++) {
                var val = buf.peek(1, s);
                master.poke(1, offset_samples + s, val);		
			}
			
            index.push({
                "name": buffer_name,
                "start_sample": offset_samples,
                "length_sample": num_samples,
            });
            
            offset_samples += num_samples;
        } else {
            post("Buffer " + buffer_name + " is empty.\n");
        }
    }
	var wav_path = export_base_path + ".wav";
	messnamed("master_buffer", "writewave", wav_path);
    save_json();
}


function save_json() {
	var json_path = export_base_path + ".json";
	var f = new File(json_path, "write");
    f.writestring(JSON.stringify(index, null, 2));
    f.close();
}