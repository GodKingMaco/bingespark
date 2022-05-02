<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class ReviewModel extends Database
{
    public function getReviewsForFilm($film_id)
    {
        return $this->select("
        SELECT * FROM table_reviews r 
        JOIN table_film f on f.film_id = r.film_id 
        WHERE f.film_id = ?",
        ["i", $film_id]);
    }

    public function addReview($film_id, $user_id, $content, $rating)
    {
        return $this->insert(
            'table_reviews',
            ['film_id','user_id','review_content', 'review_rating'],
            ['iiss', $film_id, $user_id, $content, $rating]
        );
    }
}
