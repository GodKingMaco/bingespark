<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class LikeModel extends Database
{
    public function getLikesForFilm($film_id)
    {
        return $this->select("
        SELECT * FROM table_likes l 
        JOIN table_film f on f.film_id = l.film_id 
        WHERE f.film_id = ?",
        ["i", $film_id]);
    }

    public function addLike($film_id, $user_id)
    {
        return $this->insert(
            'table_likes',
            ['user_id','film_id'],
            ['ii', $user_id, $film_id]
        );
    }
}