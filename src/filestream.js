;(function(exports){
	var ondragover = function(el){
		el.addEventListener('dragover', function(e){
			noDefault(e);
			e.dataTransfer.dropEffect = 'copy';
		});
	};

	var ondrop = function(el, url, xhr){
		var files;
		el.addEventListener('drop', function(e){
			noDefault(e);
			files = e.dataTransfer.files || e.target.files;
			if (files.length) {
				files = [].slice.call(files);
				files.forEach(function(file){
					send(file, url, xhr);
				});
			}
		});
	};

	var Promise = function(xhr){
		this.xhr = xhr;
	};

	Promise.prototype = {
		then: function(callback) {
			var xhr = this.xhr;
			xhr.onreadystatechange = function(e){
				if(e.target.readyState == 4) {
					callback(xhr.response);
				}
			};
			return this;
		},
		progress: function(callback) {
			this.xhr.upload.onprogress = function(e){
				if(e.lengthComputable) {
					callback((e.loaded / e.total) * 100);
				}
			};
			return this;
		}
	};

	// base function
	var filestream = function(attrs) {
		var xhr = new XMLHttpRequest();
		var promise = new Promise(xhr);
		ondragover(attrs.el);
		ondrop(attrs.el, attrs.url, xhr);
		return promise;
	};

	var send = function(file, url, xhr) {
		var fd = new FormData();
		fd.append('file', file, file.name);
		fd.append('size', file.size);
		xhr.open('POST', url);
		xhr.send(fd);
	};

	// prevent default form actions
	var noDefault = function(e) {
		e.preventDefault();
		e.stopPropagation();
	};

	var noop = function(){};

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
