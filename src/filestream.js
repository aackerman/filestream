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

	exports.filestream = filestream;
})(this);
