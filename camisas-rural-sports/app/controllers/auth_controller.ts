import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Hash from '@adonisjs/core/services/hash'

export default class AuthController {
  // ===== Cadastro =====
  public async register({ request, response, session }: HttpContext) {
    const { name, email, password } = request.only(['name', 'email', 'password'])

    // verifica se já existe usuário com o mesmo email
    const existingUser = await User.findBy('email', email)
    if (existingUser) {
      session.flash('error', 'Email já cadastrado.')
      return response.redirect('/cadastro')
    }

    await User.create({ name, email, password })
    session.flash('success', 'Cadastro realizado com sucesso! Faça login.')
    return response.redirect('/login')
  }

  // ===== Login =====
  public async login({ request, response, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.findBy('email', email)
    if (!user || !(await Hash.verify(user.password, password))) {
      session.flash('error', 'Email ou senha incorretos.')
      return response.redirect('/login')
    }

    session.put('user', user)
    return response.redirect('/')
  }

  // ===== Logout =====
  public async logout({ response, session }: HttpContext) {
    session.forget('user')
    return response.redirect('/login')
  }
}
