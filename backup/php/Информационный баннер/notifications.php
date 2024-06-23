<?php
/** Информационный баннер **/

$user = $modx->getAuthenticatedUser('web');
$q = $modx->prepare("SELECT `id`,id_B24 FROM `site_Users` WHERE `login` = ? LIMIT 1");
$q->execute([$modx->user->get("username")]);
$user_data = $q->Fetch();
$user_id = $user_data['id'];

$pdo = $modx->getService('pdoTools');
$textIntroduction = "Напоминаем, ";
$textEnd = ". Если возникнут сложности напишите нам в чат.";

$infoIdGlobal = "";
$termGlobal = "";
$infoOplataIdGlobal = "";

/** Выбери все данные из табл. site_Oplata для авторизованного юзера,
 * где `paid` = 0 (Признак оплаты, не оплачен),
 * дата план. опл. больше текущей на 3 дня или меньше либо равно текущей и отсортирую дату план. опл. по убыванию
 */
$q = $modx->prepare("SELECT * FROM `site_Oplata` WHERE `user_id` = ? AND `paid` = 0 AND `payment_date` >= CURDATE() AND `payment_date` <= CURDATE() + INTERVAL 3 DAY ORDER BY `payment_date` ASC");
$q->execute([$user_id]);
$res = $q->FetchAll(PDO::FETCH_ASSOC);

// Выбрать все данные из таблицы site_notifications, где ID оплаты равен ID оплаты из табл. site_Oplata
$q = $modx->prepare("SELECT * FROM `site_notifications` WHERE `user_id` = ?");
$q->execute([$user_id]);
$rows = $q->FetchAll(PDO::FETCH_ASSOC);

$arrayOplataId = array();

if (count($rows) > 0) {
    foreach ($rows as $row) {
        $arrayOplataId[] = $row['oplata_id'];
    }
    $listOplataId = implode(",", $arrayOplataId); // Массив ИД

    /* Найти в таблице site_Oplata ИД с приближенным сроком оплаты и проверить, есть ли такой же ИД в табл. site_notifications у которого is_checked = 0,
        Если есть такой ИД то вывести его на страницу
    */
    if (count($res) > 0) {
        foreach ($res as $v) {
            foreach ($rows as $row) {
                if ($row['oplata_id'] == $v['id'] && $row['is_checked'] == 0) {
                    list($timeDay, $days) = RemainingTime($v['payment_date']);
                    list($contractNum, $contractId) = Contract($user_id, $v['dogovor_id']);
                    TimeCalculation($user_id, $v['id'], $timeDay, $textIntroduction, $days, $contractNum, $textEnd);
                    // print_r('1   ');
                    // print_r($v['id']);
                    return ShowNotification($pdo, $tpl, $contractId);
                }
            }
        }
    }

    $q = $modx->prepare("SELECT * FROM `site_notifications` WHERE `user_id` = ? AND `is_checked` = 1");
    $q->execute([$user_id]);
    $isChecked = $q->FetchAll(PDO::FETCH_ASSOC);

    /** Выбери все данные из табл. site_Oplata для авторизованного юзера, где `paid` = 0 (Признак оплаты, не оплачен), исключи из выборки ID,
     * которые есть в таблице site_notifications и дата план. опл. больше или равно текущей и меньше или равно на 3 дня текущей,
     * отсортирую дату план. опл. по возрастанию даты.
     */
    $q = $modx->prepare("SELECT * FROM `site_Oplata` WHERE `user_id` = ? AND `paid` = 0 AND `id` NOT IN ({$listOplataId}) AND `payment_date` >= CURDATE() AND `payment_date` <= CURDATE() + INTERVAL 3 DAY ORDER BY `payment_date` ASC LIMIT 1");
    $q->execute([$user_id]);
    $res = $q->FetchAll(PDO::FETCH_ASSOC);

    /* Если количество элементов в таблице site_notifications равно количеству элементов `is_checked` = 1 в той же таблице, то
        найти новый ИД в таблице site_Oplata, добавить в табл. site_notifications и вывести на страницу
    */
    if (count($rows) == count($isChecked)) {
        if (count($res) > 0) {
            foreach ($res as $v) {
                list($timeDay, $days) = RemainingTime($v['payment_date']);
                list($contractNum, $contractId) = Contract($user_id, $v['dogovor_id']);
                AddFollowingReminderToTable($user_id, $v['id'], $v['dogovor_id']);
                TimeCalculation($user_id, $v['id'], $timeDay, $textIntroduction, $days, $contractNum, $textEnd);
                // print_r('3');
            }
            return ShowNotification($pdo, $tpl, $contractId);
        }

        /* Иначе если количество элементов в таблице site_notifications НЕ равно количеству элементов `is_checked` = 1 в той же таблице, то
            найти новый ИД в таблице site_Oplata, добавить в табл. site_notifications и вывести на страницу.
            Это значит, что у какого-то элемента в табл. site_notifications кончился срок оплаты, но он не отмечен как `is_checked` = 1
        */
    } else {
        if (count($res) > 0) {
            foreach ($res as $v) {
                list($timeDay, $days) = RemainingTime($v['payment_date']);
                list($contractNum, $contractId) = Contract($user_id, $v['dogovor_id']);
                AddFollowingReminderToTable($user_id, $v['id'], $v['dogovor_id']);
                TimeCalculation($user_id, $v['id'], $timeDay, $textIntroduction, $days, $contractNum, $textEnd);
                // print_r('2');
                return ShowNotification($pdo, $tpl, $contractId);
            }
        }
    }

} else {
    if (count($res) > 0) {
        foreach ($res as $v) {
            list($timeDay, $days) = RemainingTime($v['payment_date']);
            list($contractNum, $contractId) = Contract($user_id, $v['dogovor_id']);
            AddFollowingReminderToTable($user_id, $v['id'], $v['dogovor_id']);
            TimeCalculation($user_id, $v['id'], $timeDay, $textIntroduction, $days, $contractNum, $textEnd);
            return ShowNotification($pdo, $tpl, $contractId);
        }
    }
}

