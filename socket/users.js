var UserModel = require('../models/user').UserModel;

module.exports = function(socket, session, io){

	//Si el usuario esta logueado, actualizo su socket.id para poder enviar
	//correctamente las noticias o las notificaciones personales.
	if(session.user){
		UserModel.findById(session.user._id, function(err, user){
			if (err) throw err;
			if(user){
				user.socket_id = socket.id;
				user.save(function(err){
					if (err) throw err;
				});
			}
		});
	}


	socket.on('disconnect', function() {
		if(session.user){
			UserModel.findById(session.user._id, function(err, user){
				if (err) throw err;

				if(user){
					user.socket_id = null;
					user.save(function(err){
						if (err) throw err;
					});
				}
			});
		}
	});


	socket.on('LoggedInSocketId', function (user) {
		session.expose.socket_id = socket.id;
		console.log("Socket");
		console.log(req.session.expose.socket_id);
	});
	

	socket.on('personal_echo', function(){
		if(session.user){
			UserModel.findById(session.user._id, function(err, user){
				if (err) throw err;

				if(user){
					if(user.socket_id){
						var client = io.sockets.socket(user.socket_id);
						client.emit('personal_echo', { message : 'hello ' + user.username });
					}
				}
			});
		}
	});
}