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
					stream(file, url);
				});
			}
		});
	};


	// stream a file in 5MB slices to a url
	var stream = function(file, url) {
		var fd = new FormData();
		var xhr = new XMLHttpRequest();
		fd.append('file', file, file.name);
		fd.append('size', file.size);
		xhr.open('POST', url, false);
		xhr.send(fd);
	};

	// base function
	var filestream = function(attrs) {
		ondragover(attrs.el);
		ondrop(attrs.el, attrs.url);
	};

	// prevent default form actions
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
