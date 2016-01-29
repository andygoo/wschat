<?php

class Controller_Wechat extends Controller {

    public function action_index() {
        $wx = new WeixinOauth();
        $user_info = $wx->get_user_info();
        if (empty($user_info)) {
            $callback_url = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
            $this->redirect('weixin/oauth/login?callback_url=' . urlencode($callback_url));
        }
		
        $this->template = View::factory('wechat');
		$this->template->user_info = $user_info;
    }
}

