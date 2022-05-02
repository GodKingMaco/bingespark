SET
    @searchValue = NULL;
SET
    @actors = '2007,2008';
SET
    @directors = NULL;
SELECT
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
WHERE
    IF(
        @actors IS NOT NULL AND FIND_IN_SET(a.actor_id, @actors),
        TRUE,
        FALSE
    ) OR(
        @searchValue IS NOT NULL AND IF(
            @searchValue IS NOT NULL AND f.film_title LIKE @searchValue,
            TRUE,
            FALSE
        ) OR IF(
            @searchValue IS NOT NULL AND g.genre_name LIKE @searchValue,
            TRUE,
            FALSE
        ) OR IF(
            @searchValue IS NOT NULL AND a.actor_name LIKE @searchValue,
            TRUE,
            FALSE
        ) OR IF(
            @searchValue IS NOT NULL AND d.director_name LIKE @searchValue,
            TRUE,
            FALSE
        ) OR IF(
            @searchValue IS NOT NULL AND f.film_year LIKE @searchValue,
            TRUE,
            FALSE
        )
    )
GROUP BY
    f.film_id,
    f.film_title,
    f.film_year,
    f.film_runtime,
    f.film_revenue;