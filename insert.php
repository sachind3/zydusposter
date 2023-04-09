<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require 'config.php';

// POST DATA
$data = json_decode(file_get_contents("php://input"));

if (
    isset($data->emp_id)
    && isset($data->emp_name)
    && isset($data->hq)
    && isset($data->region)
    && isset($data->doc_name)
    && isset($data->doc_contact)
    && !empty(trim($data->emp_id))
    && !empty(trim($data->emp_name))
    && !empty(trim($data->hq))
    && !empty(trim($data->region))
    && !empty(trim($data->doc_name))
    && !empty(trim($data->doc_contact))
    && !empty(trim($data->poster_name))
) {
    $t = time() + rand(1, 100000);
    $image = $data->template;
    $image = explode(";", $image)[1];
    $image = explode(",", $image)[1];
    $image = str_replace(" ", "+", $image);
    $image = base64_decode($image);
    file_put_contents("uploaded/$t.jpeg", $image);
    
    // error_reporting(E_ALL);
    
    $emp_id = mysqli_real_escape_string($db_conn, trim($data->emp_id));
    $emp_name = mysqli_real_escape_string($db_conn, trim($data->emp_name));
    $hq = mysqli_real_escape_string($db_conn, trim($data->hq));
    $region = mysqli_real_escape_string($db_conn, trim($data->region));
    $doc_name = mysqli_real_escape_string($db_conn, trim($data->doc_name));
    $doc_contact = mysqli_real_escape_string($db_conn, trim($data->doc_contact));
    $poster_name = mysqli_real_escape_string($db_conn, trim($data->poster_name));
 
    $template =  "uploaded/" . $t . ".jpeg";
    $insertUser = mysqli_query($db_conn, "INSERT INTO `users`(`emp_id`,`emp_name`,`hq`,`region`,`doc_name`,`doc_contact`,`poster_name`,`template`) VALUES('$emp_id','$emp_name','$hq','$region','$doc_name','$doc_contact','$poster_name','$template')");

    if ($insertUser) {
        $last_id = mysqli_insert_id($db_conn);
        echo json_encode(["success" => 1, "msg" => "User Inserted.", "id" => $last_id, "path" => $template]);
    } else {
        echo json_encode(["success" => 0, "msg" => "User Not Inserted!"]);
    }
} else {
    echo json_encode(["success" => 0, "msg" => "Please fill all the required fields!"]);
}

