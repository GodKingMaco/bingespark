<?php
class Database
{
    protected $connection = null;
    public $primary_keys = [
        "table_film" => "film_id",
        "table_actor" => "actor_id",
        "table_film_actor" => "film_actor_id" 
    ];

    public function __construct()
    {
        try {
            $this->connection = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE_NAME);

            if (mysqli_connect_errno()) {
                throw new Exception("Could not connect to database.");
            }
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

    public function exists($table_name, $field, $value, $type = 's')
    {
        $primary_key = $this->primary_keys[$table_name];

        try {
            $value = $this->sanitizeParams([$value])[0];
            $query = "SELECT $primary_key FROM $table_name WHERE $field = ?";
            $stmt = $this->executeStatement($query, [$type, $value]);
            $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            $stmt->close();

            error_log('Check: ' . $query);
            error_log('Res: ' . json_encode($result));

            if (is_array($result) && count($result) > 0 && $result[0][$primary_key]) {
                return $result[0][$primary_key];
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
        return false;
    }

    private function fieldsToWhere($fields = []){
        $str = ' WHERE ';
        foreach($fields as $key=>$field){
            if($key === 0){
                $str .= $field . ' = ?';
            }else{
                $str .= ' AND ' . $field . ' = ?';
            }
        }
        error_log('Where string: ' . $str);
        return $str;
    }

    public function existsMultiple($table_name, $fields = [], $values = [], $types = 's')
    {

        $primary_key = $this->primary_keys[$table_name];

        try {
            $values = $this->sanitizeParams($values);
            $query = "SELECT $primary_key FROM $table_name" . $this->fieldsToWhere($fields);
            error_log('Check M: ' . $query);
            error_log('DEBUG: ' . json_encode(array_merge([$types], $values)));
            $stmt = $this->executeStatement($query, array_merge([$types], $values));
            $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            $stmt->close();

            error_log('Res M: ' . json_encode($result));

            if (is_array($result) && count($result) > 0 && $result[0][$primary_key]) {
                return $result[0][$primary_key];
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
        return false;
    }

    public function select($query = "", $params = [])
    {
        try {
            $stmt = $this->executeStatement($query, $params);
            $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            $stmt->close();

            return $result;
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
        return false;
    }

    public function insert($table_name, $fields = [], $params = [])
    {
        try {
            $params = $this->sanitizeParams($params);
            $query = "INSERT INTO {$table_name} (" . implode(',', $fields)  . ") VALUES(" . implode(',', array_fill(0, count($params) - 1, '?')) . "); \r\n";
            error_log($query);
            $stmt = $this->executeStatement($query, $params);
            $result = $stmt->insert_id;
            $stmt->close();

            return $result;
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
        return false;
    }

    public function executeStatement($query = "", $params = [], $getId = false)
    {
        try {
            $stmt = $this->connection->prepare($query);

            if ($stmt === false) {
                throw new Exception("Unable to do prepared statement: " . $query);
            }

            if ($stmt->error) {
                error_log('Error: ' . strval($stmt->error));
            }

            if ($params) {
                $stmt->bind_param(...$params); // spread operator e.g. [$params[0], $params[1]...]
            }

            $stmt->execute();

            return $stmt;
        } catch (Exception $e) {
            echo $e->getMessage();
            throw new Exception($e->getMessage());
        }
    }

    private function sanitizeParams($params = [])
    {
        $params = array_map('trim', $params);
        $params = array_map(fn ($value) => ltrim($value, "'"), $params);
        $params = array_map(fn ($value) => rtrim($value, "'"), $params);
        return $params;
    }
}
