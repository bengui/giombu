$(document).ready(function(){

    socket.emit('news.start');
    socket.on('news.new', function(data){
            var container = $('<div class="alert alert-info"></div>');
            var news = $('<p class="bg-info"></p>').text(data.message);
            container.append(news);
            container.hide();
            $('.feed_container').prepend(container);
            container.show('slow');
    });

    setInterval(function(){
        socket.emit('news.random');
    },60000);


});
