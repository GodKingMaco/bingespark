<?php
class FeedbackController extends BaseController
{
    /**
     * "/film/list" Endpoint - Get list of likes and reviews
     */
    public function getFeedbackForFilmAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();

        if (strtoupper($requestMethod) == 'GET') {
            try {
                $likeModel = new LikeModel();
                $reviewModel = new ReviewModel();

                $film_id = $this->getAndCheckParam($arrQueryStringParams, 'film_id');
                if (!$film_id) {
                    $strErrorDesc = 'Film ID must be provided';
                    $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
                }

                $arrLike = $likeModel->getLikesForFilm($film_id);
                $arrReview = $reviewModel->getReviewsForFilm($film_id);

                $responseData = ['likes' => $arrLike, 'reviews' => $arrReview];
                $responseData = json_encode($responseData);
            } catch (Error $e) {
                $strErrorDesc = $e->getMessage() . 'Something went wrong! Please contact support.';
                $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
            }
        } else {
            $strErrorDesc = 'Method not supported';
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }

        // send output
        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(
                json_encode(array('error' => $strErrorDesc)),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }

    /**
     * "/user/add" Endpoint - Like a film
     */
    public function likeAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();

        if (strtoupper($requestMethod) == 'GET') {
            try {
                $likeModel = new LikeModel();

                $film_id = $this->getAndCheckParam($arrQueryStringParams, 'film_id');
                $user_id = $this->getAndCheckParam($arrQueryStringParams, 'user_id');

                if (!$film_id || !$user_id) {
                    $strErrorDesc = 'Film & User IDs Required!';
                    $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
                }

                $db = new Database();
                $like_exists = $db->existsMultiple('table_likes', ['film_id', 'user_id'], [$film_id, $user_id], 'ii');
                if (!$like_exists) {
                    $like_id = $likeModel->addLike($film_id, $user_id);
                }
                $responseData = json_encode($like_id ?? ($like_exists ? false : true));
            } catch (Error $e) {
                $strErrorDesc = $e->getMessage() . 'Something went wrong! Please contact support.';
                $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
            }
        } else {
            $strErrorDesc = 'Method not supported';
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }

        // send output
        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(
                json_encode(array('error' => $strErrorDesc)),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }

    /**
     * "/user/add" Endpoint - Review a film
     */
    public function reviewAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();

        if (strtoupper($requestMethod) == 'GET') {
            try {
                $reviewModel = new ReviewModel();

                $film_id = $this->getAndCheckParam($arrQueryStringParams, 'film_id');
                $user_id = $this->getAndCheckParam($arrQueryStringParams, 'user_id');
                $content = $this->getAndCheckParam($arrQueryStringParams, 'content');
                $rating = $this->getAndCheckParam($arrQueryStringParams, 'rating');

                if (!$film_id || !$user_id || !$content || !$rating) {
                    $strErrorDesc = 'Film ID, User ID, Content & Rating Required!';
                    $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
                }

                $review_id = $reviewModel->addReview($film_id, $user_id, $content, $rating);
                $responseData = json_encode($review_id);
            } catch (Error $e) {
                $strErrorDesc = $e->getMessage() . 'Something went wrong! Please contact support.';
                $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
            }
        } else {
            $strErrorDesc = 'Method not supported';
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }

        // send output
        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(
                json_encode(array('error' => $strErrorDesc)),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }
}
