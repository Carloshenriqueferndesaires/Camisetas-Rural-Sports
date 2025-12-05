import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import { schema, rules } from '@adonisjs/validator'

export default class ProductsController {
  
  public async create({ view }: HttpContext) {
    return view.render('cadastro_produto')
  }

  public async store({ request, response, session }: HttpContext) {
    try {
      const productSchema = schema.create({
        name: schema.string({}, [
          rules.minLength(1), 
        ]),
        price: schema.number([
          rules.unsigned(), 
        ]),
        quantity: schema.number([ rules.unsigned() ]),
        description: schema.string.optional({}, [
          rules.maxLength(500), 
        ]),
        image_url: schema.string.optional({}, [
          rules.regex(/^(https?:\/\/|\/|\.\/|\.{2}\/).+/),
        ]),
      })

      const data = await request.validate({ schema: productSchema })

      await Product.create(data)

      session.flash('success', 'Produto cadastrado com sucesso!')
      return response.redirect('/produtos')
    } catch (error) {
      console.error('Erro de validação:', error.messages)
      session.flash('error', 'Verifique os campos e tente novamente.')
      return response.redirect('/produtos/novo')
    }
  }

  // Método existente (Lista Administrativa)
  public async index({ view }: HttpContext) {
    const products = await Product.all()
    return view.render('lista_produtos', { products })
  }

  // ⬇️⬇️ ADICIONE ESTE BLOCO AQUI ⬇️⬇️
  // Método novo (Vitrine de Compras para o Cliente)
  public async shop({ view }: HttpContext) {
    const products = await Product.all()
    return view.render('loja', { products })
  }
  // ⬆️⬆️ FIM DO BLOCO NOVO ⬆️⬆️

  public async edit({ params, view }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    return view.render('editar_produto', { product })
  }

  public async update({ params, request, response, session }: HttpContext) {
    try {
      const productSchema = schema.create({
        name: schema.string({}, [
          rules.minLength(1),
        ]),
        price: schema.number([
          rules.unsigned(),
        ]),
        quantity: schema.number([ rules.unsigned() ]),
        description: schema.string.optional({}, [
          rules.maxLength(500),
        ]),
        image_url: schema.string.optional({}, [
          rules.regex(/^(https?:\/\/|\/|\.\/|\.{2}\/).+/),
        ]),
      })

      const data = await request.validate({ schema: productSchema })
      const product = await Product.findOrFail(params.id)

      product.merge(data)
      await product.save()

      session.flash('success', 'Produto atualizado com sucesso!')
      return response.redirect('/produtos')
    } catch (error) {
      console.error('Erro de validação:', error.messages)
      session.flash('error', 'Verifique os campos e tente novamente.')
      return response.redirect(`/produtos/${params.id}/editar`)
    }
  }

  public async destroy({ params, response, session }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.delete()

    session.flash('success', 'Produto excluído com sucesso!')
    return response.redirect('/produtos')
  }

  public async show({ params, view }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    return view.render('detalhe_produto', { product })
  }
}