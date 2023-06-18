<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
try {
    require "class.php";
    $db = new Database;
    $clientId = $_POST['clientId'];
    $db->connect();
    $stmt = $db->conn->prepare("SELECT profile_dir FROM users WHERE id=:clientId");
    $stmt->bindParam(":clientId", $clientId);
    $stmt->execute();
    $db->disconnect();
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo $res[0]['profile_dir'];
} catch (\Throwable $th) {
    echo "701";
}