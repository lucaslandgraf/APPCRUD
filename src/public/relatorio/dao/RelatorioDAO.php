<?php
require_once(__DIR__ . '/../../connection/Connection.php');

class RelatorioDAO {
    public static function listarTodos() {
        $conn = ConnectionFactory::getConnection();
        $stmt = $conn->query("SELECT * FROM relatorios ORDER BY id ASC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function buscarPorId($id) {
        $conn = ConnectionFactory::getConnection();
        $stmt = $conn->prepare("SELECT * FROM relatorios WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function adicionar($nome, $cpf, $tipo_exame, $data_exame, $resultado, $observacao) {
        $conn = ConnectionFactory::getConnection();
        $stmt = $conn->prepare("INSERT INTO relatorios (nome_paciente, cpf, tipo_exame, data_exame, resultado, observacao) 
                                VALUES (:nome, :cpf, :tipo_exame, :data_exame, :resultado, :observacao)");
        $stmt->bindParam(':nome', $nome);
        $stmt->bindParam(':cpf', $cpf);
        $stmt->bindParam(':tipo_exame', $tipo_exame);
        $stmt->bindParam(':data_exame', $data_exame);
        $stmt->bindParam(':resultado', $resultado);
        $stmt->bindParam(':observacao', $observacao);
        $stmt->execute();
    }

    public static function atualizar($id, $nome, $cpf, $tipo_exame, $data_exame, $resultado, $observacao) {
        $conn = ConnectionFactory::getConnection();
        $stmt = $conn->prepare("UPDATE relatorios SET nome_paciente = :nome, cpf = :cpf, tipo_exame = :tipo_exame, 
                                data_exame = :data_exame, resultado = :resultado, observacao = :observacao 
                                WHERE id = :id");
        $stmt->bindParam(':nome', $nome);
        $stmt->bindParam(':cpf', $cpf);
        $stmt->bindParam(':tipo_exame', $tipo_exame);
        $stmt->bindParam(':data_exame', $data_exame);
        $stmt->bindParam(':resultado', $resultado);
        $stmt->bindParam(':observacao', $observacao);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
    }

    public static function excluir($id) {
        $conn = ConnectionFactory::getConnection();
        $stmt = $conn->prepare("DELETE FROM relatorios WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
    }
}
?>
