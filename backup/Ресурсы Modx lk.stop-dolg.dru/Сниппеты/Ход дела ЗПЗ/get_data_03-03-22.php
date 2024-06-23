<?php
$q = $modx->prepare("SELECT `id` FROM `site_exc_Users` WHERE `login` = ? LIMIT 1");
$q->execute([$modx->user->get("username")]);
$user_id = $q->FetchColumn();

// if(!$user_id) return false;
if(!isset($id_stage)) $id_stage = 1;

// $q = $modx->prepare("SELECT * FROM `site_protect_progress` WHERE `user_id` = ? AND `id_stage` = '1' LIMIT 1");
$q = $modx->prepare("SELECT * FROM `site_protect_progress` WHERE `user_id` = ? AND `id_stage` = '{$id_stage}' LIMIT 1");

$q->execute([$user_id]);
$protect_progress = $q->Fetch(PDO::FETCH_ASSOC);

$q = $modx->prepare("SELECT * FROM `site_protect_sub_progress` WHERE `user_id` = ?");
$q->execute([$user_id]);
$res = $q->FetchAll(PDO::FETCH_ASSOC);



foreach($res as $v) {
  $sub_protect['id'.$v['id_substage']] = $v;
}



switch($target) {
  case 'get_tasks_four': {
    $q = $modx->prepare("SELECT *,`title` as name FROM `site_protect_task_creditor` WHERE `user_id` = ? AND `id_substage` = 14 ORDER BY `date_end` ASC");
    $q->execute([$user_id]);

    $res = $q->FetchAll(PDO::FETCH_ASSOC);

    if (count($res)) {
      foreach($res as $v) {

        if ($v['date_end'] != "0000-00-00") {
          $v['show_date_end'] = "1";
          $v['endClass'] = "completed-task";
        } else {
          $v['endClass'] = " ";
          $v['show_dedline'] = "1";
        }

        echo $modx->getChunk($tpl, $v);
      }
    }
  } break;
  case 'zpz-disturbance-completed-count': {
    $q = $modx->prepare("SELECT COUNT(*) FROM `site_protect_violation` WHERE `user_id` = ? AND `date_end` <> '0000-00-00'");
    $q->execute([$user_id]);
    $res = $q->FetchColumn();
    echo $res == "" ? 0 : $res;

  } break;
  case 'zpz-disturbance-completed': {
    $q = $modx->prepare("SELECT * FROM `site_protect_violation` WHERE `user_id` = ? AND `date_end` <> '0000-00-00'");
    $q->execute([$user_id]);
    $res = $q->FetchAll(PDO::FETCH_ASSOC);

    if (count($res) >0) {
      $num = 1;
      foreach($res as $v) {
        $v['num'] = $num;

        $q = $modx->prepare("SELECT *,`title` as name FROM `site_protect_task_creditor` WHERE `user_id` = ? AND `id_violation` = ? AND `date_end` <> '0000-00-00' ORDER BY `date_end` ASC ");
        $q->execute([$user_id, $v['id']]);

        $tasks = $q->FetchAll(PDO::FETCH_ASSOC);

        if (count($tasks)) {

          foreach($tasks as $task) {
            $task['show_dedline'] = "1";
            $v['tasks'] .= $modx->getChunk('zpz-task-comment', $task);
          }
        }

        $q = $modx->prepare("SELECT * FROM `site_protect_violation_details` WHERE `id_violation` = ? ORDER BY `rank`");
        $q->execute([$v['id']]);
        $violation_details = $q->FetchAll(PDO::FETCH_ASSOC);

        if (count($violation_details) > 0) {

          foreach($violation_details as $violation_detail) {
            $q = $modx->prepare("SELECT `name` FROM `site_protect_violation_type` WHERE `id` = ? LIMIT 1");
            $q->execute([$violation_detail['id_income_type']]);

            $violation_detail['name'] = $q->FetchColumn();

            $v['zpz-violation_details-completed'] .= $modx->getChunk('tpl.zpz-violation_details-completed', $violation_detail);
          }
        }
        $v['date_added'] = date("d.m.Y", strtotime($v['date_added']));
        $v['date_end'] = date("d.m.Y", strtotime($v['date_end']));
        echo $modx->getChunk($tpl, $v);

        $num++;
      }
    } else {
      return '<div class="no-data no-data__pt-40"><p>Пока что отсутсвуют</p></div>';
    }

  } break;
  case 'zpz-disturbance-count': {
    $q = $modx->prepare("SELECT COUNT(*) FROM `site_protect_violation` WHERE `user_id` = ? AND `date_end` = '0000-00-00'");
    $q->execute([$user_id]);
    $res = $q->FetchColumn();
    echo $res == "" ? 0 : $res;

  } break;
  case 'zpz-disturbance': {
    $q = $modx->prepare("SELECT * FROM `site_protect_violation` WHERE `user_id` = ? AND `date_end` = '0000-00-00'");
    $q->execute([$user_id]);

    $res = $q->FetchAll(PDO::FETCH_ASSOC);

    if (count($res) >0) {
      $num = 1;
      foreach($res as $v) {
        $v['num'] = $res['number'];

        $q = $modx->prepare("SELECT *,`title` as name FROM `site_protect_task_creditor` WHERE `user_id` = ? AND `id_violation` = ? AND `date_end` = '0000-00-00' ORDER BY `date_end` ASC");
        $q->execute([$user_id, $v['id']]);

        $tasks = $q->FetchAll(PDO::FETCH_ASSOC);

        if (count($tasks)) {

          foreach($tasks as $task) {
            $task['show_dedline'] = "1";

            $v['tasks'] .= $modx->getChunk('zpz-task-comment', $task);
          }
        }

        $q = $modx->prepare("SELECT * FROM `site_protect_violation_details` WHERE `id_violation` = ? ORDER BY `rank`");
        $q->execute([$v['id']]);
        $violation_details = $q->FetchAll(PDO::FETCH_ASSOC);

        if (count($violation_details) > 0) {

          foreach($violation_details as $violation_detail) {
            $q = $modx->prepare("SELECT `name` FROM `site_protect_violation_type` WHERE `id` = ? LIMIT 1");
            $q->execute([$violation_detail['id_income_type']]);

            $violation_detail['name'] = $q->FetchColumn();

            $v['zpz-violation_details'] .= $modx->getChunk('tpl.zpz-violation_details', $violation_detail);

          }
        }


        $v['date_added'] = date("d.m.Y", strtotime($v['date_added']));
        $v['date_end'] = date("d.m.Y", strtotime($v['date_end']));
        echo $modx->getChunk($tpl, $v);
        $num++;
      }
    }

  } break;
  case 'get_tasks_tree': {
    $q = $modx->prepare("SELECT *,`title` as name FROM `site_protect_task_creditor` WHERE `user_id` = ? AND `id_substage` = '7' AND `date_end` = '0000-00-00' ORDER BY `date_end` ASC");
    $q->execute([$user_id]);

    $res = $q->FetchAll(PDO::FETCH_ASSOC);

    if (count($res)) {
      foreach($res as $v) {

        if ($v['date_end'] != "0000-00-00") {
          $v['show_date_end'] = "1";
          $v['endClass'] = "completed-task";
        } else {
          $v['endClass'] = " ";
          $v['show_dedline'] = "1";
        }

        echo $modx->getChunk($tpl, $v);
      }
    }
  } break;
  case 'get_tasks_two': {
    $q = $modx->prepare("SELECT *,`title` as name FROM `site_protect_task_creditor` WHERE `user_id` = ? AND `id_creditor` > 0 ORDER BY `date_end` ASC");
    $q->execute([$user_id]);

    $res = $q->FetchAll(PDO::FETCH_ASSOC);

    if (count($res)) {
      foreach($res as $v) {

        if ($v['date_end'] != "0000-00-00") {
          $v['show_date_end'] = "1";
          $v['endClass'] = "completed-task";
        } else {
          $v['endClass'] = " ";
          $v['show_dedline'] = "1";
        }

        echo $modx->getChunk($tpl, $v);
      }
    }
  } break;
  case 'zpz-creditors': {
    $q = $modx->prepare("SELECT * FROM `site_protect_sub_progress_creditor` WHERE `user_id` = ? AND `stage` = 1");
    $q->execute([$user_id]);

    $res = $q->FetchAll(PDO::FETCH_ASSOC);

    $num = 1;

    if (count($res)) {
      foreach($res as $v) {
        $v['num'] = $num;

        // $q = $modx->prepare("SELECT `name` FROM `site_protect_creditor` WHERE `id` = ? LIMIT 1");
        // $q->execute([$v['id_creditor']]);
        // $v['cred_name'] = $q->FetchColumn();

        // $q = $modx->prepare("SELECT COUNT(*) FROM `site_protect_task_creditor` WHERE `id_creditor` = ? AND `user_id` = ?");
        // $q->execute([$v['id_creditor'], $user_id]);
        // $v['all_tasks'] = $q->FetchColumn();

        // $q = $modx->prepare("SELECT COUNT(*) FROM `site_protect_task_creditor` WHERE `id_creditor` = ? AND `date_end` <> '0000-00-00' AND `user_id` = ?");
        // $q->execute([$v['id_creditor'], $user_id]);
        // $v['end_tasks'] = $q->FetchColumn();


        $q = $modx->prepare("SELECT `name` FROM `site_protect_creditor` WHERE `id` = ? LIMIT 1");
        $q->execute([$v['id_creditor']]);
        $v['cred_name'] = $q->FetchColumn();

        $q = $modx->prepare("SELECT COUNT(*) FROM `site_protect_task_creditor` WHERE `id_creditor` = ? AND `user_id` = ?");
        $q->execute([$v['id_creditor'], $user_id]);
        $v['all_tasks'] = $q->FetchColumn();

        $q = $modx->prepare("SELECT COUNT(*) FROM `site_protect_task_creditor` WHERE `id_creditor` = ? AND `date_end` <> '0000-00-00' AND `user_id` = ?");
        $q->execute([$v['id_creditor'], $user_id]);
        $v['end_tasks'] = $q->FetchColumn();

        $q = $modx->prepare("SELECT * FROM `site_protect_sub_progress_creditor` WHERE `user_id` = ? AND `id_creditor` = ? LIMIT 1");
        $q->execute([$user_id, $v['id_creditor']]);

        $cred_prog = $q->Fetch(PDO::FETCH_ASSOC);

        $v['all_tasks'] = $cred_prog['task_work'];
        $v['end_tasks'] = $cred_prog['task_complete'];



        $q = $modx->prepare("SELECT *,`title` as name FROM `site_protect_task_creditor` WHERE `user_id` = ? AND `id_creditor` = ?  ORDER BY `date_end` ASC ");  //AND `date_end` = '0000-00-00'
        $q->execute([$user_id, $v['id_creditor']]);

        $tasks = $q->FetchAll(PDO::FETCH_ASSOC);
        // $all_tasks = 0;
        // $end_tasks = 0;
        if (count($tasks)) {

          foreach($tasks as $task) {
            $task['show_dedline'] = "1";

            if ($task['date_end'] != "0000-00-00") {
              $task['show_date_end'] = "1";
              $task['endClass'] = "completed-task";
              $end_tasks++;
            } else {
              $task['endClass'] = " ";
              $task['show_dedline'] = "1";
            }

            $v['tasks'] .= $modx->getChunk('zpz-task-comment', $task);
            $all_tasks++;
          }
        }
        //
        $v['all_tasks'] = $all_tasks-$end_tasks;
        $v['end_tasks'] = $end_tasks;

        $q = $modx->prepare("SELECT * FROM `site_protect_obligation` WHERE `id_creditor` = ? AND user_id= ?");
        $q->execute([$v['id_creditor'],$user_id]);

        $res = $q->FetchAll(PDO::FETCH_ASSOC);

        if (count($res) > 0) {
          foreach($res as $k) {
            $q = $modx->prepare("SELECT `name` FROM `site_protect_type_obligation` WHERE `id` = ? LIMIT 1");
            $q->execute([$k['id_obligation']]);
            $k['name'] = $q->FetchColumn();

            $k['amount'] = number_format($k['amount'], 0, '', ' ' );

            $v['protect_obligation'] .= $modx->getChunk('tpl.protect_obligation', $k);
          }
        }
        $v['debt_amount'] = number_format($v['debt_amount'], 0, '', ' ' );


        echo $modx->getChunk($tpl, $v);
        $num++;
      }
    }
  }  break;

  // Дата изменения: 01.03.22 Начало: Кредитор не может взыскать долг
  case 'zpz_creditor_cannot_debt_total_amount': {
    $q = $modx->prepare("SELECT SUM(`debt_amount`) FROM `site_protect_sub_progress_creditor` WHERE `user_id` = ? AND `stage` = 4"); // Таблица Подэтапы-Кредиторы
    $q->execute([$user_id]);
    $resQ = $q->FetchColumn();

    $q = $modx->prepare("SELECT SUM(`sum_recovery`) FROM `site_protect_exec_process` WHERE `user_id` = ? AND `closed` = 1 AND `date_closed` <> '0000-00-00'"); // Таблица Исполнительное производство
    $q->execute([$user_id]);
    $resW = $q->FetchColumn();

    $sum = number_format($resQ + $resW, 0, '', ' ' );
    echo $sum === '' ? 0 : $sum;
  } break;

  case 'zpz_creditor_cannot_debt_statute_limitations_passeds': {
    $q = $modx->prepare("SELECT * FROM `site_protect_sub_progress_creditor` WHERE `user_id` = ? AND `stage`= 4");
    $q->execute([$user_id]);

    $res = $q->FetchAll(PDO::FETCH_ASSOC);

    $num = 1;

    if (count($res)) {
      foreach($res as $v) {
        $v['num'] = $num;

        $q = $modx->prepare("SELECT `name` FROM `site_protect_creditor` WHERE `id` = ? LIMIT 1");
        $q->execute([$v['id_creditor']]);
        $v['cred_name'] = $q->FetchColumn();

        $q = $modx->prepare("SELECT COUNT(*) FROM `site_protect_task_creditor` WHERE `id_creditor` = ? AND `user_id` = ?");
        $q->execute([$v['id_creditor'], $user_id]);
        $v['all_tasks'] = $q->FetchColumn();

        $q = $modx->prepare("SELECT COUNT(*) FROM `site_protect_task_creditor` WHERE `id_creditor` = ? AND `date_end` <> '0000-00-00' AND `user_id` = ?");
        $q->execute([$v['id_creditor'], $user_id]);
        $v['end_tasks'] = $q->FetchColumn();

        $q = $modx->prepare("SELECT * FROM `site_protect_sub_progress_creditor` WHERE `user_id` = ? AND `id_creditor` = ? LIMIT 1");
        $q->execute([$user_id, $v['id_creditor']]);

        $cred_prog = $q->Fetch(PDO::FETCH_ASSOC);

        $v['all_tasks'] = $cred_prog['task_work'];
        $v['end_tasks'] = $cred_prog['task_complete'];

        $q = $modx->prepare("SELECT *,`title` as name FROM `site_protect_task_creditor` WHERE `user_id` = ? AND `id_creditor` = ?  ORDER BY `date_end` ASC ");  //AND `date_end` = '0000-00-00'
        $q->execute([$user_id, $v['id_creditor']]);

        $tasks = $q->FetchAll(PDO::FETCH_ASSOC);

        if (count($tasks)) {

          foreach($tasks as $task) {
            $task['show_dedline'] = "1";

            if ($task['date_end'] != "0000-00-00") {
              $task['show_date_end'] = "1";
              $task['endClass'] = "completed-task";
              $end_tasks++;
            } else {
              $task['endClass'] = " ";
              $task['show_dedline'] = "1";
            }

            $v['tasks'] .= $modx->getChunk('zpz-task-comment', $task);
            $all_tasks++;
          }
        }

        $v['all_tasks'] = $all_tasks-$end_tasks;
        $v['end_tasks'] = $end_tasks;

        $q = $modx->prepare("SELECT * FROM `site_protect_obligation` WHERE `id_creditor` = ? AND user_id= ?");
        $q->execute([$v['id_creditor'],$user_id]);

        $res = $q->FetchAll(PDO::FETCH_ASSOC);

        if (count($res) > 0) {
          foreach($res as $k) {
            $q = $modx->prepare("SELECT `name` FROM `site_protect_type_obligation` WHERE `id` = ? LIMIT 1");
            $q->execute([$k['id_obligation']]);
            $k['name'] = $q->FetchColumn();

            $k['amount'] = number_format($k['amount'], 0, '', ' ' );

            $v['protect_obligation'] .= $modx->getChunk('tpl.protect_obligation', $k);
          }
        }
        $v['debt_amount'] = number_format($v['debt_amount'], 0, '', ' ' );


        echo $modx->getChunk($tpl, $v);
        $num++;
      }

    } else {
      return '<div class="no-data no-data__pt-10 no-data__pb-60"><p>Данных нет</p></div>';
    }

  } break;

  case 'zpz_creditor_cannot_debt_statute_limitations_passeds_count': {
    $q = $modx->prepare("SELECT COUNT(*) FROM `site_protect_sub_progress_creditor` WHERE `user_id`= ? AND `id_substage` = 10 AND `stage` = 4");
    $q->execute([$user_id]);
    $res = $q->FetchColumn();
    echo $res == "" ? 0 : $res;
  } break;

  case 'zpz_creditor_cannot_debt_execution_proceedings_stopped_count': {
    $q = $modx->prepare("SELECT COUNT(*) FROM `site_protect_exec_process` WHERE `user_id` = ? AND `closed` = 1 AND `date_closed` <> '0000-00-00'");
    $q->execute([$user_id]);
    $res = $q->FetchColumn();
    echo $res == "" ? 0 : $res;
  } break;
  // Конец: Кредитор не может взыскать долг

  case 'get_tasks_one': {
    $q = $modx->prepare("SELECT *,`title` as name FROM `site_protect_task_creditor` WHERE `user_id` = ? AND `id_substage` = 15 ORDER BY `date_end` ASC");
    $q->execute([$user_id]);

    $res = $q->FetchAll(PDO::FETCH_ASSOC);

    if (count($res)) {
      foreach($res as $v) {

        if ($v['date_end'] != "0000-00-00") {
          $v['show_date_end'] = "1";
          $v['endClass'] = "completed-task";
        } else {
          $v['endClass'] = " ";
          $v['show_dedline'] = "1";
        }

        echo $modx->getChunk($tpl, $v);
      }
    }
  } break;
  case 'get_property': {
    $q = $modx->prepare("SELECT * FROM `site_protect_property` WHERE `status` = ? AND `user_id` = ?");
    $q->execute([$mode, $user_id]);

    $res = $q->FetchAll(PDO::FETCH_ASSOC);



    if (count($res)) {
      foreach($res as $v) {
        echo $modx->getChunk($tpl, $v);
      }
    }

  } break;
  case '8_comment': {
    echo $sub_protect['id8']['comment'];
  } break;
  case '7_task_work': {
    $q = $modx->prepare("SELECT COUNT(1) as `task_work` FROM `site_protect_task_creditor` 
        WHERE `date_end`='0000-00-00' AND id_substage=7 AND user_id={$user_id}");
    $q->execute();
    $task_work = $q->fetchColumn();
    echo $task_work == "" ? "0" : $task_work;
  } break;
  case '7_violation_total': {
    $q = $modx->prepare("SELECT COUNT(1) as `violation_total` FROM `site_protect_violation` 
        WHERE user_id={$user_id}");
    $q->execute();
    $violation_total = $q->fetchColumn();
    echo $violation_total == "" ? "0" : $violation_total;
  } break;
  case '10_task_work': {
    $q = $modx->prepare("SELECT COUNT(1) as `task_work` FROM `site_protect_task_creditor` 
        WHERE `date_end`='0000-00-00' AND `id_creditor` > 0 AND user_id={$user_id}");
    $q->execute();
    $task_work = $q->fetchColumn();
    echo $task_work == "" ? "0" : $task_work;
  } break;
  case '10_creditor_total': {
    $q = $modx->prepare("SELECT COUNT(1) as `creditor_total` FROM `site_protect_sub_progress_creditor` 
        WHERE user_id={$user_id}");
    $q->execute();
    $creditor_total = $q->fetchColumn();
    echo $creditor_total == "" ? "0" : $creditor_total;
  } break;
  case '8_task_work': {
    $q = $modx->prepare("SELECT COUNT(1) as `task_work` FROM `site_protect_task_creditor` 
        WHERE `date_end`='0000-00-00' AND (id_substage=14 OR id_substage=15) AND user_id={$user_id}");
    $q->execute();
    $task_work = $q->fetchColumn();
    echo $task_work == "" ? "0" : $task_work;
  } break;
  case 'get-zpz-work-task_tasks_item': {

    $q = $modx->prepare("SELECT `id`,`name` FROM `site_protect_income_type`");
    $q->execute();
    $types = $q->fetchAll(PDO::FETCH_KEY_PAIR);


    $q = $modx->prepare("SELECT * FROM `site_protect_income` WHERE `user_id` = ?");
    $q->execute([$user_id]);

    $res = $q->FetchAll(PDO::FETCH_ASSOC);

    if (count($res) > 0) {
      foreach($res as $v){
        switch($mode) {
          case 'protect': { $v['price'] = number_format($v['income_protected'], 0, '', ' ' ); } break;
          case 'all': { $v['price'] = number_format($v['income_total'], 0, '', ' ' ); } break;
        }

        $v['type'] = $types[$v['id_income_type']];

        echo $modx->getChunk($tpl, $v);
      }
    }

  } break;
  case 'creditor_total': {
    $q = $modx->query("SELECT COUNT(DISTINCT id_creditor) as `creditor_total` FROM `site_protect_sub_progress_creditor` 
        WHERE user_id={$user_id} AND stage=1");
    if($q) $creditor_total = $q->fetchColumn();
    else $creditor_total = 0;
    echo $creditor_total == "" ? "0" : $creditor_total;
  } break;
  case 'creditor_stop': {
    echo $protect_progress['creditor_stop'] == "" ? "0" : $protect_progress['creditor_stop'];
  } break;
  case 'creditor_miss': {
    echo $protect_progress['creditor_miss'] == "" ? "0" : $protect_progress['creditor_miss'];
  } break;


  case 'task_total': {
    $sql = "SELECT COUNT(1) as `task_work` FROM `site_protect_task_creditor` 
        WHERE id_substage IN ({$id_substage}) AND user_id={$user_id}";
    if($where) $sql .= $where;
    $q = $modx->query($sql);
    $task_work = $q->fetchColumn();
    echo $task_work == "" ? "0" : $task_work;
  } break;
  case 'task_work': {
    $sql = "SELECT COUNT(1) as `task_work` FROM `site_protect_task_creditor` 
        WHERE `date_end`='0000-00-00' AND id_substage IN ({$id_substage}) AND user_id={$user_id}";
    if($where) $sql .= $where;
    $q = $modx->query($sql);
    $task_work = $q->fetchColumn();
    echo $task_work == "" ? "0" : $task_work;
  } break;
  case 'task_end': {
    $sql = "SELECT COUNT(1) as `task_work` FROM `site_protect_task_creditor` 
        WHERE `date_end`<>'0000-00-00' AND id_substage IN ({$id_substage}) AND user_id={$user_id}";
    if($where) $sql .= $where;
    $q = $modx->query($sql);
    $task_work = $q->fetchColumn();
    echo $task_work == "" ? "0" : $task_work;
  } break;

  case 'creditors_coutr_now_task_count':
    $q = $modx->prepare("SELECT COUNT(*) as `count` FROM `site_protect_task_creditor` WHERE `user_id` = :user_id AND `id_creditor` IN (
            SELECT p2.id as title FROM `site_protect_court` as p1 LEFT JOIN `site_protect_creditor` as p2 ON p1.id_creditor = p2.id
        WHERE (p1.description_complete='' OR p1.description_complete='-' ) AND p2.name!='' AND p1.user_id=:user_id
        ) AND id_substage=20");
    $q->execute(['user_id'=>$user_id]);
    $task_work = $q->fetchColumn();
    echo $task_work == "" ? 0 : $task_work;

    break;
  case 'creditords_coutr_complete_task_count':
    $q = $modx->prepare("SELECT COUNT(*) as `count` FROM `site_protect_task_creditor` WHERE `user_id` = :user_id AND `id_creditor` IN (
            SELECT p2.id as title FROM `site_protect_court` as p1 LEFT JOIN `site_protect_creditor` as p2 ON p1.id_creditor = p2.id
        WHERE p1.description_complete<>'' AND p1.description_complete<>'-' AND p2.name!='' AND p1.user_id=:user_id
        ) AND id_substage=20");
    $q->execute(['user_id'=>$user_id]);
    $task_work = $q->fetchColumn();
    echo $task_work == "" ? 0 : $task_work;
    break;


  case 'creditors_coutr_now_count':
    $q = $modx->query("SELECT COUNT(1) as `task_work` FROM `site_protect_court` as p1 LEFT JOIN `site_protect_creditor` as p2 ON p1.id_creditor = p2.id
        WHERE (`description_complete`='' OR `description_complete`='-') AND p2.name!='' AND user_id={$user_id}");
    $task_work = $q->fetchColumn();
    echo $task_work == "" ? 0 : $task_work;

    break;
  case 'creditords_coutr_complete_count':
    $q = $modx->query("SELECT COUNT(1) as `task_work` FROM `site_protect_court` as p1 LEFT JOIN `site_protect_creditor` as p2 ON p1.id_creditor = p2.id
        WHERE `description_complete`<>'' AND `description_complete`<>'-'  AND user_id={$user_id}");
    $task_work = $q->fetchColumn();
    echo $task_work == "" ? 0 : $task_work;
    break;
  case 'creditors_in_coutr_total':
    $q = $modx->query("SELECT COUNT(DISTINCT id_creditor) as `creditor_total` FROM `site_protect_court` 
        WHERE user_id={$user_id}");
    $total = $q->fetchColumn();

    return $total;
    break;

  case 'creditors_coutr_now':
    $q = $modx->query("SELECT p1.*,p2.name as title FROM `site_protect_court` as p1 LEFT JOIN `site_protect_creditor` as p2 ON p1.id_creditor = p2.id
        WHERE (p1.description_complete='' OR p1.description_complete='-' ) AND p2.name!='' AND p1.user_id={$user_id}");
    if(!is_object($q)) return [];
    $tasks_work = $q->fetchAll();
    foreach($tasks_work as $key=>$task_work){
      $q = $modx->prepare("SELECT *,`title` as name FROM `site_protect_task_creditor` WHERE `user_id` = ? AND `id_creditor` = ? AND id_substage=20 ORDER BY `date_end` ASC ");  //AND `date_end` = '0000-00-00'
      $q->execute([$user_id, $task_work['id_creditor']]);
      $tasks = $q->FetchAll(PDO::FETCH_ASSOC);


      $tasks_work[$key]['tasks_completed'] = 0;
      $tasks_work[$key]['tasks'] = "";
      if (count($tasks)) {

        foreach($tasks as $task) {
          $task['show_dedline'] = "1";

          if ($task['date_end'] != "0000-00-00") {
            $task['show_date_end'] = "1";
            $task['endClass'] = "completed-task";
            $tasks_work[$key]['tasks_completed']++;
          } else {
            $task['endClass'] = " ";
            $task['show_dedline'] = "1";
          }

          $tasks_work[$key]['tasks'] .= $modx->getChunk('zpz-task-comment', $task);
        }
      }
    }

    return $tasks_work;
    break;
  case 'creditords_coutr_complete':
    $q = $modx->query("SELECT p1.*,p2.name as title FROM `site_protect_court` as p1 LEFT JOIN `site_protect_creditor` as p2 ON p1.id_creditor = p2.id
        WHERE p1.description_complete<>'' AND p1.description_complete<>'-' AND p2.name!='' AND p1.user_id={$user_id}");
    if(!is_object($q)) return [];
    $tasks_work = $q->fetchAll();

    foreach($tasks_work as $key=>$task_work){
      $q = $modx->prepare("SELECT *,`title` as name FROM `site_protect_task_creditor` WHERE `user_id` = ? AND `id_creditor` = ? AND id_substage=20 ORDER BY `date_end` ASC ");  //AND `date_end` = '0000-00-00'
      $q->execute([$user_id, $task_work['id_creditor']]);
      $tasks = $q->FetchAll(PDO::FETCH_ASSOC);


      $tasks_work[$key]['tasks_completed'] = 0;
      $tasks_work[$key]['tasks'] = "";
      if (count($tasks)) {

        foreach($tasks as $task) {
          $task['show_dedline'] = "1";

          if ($task['date_end'] != "0000-00-00") {
            $task['show_date_end'] = "1";
            $task['endClass'] = "completed-task";
            $tasks_work[$key]['tasks_completed']++;
          } else {
            $task['endClass'] = " ";
            $task['show_dedline'] = "1";
          }

          $tasks_work[$key]['tasks'] .= $modx->getChunk('zpz-task-comment', $task);
        }
      }
    }

    return $tasks_work;
    break;


  case 'protect_exec_process_active_count':
    $q = $modx->query("SELECT COUNT(1) as `count` FROM `site_protect_exec_process` 
        WHERE `closed`=0 AND user_id={$user_id}");
    $task_work = $q->fetchColumn();
    echo $task_work == "" ? 0 : $task_work;

    break;
  case 'protect_exec_process_closed_count':
    $q = $modx->query("SELECT COUNT(1) as `count` FROM `site_protect_exec_process` 
        WHERE `closed`=1 AND user_id={$user_id}");
    $task_work = $q->fetchColumn();
    echo $task_work == "" ? 0 : $task_work;

    break;
  case 'protect_exec_process_count':
    $q = $modx->query("SELECT COUNT(1) as `count` FROM `site_protect_exec_process` 
        WHERE user_id={$user_id}");
    $task_work = $q->fetchColumn();
    echo $task_work == "" ? 0 : $task_work;

    break;

  case 'protect_exec_process_active':
    $q = $modx->query("SELECT * FROM `site_protect_exec_process` 
        WHERE `closed`=0 AND user_id={$user_id}");
    $data = $q->fetchAll();
    if(!$data) return [];
    foreach($data as $key=>$value){
      $q = $modx->prepare("SELECT * FROM `site_protect_task_creditor` WHERE `user_id` = ? AND `id_task` = ? AND id_substage=21 ORDER BY `date_end` ASC ");  //AND `date_end` = '0000-00-00'
      $q->execute([$user_id, $value['id']]);
      $tasks = $q->FetchAll(PDO::FETCH_ASSOC);
      $data[$key]['tasks'] = $tasks;
    }
    return $data;
    break;
  case 'protect_exec_process_closed':
    $q = $modx->query("SELECT * FROM `site_protect_exec_process` 
        WHERE `closed`=1 AND user_id={$user_id}");
    $data = $q->fetchAll();
    if(!$data) return [];
    foreach($data as $key=>$value){
      $q = $modx->prepare("SELECT * FROM `site_protect_task_creditor` WHERE `user_id` = ? AND `id_task` = ? AND id_substage=21 ORDER BY `date_end` ASC ");  //AND `date_end` = '0000-00-00'
      $q->execute([$user_id, $value['id']]);
      $tasks = $q->FetchAll(PDO::FETCH_ASSOC);
      $data[$key]['tasks'] = $tasks;
    }
    return $data;
    break;

}
