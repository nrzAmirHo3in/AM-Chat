<?php
require "class.php";
$db = new Database;
try {
    $db->connect();
    try {
        $stmt = $db->conn->prepare("SELECT profile_dir,name,email,bio,id FROM users WHERE id=:id");
        $stmt->bindParam(":id",$_POST['user_id']);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo $res[0]['profile_dir'] . "," . $res[0]['name'] . "," . $res[0]['email'] . "," . $res[0]['bio'] . "," . $res[0]['id'];
    } catch (\Throwable $th) {
        echo $th . " " . 700;
    }
} catch (\Throwable $th) {
    echo $th . " " . 701;
}