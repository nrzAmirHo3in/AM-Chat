<?php
require "class.php";
$db = new Database;
try {
    $db->connect();
    try {
        $stmt = $db->conn->prepare("SELECT profile_dir,name,status,id FROM users WHERE id=:id");
        $stmt->bindParam(":id",$_POST['user_id']);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($res[0]['status'] == 0){
            $stmt = $db->conn->prepare("SELECT profile_dir,name,id,lastseen FROM users WHERE id=:id");
            $stmt->bindParam(":id",$_POST['user_id']);
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo $res[0]['profile_dir'] . "," . $res[0]['name'] . "," . "Lastseen: " . $res[0]['lastseen'] . "," . $res[0]['id'];
        }else if($res[0]['status'] == 1){
            echo $res[0]['profile_dir'] . "," . $res[0]['name'] . ", Online ," . $res[0]['id'];
        }else if($res[0]['status'] == 3){
            echo $res[0]['profile_dir'] . "," . $res[0]['name'] . ", Typing... ," . $res[0]['id'];
        }
    } catch (\Throwable $th) {
        echo $th . " " . 700;
    }
} catch (\Throwable $th) {
    echo $th . " " . 701;
}