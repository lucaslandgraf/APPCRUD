<?php
class ConnectionFactory
{ # padrão singleton
    static $connection;

    public static function getConnection()
    {
        if (!isset(self::$connection)) {
            $host = "localhost";
            $dbName = "sps";
            $user = "root";
            $pass = "";
            $port = 3306;

            try {
                self::$connection = new PDO("mysql:host=$host;dbname=$dbName;port=$port", $user, $pass);
                return self::$connection;
            } catch (PDOException $ex) {
                echo ("ERRO ao conectar no banco de dados! <p>$ex</p>");
                return null; // ← isso faltava
            }
        }

        return self::$connection; // ← também importante se já tiver conexão
    }
}
