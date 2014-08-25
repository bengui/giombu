
$(document).ready(function(){
//Get the context of the canvas element we want to select
var ctx = document.getElementById("myChart").getContext("2d");
var ctx1 = document.getElementById("myChart1").getContext("2d");
var ctx2 = document.getElementById("myChart2").getContext("2d");
var ctx3 = document.getElementById("myChart3").getContext("2d");


var month_names = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];


function plotValues(data,plotCtx,plotChart){
	var labelsArray = [];
	var valuesArray = [];
	for (var i = data.length - 1; i >= 0; i--) {
	 labelsArray.push(month_names[data[i]._id]);
	 alert(data[i]._id);
	 valuesArray.push(data[i].value);
	};


	var plotData = {
		labels : labelsArray,
		datasets : [
			{
				fillColor : "rgba(220,220,220,0.5)",
				strokeColor : "rgba(220,220,220,1)",
				pointColor : "rgba(220,220,220,1)",
				pointStrokeColor : "#fff",
				data : valuesArray
			}
		]
	}
	
	
	var plotChart = new Chart(plotCtx).Line(plotData);
}

$.ajax({
  url: "/stats/new_users",
  context: document.body
}).done(function(data ) {
 plotValues(data,ctx3,myChart3)
});

$.ajax({
  url: "/stats/new_deals",
  context: document.body
}).done(function(data ) {
  plotValues(data,ctx2,myChart2)
});

$.ajax({
  url: "/stats/total_by_month",
  context: document.body
}).done(function(data ) {
  plotValues(data,ctx1,myChart1)
});

$.ajax({
  url: "/stats/coupon_total_by_month",
  context: document.body
}).done(function(data ) {
	plotValues(data,ctx,myChart)
});


})