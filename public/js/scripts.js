$(document).ready(inicio);



//Acciones que se deben ejecutar cuando se carga la pagina
function inicio(){
 	$('#selectAll').click(function(event) {  
        if(this.checked) { 
            $('.select_list').each(function() { 
                this.checked = true;             
            });
        }else{
            $('.select_list').each(function() { 
                this.checked = false;                      
            });        
        }
    });
     $('.create_payment').click(function(){
		var total_amount=0;
		$('.select_list').each(function() { 
			if(this.checked){
				total_amount = parseFloat($(this).attr("amount")) + total_amount;
			}
        });
        if(total_amount < 20){
        	alert("El monto del pago debe ser superior a $20 para poder realizar el depósito.");
        }else{
			document.create_payment.submit();
        }
        
	})
	
 }