/** Добавить договор с приближающейся датой оплаты в таблицу site_notifications **/
function AddFollowingReminderToTable($userID, $oplataID, $dogovorID) {
    global $modx;
    $data = array(NULL, $userID, $oplataID, $dogovorID, '', '', 'payment', NULL);
    $q = $modx->prepare("INSERT INTO `site_notifications` VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $q->execute($data);
}

/** Вычисление времени **/
function RemainingTime($paymentData) {
    $timeEnd = strtotime($paymentData . ', 23:59'); // Плановая дата платежа
    $timeDay = $timeEnd - time(); // Плановая дата платежа в сек. - сегоднешняя дата в сек.
    $days = floor(($timeDay % 345600) / 86400); // Вычислить сколько дней осталось до оплаты по договору
    return [$timeDay, $days];
}

/** Выбирает все данные из табл. site_Dogovor, где ID договора равно ID договору найденному по ближайшей дате оптате в табл. site_Oplata и не оплаченный договор **/
function Contract($userId, $vDogovorId) {
    global $modx;
    $q = $modx->prepare("SELECT * FROM `site_Dogovor` WHERE `user_id` = :userId AND `id` = :dogovorId");
    $q->execute(['userId' => $userId, 'dogovorId' => $vDogovorId]);
    $contract = $q->Fetch();
    return [$contract['number'], $contract['id']];
}

/** Выбирает все данные из табл. site_notifications, где запись имеет `is_checked` = 0, `type` = 'payment' и `oplata_id` = id записи из табл. site_Oplata.
 * Передает данные из таблицы site_notifications в верстку чанка tpl.info_banner (Напоминание клиенту).
 */
function TimeCalculation($userId, $oplataId, $time_day, $text_introduction, $howManyDays, $contractNumber, $text_end) {
    global $modx,
           $infoIdGlobal,
           $termGlobal,
           $infoOplataIdGlobal;

    if ($time_day <= 345600) {
        $q = $modx->prepare("SELECT * FROM `site_notifications` WHERE `user_id` = :userId AND `is_checked` = 0 AND `type` = 'payment' AND `oplata_id` = :oplataId");
        $q->execute(['userId' => $userId, 'oplataId' => $oplataId]);
        $res = $q->FetchAll(PDO::FETCH_ASSOC);

        if (count($res) > 0) {
            foreach ($res as $info) {
                $infoIdGlobal = $info['id'];
                $infoOplataIdGlobal = $info['oplata_id'];

                if ($time_day <= 86399) {
                    $term = $text_introduction . "сегодня нужно внести оплату по договору №" . $contractNumber . $text_end;
                    $termGlobal = $term;

                } elseif ($time_day > 86399 && $time_day < 172799) {
                    $term = $text_introduction . "завтра нужно внести оплату по договору №" . $contractNumber . $text_end;
                    $termGlobal = $term;

                } elseif ($time_day >= 172800 && $time_day <= 345600) {
                    $term = $text_introduction . "через " . $howManyDays . " дня оплата по договору №" . $contractNumber . $text_end;
                    $termGlobal = $term;
                }
            }
        }
    }
}

/** Принимает данные из функции TimeCalculation и создает через Ajax новое напоминание. **/
function ShowNotification($pdo, $tpl, $contractId) {
    global $infoIdGlobal,
           $termGlobal,
           $infoOplataIdGlobal;

    return $pdo->getChunk($tpl, array(
        'id' => $infoIdGlobal,
        'dogovor_id' => $contractId,
        'message' => $termGlobal,
        'oplataId' => $infoOplataIdGlobal
    ));
}
