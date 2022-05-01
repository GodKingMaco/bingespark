<?php

require __DIR__ . "/inc/bootstrap.php";
require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class TestInsert extends Database
{
    public function insertTest()
    {
        $this->insert(
            'table_film',
            ['film_title', 'film_year', 'film_runtime', 'film_revenue'],
            ['siis', 'Test film name 2.0', 2022, 100, '1000000']
        );
    }
}

?>


<?php

$test = new TestInsert();
$test->insertTest();