import router from '@adonisjs/core/services/router'
import { HttpContext } from '@adonisjs/core/http'

router.get('/login', async ({ view }: HttpContext) => {
  return view.render('login')
})

router.post('/login', async ({ request, response }: HttpContext) => {
  const email = request.input('email')
  const password = request.input('password')

  // Aqui você faria a autenticação (exemplo)
  if (email === 'teste@teste.com' && password === '123456') {
    return response.redirect('/dashboard')
  }

  return response.badRequest('Credenciais inválidas')
})
