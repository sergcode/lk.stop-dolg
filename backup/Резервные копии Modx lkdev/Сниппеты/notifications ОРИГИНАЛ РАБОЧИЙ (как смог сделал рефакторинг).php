<?php
$user = $modx->getAuthenticatedUser('web');
$q = $modx->prepare("SELECT `id`,id_B24 FROM `site_exc_Users` WHERE `login` = ? LIMIT 1");
$q->execute([$modx->user->get("username")]);
$user_data = $q->Fetch();
$user_id = $user_data['id'];

$pdo = $modx->getService('pdoTools');
$textIntroduction = "На всякий случай напоминаем. ";
$textEnd = ". Если возникнут сложности напишите нам в чат.";

// Выбери все данные из табл. Оплата для юзера 4565, где дата план. опл. больше текущей на 3 дня или меньше либо равно текущей и осортирую дату план. опл. по убыванию
$q = $modx->prepare("SELECT * FROM `site_exc_Oplata` WHERE `user_id` = ? AND `payment_date` >= CURDATE() AND `payment_date` <= CURDATE() + INTERVAL 3 DAY ORDER BY `payment_date` ASC");
$q->execute([$user_id]);
$res = $q->FetchAll(PDO::FETCH_ASSOC);

// Выбрать все данные из таблицы site_modifications, где ID оплаты равен ID оплаты из табл. site_exc_Oplata
$q = $modx->prepare("SELECT * FROM `site_modifications` WHERE `user_id` = ?");
$q->execute([$user_id]);
$rows = $q->FetchAll(PDO::FETCH_ASSOC);

$arrayOplataId = array();

