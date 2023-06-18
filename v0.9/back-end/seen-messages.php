<?php
require "class.php";
$db = new Database;
try {
    $db->connect();
    try {
        $stmt = $db->conn->prepare("UPDATE messages SET seen=1 WHERE msgTo=:id");
        $stmt->bindParam(":id",$_POST['client_id']);
        $stmt->execute();
        echo "success";
    } catch (\Throwable $th) {
        echo $th . " " . 700;
    }
} catch (\Throwable $th) {
    echo $th . " " . 701;
}