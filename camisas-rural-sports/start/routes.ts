import router from '@adonisjs/core/services/router'
import { HttpContext } from '@adonisjs/core/http'
import AuthController from '#controllers/auth_controller'

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


router.post('/register', [AuthController, 'register'])
router.post('/login', [AuthController, 'login'])
router.get('/logout', [AuthController, 'logout'])


router.get('api/profile', async ({ session, response }: HttpContext) => {
  const user = session.get('user')
  if (!user) {
    return response.unauthorized({ error: 'Usuário não logado' })
  }
  return response.json({
    name: user.name,
    email: user.email,
    sexo: user.sexo
    
  })
})

router.get('/teste', async ({ view, session, response }: HttpContext) => {
  const user = session.get('user')

  if (!user) {
    session.flash('error', 'Você precisa estar logado para acessar esta página.')
    return response.redirect('/login')
  }

  return view.render('teste', { user })
})

router.get('/', async ({ view, session }: HttpContext) => {
  const user = session.get('user')
  return view.render('index', { user })
})
