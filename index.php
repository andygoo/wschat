<?php

$application = __DIR__;
$modules = __DIR__.'/../kohana/modules';
$system = __DIR__.'/../kohana/system';

define('DOCROOT', realpath(__DIR__).DIRECTORY_SEPARATOR);
define('APPPATH', realpath($application).DIRECTORY_SEPARATOR); 
define('MODPATH', realpath($modules).DIRECTORY_SEPARATOR);
define('SYSPATH', realpath($system).DIRECTORY_SEPARATOR);
unset($application, $modules, $system);

require SYSPATH.'classes/Kohana.php';

date_default_timezone_set('Asia/Shanghai');
setlocale(LC_ALL,"chs");

spl_autoload_register(array('Kohana', 'auto_load'));
ini_set('unserialize_callback_func', 'spl_autoload_call');

error_reporting(E_ALL | E_STRICT);
ini_set('display_errors', TRUE);

Kohana::init(array(
	'base_url' => '/',
	'index_file' => false,
));

Kohana::modules(array(
	'helper'   => MODPATH.'helper',
	'media'    => MODPATH.'media',
	'weixin'    => MODPATH.'weixin',
));

Route::set('default', '(<controller>(/<action>))')->defaults(array('controller' => 'home'));
Route::set('catch_all', '<path>', array('path' => '.+'))->defaults(array('controller' => 'Error','action' => '404'));

echo Request::instance()->execute();
//try {echo Request::instance()->execute();} catch(Exception $e) {}
