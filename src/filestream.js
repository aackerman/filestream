;(function(exports){
	var noop = function(e) {
		e.preventDefault();
		e.stopPropagation();
	};

	var ondragover = function(el){
		el.addEventListener('dragover', function(e){
			noop(e);
			e.dataTransfer.dropEffect = 'copy';
		});
	};

	var ondrop = function(el, url){
		el.addEventListener('drop', function(e){
			noop(e);
			var files = e.dataTransfer.files || e.target.files;
			if (files.length) {
				files = [].slice.call(files);
				files.forEach(stream);
			}
		});
	};

	var sendfile = function(file) {
		var fd = new FormData();
		var xhr = new XMLHttpRequest();
		fd.append('file', file);
		fd.append('name', file.name);
		fd.append('size', file.size);
		xhr.open('POST', '/upload', false);
		xhr.send(fd);
	};

	var chunkfile = function(file) {
		var CHUNK_SIZE = 1024 * 1024 * 5;
		var start = 0, end = 0, chunk;
		while (start < file.size) {
			end = start + CHUNK_SIZE;
			if (end > file.size) {
				end = file.size;
			}

			if (file.mozSlice) {
				chunk = file.mozSlice(start, end);
			}
			if (file.webkitSlice) {
				chunk = file.webkitSlice(start, end);
			}
			if (file.slice) {
				chunk = file.slice(start, end);
			}

			sendfile(chunk);
			start = end;
		}
	};

	var stream = function(file) {
		var SINGLE_FILE_LIMIT = 1024 * 1024 * 25;

		// send up to 25MB file in one chunk
		if (file.size < SINGLE_FILE_LIMIT) {
			sendfile(file);
			return;
		}

		// otherwise send in chunks
		chunkfile(file);
	};

	// base function
	var filestream = function(attrs) {
		ondragover(attrs.el);
		ondrop(attrs.el, attrs.url);
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
