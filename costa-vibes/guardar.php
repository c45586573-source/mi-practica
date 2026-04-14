<?php
// 1. Indicar a JavaScript que responderemos en formato JSON
header('Content-Type: application/json');

// Conexión a la base de datos
$conexion = new mysqli("localhost", "root", "", "costa-vibes");

// Comprobar la conexión
if ($conexion->connect_error) {
    echo json_encode(["status" => "error", "message" => "Error de conexión: " . $conexion->connect_error]);
    exit;
}

// Verificar que lleguen los datos por POST
if (isset($_POST['nombre']) && isset($_POST['numero']) && isset($_POST['mensaje'])) {
    
    $nombre = $_POST['nombre'];
    $numero = $_POST['numero'];
    $mensaje = $_POST['mensaje'];

    // 2. USO DE SENTENCIAS PREPARADAS (Evita Inyección SQL)
    $stmt = $conexion->prepare("INSERT INTO mensajes (nombre, numero, mensaje) VALUES (?, ?, ?)");
    
    // Las "sss" indican que son 3 strings (cadenas de texto)
    $stmt->bind_param("sss", $nombre, $numero, $mensaje);

    // 3. RESPONDER EN FORMATO JSON
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Mensaje guardado correctamente"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al guardar: " . $stmt->error]);
    }
    
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "No se recibieron todos los datos del formulario."]);
}

$conexion->close();
?>