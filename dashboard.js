#!/usr/bin/env node

sys     = require('util');
express = require('express');
http = require('http');
JSFtp = require('jsftp');
fs = require('fs');

//setting ftp
var Ftp = new JSFtp({
  host: "ftp.lskk.ee.itb.ac.id",
  port: 21, // defaults to 21
  user: "cctv|cctv", // defaults to "anonymous"
  pass: "cctvuser" // defaults to "@anonymous"
});

app = express();
//app.configure(function(){
  app.use(express.static(__dirname + '/public'));
//});

app.get('/', function(req, res, next){		
  res.render('/public/index.html');
});

server = http.createServer(app)
server.listen(8081);
console.log('Server running at http://localhost:8081/');

var io  = require('socket.io').listen(server);
io.set('log level', 0);

//controller
io.sockets.on('connection', function(socket) {
    /*socket.on('data', function(action,data) {
	if(action==='+') {
        	myList.push(data);
	}
	if(action==='-') {
		myList.del(data);
	}
	if(action==='*') {
            twit.updateStatus(data,
                function (err, data) {
                  console.log(data);
                });
	}
    });*/
    
	/*socket.on('getfilter', function() {
        socket.emit('pushfilter', myList);
    });*/
	//socket.emit('news', { hello: 'world' });
	//socket.on('my other event', function (data) {
	//	console.log(data);
	//});
	
	socket.on('pushtoftp', function (data) {
		//console.log(data.imgurl);
		
		var delay = 1000;
		var request = require('request').defaults({ encoding: null });
		setTimeout(function(){
			  request.get(data.imgurl, function (err, buffer) {
				  //console.log(buffer);
				  if(err)
					console.log(err);
				  else{
				  //to cctv folder
					Ftp.put(buffer, '/CCTV/'+new Date().getTime()+'.jpeg', function(hadError) {
					  if(hadError)
						console.log("File not transferred! " + hadError);
					  else
						console.log(new Date().getTime()+".jpeg transferred successfully!");
						 //to view folder
						var file = fs.createWriteStream("public/update.jpeg");
						var req = http.get(data.imgurl, function(response) {
						  if(!response)
							console.log("update.jpeg fail to update! time:"+new Date().toDateString());
						  else{
							console.log("update.jpeg updated!");
							response.pipe(file);
						  }
						});	
					});		
				}							
			});	
		}, delay); 
	});
 });
