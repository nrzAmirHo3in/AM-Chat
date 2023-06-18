<?php
require "class.php";
$db = new Database;
try {
    $db->connect();
    try {
        $user_id = $_POST['user_id'];
        $client_id = $_POST['client_id'];
        $stmt = $db->conn->prepare("SELECT text, seen, time, id, msgFrom, replyTo
            FROM messages 
            WHERE (msgFrom=:u_id AND msgTo=:c_id) 
            OR (msgFrom=:c_id AND msgTo=:u_id) ORDER BY id ASC");
        $stmt->bindParam(":u_id",$user_id);
        $stmt->bindParam(":c_id",$client_id);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $output="";
        foreach ($res as $value) {
            if($value['replyTo'] == "0"){
                if($value['msgFrom'] == $client_id && $value['seen'] == 1){
                    $output .= '
                    <div class="send">
                    <p class="text">'.$value['text'].'</p>
                    <svg width="31" height="34" viewBox="0 0 31 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.3333 17.6878L15.8134 23.6981L26.7724 11.6772M3.875 17.6878L9.35508 23.6981M20.3152 11.6772L16.1458 16.2919" stroke="#45AAF2" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>                
                    <p>'.$value['time'].'</p>
                    <input type="hidden" class="id" value="'.$value['id'].'">
                    </div>
                    ';
                }else if($value['msgFrom'] == $client_id && $value['seen'] == 0){
                    $output .= '
                    <div class="send">
                    <p class="text">'.$value['text'].'</p>
                    <svg width="31" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="Interface / Check_Big">
                    <path id="Vector" d="M4 12L8.94975 16.9497L19.5572 6.34326" stroke="#4a4a4a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    </svg>            
                    <p>'.$value['time'].'</p>
                    <input type="hidden" class="id" value="'.$value['id'].'">
                    </div>
                    ';
                }else if($value['msgFrom'] == $user_id){
                    $output .= '
                    <div class="receive">
                    <p class="text">'.$value['text'].'</p>
                    <p>'.$value['time'].'</p>
                    <input type="hidden" class="id" value="'.$value['id'].'">
                    </div>
                    ';
                }
            }else{
                $stmt = $db->conn->prepare("SELECT text AS ReplyText, msgFrom
                    FROM messages 
                    WHERE id=:id");
                $stmt->bindParam(":id",$value['replyTo']);
                $stmt->execute();
                $resa = $stmt->fetchAll(PDO::FETCH_ASSOC);
                if($value['msgFrom'] == $client_id && $value['seen'] == 1){
                    $output .= '
                    <div class="send">
                    ';
                    foreach ($resa as $row) {
                        $text = $row['ReplyText'];

// Convert the string into an array of characters
$characters = preg_split('//u', $text, -1, PREG_SPLIT_NO_EMPTY);

if (count($characters) > 10) {
    // Truncate the array to 10 characters
    $truncatedCharacters = array_slice($characters, 0, 10);

    // Join the characters back together
    $text = implode('', $truncatedCharacters) . '...';
}

// $text now contains the truncated string or the original string if it was already short

                        $replyFrom = ($client_id == $row['msgFrom']) ? "<h3 class='client'></h3>" : "<h3 class='user'></h3>";
                        $output .= '
                        <div class="replayed">
                        <span></span>
                        '.$replyFrom.'
                        <p>'.$text.'</p>
                        </div>
                        ';
                    }
                    $output .= '
                    <p class="text">'.$value['text'].'</p>
                    <svg width="31" height="34" viewBox="0 0 31 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.3333 17.6878L15.8134 23.6981L26.7724 11.6772M3.875 17.6878L9.35508 23.6981M20.3152 11.6772L16.1458 16.2919" stroke="#45AAF2" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>                
                    <p>'.$value['time'].'</p>
                    <input type="hidden" class="id" value="'.$value['id'].'">
                    </div>
                    ';
                }else if($value['msgFrom'] == $client_id && $value['seen'] == 0){
                    $output .= '
                    <div class="send">';
                    foreach ($resa as $row) {
                        $text = $row['ReplyText'];

// Convert the string into an array of characters
$characters = preg_split('//u', $text, -1, PREG_SPLIT_NO_EMPTY);

if (count($characters) > 10) {
    // Truncate the array to 10 characters
    $truncatedCharacters = array_slice($characters, 0, 10);

    // Join the characters back together
    $text = implode('', $truncatedCharacters) . '...';
}

// $text now contains the truncated string or the original string if it was already short

                        $replyFrom = ($client_id == $row['msgFrom']) ? "<h3 class='client'></h3>" : "<h3 class='user'></h3>";
                        $output .= '
                        <div class="replayed">
                        <span></span>
                        '.$replyFrom.'
                        <p>'.$text.'</p>
                        </div>
                        ';
                    }
                    $output .= '
                    <p class="text">'.$value['text'].'</p>
                    <svg width="31" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="Interface / Check_Big">
                    <path id="Vector" d="M4 12L8.94975 16.9497L19.5572 6.34326" stroke="#4a4a4a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    </svg>            
                    <p>'.$value['time'].'</p>
                    <input type="hidden" class="id" value="'.$value['id'].'">
                    </div>
                    ';
                }else if($value['msgFrom'] == $user_id){
                    $output .= '
                    <div class="receive">';
                    foreach ($resa as $row) {
                        $text = $row['ReplyText'];

// Convert the string into an array of characters
$characters = preg_split('//u', $text, -1, PREG_SPLIT_NO_EMPTY);

if (count($characters) > 10) {
    // Truncate the array to 10 characters
    $truncatedCharacters = array_slice($characters, 0, 10);

    // Join the characters back together
    $text = implode('', $truncatedCharacters) . '...';
}

// $text now contains the truncated string or the original string if it was already short

                        $replyFrom = ($client_id == $row['msgFrom']) ? "<h3 class='client'></h3>" : "<h3 class='user'></h3>";
                        $output .= '
                        <div class="replayed">
                        <span></span>
                        '.$replyFrom.'
                        <p>'.$text.'</p>
                        </div>
                        ';
                    }
                    $output .= '
                    <p>'.$resa['ReplyText'].'</p>
                    </div>
                    <p class="text">'.$value['text'].'</p>
                    <p>'.$value['time'].'</p>
                    <input type="hidden" class="id" value="'.$value['id'].'">
                    </div>
                    ';
                }
            }
        }
        echo $output;
    } catch (\Throwable $th) {
        echo $th . " " . 700;
    }
} catch (\Throwable $th) {
    echo $th . " " . 701;
}