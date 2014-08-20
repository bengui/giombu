$(document).ready(function(){

	var closureMessage = "<br/><hr/>Click <a href='/users/turnOffHelpMode'>aquí</a> si considera que los mensajes de ayuda ya no son necesarios"
	//Ejemplo de tooltip
	$('#allDeals').tooltipster({
		contentAsHTML: true,
		interactive: true,
        content: 'Acceda aquí para ver la lista de todas las ofertas'+closureMessage
    });

    $('.filtered_deals').tooltipster({
		contentAsHTML: true,
		interactive: true,
        content: 'Acceda aquí para ver la lista de todas las ofertas bajo este filtro'+closureMessage
    });

    $('#logo_giombu').tooltipster({
		contentAsHTML: true,
		interactive: true,
        content: 'Este es nuestro logo. ¿Todavia no nos conoce?. Visite nuestro <a href="/nosotros"> perfil.</a>'+closureMessage
    });

});