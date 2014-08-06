$(document).ready(function(){

    socket.emit('news.start');
    socket.on('news.new', function(data){
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

});
