window.addEventListener('onBitrixLiveChat', function(event) {
    var user = $("#user-data").data("user");

    console.log(user);
     var widget = event.detail.widget;

  // Установка внешней авторизации пользователя
  try {
    widget.setUserRegisterData({
      'hash': user.hash,
      'name': user.user.name,
      'lastName': user.user.surname,
      'email': user.user.Email,
    });
    widget.setCustomData([
      { "USER": {
          "NAME" : user.user.family+" "+user.user.name+" "+user.user.surname,
        } },
      {"GRID": [
          {
            "NAME" : "E-mail",
            "VALUE" : user.user.Email,
            "DISPLAY" : "LINE",
          },
          {
            "NAME" : "Код клиента",
            "VALUE" : "[url=https://crm.stop-dolg.ru/crm/contact/details/"+user.user.id_B24+"/]"+user.user.id_B24+"[/url]",
            "COLOR" : "#ff0000",
            "DISPLAY" : "LINE"
          },
          {
            "NAME": "Сайт",
            "VALUE": location.hostname,
            "DISPLAY": "LINE"
          },
          {
            "NAME": "Страница",
            "VALUE": "[url="+location.href+"]"+(document.title || location.href)+"[/url]",
            "DISPLAY": "LINE"
          }
        ] }
    ]);
  } catch (e) {}
});
