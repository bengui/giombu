
var io;

exports.setIO = function(_io){
	io = _io;
}

exports.handleSocketCalls = function(err, socket, session){

	if (err) throw err;

	socket.emit('news', { message: 'welcome'});
	socket.on('log_this', function (data) {
		console.log(data);
	});


	//Esta bueno distribuir las llamadas en modulos para evitar generar una tormenta de codigo
	require('./users')(socket, session, io);
	require('./news')(socket, session, io);


};