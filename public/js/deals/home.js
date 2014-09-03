(function(){

	socket.emit('countries.get');
	socket.on('countries.get', function(data){
		var countries_select = $('#countries_select');
		for (var i = 0; i < data.length; i++) {
			countries_select.append($('<option value="'+data[i]._id+'">'+data[i].name+'</option>'));
		};
		$('#countries_select').trigger('change');
	});


	$('#countries_select').change(function(){
		$('#franchises_select').empty();
		socket.emit('countries.get_franchises', $('#countries_select').val());
	});

	socket.on('countries.get_franchises', function(data){
		var franchises_select = $('#franchises_select');
		for (var i = 0; i < data.length; i++) {
			franchises_select.append($('<option value="'+data[i]._id+'">'+data[i].name+'</option>'));
		};
	});

	
})();