<?php
class UserController extends BaseController
{
    /**
     * "/user/list" Endpoint - Get list of users
     */
    public function listAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();

        if (strtoupper($requestMethod) == 'GET') {
            try {
                $userModel = new UserModel();

                $intLimit = 10;
                $intLimit = $this->getAndCheckParam($arrQueryStringParams, 'limit') ?? $intLimit;

                $arrUsers = $userModel->getUsers($intLimit);
                $responseData = json_encode($arrUsers);
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
     * "/user/add" Endpoint - Add new user
     */
    public function addAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();

        if (strtoupper($requestMethod) == 'GET') {
            try {
                $userModel = new UserModel();

                $user_username = $this->getAndCheckParam($arrQueryStringParams, 'username');
                $user_email = $user_username;
                $user_password = $this->getAndCheckParam($arrQueryStringParams, 'password');
                $user_forename = $this->getAndCheckParam($arrQueryStringParams, 'forename');
                $user_surname = $this->getAndCheckParam($arrQueryStringParams, 'surname');

                if (!$user_email || !$user_username || !$user_password || !$user_forename || !$user_surname) {
                    $strErrorDesc = 'Something went wrong! Please contact support.';
                    $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
                }

                $user_password = password_hash($user_password, PASSWORD_BCRYPT);

                $user_id = $userModel->addUser($user_username, $user_email, $user_password, $user_forename, $user_surname);
                $responseData = json_encode($user_id);
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

    public function loginAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();

        if (strtoupper($requestMethod) == 'GET') {
            try {
                $userModel = new UserModel();

                $user_username = $this->getAndCheckParam($arrQueryStringParams, 'username');
                $user_password = $this->getAndCheckParam($arrQueryStringParams, 'password');

                if (!$user_username || !$user_password) {
                    $strErrorDesc = 'Something went wrong! Please contact support.';
                    $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
                }

                $user = $userModel->getUser($user_username)[0];
                if (password_verify($user_password, $user['user_password'])) {
                    $token = bin2hex(random_bytes(16));
                    $userModel->executeStatement("INSERT INTO table_session(session_id, session_data) VALUES(?,?)", ["ss", $token, json_encode($user)]);
                    $responseData = json_encode((object)['token' => $token, 'user' => $user]);
                } else {
                    $responseData = 'false';
                }
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
