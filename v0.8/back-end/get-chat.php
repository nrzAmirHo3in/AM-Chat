<?php
require "class.php";
$db = new Database;
try {
    $db->connect();
    try {
        $user_id = $_POST['user_id'];
        $client_id = $_POST['client_id'];
        $stmt = $db->conn->prepare("SELECT text, seen, time, id, msgFrom 
            FROM messages 
            WHERE (msgFrom=:u_id AND msgTo=:c_id) 
            OR (msgFrom=:c_id AND msgTo=:u_id) ORDER BY id ASC");
        $stmt->bindParam(":u_id",$user_id);
        $stmt->bindParam(":c_id",$client_id);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $output="";
        foreach ($res as $value) {
            if($value['msgFrom'] == $client_id && $value['seen'] == 1){
                $output .= '
                <div class="send">
                <p>'.$value['text'].'</p>
                <svg width="31" height="34" viewBox="0 0 31 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.3333 17.6878L15.8134 23.6981L26.7724 11.6772M3.875 17.6878L9.35508 23.6981M20.3152 11.6772L16.1458 16.2919" stroke="#45AAF2" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>                
                <p>'.$value['time'].'</p>
                </div>
                ';
            }else if($value['msgFrom'] == $client_id && $value['seen'] == 0){
                $output .= '
                <div class="send">
                <p>'.$value['text'].'</p>
                <svg width="31" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="Interface / Check_Big">
                <path id="Vector" d="M4 12L8.94975 16.9497L19.5572 6.34326" stroke="#4a4a4a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                </svg>            
                <p>'.$value['time'].'</p>
                </div>
                ';
            }else if($value['msgFrom'] == $user_id){
                $output .= '
                <div class="receive">
                <p>'.$value['text'].'</p>
                <p>'.$value['time'].'</p>
                </div>
                ';
            }
        }
        echo $output;
    } catch (\Throwable $th) {
        echo $th . " " . 700;
    }
} catch (\Throwable $th) {
    echo $th . " " . 701;
}