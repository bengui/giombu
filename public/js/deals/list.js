$(document).ready(function(){

	$('.deal_status_selector').click(function(){
		var that=this;
		$.ajax({
			type 		: 'GET',
			url 		: $(that).attr("url") ,
			success 	: function(data){
				$("#"+data.id+" .status_selector").removeClass("active draft closed");
				$("#"+data.id+" .status_selector").addClass(data.status);
			}
		});
	});
});