<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
require "class.php";
$db = new Database;
try {
    $clientId = $_POST['clientId'];
    try {
        $db->connect();
        try {
            $stmt = $db->conn->prepare("SELECT
                        users.id,
                        users.name,
                        users.profile_dir,
                        messages.time,
                        messages.seen,
                        messages.text,
                        messages.msgFrom,
                        messages.msgTo
                    FROM
                        contacts
                        JOIN users ON contacts.contact_id = users.id
                        LEFT JOIN messages ON (messages.msgFrom = :id OR messages.msgTo = :id) 
                            AND messages.id = (
                                SELECT MAX(id) FROM messages 
                                WHERE (msgFrom = :id AND msgTo = users.id) 
                                OR (msgFrom = users.id AND msgTo = :id)
                            )
                    WHERE
                        contacts.user_id = :id
                    GROUP BY
                        users.id,
                        users.name,
                        users.profile_dir,
                        messages.time,
                        messages.seen,
                        messages.text,
                        messages.msgFrom,
                        messages.msgTo
            ");
            $stmt->bindParam(":id", $clientId);
            $stmt->execute();
            $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $db->disconnect();
            $output = "";
            foreach ($contacts as $value) {
                $text = ($value['text'] == "") ? "یکم بهم پیام بدید...!" : $value['text'];
                
                $emojiRegex = '/[\p{Emoji}]/u';
                $hasEmoji = preg_match($emojiRegex, $text);
                
                if($hasEmoji){
                    $characters = preg_split('//u', $text, -1, PREG_SPLIT_NO_EMPTY);

                    if (count($characters) > 8) {
                        // Truncate the array to 30 characters
                        $truncatedCharacters = array_slice($characters, 0, 8);
                    
                        // Join the characters back together
                        $text = implode('', $truncatedCharacters) . '...';
                    }
                }else{
                    $characters = preg_split('//u', $text, -1, PREG_SPLIT_NO_EMPTY);

                    if (count($characters) > 30) {
                        // Truncate the array to 30 characters
                        $truncatedCharacters = array_slice($characters, 0, 30);
                    
                        // Join the characters back together
                        $text = implode('', $truncatedCharacters) . '...';
                    }
                }
                $profile_dir = ($value['profile_dir'] == "") ? "profiles/person.jpg" : $value['profile_dir'];
                if ($value['msgFrom'] == $clientId) {
                    $output .= '
                    <div class="contact" onclick="goChat(' . $value['id'] . ')">
                        <img src="' . $profile_dir . '" alt="">
                        <div class="n-l">
                            <h2>' . $value['name'] . '</h2>
                            <h4>شما: ' . $text . '</h4>
                        </div>
                        <div class="n-t">
                            <h5>' . $value['time'] . '</h5>
                        </div>
                    </div>
                    ';
                } else {
                    $output .= ($value['seen'] == "0") ? '
                    <div class="contact" onclick="goChat(' . $value['id'] . ')">
                        <img src="' . $profile_dir . '" alt="">
                        <div class="n-l">
                            <h2>' . $value['name'] . '</h2>
                            <h4>' . $text . '</h4>
                        </div>
                        <div class="n-t">
                            <h5>' . $value['time'] . '</h5>
                            <span id="new-msg"></span>
                        </div>
                    </div>
                    ' : '
                    <div class="contact" onclick="goChat(' . $value['id'] . ')">
                        <img src="' . $profile_dir . '" alt="">
                        <div class="n-l">
                            <h2>' . $value['name'] . '</h2>
                            <h4>' . $text . '</h4>
                        </div>
                        <div class="n-t">
                            <h5>' . $value['time'] . '</h5>
                        </div>
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
} catch (\Throwable $th) {
    echo $th . " " . 705;
}