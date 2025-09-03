<?php

require_once __DIR__ . '../../../connection/Connection.php';

class UsuarioDao {
    private \PDO $conn;

    public function __construct() {
        $this->conn = ConnectionFactory::getConnection();
    }


    public function inserir(string $nome, string $email, string $senhaHash, string $rol): bool {
        $sql = "INSERT INTO usuario (nome, email, senha, rol) VALUES (:nome, :email, :senha, :rol)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':nome', $nome, PDO::PARAM_STR);
        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        $stmt->bindValue(':senha', $senhaHash, PDO::PARAM_STR);
        $stmt->bindValue(':rol', $rol, PDO::PARAM_STR);
        return $stmt->execute();
    }

    public function findAll(): array {
        $sql = "SELECT id, nome, email, rol FROM usuario ORDER BY id ASC";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function deleteById(int $id): bool {
        $sql = "DELETE FROM usuario WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    //Busca um usuário pelo e-mail.
    public function findByEmail(string $email): ?array {
        $sql = "SELECT id, nome, email, senha, rol FROM usuario WHERE email = :email";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        $stmt->execute();
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        return $resultado === false ? null : $resultado;
    }

    public function update(int $id, string $nome, string $email, string $rol): bool {
        $sql = "UPDATE usuario SET nome = :nome, email = :email, rol = :rol WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':nome', $nome, PDO::PARAM_STR);
        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        $stmt->bindValue(':rol', $rol, PDO::PARAM_STR);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function updatePassword(string $email, string $novaSenhaHash): bool {
        $sql = "UPDATE usuario SET senha = :senha WHERE email = :email";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':senha', $novaSenhaHash, PDO::PARAM_STR);
        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        return $stmt->execute();
    }
}
