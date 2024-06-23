<?php
$to  = "<shahvorostov@stop-dolg.ru>, " ;
$to .= "shahvorostov@stop-dolg.ru>";

$subject = "Заголовок письма";

$message = ' <p>Текст письма</p> </br> <b>1-ая строчка </b> </br><i>2-ая строчка </i> </br>';

echo "Ваше имя: " . $_GET["name"] . "<br />";
echo "Ваш возраст: " . $_GET["age"] . "<br />";

$headers  = "Content-type: text/html; charset=windows-1251 \r\n";
$headers .= "From: От кого письмо <shsv100@gmail.com>\r\n";
$headers .= "Reply-To: shahvorostov@stop-dolg.ru\r\n";

mail($to, $subject, $message, $headers);
