<?php
class FilmController extends BaseController
{
    /**
     * "/film/list" Endpoint - Get list of films
     */
    public function listAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();

        if (strtoupper($requestMethod) == 'GET') {
            try {
                $userModel = new FilmModel();

                $intLimit = $this->getAndCheckParam($arrQueryStringParams, 'limit', false, 10);

                $arrFilms = $userModel->getFilms($intLimit);
                $responseData = json_encode($arrFilms);
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
     * "/user/add" Endpoint - Add new film
     */
    public function addAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();

        if (strtoupper($requestMethod) == 'POST') {
            try {
                $filmModel = new FilmModel();

                $film_title = $this->getAndCheckParam($arrQueryStringParams, 'film_title');
                $film_year = $this->getAndCheckParam($arrQueryStringParams, 'film_year');
                $film_runtime = $this->getAndCheckParam($arrQueryStringParams, 'film_runtime');
                $film_revenue = $this->getAndCheckParam($arrQueryStringParams, 'film_revenue');

                if (!$film_title || !$film_year || !$film_runtime || !$film_revenue) {
                    $strErrorDesc = 'Something went wrong! Please contact support.';
                    $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
                }

                $film_id = $filmModel->addFilm($film_title, $film_year, $film_runtime, $film_revenue);
                $responseData = json_encode($film_id);
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
