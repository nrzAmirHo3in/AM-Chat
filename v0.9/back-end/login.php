<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
require "class.php";
$db = new Database;

try {
  $db->connect();
  try {
    $email = $_POST["email"];
    $pass = $_POST["pass"];
    $stmt = $db->conn->prepare("SELECT * FROM users WHERE email=:email AND pass=:pass");
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':pass', $pass);
    $stmt->execute();
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if (!empty($res)) {
      echo "success";
    }else{
        echo "failed";
    }
  } catch (\Throwable $th) {
    echo "700";
  }
} catch (\Throwable $th) {
  echo "701";
}
