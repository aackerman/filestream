var progress = function() {

};

var cancel = function() {

};

var send = function(chunk, url) {
	var fd = new FormData();
	fd.append('file', chunk);
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/upload', false);
	xhr.send(fd);
};

var createChunk = function(file, start, end) {
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

self.onmessage = function(e) {
	var options = e.data;
	var url = options.url;
	var files = [].slice.call(options.files);
	files.forEach(function(file){
		stream(file, url);
	});
	self.postMessage('done');
};
