var NewModel = require('../models/new').NewModel;
var news_builder = require('../helpers/news_builder.js');

module.exports = function(socket, session){

	socket.on('news.start', function (data) {
		socket.emit('news.new', { 
			title 		: 'Nueva noticia',
			message 	: 'Esta es una nueva noticia'
		});
		if(session.user){

			NewModel.find({ to_user : session.user._id, informed:false})
			.populate('to_user')
			.populate('from_user')
			.populate('deal')
			.populate('event')
			.exec(function(err, news_list){
				if(err) throw err;
				var packed_new;
				console.log('-------------------- ARMADO DE NEWS --------------------');
				for (var i = news_list.length - 1; i >= 0; i--) {
					//console.log(news_list[0]);
					packed_new = {};
					packed_new.title = news_list[i].event.type;
					packed_new.message = news_builder.make_news_string(news_list[i]);
					console.log(packed_new);
					socket.emit('news.new', packed_new);

				};
			});
		}

	});

	socket.on('news.random', function (data) {
		socket.emit('news.new', { message : 'Esta es una nueva noticia enviada el ' + new Date()});
	});

}
