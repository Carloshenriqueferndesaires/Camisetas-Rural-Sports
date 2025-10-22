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
router.post('/logout', [AuthController, 'logout'])


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

router.post('/api/profile/update', async ({ request, session, response }: HttpContext) => {
  const user = session.get('user')

  if (!user) {
    return response.unauthorized({ success: false, message: 'Usuário não logado' })
  }

  const { name, email, sexo } = request.only(['name', 'email', 'sexo'])
  const User = (await import('#models/user')).default

  const dbUser = await User.find(user.id)
  if (!dbUser) {
    return response.notFound({ success: false, message: 'Usuário não encontrado' })
  }

  dbUser.name = name
  dbUser.email = email
  dbUser.sexo = sexo
  await dbUser.save()

  
  session.put('user', {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    sexo: dbUser.sexo,
  })

  return response.json({ success: true })
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
