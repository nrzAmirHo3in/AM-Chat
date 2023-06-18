<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
require "class.php";
$db = new Database;

try {
    $db->connect();
    try {
        $clientId = $_POST['clientId'];
        $stmt = $db->conn->prepare("SELECT email FROM users WHERE id=:id");
        $stmt->bindParam(":id",$clientId);
        $stmt->execute();
        $db->disconnect();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo $res[0]['email'];
    } catch (\Throwable $th) {
        echo "700";
    }
} catch (\Throwable $th) {
    echo "701";
}