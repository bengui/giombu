$(document).ready(function(){

    socket.emit('news.start');

    //FUNCION VIEJA
    socket.on('_news.new', function(data){
            console.log(data);
            var container = $('<div class="alert alert-info"></div>');
            if(data.title){
                var title = $('<p class="bg-info"></p>').text(data.title);
            }
            var news = $('<p class="bg-info"></p>').text(data.message);
            container.append(news);
            container.hide();
            $('.feed_container').prepend(container);
            container.show('slow');
            
    });

    socket.on('news.new', function(data){
            console.log(data);
            var li = $('<li role="presentation"></li>');
            var close_btn = $('<button type="button" data-dismiss="alert" aria-hidden="true" class="close">×</button>');
            var element = $('<div class="alert alert-success alert-dismissable"></div>').text(data.message);
            if(data.title){
                var title = $('<strong></strong>').text(data.title);
                element.prepend($('<br />'));
                element.prepend(title);
            }
            element.prepend(close_btn);
            li.append(element);
            $('.feed_container').prepend(li);
            $('#feed_button').removeClass( "btn-default" ).addClass( "btn-success" );
    });

    $('.feed_container').click(function(element){
        var hasVisibleElements = false;
        $(this).children().each(function(kid){
            if($(kid).is(":visible")){
                hasVisibleElements = true;
            }
        });
        if(!hasVisibleElements){
            $('#feed_button').removeClass( "btn-success" ).addClass( "btn-default" );
        }
    });


});
