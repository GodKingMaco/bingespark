<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class UserModel extends Database
{
    public function getUsers($limit)
    {
        return $this->select("SELECT * FROM table_user ORDER BY user_id ASC LIMIT ?", ["i", $limit]);
    }

    public function getUser($username)
    {
        return $this->select("SELECT * FROM table_user WHERE user_username = ?", ["s", $username]);
    }

    public function addUser($username, $email, $password, $forename, $surname)
    {
        return $this->insert(
            'table_user',
            ['user_username', 'user_email', 'user_password', 'user_forename', 'user_surname'],
            ['sssss', $username, $email, $password, $forename, $surname]
        );
    }
}
