<?php
session_start();

    if (!isset($_SESSION["id"])) {
        header("Location: ../acesso/login.php");
        exit;
    }

// Carrega mensagens de sucesso/erro (se houver)
$sucesso = $_SESSION['sucesso'] ?? null;
$erro    = $_SESSION['erro'] ?? null;
unset($_SESSION['sucesso'], $_SESSION['erro']);

require __DIR__ . '../../acesso/dao/usuarioDao.php';

$usuarioDao = new UsuarioDao();
$usuarios   = $usuarioDao->findAll();
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <title>Cadastro de Usuário</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="icon" href="../faviconSPS.png" type="image/x-icon">
    <link rel="stylesheet" href="../CSS/styleCP.css">
    <style> .mt-2 { margin-top: 0.5rem;}</style>
</head>

<body>
    <?php include('../../modelo/nav.php'); ?>

    <div class="container mt-4">
        <h1 id="titulo" class="mb-4">Cadastro de Usuário</h1>

        <?php if ($sucesso): ?>
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <?= htmlspecialchars($sucesso, ENT_QUOTES, 'UTF-8') ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <?php endif; ?>

        <?php if ($erro): ?>
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <?= htmlspecialchars($erro, ENT_QUOTES, 'UTF-8') ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <?php endif; ?>

        <!-- Form de Cadastro / Edição -->
        <div class="mb-5">
            <div class="card-body">
                <form id="formUsuario" action="../acesso/controller/usuarioController.php" method="post">
                    <!-- Campo oculto para o ID (usado só no modo EDIÇÃO) -->
                    <input type="hidden" name="id" id="user_id" value="">

                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label for="nome" class="form-label">Nome</label>
                            <input type="text" class="form-control" id="nome" name="nome" required>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label for="email" class="form-label">E-mail</label>
                            <input type="email" class="form-control" id="email" name="email" required>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label for="tipoUsuario" class="form-label">Tipo de Usuário</label>
                            <select class="form-select" id="tipoUsuario" name="tipoUsuario" required>
                                <option value="" disabled selected>Selecione o tipo</option>
                                <option value="ADM">ADM</option>
                                <option value="DEFAULT">DEFAULT</option>
                            </select>
                        </div>
                    </div>

                    <!-- Campos de senha -->
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label for="password" class="form-label">Senha</label>
                            <input type="password" class="form-control" id="password" name="password" required>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label for="pyes" class="form-label">Confirmar Senha</label>
                            <input type="password" class="form-control" id="pyes" name="pyes" required>
                        </div>
                    </div>

                    <!-- Botão que muda dinamicamente entre Cadastrar / Atualizar -->
                    <button type="submit" id="btnSubmit" name="cadastrar" class="btn btn-primary">
                        Cadastrar
                    </button>
                    <button type="button" id="btnCancelarEdicao" class="btn btn-secondary d-none ms-2">
                        Cancelar edição
                    </button>
                </form>
            </div>
        </div>

        <!-- Tabela de Usuários -->
        <div class="table-responsive">
            <table class="table table-striped align-middle border-top border-dark">
                <thead class="table-primary border-bottom border-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Rol</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($usuarios as $u): ?>
                        <tr>
                            <td><?= htmlspecialchars($u['id'], ENT_QUOTES, 'UTF-8') ?></td>
                            <td><?= htmlspecialchars($u['nome'], ENT_QUOTES, 'UTF-8') ?></td>
                            <td><?= htmlspecialchars($u['email'], ENT_QUOTES, 'UTF-8') ?></td>
                            <td><?= htmlspecialchars($u['rol'], ENT_QUOTES, 'UTF-8') ?></td>
                            <td>
                                <?php if ($_SESSION['id'] != $u['id']): ?>
                                <!-- Editar: chama JS para preencher formulário -->
                                <button class="btn btn-sm btn-warning me-1 btnEditar" onclick="fillForm(<?= $u['id'] ?>, '<?= addslashes($u['nome']) ?>', '<?= addslashes($u['email']) ?>', '<?= addslashes($u['rol']) ?>')">
                                    Editar
                                </button>

                                <form method="post" action="../acesso/controller/usuarioController.php" style="display:inline;" 
                                        onsubmit="return confirm('Tem certeza que deseja excluir o usuário <?= addslashes($u['nome']) ?>?');">
                                    <input type="hidden" name="excluir" value="<?= $u['id'] ?>">
                                    <!-- Excluir: chama função JS de confirmação -->
                                    <button type="submit" class="btn btn-sm btn-danger">
                                        Excluir
                                    </button>
                                </form>
                                <?php else: ?>
                                    <span class="text-muted">Você</span>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>

                    <?php if (count($usuarios) === 0): ?>
                        <tr>
                            <td colspan="5" class="text-center">Nenhum usuário cadastrado.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <?php include('../../modelo/footer.php'); ?>

    <!-- Nosso JavaScript para preencher formulário e exclusão -->
    <script>
        //Preenche o formulário de edição com os dados do usuário clicado e rola para o topo e desabilita os campos de senha para não serem editáveis (ficam “cinzas”)
        function fillForm(id, nome, email, rol) {
            // 1) Preenche ID, nome, email e tipo de usuário:
            document.getElementById('user_id').value = id;
            document.getElementById('nome').value = nome;
            document.getElementById('email').value = email;

            const select = document.getElementById('tipoUsuario');
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].value === rol) {
                    select.selectedIndex = i;
                    break;
                }
            }

            // 2) Desabilita os campos de senha (ficam cinzas e não clicáveis)
            document.getElementById('password').value = ''; // limpa, se quiser
            document.getElementById('pyes').value = '';
            document.getElementById('password').disabled = true;
            document.getElementById('pyes').disabled = true;

            // 3) Altera botão principal para “Atualizar”
            const btnSubmit = document.getElementById('btnSubmit');
            btnSubmit.textContent = 'Atualizar';
            btnSubmit.classList.replace('btn-primary', 'btn-success');
            btnSubmit.name = 'atualizar';

            // 4) Mostra botão “Cancelar edição”
            const btnCancelar = document.getElementById('btnCancelarEdicao');
            btnCancelar.classList.remove('d-none');

            // 5) Faz scroll suave até o topo
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }


        //Cancela o modo de edição, limpa o formulário e volta ao modo “cadastrar” e reabilita os campos de senha.
        document.getElementById('btnCancelarEdicao').addEventListener('click', function() {
            // 1) Limpa todos os campos
            document.getElementById('user_id').value = '';
            document.getElementById('nome').value = '';
            document.getElementById('email').value = '';
            document.getElementById('tipoUsuario').value = '';

            // 2) Reabilita os campos de senha e limpa valores
            const inputSenha = document.getElementById('password');
            const inputConfirm = document.getElementById('pyes');
            inputSenha.disabled = false;
            inputConfirm.disabled = false;
            inputSenha.value = '';
            inputConfirm.value = '';

            // 3) Ajusta botão de submit de volta para “Cadastrar”
            const btnSubmit = document.getElementById('btnSubmit');
            btnSubmit.textContent = 'Cadastrar';
            btnSubmit.classList.replace('btn-success', 'btn-primary');
            btnSubmit.name = 'cadastrar';

            // 4) Esconde botão “Cancelar edição”
            this.classList.add('d-none');

            // 5) (Opcional) Scroll suave para manter a tela estável
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        const titulo = document.getElementById('titulo');
        const btnConcelar = document.getElementById('btnCancelarEdicao');

        // Seleciona todos os botões de editar
        const btnsEditar = document.querySelectorAll('.btnEditar');

        // Para cada botão, adiciona o evento de clique
        btnsEditar.forEach((btn) => {
            btn.addEventListener('click', () => {
                titulo.textContent = 'Edição de Usuário';
            });
        });

        // Cancela a edição e volta o título
        btnConcelar.addEventListener('click', () => {
            titulo.textContent = 'Cadastro de Usuário';
        });
    </script>
</body>

</html>