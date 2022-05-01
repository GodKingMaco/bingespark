<?php


$table_name="table_film";
$fields=["film_title", 'film_year', 'film_runtime', 'film_revenue']; 
$params=["siis", "Test film name", "2022", '100', '1000000'];
$query = "INSERT INTO {$table_name} (" . implode(',', $fields)  . ") VALUES(" . implode(',', array_fill(0, count($params) - 1, '?')) . ")";
print_r("<p>" . $query . "<p>");   
?>
