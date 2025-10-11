import router from '@adonisjs/core/services/router'
import { HttpContext } from '@adonisjs/core/http'

// ==========================
// LOGIN
// ==========================
router.get('/login', async ({ view }: HttpContext) => {
  return view.render('login')
})

router.post('/login', async ({ request, response, session }: HttpContext) => {
  const email = request.input('email')
  const password = request.input('password')

  // Autenticação simples "hardcoded"
  if (email === 'teste@teste.com' && password === '123456') {
    return response.redirect('/dashboard')
  }

  session.flash('error', 'Credenciais inválidas')
  return response.redirect('/login')
})

// ==========================
// CADASTRO
// ==========================
router.get('/cadastro', async ({ view }: HttpContext) => {
  return view.render('cadastro')
})

router.post('/cadastro', async ({ request, response, session }: HttpContext) => {
  const name = request.input('name')
  const email = request.input('email')
  const password = request.input('password')
  const confirmPassword = request.input('confirm_password')

  // Validação simples
  if (password !== confirmPassword) {
    session.flash('error', 'As senhas não coincidem')
    return response.redirect('/cadastro')
  }

  // Aqui você poderia salvar o usuário em um banco de dados
  // Por enquanto vamos apenas aceitar qualquer cadastro
  session.flash('success', 'Conta criada com sucesso! Faça login.')
  return response.redirect('/login')
})

// ==========================
// DASHBOARD
// ==========================
router.get('/dashboard', async ({ view }: HttpContext) => {
  // Aqui você pode adicionar verificação de login se quiser
  return view.render('dashboard', { user: 'Usuário Teste' })
})
