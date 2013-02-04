var progress = function() {

};

var cancel = function() {

};

var send = function(chunk, location) {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', location, false);
	xhr.onload = function(){};
	xhr.send(chunk);
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

var stream = function(file, location) {
	var CHUNK_SIZE = 1024 * 1024;
	var size = file.size;
	var start = 0;
	var end = CHUNK_SIZE;
	var chunk;

	while (start < size) {
		chunk = createChunk(file, start, end);
		send(chunk, location);
		start = end;
		end = start + CHUNK_SIZE;
	}
};

self.onmessage = function(e) {
	var options = e.data;
	var location = options.location;
	var files = [].slice.call(options.files);
	files.forEach(function(file){
		stream(file, location);
	});
	self.postMessage('done');
};
