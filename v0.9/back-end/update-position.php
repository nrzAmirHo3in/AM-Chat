<?php
require "class.php";
$db = new Database;
try {
    $db->connect();
    try {
        $client_id = $_POST['client_id'];
        $position = $_POST['position'];
        $stmt = $db->conn->prepare("UPDATE users SET position=:pos WHERE id=:id");
        $stmt->bindParam(":pos",$position);
        $stmt->bindParam(":id",$client_id);
        $stmt->execute();
        echo "success";
    } catch (\Throwable $th) {
        echo $th . " " . 700;
    }
} catch (\Throwable $th) {
    echo $th . " " . 701;
}