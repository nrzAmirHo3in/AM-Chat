<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
require "class.php";
$db = new Database;
try {
    $db->connect();
    try {
        $email = $_POST["email"];
        $text = $_POST["text"];
        $fromId = $_POST["id"];
        $Toid = $db->getIdByEmail($email);
        if($Toid == "703"){
            die("703");
        }
        $stmt2 = $db->conn->prepare("INSERT INTO requests VALUES(NULL, :fromid, :toid, :textreq)");
        $stmt2->bindParam(':fromid', $fromId);
        $stmt2->bindParam(':toid', $Toid);
        $stmt2->bindParam(':textreq', $text);
        $stmt2->execute();
        echo "success";
    } catch (\Throwable $th) {
        echo "duplicate";
    }
} catch (\Throwable $th) {
    echo "701";
}