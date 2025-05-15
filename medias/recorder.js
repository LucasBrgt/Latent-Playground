autowatch = 1;
inlets = 1;
outlets = 2; //0 dict 1 OSC

var device = null;
var observed = {};
var snapshots = {};
var snapshotInterval = 50;
var task = null;
var startTime = null;
var savePath = null;
var oscEnabled = true;
var saveEnabled = true;
var dictEnabled = true;
var targetDeviceName = "Latent-Playground";

function anything() {
    if (messagename === "init" && arguments.length > 0) {
        savePath = arrayfromargs(arguments).join(" ");
        reset();
        findTargetDevice();
        scanParameters();
        saveInitialSnapshot();
        if (device && device.id !== 0) {
            scanParameters();
    	var statusDict = new Dict();
    	statusDict.replace("status", "init\n");
    	statusDict.replace(targetDeviceName, "\n");
    	outlet(0, "dictionary", statusDict.name, "\n");
        }
    } else if (messagename === "start") {
        if (!savePath || Object.keys(observed).length === 0) {
            return;
        }
        startRecording();
    } else if (messagename === "stop") {
        stopRecording();
    } else if (messagename === "interval" && arguments.length > 0) {
        snapshotInterval = parseInt(arguments[0]);
    } else if (messagename === "osc" && arguments.length > 0) {
    	oscEnabled = arguments[0] === 1;
	} else if (messagename === "save" && arguments.length > 0) {
    	saveEnabled = arguments[0] === 1;
	} else if (messagename === "dict" && arguments.length > 0) {
		dictEnabled = arguments[0] ===1;
	}
}

function reset() {
    observed = {};
    snapshots = {};
    if (task) {
        task.cancel();
        task = null;
    }
}

function findTargetDevice() {
    var thisDev = new LiveAPI("this_device");
    var this_id = thisDev.id;
    var liveSet = new LiveAPI("live_set");
    var trackCount = liveSet.getcount("tracks");
    var targetRegex = new RegExp("^" + targetDeviceName + "(\\.v[0-9a-zA-Z._-]+)?$", "i");

    for (var t = 0; t < trackCount; t++) {
        var trackPath = "live_set tracks " + t;
        var track = new LiveAPI(trackPath);
        var deviceCount = track.getcount("devices");

        for (var d = 0; d < deviceCount; d++) {
            var devPath = trackPath + " devices " + d;
            var dev = new LiveAPI(devPath);
            if (dev.id === this_id) {
                for (var i = 0; i < deviceCount; i++) {
                    var path = trackPath + " devices " + i;
                    var target = new LiveAPI(path);
                    var name = target.get("name");
                    if (name && targetRegex.test(name.toString().trim())) {
                        device = target;
                        return;
                    }
                }
            }
        }
    }
    device = null;
}


function scanParameters() {
    var param_ids = device.get("parameters");
    observed = {};

    for (var i = 0; i < param_ids.length; i++) {
        var pid = param_ids[i];
        if (typeof pid !== "number" || pid === 0) continue;

        var param = new LiveAPI(["id", pid]);
        if (!param || param.id === 0) continue;

        var enabled = param.get("is_enabled");
        var name = param.get("name");
        var value = param.get("value");

		if (Array.isArray(value)) value = value[0];

        if (Number(enabled) === 1) {
    		value = Math.round(value * 100) / 100;
            observed[name] = { value: value, api: param };
        }
    }
}

function saveInitialSnapshot() {
    if (!savePath) return;
    snapshots = {};
	snapshots["0.000"] = {};
	for (var key in observed) {
    	snapshots["0.000"][key] = observed[key].value;
	}
    var f = new File(savePath, "write", "TEXT");
    f.writeline(JSON.stringify(snapshots, null, 2)); 
    f.close();
}

function startRecording() {
    startTime = new Date().getTime();
    task = new Task(takeSnapshot, this);
    task.interval = snapshotInterval;
    task.repeat();
}

function takeSnapshot() {
    var now = new Date().getTime();
    var timestamp = ((now - startTime) / 1000).toFixed(3);
    var changed = {};
    var changedFlag = false;

    for (var key in observed) {
        var obj = observed[key];
        var current = obj.api.get("value");

        if (Array.isArray(current)) current = current[0];
		var rounded = Math.round(current * 100) / 100;
        if (rounded !== obj.value) {	
            obj.value = rounded;
            changed[key] = rounded;
            changedFlag = true;
        }
    }

    if (changedFlag) {
        snapshots[timestamp] = changed;
		
		if (oscEnabled) {
    		var delay = 0;
			for (var key in changed) {
    			(function(k, v) {
        			var sendTask = new Task(function () {
						outlet(1, "/param/" + k, v);
        		}, this);
        		sendTask.schedule(delay);
    		})(key, changed[key]);
    		delay += 5;
			}
		}

		if (dictEnabled) {
			var dict = new Dict("snap_dict_" + timestamp.replace(".", "_"));
    		dict.parse(JSON.stringify(changed));
    		outlet(0, "dictionary", dict.name);
		}
		
		if (saveEnabled) {
        	try {
            	var sortedKeys = Object.keys(snapshots).sort(function (a, b) {
                	return parseFloat(a) - parseFloat(b);
            	});

            	var result = "{\n";
            	for (var i = 0; i < sortedKeys.length; i++) {
                	var ts = sortedKeys[i];
                	var values = snapshots[ts];
                	var line = "\"" + ts + "\": {";

                	var paramList = [];
                	for (var name in values) {
                    	var val = values[name];
                    	if (Array.isArray(val)) val = val[0];
                    	paramList.push("\"" + name + "\": " + val);
                	}

                	line += paramList.join(", ") + "}";
                	if (i < sortedKeys.length - 1) line += ",";
                	result += line + "\n";
            	}
            	result += "}";

            	var f = new File(savePath, "write", "TEXT");
            	f.writeline(result);
            	f.close();
        	} catch (e) {
            	post("❌ Erreur écriture JSON : " + e + "\n");
        	}
    	}
	}
}

function stopRecording() {
    if (task) {
        task.cancel();
        task = null;
    }
} 