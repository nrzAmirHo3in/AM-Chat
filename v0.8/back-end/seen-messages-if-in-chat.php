<?php
require "class.php";
$db = new Database;
try {
    $db->connect();
    try {
        $client_id = $_POST['client_id'];
        $user_id = $_POST['user_id'];
        $seenPosition = $client_id . "c";
        $seen = 0;

        $stmt = $db->conn->prepare("SELECT position,status FROM users WHERE id=:user_id");
        $stmt->bindParam(":user_id",$user_id);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($res[0]['position'] == $seenPosition && $res[0]['status'] == "1"){
            $stmt = $db->conn->prepare("UPDATE messages SET seen=1 WHERE msgTo=:id");
            $stmt->bindParam(":id",$_POST['client_id']);
            $stmt->execute();
        }
        echo "success";
    } catch (\Throwable $th) {
        echo $th . " " . 700;
    }
} catch (\Throwable $th) {
    echo $th . " " . 701;
}