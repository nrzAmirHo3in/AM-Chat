<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
class Database
{
    public $servername = "localhost";
    public $ServerUsername = "nrzamiri_users_am_chat";
    public $password = "S]EPWUPnV5S.";
    public $conn;

    function connect()
    {
        try {
            $this->conn = new PDO(
                "mysql:host={$this->servername};dbname=nrzamiri_am_chat",
                $this->ServerUsername, $this->password
            );
            $this->conn->exec("set names utf8mb4");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            return "Database Connection failed: " . $e->getMessage();
        }
    }

    function disconnect(){
        $this->conn = null;
    }

    function getIdByEmail($email)
    {
        try {
            $this->connect();
            try {
                $stmt = $this->conn->prepare("SELECT id FROM users WHERE email=:email");
                $stmt->bindParam(':email', $email);
                $stmt->execute();
                $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
                if (!empty($res)) {
                    return $res[0]['id'];
                } else {
                    return "703";
                }
            } catch (\Throwable $th) {
                return "700";
            }
        } catch (\Throwable $th) {
            return "701";
        }
    }
}