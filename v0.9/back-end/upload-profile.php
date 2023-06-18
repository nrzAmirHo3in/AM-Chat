<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
try {
    $clientId = $_POST['id'];
    $src = $_FILES['fileToUpload']['tmp_name'];
    $des = "profiles/" . $clientId . "_"  . time() . "_" . ".jpg";
    move_uploaded_file($src, $des);
    try {
        require "class.php";
        $db = new Database;
        $db->connect();
        $stmt = $db->conn->prepare("UPDATE users SET profile_dir=:dir WHERE id=:clientId");
        $stmt->bindParam(":clientId",$clientId);
        $stmt->bindParam(":dir",$des);
        $stmt->execute();
        $db->disconnect();
    } catch (\Throwable $th) {
        echo "701";
    }
    echo "success";
} catch (\Throwable $th) {
    echo "702";
}