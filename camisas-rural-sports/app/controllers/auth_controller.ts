import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Hash from '@adonisjs/core/services/hash'
import { schema, rules } from '@adonisjs/validator'

export default class AuthController {

  public async login({ request, response, session }: HttpContext) {
    try {
      
      const loginSchema = schema.create({
        email: schema.string({}, [
          rules.email(), 
        ]),
        password: schema.string({}, [
          rules.minLength(6), 
        ]),
      })

      
      const { email, password } = await request.validate({ schema: loginSchema })

      
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
    } catch (error) {
      console.error('Erro de validação no login:', error.messages)
      session.flash('error', 'Verifique o email e a senha e tente novamente.')
      return response.redirect('/login')
    }
  }

  
  public async register({ request, response, session }: HttpContext) {
    try {
      const userSchema = schema.create({
        name: schema.string({}, [
          rules.minLength(3),
          rules.maxLength(50),
        ]),
        email: schema.string({}, [
          rules.email(),
        ]),
        password: schema.string({}, [
          rules.minLength(6),
        ]),
        sexo: schema.enum(['Masculino', 'Feminino'] as const),
      })

      const data = await request.validate({ schema: userSchema })

      const existingUser = await User.findBy('email', data.email)
      if (existingUser) {
        session.flash('error', 'E-mail já cadastrado.')
        return response.redirect('/cadastro')
      }

      await User.create(data)

      session.flash('success', 'Cadastro realizado com sucesso!')
      return response.redirect('/login')
    } catch (error) {
      console.error('Erro de validação no cadastro:', error.messages)
      session.flash('error', 'Verifique os campos e tente novamente.')
      return response.redirect('/cadastro')
    }
  }

  public async logout({ session, response }: HttpContext) {
    session.forget('user')
    session.flash('success', 'Você saiu com sucesso.')
    return response.redirect('/login')
  }
}
