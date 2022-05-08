<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class DirectorModel extends Database
{
    public function getDirectors()
    {
        return $this->select("SELECT * FROM table_director ORDER BY director_name ASC");
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
