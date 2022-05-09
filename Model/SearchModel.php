<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class SearchModel extends Database
{
    public function search($searchTerm, $year, $genres, $directors, $orderBy, $limit = 10, $offset = 0)
    {
        $query =
            "SELECT
        f.film_id,
        f.film_title,
        f.film_runtime,
        f.film_revenue,
        f.film_year,
        IFNULL(
            (
            SELECT
                COUNT(il.likes_id)
            FROM
                table_likes il
            WHERE
                il.film_id = f.film_id
        ),
        0
        ) AS 'likes',
        (
        SELECT
            AVG(ir.review_rating)
        FROM
            table_reviews ir
        WHERE
            ir.film_id = f.film_id
    ) AS 'rating',
    GROUP_CONCAT(
        DISTINCT d.director_name SEPARATOR ','
    ) AS 'directors',
    GROUP_CONCAT(
        DISTINCT g.genre_name SEPARATOR ','
    ) AS 'genres',
    GROUP_CONCAT(
        DISTINCT a.actor_name SEPARATOR ','
    ) AS 'actors'
    FROM
        table_film f
    LEFT JOIN table_likes l ON
        l.film_id = f.film_id
    LEFT JOIN table_reviews r ON
        r.film_id = f.film_id
    LEFT JOIN table_film_director fd ON
        fd.film_id = f.film_id
    LEFT JOIN table_director d ON
        fd.director_id = d.director_id
    LEFT JOIN table_film_genre fg ON
        fg.film_id = f.film_id
    LEFT JOIN table_film_actor fa ON
        fa.film_id = f.film_id
    LEFT JOIN table_genre g ON
        g.genre_id = fg.genre_id
    LEFT JOIN table_actor a ON
        a.actor_id = fa.actor_id
    WHERE ";

        if ($searchTerm) {
            $query .= "f.film_id IN(
            SELECT sf.film_id from table_film sf WHERE sf.film_title LIKE ?)";
        } else {
            $query .= 'TRUE';
        }

        if ($year) {
            $query .= " AND FIND_IN_SET(f.film_year, ?)";
        }

        if ($genres) {
            $query .= " AND FIND_IN_SET(fg.genre_id, ?)";
        }

        if ($directors) {
            $query .= " AND FIND_IN_SET(fd.director_id, ?)";
        }

        $query .=
            " GROUP BY
    f.film_id,
    f.film_title,
    f.film_year,
    f.film_runtime,
    f.film_revenue";

        if ($orderBy) {
            $query .= " ORDER BY " . $orderBy;
        }

        $query .= " LIMIT " . $limit . " OFFSET " . $offset . ";";

        $params = [""];
        if ($searchTerm) {
            $params[0] .= 's';
            array_push($params, $searchTerm);
        }
        if ($year) {
            $params[0] .= 's';
            array_push($params, $year);
        }
        if ($genres) {
            $params[0] .= 's';
            array_push($params, $genres);
        }
        if ($directors) {
            $params[0] .= 's';
            array_push($params, $directors);
        }

        return $this->select($query, $params);
    }
}
