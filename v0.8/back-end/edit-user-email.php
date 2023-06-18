<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
try {
    require "class.php";
    $db = new Database;
    $db->connect();
    try {
        $newEmail = $_POST['newEmail'];
        $clientId = $_POST['clientId'];
        $stmt = $db->conn->prepare("UPDATE users SET `email`=:newEmail WHERE id=:clientId");
        $stmt->bindParam(":clientId",$clientId);
        $stmt->bindParam(":newEmail",$newEmail);
        $stmt->execute();
        $db->disconnect();
        echo true;
    } catch (\Throwable $th) {
        echo $th . " " . 700;
    }
} catch (\Throwable $th) {
    echo $th . " " . 701;
}