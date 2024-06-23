<?php
$fields = array(
    "Плохо",
    "Нормально",
    "Отлично",
    "key"
);
foreach ($fields as $field){
  if (!isset($_POST[$field])){
    echo json_encode(array(			"status"=>"Ошибка"		));
    die();
  }}
$subj = "Заявка с сайта ".$_SERVER["SERVER_NAME"];
$file_name = date("d.m.Y H:i:s") . "_" . $to;
//путь к файлу сохранения
$need_save = true;
$from = "";
$to = array(	"shahvorostov@stop-dolg.ru");
$headers = array();
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-type: text/html;
 charset=UTF-8";
$headers[] = "Subject: {$subj}";
if (!empty($from)){
  $headers[] = "From: {$from}";
  $headers[] = "Reply-To: {$replyTo}";
}
foreach ($_POST as $key=>$value){
  ${$key} = htmlspecialchars($value);
}
$fullmsg = "<p>Информация по заявке:</p>";
$fullmsg .= "<p>";foreach ($fields as $field){
  $fullmsg .= $field.": {".${$field}."}<br/>";
}
$fullmsg .= "</p>";
foreach ($to as $emailTo){
  $phpmailStatus = mail($emailTo, $subj, $fullmsg, implode("\r\n", $headers));
  if (!$phpmailStatus AND $need_save) {
    $text = $headers . "\n" . $subj . "\n" . $fullmsg . "\n";
    file_put_contents($file_name, $text, FILE_APPEND | LOCK_EX);
    break;
  }
}
$response = array(		"status"=>"ok",		"message"=>"Сообщение отправлено");
if (!$phpmailStatus) {
  $response = array(
      "status"=>"error"
  );
}
echo json_encode($response);
