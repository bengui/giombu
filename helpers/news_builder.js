
exports.make_news_string = function (item){
    if(typeof item !== "undefined"){
         if(typeof item.event !== "undefined"){
              if(typeof item.event.body !== "undefined"){
                 var New_String,String_Deal ;
                 New_String = "";
                 String_Deal ="";
                 New_String = item.event.body;
                 var deal, to_user, from_user;
                 if(item.deal.title){
                    deal = item.deal.title;
                 }else{
                    deal = ''
                 }
                 if( item.to_user){
                    to_user =  item.to_user.name+' '+item.to_user.lname;
                 }else{
                    to_user = 'Usuario'
                 }
                 if(item.from_user){
                    from_user = item.from_user.name+' '+item.from_user.lname;
                 }else{
                   from_user = 'usuario'
                 }
                 
                 String_Deal = New_String.replace( /%d/ , deal);
                 String_Deal = String_Deal.replace( /%t/ , to_user);
                 String_Deal = String_Deal.replace( /%f/ , from_user);
                 if( typeof item.commission !== "undefined"){
                    String_Deal = String_Deal.replace( /%a/ , item.commission.amount);
                 }
                 return String_Deal;
                }
          }
    }
      return "";

}