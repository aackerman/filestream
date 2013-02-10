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
				files.forEach(function(file){
					stream(file, url)
				});
			}
		});
	};

	var send = function(filedata) {
		var formdata = new FormData();
		var xhr = new XMLHttpRequest();
		formdata.append('file', filedata.file, filedata.filename);
		formdata.append('blobsize', filedata.blobsize);
		formdata.append('filesize', filedata.filesize);
		formdata.append('filename', filedata.filename);
		xhr.open('POST', filedata.url, false);
		xhr.send(formdata);
	};

	var stream = function(file, url) {
		var chunker = new Chunker(file);
		while (slice = chunker.slice()) {
			send({
				url: '/upload',
				file: slice.blob,
				blobsize: slice.blob.size,
				filename: file.name,
				filesize: file.size,
				startbyte: slice.startbyte,
				endbyte: slice.endbyte
			});
		}
	};

	// base function
	var filestream = function(attrs) {
		ondragover(attrs.el);
		ondrop(attrs.el, attrs.url);
	};

	var Chunker = function(file) {
		this.file = file;
		this.start = 0;
		this.end = 0;
		this.CHUNK_SIZE = 1024 * 1024 * 5;
	};

	Chunker.prototype.slice = function() {
		var chunk
			, start = this.start
			, end = this.end
			, file = this.file;

		this.end = this.start + this.CHUNK_SIZE;

		if (this.end > file.size) {
			this.end = file.size;
		}

		if (file.slice) {
			chunk = file.slice(this.start, this.end);
		} else {
			if (file.mozSlice) {
				chunk = file.mozSlice(this.start, this.end);
			}
			if (file.webkitSlice) {
				chunk = file.webkitSlice(this.start, this.end);
			}
		}

		var slice = {
			blob: chunk,
			startbyte: this.start,
			endbyte: this.end
		};

		this.start = this.end;

		if(chunk.size === 0) {
			return null;
		}

		return slice;
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
