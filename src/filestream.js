;(function(exports){
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

	var stream = function(file) {
		var fs = new Filestream(file);
		fs.sendFile();
	};

	// base function
	var filestream = function(attrs) {
		ondragover(attrs.el);
		ondrop(attrs.el, attrs.url);
	};

	var Filestream = function(file) {
		this.file = file;
		this.SINGLE_FILE_LIMIT = 1024 * 1024 * 25;
	};

	Filestream.prototype.sendFile = function() {
		var chunker = new Chunker(this.file);
		while (chunk = chunker.nextSlice()) {
			xhr({
				blob: chunk,
				name: this.file.name,
				blobsize: chunk.size,
				filesize: this.file.size
			});
		}
	};

	Filestream.prototype.xhr = function(filedata) {
		var formdata = new FormData();
		var xhr = new XMLHttpRequest();
		Object.keys(filedata).forEach(function(key){
			formdata.append(key, filedata[key]);
		});
		xhr.open('POST', filedata.url, false);
		xhr.send(formdata);
	};

	var Chunker = function(file) {
		this.file = file;
		this.start = 0;
		this.end = 0;
		this.CHUNK_SIZE = 1024 * 1024 * 5;
	};

	Chunker.prototype.nextSlice = function() {
		var chunk
			, start = this.start
			, end = this.end
			, file = this.file
			, size = file.size
			, CHUNK_SIZE = this.CHUNK_SIZE;

		end = start + size;

		if (end > size) {
			end = size;
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

		start = end;

		if(chunk.size === 0) {
			return null;
		}

		return chunk;
	};

	var noop = function(e) {
		e.preventDefault();
		e.stopPropagation();
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
