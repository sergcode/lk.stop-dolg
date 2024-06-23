<?php

require_once '../config.core.php';
require_once MODX_CORE_PATH.'model/modx/modx.class.php';
$modx = new modX();
$modx->initialize('web');
$modx->getService('error','error.modError', '', '');

switch($_GET['action']) {
	case 'login': {
		if ($_GET['key'] == "a81080c889bd4cd48103480b1d97de4c") {

			if ($user = $modx->getObject('modUser', 1306)) { // 1275 // 199 //1138
				$modx->user = $user;
				$modx->user->addSessionContext('web');
				$modx->getUser('web', true);
			}

			echo 'Авторизовал';
			return true;
		} else {
			$modx->sendError('fatal', ['error_pagetitle' => 'Ошибка', 'error_message' => 'Ошибка доступа.']);
			return false;
		}
	} break;
}

switch($_POST['action']) {
    case 'sendRating': {
        echo $modx->runSnippet("sendRatingController", $_POST);
    }
    break; // отправка отзыва
    case 'sendFormFiles': {
        echo $modx->runSnippet("sendFormFilesController", $_POST);
    } break;
    case 'newTaskForALawyer':
    case 'aMessageAboutANewCase':
    case 'complaintAboutTheActionsOfTheBailiff':{
        echo $modx->runSnippet("sendingEmailAttachment", $_POST);
    }break;
    case 'filesUploaded': {
        echo $modx->runSnippet("filesUploadedController", $_POST);
    } break;
    case 'login': {
        echo $modx->runSnippet("r_login", $_POST);
    } break;
    case 'changePass': {
        echo $modx->runSnippet("r_setPass", $_POST);
    } break;
    case 'sendFormCallBack': {
        echo $modx->runSnippet("sendFormCallBack", $_POST);
    } break; // отправка заказа звонка
    case 'getFeedBack': {
        echo $modx->runSnippet("getFeedBack", $_POST);
    } break; // запрос фидбека
    case 'send_file': {
        echo $modx->runSnippet("send_file", $_POST);
    } break; // договор от юзера
    case 'change_Taskstatus': {
        echo $modx->runSnippet("change_Taskstatus", $_POST);
    } break;
    case 'recovery': {
        echo $modx->runSnippet("password_recovery", $_POST);
    } break; // восстановление пароля
    case 'info_banner': {
        echo $modx->runSnippet("is_checked", $_POST);
    } break; // Информационный баннер
    default: {
        echo $modx->toJSON(['result' => 'error', 'msg' => 'Не передано действие!', 'us' => $modx->user->get("id")]);

    } break;
}

