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
				files.forEach(sendfile);
			}
		});
	};

	var sendfile = function(file) {
		var fd = new FormData();
		fd.append('file', file);
		var xhr = new XMLHttpRequest();
		xhr.open('POST', '/upload', false);
		xhr.send(fd);
	};

	var chunk = function(file, start, end) {
		if ( 'slice' in file ) {
			return file.slice(start, end);
		}
		if ( 'mozSlice' in file ) {
			return file.mozSlice(start, end);
		}
		if ( 'webkitSlice' in file ) {
			return file.webkitSlice(start, end);
		}
	};

	var stream = function(file, url) {
		var CHUNK_SIZE = 1024 * 1024;
		var size = file.size;
		var start = 0;
		var end = CHUNK_SIZE;
		var chunk;

		if (size < CHUNK_SIZE) {
			send(file, url);
		}

		while (start < size) {
			chunk = createChunk(file, start, end);
			send(chunk, url);
			start = end;
			end = start + CHUNK_SIZE;
		}
	};

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
