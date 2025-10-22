import router from '@adonisjs/core/services/router'
import { HttpContext } from '@adonisjs/core/http'
import AuthController from '#controllers/auth_controller'

// ==========================
// PÁGINAS DE LOGIN E CADASTRO
// ==========================
router.get('/login', async ({ view, session }: HttpContext) => {
  const error = session.flashMessages.get('error')
  const success = session.flashMessages.get('success')
  return view.render('login', { error, success })
})

router.get('/cadastro', async ({ view, session }: HttpContext) => {
  const error = session.flashMessages.get('error')
  const success = session.flashMessages.get('success')
  return view.render('cadastro', { error, success })
})

// ==========================
// AÇÕES DE LOGIN / CADASTRO / LOGOUT
// ==========================
router.post('/register', [AuthController, 'register'])
router.post('/login', [AuthController, 'login'])
router.get('/logout', [AuthController, 'logout'])

// ==========================
// PERFIL DO USUÁRIO
// ==========================
router.get('/profile', async ({ view, session, response }: HttpContext) => {
  const user = session.get('user')

  if (!user) {
    session.flash('error', 'Você precisa estar logado para acessar o perfil.')
    return response.redirect('/login')
  }

  return view.render('profile', { user })
})

// ==========================
// DASHBOARD / TESTE
// ==========================
router.get('/teste', async ({ view, session, response }: HttpContext) => {
  const user = session.get('user')

  if (!user) {
    session.flash('error', 'Você precisa estar logado para acessar esta página.')
    return response.redirect('/login')
  }

  return view.render('teste', { user })
})

// ==========================
// HOME
// ==========================
router.get('/', async ({ view, session }: HttpContext) => {
  const user = session.get('user')
  return view.render('index', { user })
})
