<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class FilmModel extends Database
{
    public function getFilms($limit)
    {
        return $this->select("SELECT * FROM table_film ORDER BY film_id ASC LIMIT ?", ["i", $limit]);
    }

    public function addFilm($title, $year, $runtime, $revenue)
    {
        return $this->insert(
            'table_film',
            ['film_title', 'film_year', 'film_runtime', 'film_revenue'],
            ['siis', $title, $year, $runtime, $revenue]
        );
    }
}
