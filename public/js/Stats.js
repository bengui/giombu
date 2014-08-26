
$(document).ready(function(){
	//Get the context of the canvas element we want to select
	var ctx = document.getElementById("myChart").getContext("2d");
	var ctx1 = document.getElementById("myChart1").getContext("2d");
	var ctx2 = document.getElementById("myChart2").getContext("2d");
	var ctx3 = document.getElementById("myChart3").getContext("2d");
	var ctx4 = document.getElementById("myChart4").getContext("2d");


	var month_names = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];


	function plotValues(data,plotCtx){
		var plotData = {
			labels : data.keys,
			datasets : [
				{
					fillColor : "rgba(220,220,220,0.5)",
					strokeColor : "rgba(220,220,220,1)",
					pointColor : "rgba(220,220,220,1)",
					pointStrokeColor : "#fff",
					data : data.values
				}
			]
		}
		
		
		var plotChart = new Chart(plotCtx).Line(plotData);
	}

	$.ajax({
		  url: "/stats/new_users",
		  context: document.body
		}).done(function(data ) {
		 plotValues(data,ctx)
	});

	$.ajax({
		  url: "/stats/new_deals",
		  context: document.body
		}).done(function(data ) {
		  plotValues(data,ctx1)
	});

	$.ajax({
		  url: "/stats/new_invitations",
		  context: document.body
		}).done(function(data ) {
		  plotValues(data,ctx2)
	});

	$.ajax({
		  url: "/stats/new_sales",
		  context: document.body
		}).done(function(data ) {
			plotValues(data,ctx3)
	});

	$.ajax({
		  url: "/stats/weekly_sales",
		  context: document.body
		}).done(function(data ) {
			plotValues(data,ctx4)
	});


})