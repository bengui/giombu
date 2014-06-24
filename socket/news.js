

module.exports = function(socket, session){

	socket.on('news.start', function (data) {
		socket.emit('news.new', { message : 'Esta es una nueva noticia'});
	});

	socket.on('news.random', function (data) {
		socket.emit('news.new', { message : 'Esta es una nueva noticia enviada el ' + new Date()});
	});

}
