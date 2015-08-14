#!/usr/bin/env node

sys     = require('util');
express = require('express');
http = require('http');
JSFtp = require('jsftp');
fs = require('fs');
var mysql = require('mysql');

var filepath;

//setting ftp
var Ftp = new JSFtp({
  host: "ftp.lskk.ee.itb.ac.id",
  port: 21, // defaults to 21
  user: "cctv|cctv", // defaults to "anonymous"
  pass: "cctvuser" // defaults to "@anonymous"
});


//mysql setup
var dbcon = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database: 'svc_lskk'
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
			  request.get(data.imgurl, function (err, res, buffer) {
				  if(err)
					console.log(err);
				  else{
				  // -------- to cctv folder ---------
					var d = new Date();
					var filename=d.getDate()+'-'+(d.getMonth() + 1) +'-'+d.getFullYear()+'_'+d.getHours()+'-'+d.getMinutes()+'-'+d.getSeconds();
					Ftp.put(buffer, '/CCTV/'+filename+'.jpeg', function(hadError) {
					  if(hadError)
						console.log("File not transferred! " + hadError);
					  else{
							console.log(filename+".jpeg transferred successfully!");
							filepath = 'ftp://ftp.lskk.ee.itb.ac.id/CCTV/'+filename+'.jpeg';
						}

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
						
						insertToDB(data.imgurl, filename);
						 
					});		
				}							
			});	
		}, delay); 
	});
 });
 
function insertToDB(url, filename){
	dbcon.query('SELECT * FROM stream_captured', function(err, rows, fields) {
	  if (err) throw err;

	  //console.log('stream_captured table: \n', rows);
	  var post = {file_name : filename+'.jpeg', file_size : '200', file_date : filename, file_path : filepath };
	  var query = dbcon.query('INSERT INTO stream_captured SET ?', post, function(err, result) {
		  // Neat!
		  if (err) throw err;
		  console.log('Sukses insert to database');
		});
		// console.log(filename+'.jpeg');
	});
	
	
}
