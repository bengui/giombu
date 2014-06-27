(function(){
    $('#send_button').click(function(){
        var user_id = $('#user_select').val();
        var message = $('#message_box').val();
        console.log('user_id : ' + user_id);
        console.log('message : ' + message);
        socket.emit('message', {
            user_id      : user_id,
            message      : message
        });
        $('#message_box').val('');
    });
})();
