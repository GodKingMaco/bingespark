<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class ActorModel extends Database
{
    public function getActors($limit)
    {
        return $this->select("SELECT * FROM table_actor ORDER BY actor_id ASC LIMIT ?", ["i", $limit]);
    }

    public function getActorsById($ids){
        return $this->select("SELECT * FROM table_actor WHERE actor_id IN (". $ids .")");
    }

    public function getActor($id)
    {
        return $this->select("SELECT * FROM table_actor WHERE actor_id = ?", ["i", $id]);
    }

    public function addActor($name)
    {
        return $this->insert(
            'table_actor',
            ['actor_name'],
            ['s', $name]
        );
    }
    
}