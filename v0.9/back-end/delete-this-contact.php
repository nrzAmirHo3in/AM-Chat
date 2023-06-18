<?php
require "class.php";
$db = new Database;
try {
    $db->connect();
    try {
        $stmt = $db->conn->prepare("DELETE FROM contacts WHERE(user_id=:user_id AND contact_id=:client_id) OR (user_id=:client_id AND contact_id=:user_id)");
        $stmt->bindParam(":client_id",$_POST['client_id']);
        $stmt->bindParam(":user_id",$_POST['user_id']);
        $stmt->execute();
        $stmt = $db->conn->prepare("DELETE FROM messages WHERE(msgFrom=:user_id AND msgTo=:client_id) OR (msgFrom=:client_id AND msgTo=:user_id)");
        $stmt->bindParam(":client_id",$_POST['client_id']);
        $stmt->bindParam(":user_id",$_POST['user_id']);
        $stmt->execute();
        echo "success";
    } catch (\Throwable $th) {
        echo $th . " " . 700;
    }
} catch (\Throwable $th) {
    echo $th . " " . 701;
}