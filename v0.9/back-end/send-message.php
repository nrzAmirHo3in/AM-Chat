<?php
require "class.php";
$db = new Database;
try {
    $db->connect();
    try {
        $now = date("H:i"); 
        date_default_timezone_set("Asia/Tehran");
        $client_id = $_POST['client_id'];
        $user_id = $_POST['user_id'];
        $replayTo = $_POST['replayTo'];
        $msg = $_POST['msg'];
        $seenPosition = $client_id . "c";
        $seen = 0;
        if($user_id == "3"){
            $chatgpt_answer = "پاسخی دریافت نشد";
            $seen = 1;  
            $stmt = $db->conn->prepare ("INSERT INTO messages VALUES(NULL,:msgFrom,:msgTo,:repTo,:text,1,:time)");
            $stmt->bindParam(":msgFrom",$client_id);
            $stmt->bindParam(":msgTo" ,$user_id);
            $stmt->bindParam(":text", $msg);
            $stmt->bindParam(":repTo", $replayTo);
            $stmt->bindParam(":time",$now);
            $stmt->execute(); 

            $chatgpt_api_endpoint = "https://api.openai.com/v1/chat/completions";
            $headers = array(   
                'Content-Type: application/json',
                'Authorization: Bearer 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'
              );  
            $messages = array(
                array(
                    'role' => 'system',
                    'content' => 'You can add a system message if needed'
                ),
                array(
                    'role' => 'user',
                    'content' => $msg,
                ),
                array(
                    'role' => 'assistant',
                    'content' => 'Some previous assistant message in English',
                ),
                array(
                    'role' => 'user',
                    'content' => $msg,
                ),
                array(
                    'role' => 'assistant',
                    'content' => 'Some previous assistant message in Farsi',
                ),
                array(
                    'role' => 'user',
                    'content' => $msg,
                ),
            );
            
            $data = array(
                'messages' => $messages,
                'max_tokens' => 200,
                'temperature' => 0.7,
                'n' => 1,
                'model' => 'gpt-3.5-turbo'
            );
            
            $data_json = json_encode($data);
 
            $ch = curl_init($chatgpt_api_endpoint);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data_json);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER,true);
            $response = curl_exec($ch); 
            curl_close($ch); 

            $chatgpt_response = json_decode($response, true);

            $chatgpt_answer = $chatgpt_response['choices'][0]['message']['content'];
            $chatgpt_answer;
            $stmt = $db->conn->prepare ("INSERT INTO messages VALUES(NULL,3,:msgTo,0,:text,1,:time)");
            $stmt->bindParam(":msgTo" ,$client_id);
            $stmt->bindParam(":text", $chatgpt_answer);
            $stmt->bindParam(":time",$now);
            $stmt->execute(); 
        }else{
            $stmt = $db->conn->prepare("SELECT position,status FROM users WHERE id=:user_id");
        $stmt->bindParam(":user_id",$user_id);
        $stmt ->execute(); 
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($res[0]['position'] == $seenPosition && $res[0]['status'] == "1"){
            $seen = 1;  
            $stmt = $db->conn->prepare ("INSERT INTO messages VALUES(NULL,:msgFrom,:msgTo,:repTo,:text,:seen,:time)");
            $stmt->bindParam(":msgF rom",$client_id);
            $stmt->bindParam(":msgTo" ,$user_id);
            $stmt->bindParam(":text", $msg);
            $stmt->bindParam(":seen",$seen);
            $stmt->bindParam(":repTo", $replayTo);
            $stmt->bindParam(":time",$now);
            $stmt->execute(); 
        }else{  
            $seen = 0; 
            $stmt = $db->conn->prepare("INSERT INTO messages VALUES(NULL,:msgFrom,:msgTo,:repTo,:text,:seen,:time)");
            $stmt->bindParam(":msgFrom",$client_id);
            $stmt->bindParam(":msgTo",$user_id);
            $stmt->bindParam(":text",$msg);
            $stmt->bindParam(":seen",$seen);
            $stmt->bindParam(":repTo", $replayTo);
            $stmt->bindParam(":time",$now);
            $stmt->execute();
        }
        }
        echo "success";
    } catch (\Throwable $th) {
        echo $th . " " . 700;
    }
} catch (\Throwable $th) {
    echo $th . " " . 701;
}