if (count($rows) > 0) {
  foreach ($rows as $row) {
    $arrayOplataId[] = $row['oplata_id'];
  }
  $listOplataId = implode(",", $arrayOplataId);

  if (count($res) > 0) {
    foreach ($res as $v) {
      $timeEnd = strtotime($v['payment_date'] . ', 23:59'); // Плановая дата платежа
      $timeDay = $timeEnd - time(); // Плановая дата платежа в сек. - сегоднешняя дата в сек.
      $days = floor(($timeDay % 345600) / 86400); // Вычислить сколько дней осталось до оплаты по договору

      // Выбери все данные из табл. site_exc_Dogovor, где ID договора равно ID договору найденному по ближайшей дате оптате в табл. site_exc_Oplata и не оплаченный договор
      $q = $modx->prepare("SELECT * FROM `site_exc_Dogovor` WHERE `user_id` = ? AND `id` = ({$v['dogovor_id']}) AND `closed` = 0");
      $q->execute([$user_id]);
      $agreements = $q->FetchAll(PDO::FETCH_ASSOC);
      foreach ($agreements as $d) $contract = $d;

      if ($timeDay <= 345600) { // Если Плановая дата платежа меньше либо равно 3-м дням
        $q = $modx->prepare("SELECT * FROM `site_modifications` WHERE `user_id` = ? AND `is_checked` = 0 AND `type` = 'payment' AND `oplata_id` = ({$v['id']})");
        $q->execute([$user_id]);
        $res = $q->FetchAll(PDO::FETCH_ASSOC);

        if (count($res) > 0) {
          foreach ($res as $info) {
            if ($timeDay <= 86399) {
              $term = $textIntroduction . "Сегодня нужно внести оплату по договору №" . $contract['number'] . $textEnd;

            } elseif ($timeDay > 86399 && $timeDay < 172799) {
              $term = $textIntroduction . "Завтра нужно внести оплату по договору №" . $contract['number'] . $textEnd;

            } elseif ($timeDay >= 86400 && $timeDay <= 172800) {
              $term = $textIntroduction . "Через " . $days . " день оплата по договору №" . $contract['number'] . $textEnd;

            } elseif ($timeDay >= 172800 && $timeDay <= 345600) {
              $term = $textIntroduction . "Через " . $days . " дня оплата по договору №" . $contract['number'] . $textEnd;
            }
          }
        }
      }
    }
    if (isset($info, $contract, $term, $v)) {
      return $pdo->getChunk($tpl, array(
          'id' => $info['id'],
          'dogovor_id' => $contract['id'],
          'message' => $term,
          'oplataId' => $info['oplata_id']
      ));
    }
  }

  $q = $modx->prepare("SELECT * FROM `site_modifications` WHERE `user_id` = ? AND `is_checked` = 1");
  $q->execute([$user_id]);
  $isChecked = $q->FetchAll(PDO::FETCH_ASSOC);

  // Выбери все данные из табл. Оплата для юзера 4565, где нужно исключить из выборки ID, которые есть в таблице site_modifications и дата план. опл. больше или равно текущей и больше или равно на 3 дня текущей, отсортирую дату план. опл. по возрастанию даты
  $q = $modx->prepare("SELECT * FROM `site_exc_Oplata` WHERE `user_id` = ? AND `id` NOT IN ({$listOplataId}) AND `payment_date` >= CURDATE() AND `payment_date` <= CURDATE() + INTERVAL 3 DAY ORDER BY `payment_date` ASC LIMIT 1");
  $q->execute([$user_id]);
  $res = $q->FetchAll(PDO::FETCH_ASSOC);

  if (count($rows) == count($isChecked)) {

    if (count($res) > 0) {
      foreach ($res as $v) {

        $timeEnd = strtotime($v['payment_date'] . ', 23:59'); // Плановая дата платежа
        $timeDay = $timeEnd - time(); // Плановая дата платежа в сек. - сегоднешняя дата в сек.
        $days = floor(($timeDay % 345600) / 86400); // Вычислить сколько дней осталось до оплаты по договору

        // Выбери все данные из табл. site_exc_Dogovor, где ID договора равно ID договору найденному по ближайшей дате оптате в табл. site_exc_Oplata и не оплаченный договор
        $q = $modx->prepare("SELECT * FROM `site_exc_Dogovor` WHERE `user_id` = ? AND `id` = ({$v['dogovor_id']}) AND `closed` = 0");
        $q->execute([$user_id]);
        $agreements = $q->FetchAll(PDO::FETCH_ASSOC);
        foreach ($agreements as $d) $contract = $d;

        AddFollowingReminderToTable($user_id, $v['id'], $v['dogovor_id']);

        if ($timeDay <= 345600) { // Если Плановая дата платежа меньше либо равно 3-м дням
          $q = $modx->prepare("SELECT * FROM `site_modifications` WHERE `user_id` = ? AND `is_checked` = 0 AND `type` = 'payment' AND `oplata_id` = ({$v['id']})");
          $q->execute([$user_id]);
          $res = $q->FetchAll(PDO::FETCH_ASSOC);

          if (count($res) > 0) {
            foreach ($res as $info) {
              if ($timeDay <= 86399) {
                $term = $textIntroduction . "Сегодня нужно внести оплату по договору №" . $contract['number'] . $textEnd;

              } elseif ($timeDay > 86399 && $timeDay < 172799) {
                $term = $textIntroduction . "Завтра нужно внести оплату по договору №" . $contract['number'] . $textEnd;

              } elseif ($timeDay >= 86400 && $timeDay <= 172800) {
                $term = $textIntroduction . "Через " . $days . " день оплата по договору №" . $contract['number'] . $textEnd;

              } elseif ($timeDay >= 172800 && $timeDay <= 345600) {
                $term = $textIntroduction . "Через " . $days . " дня оплата по договору №" . $contract['number'] . $textEnd;
              }
            }
          }
        }
      }
      if (isset($info, $contract, $term, $v)) {
        return $pdo->getChunk($tpl, array(
            'id' => $info['id'],
            'dogovor_id' => $contract['id'],
            'message' => $term,
            'oplataId' => $info['oplata_id']
        ));
      }
    }
  }
}
else {
  if (count($res) > 0) {
    foreach ($res as $v) {
      $timeEnd = strtotime($v['payment_date'] . ', 23:59'); // Плановая дата платежа
      $timeDay = $timeEnd - time(); // Плановая дата платежа в сек. - сегоднешняя дата в сек.
      $days = floor(($timeDay % 345600) / 86400); // Вычислить сколько дней осталось до оплаты по договору

      // Выбери все данные из табл. site_exc_Dogovor, где ID договора равно ID договору найденному по ближайшей дате оптате в табл. site_exc_Oplata и не оплаченный договор
      $q = $modx->prepare("SELECT * FROM `site_exc_Dogovor` WHERE `user_id` = ? AND `id` = ({$v['dogovor_id']}) AND `closed` = 0");
      $q->execute([$user_id]);
      $agreements = $q->FetchAll(PDO::FETCH_ASSOC);
      foreach ($agreements as $d) $contract = $d;

      AddFollowingReminderToTable($user_id, $v['id'], $v['dogovor_id']);

      if ($timeDay <= 345600) { // Если Плановая дата платежа меньше либо равно 3-м дням
        $q = $modx->prepare("SELECT * FROM `site_modifications` WHERE `user_id` = ? AND `is_checked` = 0 AND `type` = 'payment' AND `oplata_id` = ({$v['id']})");
        $q->execute([$user_id]);
        $res = $q->FetchAll(PDO::FETCH_ASSOC);

        if (count($res) > 0) {
          foreach ($res as $info) {
            if ($timeDay <= 86399) {
              $term = $textIntroduction . "Сегодня нужно внести оплату по договору №" . $contract['number'] . $textEnd;

            } elseif ($timeDay > 86399 && $timeDay < 172799) {
              $term = $textIntroduction . "Завтра нужно внести оплату по договору №" . $contract['number'] . $textEnd;

            } elseif ($timeDay >= 86400 && $timeDay <= 172800) {
              $term = $textIntroduction . "Через " . $days . " день оплата по договору №" . $contract['number'] . $textEnd;

            } elseif ($timeDay >= 172800 && $timeDay <= 345600) {
              $term = $textIntroduction . "Через " . $days . " дня оплата по договору №" . $contract['number'] . $textEnd;
            }
          }

          if (isset($info, $contract, $term, $v)) {
            return $pdo->getChunk($tpl, array(
                'id' => $info['id'],
                'dogovor_id' => $contract['id'],
                'message' => $term,
                'oplataId' => $info['oplata_id']
            ));
          }
        }
      }
    }
  }
}

function AddFollowingReminderToTable($userID, $oplataID, $dogovorID) {
  global $modx;
  $data = array(NULL, $userID, $oplataID, $dogovorID, '', '', 'payment', NULL);
  $q = $modx->prepare("INSERT INTO `site_modifications` VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  $q->execute($data);
}
