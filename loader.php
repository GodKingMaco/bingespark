<?php
require __DIR__ . "/inc/bootstrap.php";
require_once PROJECT_ROOT_PATH . "/Model/Database.php";

$csv = fopen('films_csv.csv', 'r') or die("can't open file");
$index = 0;
$database = new Database();
while ($csv_line = fgetcsv($csv)) {
    list($title, $genre, $director, $actors, $year, $runtime, $revenue) = $csv_line;
    // echo 'Title: ' . $title . '<br />';
    // echo 'Genre: ' . $genre . '<br />';
    // echo 'Director: ' . $director . '<br />';
    // echo 'Actors: ' . $actors . '<br />';
    // echo 'Year: ' . $year . '<br />';
    // echo 'Runtime: ' . $runtime . '<br />';
    // echo 'Revenue: ' . $revenue . '<br />';

    if ($index > 0) {

        $film_exists = $database->exists('table_film', 'film_title', $title);
        if ($film_exists) {
            $film_id = $film_exists;
        } else {
            $film_id = $database->insert(
                "table_film",
                ['film_title', 'film_year', 'film_runtime', 'film_revenue'],
                ['siis', $title, $year, $runtime, $revenue]
            );
        }

        $actors_arr = explode(',', $actors);
        foreach ($actors_arr as $actor) {
            $actor_exists = $database->exists('table_actor', 'actor_name', $actor);
            $actor_id = 'null';
            if ($actor_exists) {
                $actor_id = $actor_exists;
            } else {
                $actor_id = $database->insert('table_actor', ['actor_name'], ['s', $actor]);
            }

            $database->insert('table_film_actor', ['film_id', 'actor_id'], ['ii', $film_id, $actor_id]);

            echo '<p>'  . $actor . 'ActorID: ' . $actor_id . "</p>";
        }
    }

    $index++;
}

fclose($csv) or die("can't close file");
