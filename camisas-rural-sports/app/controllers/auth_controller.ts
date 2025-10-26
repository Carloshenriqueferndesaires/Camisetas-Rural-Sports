import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Hash from '@adonisjs/core/services/hash'


export default class AuthController {
  // ===== Login =====
  public async login({ request, response, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.findBy('email', email)

    if (!user) {
      session.flash('error', 'Usuário não encontrado.')
      return response.redirect('/login')
    }

    const passwordValid = await Hash.verify(user.password, password)
    if (!passwordValid) {
      session.flash('error', 'Senha incorreta.')
      return response.redirect('/login')
    }

    session.put('user', {
      id: user.id,
      name: user.name,
      email: user.email,
      sexo: user.sexo,
    })

    session.flash('success', `Bem-vindo, ${user.name}!`)
    return response.redirect('/')
  }

  public async register({ request, response, session }: HttpContext) {
    const { name, email, password, sexo } = request.only(['name', 'email', 'password', 'sexo'])
    const existingUser = await User.findBy('email', email)
    if (existingUser) {
      session.flash('error', 'Email já cadastrado.')
      return response.redirect('/cadastro')
    }

    const user = new User()
    user.name = name
    user.email = email
    user.password = password
    user.sexo = sexo
    await user.save()

    session.flash('success', 'Cadastro realizado com sucesso!')
    return response.redirect('/login')
  }

  public async logout({ session, response }: HttpContext) {
    
    session.forget('user')
    session.flash('success', 'Você saiu com sucesso.')
    return response.redirect('/login')
  }
}
