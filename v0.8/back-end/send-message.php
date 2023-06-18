<?php
require "class.php";
$db = new Database;
try {
    $db->connect();
    try {
        date_default_timezone_set("Asia/Tehran");
        $client_id = $_POST['client_id'];
        $user_id = $_POST['user_id'];
        $msg = $_POST['msg'];
        $seenPosition = $client_id . "c";
        $seen = 0;

        $stmt = $db->conn->prepare("SELECT position,status FROM users WHERE id=:user_id");
        $stmt->bindParam(":user_id",$user_id);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($res[0]['position'] == $seenPosition && $res[0]['status'] == "1"){
            $now = date("H:i");
            $seen = 1;
            $stmt = $db->conn->prepare("INSERT INTO messages VALUES(NULL,:msgFrom,:msgTo,:text,:seen,:time)");
            $stmt->bindParam(":msgFrom",$client_id);
            $stmt->bindParam(":msgTo",$user_id);
            $stmt->bindParam(":text",$msg);
            $stmt->bindParam(":seen",$seen);
            $stmt->bindParam(":time",$now);
            $stmt->execute();
        }else{
            $now = date("H:i");
            $seen = 0;
            $stmt = $db->conn->prepare("INSERT INTO messages VALUES(NULL,:msgFrom,:msgTo,:text,:seen,:time)");
            $stmt->bindParam(":msgFrom",$client_id);
            $stmt->bindParam(":msgTo",$user_id);
            $stmt->bindParam(":text",$msg);
            $stmt->bindParam(":seen",$seen);
            $stmt->bindParam(":time",$now);
            $stmt->execute();
        }
        echo "success";
    } catch (\Throwable $th) {
        echo $th . " " . 700;
    }
} catch (\Throwable $th) {
    echo $th . " " . 701;
}