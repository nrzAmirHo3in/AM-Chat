<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
require "class.php";
$db = new Database;

try {
    $db->connect();
    try {
        $clientID = $_POST["clientId"];
        $stmt = $db->conn->prepare("SELECT * FROM requests WHERE reqTo=:clientId");
        $stmt->bindParam(":clientId",$clientID);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if(is_null($res[0])){
            echo "null";
        }else{
            $output = "";
            foreach($res as $value){
                $output .= '
                <div class="user">
                <h3 class="message">'.$value['text'].'</h3>
                <img src="svg/like.svg" class="like" alt="" value="'.$value['reqFrom'].'">
                <img src="svg/profile.svg" class="profile" alt="" value="'.$value['reqFrom'].'">
                <img src="svg/dislike.svg" class="dislike" alt="" value="'.$value['reqFrom'].'">
                </div>
                ';
            }
            echo $output;
        }
    } catch (\Throwable $th) {
        echo "700";
    }
} catch (\Throwable $th) {
    echo "701";
}