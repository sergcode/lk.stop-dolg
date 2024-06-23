$(document).ready(function () {
  $('.sendFeed').click(function (e) {
    showModal();
  });
  $('.yesitis').click(function (e) {
    var fd = new FormData();
    fd.append('action', 'getFeedBack');
    fd.append('type', $(this).data("action"));
    $.ajax({
      type: "POST",
      url: "/assets/ajax.php",
      data: fd,
      contentType: false,
      cache: false,
      processData: false,
      success: function (msg) {
        mass = JSON.parse(msg);

        if (mass.result == "ok") {} else {
          alert("Что-то пошло не так. Но мы уже исправляем это.");
        }
      }
    });
  });
});
//# sourceMappingURL=send.feed.js.map
