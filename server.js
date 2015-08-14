#!/usr/bin/env node

express = require('express');
http = require('http');
var Client = require('ftp');
var fs = require('fs');
var Promise = require('bluebird');
var path = require('path');

app = express();
 app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res, next){		
  res.render('/public/view.html');
});

server = http.createServer(app)
server.listen(9250);
console.log('Server running at http://localhost:9250/');

var connectionProperties = {
    host: "ftp.lskk.ee.itb.ac.id",
    user: "cctv|cctv",
    password: "cctvuser"
};
var c = new Client();

/*  c.on('ready', function() {
  
    c.get('/CCTV/1.jpg', function(err, stream) {
      if (err) throw err;
      stream.once('close', function() { c.end(); });
      stream.pipe(fs.createWriteStream('foo.local-copy.jpg'));
    });
	
	c.list('/CCTV', function(err, list){
	if (err) throw err;
	if(list){
		console.log('worked');
	}
	});
	
  });
  
  // connect to localhost:21 as anonymous
  c.connect(connectionProperties); */
  
  
/*  c.on('ready', function () {
    console.log('ready');
    c.list('/CCTV', function (err, list) {
        if (err) throw err;
        list.forEach(function (element, index, array) {
            //Ignore directories
            if (element.type === '-') {
                console.log('file ' + element.name);
				
				    c.get('/CCTV/'+element.name, function(err, stream) {
						if (err) throw err;
						stream.once('close', function() { c.end(); });
						stream.pipe(fs.createWriteStream('file '+new Date().getTime()+'.jpg'));
						console.log('downloading '+element.name+' '+index);
						});
				
            }
            //Download files
    /*        c.get(element.name, function (err, stream) {
                if (err) throw err;
                stream.once('close', function () {
                    c.end();
                });
                stream.pipe(fs.createWriteStream(element.name));
            }); 
        });
    });
});
c.connect(connectionProperties); */