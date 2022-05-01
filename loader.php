<?php
require __DIR__ . "/inc/bootstrap.php";
require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class Loader
{

    public $database = null;

    public function __construct()
    {
        $this->database = new Database();
        $this->init();
    }

    public function init()
    {
        $csv = fopen('films_csv.csv', 'r') or die("can't open file");
        $index = 0;
        while ($csv_line = fgetcsv($csv)) {
            list($title, $genre, $directors, $actors, $year, $runtime, $revenue) = $csv_line;
            // echo 'Title: ' . $title . '<br />';
            // echo 'Genre: ' . $genre . '<br />';
            // echo 'Director: ' . $director . '<br />';
            // echo 'Actors: ' . $actors . '<br />';
            // echo 'Year: ' . $year . '<br />';
            // echo 'Runtime: ' . $runtime . '<br />';
            // echo 'Revenue: ' . $revenue . '<br />';

            if ($index > 0) {

                $film_exists = $this->database->existsMultiple('table_film', ['film_title', 'film_year'], [$title, $year], 'si');
                if ($film_exists) {
                    $film_id = $film_exists;

                    // update existing with missmatched values
                    $this->database->update('table_film', $film_id, ['film_runtime', 'film_revenue'], [$runtime, $revenue]);

                } else {
                    $film_id = $this->database->insert(
                        "table_film",
                        ['film_title', 'film_year', 'film_runtime', 'film_revenue'],
                        ['siis', $title, $year, $runtime, $revenue]
                    );
                }

                $this->insertMultiple($actors, ['actor_name'], 's', $film_id, 'table_actor', 'table_film_actor', ['film_id', 'actor_id']);
                $this->insertMultiple($directors, ['director_name'], 's', $film_id, 'table_director', 'table_film_director', ['film_id', 'director_id']);
            }


            $index++;
        }
        fclose($csv) or die("can't close file");
    }

    private function insertMultiple($values, $target_fields = [], $target_field_types = 's', $film_id, $target_table, $link_table, $link_fields = [])
    {
        $values_arr = explode(',', $values);
        error_log('Values JSON: ' . json_encode($values));
        foreach ($values_arr as $value) {
            error_log('Value: ' . $value);
            $value_exists = $this->database->existsMultiple($target_table, $target_fields, [$value], $target_field_types);
            $value_id = 'null';
            if ($value_exists) {
                $value_id = $value_exists;
            } else {
                error_log('DEBUG ARRAY: ' . json_encode([$target_field_types, $value]));
                $value_id = $this->database->insert(
                    $target_table,
                    $target_fields,
                    [$target_field_types, $value]
                );
            }

            $film_target_link_exists = $this->database->existsMultiple($link_table, $link_fields, [$film_id, $value_id], 'ii');
            if (!$film_target_link_exists) {
                $this->database->insert($link_table, $link_fields, ['ii', $film_id, $value_id]);
            }
        }
    }
}

?>

<?php

$loader = new Loader();
