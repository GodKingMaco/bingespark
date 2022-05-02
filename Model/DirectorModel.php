<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class DirectorModel extends Database
{
    public function getDirectors($limit)
    {
        return $this->select("SELECT * FROM table_director ORDER BY director_id ASC LIMIT ?", ["i", $limit]);
    }

    public function addDirector($name)
    {
        return $this->insert(
            'table_director',
            ['director_name'],
            ['s', $name]
        );
    }
}