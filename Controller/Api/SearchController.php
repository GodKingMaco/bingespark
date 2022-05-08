<?php
class SearchController extends BaseController
{
    public function filmAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();

        if (strtoupper($requestMethod) == 'GET') {
            try {
                $searchModel = new SearchModel();

                $searchTerm = $this->getAndCheckParam($arrQueryStringParams, 'searchTerm', false, '');
                $searchTerm = "%" . $searchTerm . "%";
                $year = $this->getAndCheckParam($arrQueryStringParams, 'year', true);
                $genres = $this->getAndCheckParam($arrQueryStringParams, 'genres', true);
                $directors = $this->getAndCheckParam($arrQueryStringParams, 'directors', true);

                $orderBy = $this->getAndCheckParam($arrQueryStringParams, 'orderBy');

                $arrResults = $searchModel->search($searchTerm, $year, $genres, $directors, $orderBy);
                $responseData = json_encode($arrResults);
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
