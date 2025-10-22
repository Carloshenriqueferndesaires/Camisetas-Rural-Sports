import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Hash from '@adonisjs/core/services/hash'

export default class AuthController {
  // ===== Cadastro =====
  public async register({ request, response, session }: HttpContext) {
    const { name, email, password, sexo } = request.only(['name', 'email', 'password', 'sexo'])

    // verifica se já existe usuário com o mesmo email
    const existingUser = await User.findBy('email', email)
    if (existingUser) {
      session.flash('error', 'Email já cadastrado.')
      return response.redirect('/cadastro')
    }

    // cria o usuário com nome, email, senha e sexo
    await User.create({ name, email, password, sexo })

    session.flash('success', 'Cadastro realizado com sucesso! Faça login.')
    return response.redirect('/login')
  }

  // ===== Login =====
  public async login({ request, response, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.findBy('email', email)

    // valida credenciais
    if (!user || !(await Hash.verify(user.password, password))) {
      session.flash('error', 'Email ou senha incorretos.')
      return response.redirect('/login')
    }

    // salva usuário na sessão
    session.put('user', user)
    return response.redirect('/')
  }

  // ===== Logout =====
  public async logout({ response, session }: HttpContext) {
    session.forget('user')
    return response.redirect('/login')
  }

  // ===== Atualizar senha =====
  public async updatePassword({ request, session, response }: HttpContext) {
    const user = session.get('user')
    if (!user) {
      session.flash('error', 'Você precisa estar logado para alterar a senha.')
      return response.redirect('/login')
    }

    const newPassword = request.input('password')

    const dbUser = await User.find(user.id)
    if (dbUser) {
      dbUser.password = newPassword
      await dbUser.save()
      session.flash('success', 'Senha atualizada com sucesso!')
    }

    return response.redirect('/')
  }

  // ===== API Perfil (dados em JSON) =====
  public async getProfile({ session, response }: HttpContext) {
    const user = session.get('user')
    if (!user) {
      return response.unauthorized({ error: 'Usuário não logado' })
    }

    return response.json({
      name: user.name,
      email: user.email,
      sexo: user.sexo,
    })
  }
}

