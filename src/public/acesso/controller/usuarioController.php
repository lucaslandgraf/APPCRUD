<?php
session_start();

require __DIR__ . '../../../connection/Connection.php';
require __DIR__ . '/../../../modelo/usuario.php';
require __DIR__ . '/../dao/usuarioDao.php';
require __DIR__ . '../../../../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$usuario = new Usuario();
$usuarioDao = new UsuarioDao();

if (isset($_POST['cadastrar'])) {
    $nome = trim($_POST['nome']);
    $email = trim($_POST['email']);
    $senha = $_POST['password'];
    $confirmar = $_POST['pyes'];
    $rol = $_POST['tipoUsuario'];

    if ($senha !== $confirmar) {
        $_SESSION['erro'] = "As senhas não são iguais.";
    } else {
        $senhaHash = password_hash($senha, PASSWORD_DEFAULT);
        $sucesso = $usuarioDao->inserir($nome, $email, $senhaHash, $rol);
        if ($sucesso) {
            $_SESSION['sucesso'] = "Usuário cadastrado com sucesso!";
        } else {
            $_SESSION['erro'] = "Erro ao cadastrar usuário.";
        }
    }
    header("Location: ../../cadastro/cadastro.php");
    exit;
}

if (isset($_POST['excluir'])) {
    $idExcluir = (int) $_POST['excluir'];

    // Garante que não pode excluir a si mesmo
    if ($idExcluir === $_SESSION['id']) {
        $_SESSION['erro'] = "Você não pode excluir a si mesmo.";
        header("Location: ../../cadastro/cadastro.php");
        exit;
    }

    if ($usuarioDao->deleteById($idExcluir)) {
        $_SESSION['sucesso'] = "Usuário excluído com sucesso!";
    } else {
        $_SESSION['erro'] = "Falha ao excluir usuário.";
    }
    header("Location: ../../cadastro/cadastro.php");
    exit;
}

if (isset($_POST['atualizar'])) {
    $id       = (int) $_POST['id'];
    $nome     = trim($_POST['nome']);
    $email    = trim($_POST['email']);
    $rol      = $_POST['tipoUsuario'];

    // Só atualiza nome, email e rol. Não mexe em senha aqui.
    $sucesso = $usuarioDao->update($id, $nome, $email, $rol);
    if ($sucesso) {
        $_SESSION['sucesso'] = "Usuário atualizado com sucesso!";
    } else {
        $_SESSION['erro'] = "Erro ao atualizar usuário.";
    }
    header("Location: ../../cadastro/cadastro.php");
    exit;
}


if (isset($_POST['login'])) {
    $email = $_POST['email'];
    $senha = $_POST['password'];

    $usuario = $usuarioDao->findByEmail($email);
    if (!$usuario || !password_verify($senha, $usuario['senha'])) {
        $_SESSION['erro'] = "Usuário ou senha incorretos.";
        header("Location: ../login.php");
        exit;
    }

    $_SESSION['id'] = $usuario['id'];
    $_SESSION['nome'] = $usuario['nome'];
    $_SESSION['rol']  = $usuario['rol'];
    $_SESSION['email'] = $usuario['email'];

    header("Location: ../../home/home.php");
    exit;
}


if (isset($_POST['reset'])) {
    $email = $_POST['email'];
    $usuario = $usuarioDao->findByEmail($email);

    if (!$usuario) {
        $_SESSION['erro'] = "E-mail não cadastrado.";
        header("Location: ../forgotPassword.php");
        exit;
    }

    $nome = $usuario['nome'];
    $senha_provisoria = "SPPUB@" . $nome;
    $senha_hash = password_hash($senha_provisoria, PASSWORD_DEFAULT);

    $usuarioDao->updatePassword($email, $senha_hash);

     $html = "
    <!DOCTYPE html>
    <html lang='pt-BR'>
    <head>
      <meta charset='UTF-8'>
      <title>Redefinição de Senha</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f7;
          margin: 0;
          padding: 0;
          color: #333333;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        .header {
          background-color: #4a90e2;
          padding: 20px;
          color: #ffffff;
          text-align: center;
        }
        .content {
          padding: 30px 20px;
        }
        .content h2 {
          margin-top: 0;
        }
        .button {
          display: inline-block;
          margin: 20px 0;
          padding: 12px 25px;
          background-color: #4a90e2;
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        }
        .footer {
          background-color: #f0f0f0;
          padding: 15px;
          font-size: 12px;
          text-align: center;
          color: #777777;
        }
        @media only screen and (max-width: 600px) {
          .content, .header, .footer {
            padding: 15px;
          }
        }
      </style>
    </head>
    <body>
      <div class='container'>
        <div class='header'>
          <h1>Redefinição de Senha</h1>
        </div>
        <div class='content'>
          <h2>Olá, $nome!</h2>
          <p>Recebemos uma solicitação para redefinir sua senha.</p>
          <p>Sua nova senha provisória é:</p>
          <p style='text-align: center; font-size: 20px; font-weight: bold;'>$senha_provisoria</p>
          <p>Por favor, faça login no sistema e altere sua senha o quanto antes.</p>
          <p>Se você não solicitou essa redefinição, por favor ignore este e-mail.</p>
          <p>Obrigado,<br>Equipe de Suporte - Sistema Positivo de Saúde</p>
        </div>
        <div class='footer'>
          &copy; 2025 Sistema Positivo de Saúde. Todos os direitos reservados.
        </div>
      </div>
    </body>
    </html>";


    // Envio de e-mail
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'sps.ti.no.reply@gmail.com';
        $mail->Password = 'rhjm pakk gtfg cukg';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        $mail->CharSet = 'UTF-8';

        $mail->setFrom('sps.ti.no.reply@gmail.com', 'Sistema SPS');
        $mail->addAddress($email, $nome);
        $mail->isHTML(true);
        $mail->Subject = "Recuperação de Senha - Sistema Positivo de Saúde";
        $mail->Body = $html;

        $mail->send();
        $_SESSION['sucesso'] = "Senha provisória enviada para o e-mail institucional.";
    } catch (Exception $e) {
        $_SESSION['erro'] = "Erro ao enviar e-mail: {$mail->ErrorInfo}";
    }
    header("Location: ../forgotPassword.php");
    exit;
}

if (isset($_POST['alterar'])) {
    $email = $_SESSION['email'];
    $senha_atual = $_POST['passwordAtual'];
    $nova = $_POST['password'];
    $confirmar = $_POST['pyes'];

    if ($nova !== $confirmar) {
        $_SESSION['erro'] = "As senhas não coincidem.";
    } else {
        $usuario = $usuarioDao->findByEmail($email);
        if (!$usuario || !password_verify($senha_atual, $usuario['senha'])) {
            $_SESSION['erro'] = "Senha atual incorreta.";
        } else {
            $hash = password_hash($nova, PASSWORD_DEFAULT);
            $usuarioDao->updatePassword($email, $hash);
            $_SESSION['sucesso'] = "Senha alterada com sucesso!";
        }
    }
    header("Location: ../resetPassword.php");
    exit;
}
?>