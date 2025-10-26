import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'


export default class ProductsController {
  public async create({ view }: HttpContext) {
    return view.render('cadastro_produto')
  }

  public async store({ request, response, session }: HttpContext) {
    const data = request.only(['name', 'description', 'price', 'image_url'])

    await Product.create(data)

    session.flash('success', 'Produto cadastrado com sucesso!')
    return response.redirect('/produtos')
  }

  public async index({ view }: HttpContext) {
    const products = await Product.all()
    return view.render('lista_produtos', { products })
  }

  
  public async edit({ params, view }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    return view.render('editar_produto', { product })
  }

  public async update({ params, request, response, session }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    const data = request.only(['name', 'description', 'price', 'image_url'])

    product.merge(data)
    await product.save()

    session.flash('success', 'Produto atualizado com sucesso!')
    return response.redirect('/produtos')
  }


  public async destroy({ params, response, session }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.delete()

    session.flash('success', 'Produto excluído com sucesso!')
    return response.redirect('/produtos')
  }
}


