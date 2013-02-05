;(function(exports){
	var noop = function(e) {
		e.preventDefault();
		e.stopPropagation();
	};

	var worker = function() {
		var worker = new Worker('/src/worker.js');
		worker.onmessage = function(e) {
			console.log(e.data);
		};
		worker.onerror = function(e) {
			console.log(e.message);
		};
		return worker;
	};

	var filestream = function(attrs) {

		attrs.el.addEventListener('dragover', function(e){
			noop(e);
			e.dataTransfer.dropEffect = 'copy';
		});

		attrs.el.addEventListener('drop', function(e){
			noop(e);
			var files = e.dataTransfer.files || e.target.files;
			if (files.length) {
				worker().postMessage({
					files: files,
					url: url
				});
			}
		});

	};

	// expose filestream to the window and as an AMD module
	if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
		exports.filestream = filestream;
		define(function(){
			return filestream;
		});
	} else {
		exports.filestream = filestream;
	}
})(this);
