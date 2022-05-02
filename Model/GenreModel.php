<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class GenreModel extends Database
{
    public function getGenre($limit)
    {
        return $this->select("SELECT * FROM table_genre ORDER BY genre_id ASC LIMIT ?", ["i", $limit]);
    }

    public function addGenre($name)
    {
        return $this->insert(
            'table_genre',
            ['genre_name'],
            ['s', $name]
        );
    }
}