<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
require "class.php";
$db = new Database;
try {
    $db->connect();
    try {
        $stmt1 = $db->conn->prepare("DELETE FROM requests 
                    WHERE(reqFrom=:user1 AND reqTo=:user2) 
                    OR (reqFrom=:user2 AND reqTo=:user1)");
        $stmt1->bindParam(":user1",$_POST['user1']);
        $stmt1->bindParam(":user2",$_POST['user2']);
        $stmt1->execute();
        echo "success";
    } catch (\Throwable $th) {
        echo $th . " " . 700;
    }
} catch (\Throwable $th) {
    echo $th . " " . 701;
}