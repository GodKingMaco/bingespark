<?php
require __DIR__ . "/inc/bootstrap.php";
 
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode( '/', $uri );
 
$entities = ['user', 'film', 'director', 'genre', 'feedback'];
if ((isset($uri[2]) && !in_array($uri[2], $entities)) || !isset($uri[3])) {
    header("HTTP/1.1 404 Not Found");
    exit();
}
 
require PROJECT_ROOT_PATH . "/Controller/Api/UserController.php";
require PROJECT_ROOT_PATH . "/Controller/Api/FilmController.php";
require PROJECT_ROOT_PATH . "/Controller/Api/DirectorController.php";
require PROJECT_ROOT_PATH . "/Controller/Api/GenreController.php";
require PROJECT_ROOT_PATH . "/Controller/Api/FeedbackController.php";
 
$entity = $uri[2];
switch($entity){
    case 'user':
        $objFeedController = new UserController();
        break;
    case 'film':
        $objFeedController = new FilmController();
        break;
    case 'director':
        $objFeedController = new DirectorController();
        break;
    case 'genre':
        $objFeedController = new GenreController();
        break;
    case 'feedback';
        $objFeedController = new FeedbackController();
        break;
    default:
        $objFeedController = new FilmController();
}

$strMethodName = $uri[3] . 'Action';
$objFeedController->{$strMethodName}();
?>