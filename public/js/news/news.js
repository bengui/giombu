$(document).ready(function(){

    socket.emit('news.start');

    socket.on('news.new', function(data){
            console.log(data);
            var li = $('<li role="presentation"></li>');
            var element = $('<p class="bg-success"></p>').text(data.message);
            var element = $('<p></p>').text(data.message);
            if(data.title){
                var title = $('<strong class="text-info"></strong>').text(data.title);
                element.prepend($('<br />'));
                element.prepend(title);
            }
            li.append($('<small class="text-muted pull-right"></small>').text(data.date));
            li.append(element);
            $('.feed_container').prepend(li);
            $('#feed_button').removeClass( "disabled" );
            $('#feed_button').removeClass( "btn-default" ).addClass( "btn-success" );
    });

    $('#feed_button').click(function(){
        $(this).removeClass( "btn-success" ).addClass( "btn-default" );
    });


    // $('.feed_container').click(function(element){    
    //     var hasVisibleElements = false;
    //     $(this).children().each(function(kid){
    //         if($(kid).is(":visible")){
    //             hasVisibleElements = true;
    //         }
    //     });
    //     if(!hasVisibleElements){
    //         // $('#feed_button').addClass( "disabled" );
    //     }else{
    //         $('#feed_button').removeClass( "disabled" );
    //     }

    // });


});
