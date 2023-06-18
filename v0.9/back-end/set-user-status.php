<?php
require "class.php";
$db = new Database;
try {
    $db->connect();
    date_default_timezone_set("Asia/Tehran");
    try {
        $newStatus = $_POST['newStatus'];
        if($newStatus == "1"){
            $stmt = $db->conn->prepare("UPDATE users SET status=:status WHERE id=:id");
            $stmt->bindParam(":status",$newStatus);
            $stmt->bindParam(":id",$_POST['client_id']);
            $stmt->execute();
        }else if($newStatus == "0"){
            $now = date("H:i");
            $stmt = $db->conn->prepare("UPDATE users SET status=:status, lastseen=:lastseen WHERE id=:id");
            $stmt->bindParam(":status",$newStatus);
            $stmt->bindParam(":id",$_POST['client_id']);
            $stmt->bindParam(":lastseen",$now);
            $stmt->execute();
        }
        echo "success";
    } catch (\Throwable $th) {
        echo $th . " " . 700;
    }
} catch (\Throwable $th) {
    echo $th . " " . 701;
}