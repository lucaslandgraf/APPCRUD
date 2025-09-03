<?php
// relatorio/controller/RelatorioController.php
require_once(__DIR__ . '/../dao/RelatorioDAO.php');

class RelatorioController {
    public static function handleRequest() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (isset($_POST['adicionar_relatorio'])) {
                self::adicionar($_POST);
            } elseif (isset($_POST['atualizar_relatorio'])) {
                self::atualizar($_POST);
            } elseif (isset($_POST['excluir_relatorio'])) {
                self::excluir($_POST['id']);
            }
        }
    }

    public static function adicionar($dados) {
        // Limpar o CPF removendo qualquer caractere não numérico
        $cpfLimpo = preg_replace('/\D/', '', $dados['cpf']);

        RelatorioDAO::adicionar(
            $dados['nome'],
            $cpfLimpo, // Passa o CPF limpo para o DAO
            $dados['tipo_exame'],
            $dados['data_exame'],
            $dados['resultado'],
            $dados['observacao']
        );
        $_SESSION['mensagem'] = "Relatório adicionado com sucesso!";
    }

    public static function atualizar($dados) {
        // Limpar o CPF removendo qualquer caractere não numérico também na atualização
        $cpfLimpo = preg_replace('/\D/', '', $dados['cpf']);

        RelatorioDAO::atualizar(
            $dados['id'],
            $dados['nome'],
            $cpfLimpo, // Passa o CPF limpo para o DAO
            $dados['tipo_exame'],
            $dados['data_exame'],
            $dados['resultado'],
            $dados['observacao']
        );
        $_SESSION['mensagem'] = "Relatório atualizado com sucesso!";
    }

    public static function excluir($id) {
        RelatorioDAO::excluir($id);
        $_SESSION['mensagem'] = "Relatório excluído com sucesso!";
    }

    public static function listarTodos() {
        return RelatorioDAO::listarTodos();
    }

    public static function getEdicao($id) {
        return RelatorioDAO::buscarPorId($id);
    }
}