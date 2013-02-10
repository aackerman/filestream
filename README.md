filestream
==========

Sending and Streaming files from the client to the server

## Usage
```js
var promise = filestream({
	el: document.getElementById('filestream'),
	url: '/upload'
});

promise.then(function(){
	console.log('File Uploaded!');
});

promise.progress(function(progress){
	console.log(progress);
});
```

Style the filestream element as you wish and drag and drop files to upload to the server.

The element given to the `filestream` method adds a drop event to the element. When a file or files are dropped on the element the files are sent via xhr to the supplied url.

Note: Promises returned do not attempt to adhere to the Promises/A+ spec.
