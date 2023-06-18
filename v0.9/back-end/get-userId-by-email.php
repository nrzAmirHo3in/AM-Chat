<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
require "class.php";
$db = new Database;
$email = $_POST['email'];
$id = $db->getIdByEmail($email);
echo $id;