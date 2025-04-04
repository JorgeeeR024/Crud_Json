<?php
$file = 'data.json';
$data = json_decode(file_get_contents($file), true) ?? [];

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        echo isset($_GET['id'])
            ? json_encode(array_values(array_filter($data, fn($i) => $i['id'] == $_GET['id']))[0] ?? [])
            : json_encode($data);
        break;

    case 'POST':
        $new = json_decode(file_get_contents('php://input'), true);
        $new['id'] = (end($data)['id'] ?? 0) + 1;
        $data[] = $new;
        file_put_contents($file, json_encode($data));
        echo json_encode(['ok' => true]);
        break;

    case 'PUT':
        $edit = json_decode(file_get_contents('php://input'), true);
        foreach ($data as &$item) if ($item['id'] == $edit['id']) $item = $edit;
        file_put_contents($file, json_encode($data));
        echo json_encode(['ok' => true]);
        break;

    case 'DELETE':
        parse_str(file_get_contents('php://input'), $d);
        $data = array_values(array_filter($data, fn($i) => $i['id'] != $d['id']));
        file_put_contents($file, json_encode($data));
        echo json_encode(['ok' => true]);
        break;
}
?>
