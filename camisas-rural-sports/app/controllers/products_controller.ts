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
}
