
(function(){
	$('#select_country').change(function(){
		
		$('#select_state').empty();
		var url = '/states/' + $('#select_country').val()+'.json';
		$.ajax({
			type 	: 'GET',
			url 	: url,
			success : refreshStates,
			error   : function(jqXHR, textStatus, errorThrown ){
				console.log('AJAX states - ' + textStatus + ' - ' + errorThrown);
			}
		});
	});


	$('#select_state').change(function(){
		
		$('#select_city').empty();
		var url = '/cities/' + $('#select_state').val()+'.json';
		$.ajax({
			type 	: 'GET',
			url 	: url,
			success : refreshCities,
			error   : function(jqXHR, textStatus, errorThrown ){
				console.log('AJAX cities - ' + textStatus + ' - ' + errorThrown);
			}
		});
	});
	$('#select_country').trigger("change")
})();



var refreshStates = function(states){

	for (var i = states.length - 1; i >= 0; i--) {
		$('#select_state').append(
			'<option value="' + states[i]._id + '" >' + states[i].name + '</option>'
			);
	};
				
};

var refreshCities = function(cities){

	for (var i = cities.length - 1; i >= 0; i--) {
		$('#select_city').append(
			'<option value="' + cities[i]._id + '" >' + cities[i].name + '</option>'
			);
	};
				
};