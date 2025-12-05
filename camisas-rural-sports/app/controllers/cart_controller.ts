// app/controllers/cart_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'

export default class CartController {
  
  // Renderizar a página do carrinho
  public async index({ view, session }: HttpContext) {
    const cart = session.get('cart', [])
    
    // Calcula o total
    const total = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)

    return view.render('carrinho', { cart, total })
  }

  // Adicionar item ou Incrementar quantidade (+)
  public async add({ params, session, response }: HttpContext) {
    const productId = Number(params.id)
    const product = await Product.find(productId)

    if (!product) {
      session.flash('error', 'Produto não encontrado.')
      return response.redirect().back()
    }

    let cart = session.get('cart', [])
    const existingItemIndex = cart.findIndex((item: any) => item.id === productId)

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += 1
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        imageUrl: product.imageUrl,
        description: product.description,
        quantity: 1
      })
    }

    session.put('cart', cart)
    // session.flash('success', 'Carrinho atualizado!') // Opcional: comentar para não poluir com muitas mensagens ao clicar várias vezes
    return response.redirect('/carrinho')
  }

  // Decrementar quantidade (-)
  public async decrement({ params, session, response }: HttpContext) {
    const productId = Number(params.id)
    let cart = session.get('cart', [])

    const existingItemIndex = cart.findIndex((item: any) => item.id === productId)

    if (existingItemIndex >= 0) {
      if (cart[existingItemIndex].quantity > 1) {
        cart[existingItemIndex].quantity -= 1
      } else {
        // Se a quantidade for 1 e clicar em menos, remove o item
        cart.splice(existingItemIndex, 1)
      }
    }

    session.put('cart', cart)
    return response.redirect('/carrinho')
  }

  // Remover item completamente (Lixeira)
  public async remove({ params, session, response }: HttpContext) {
    const productId = Number(params.id)
    let cart = session.get('cart', [])

    cart = cart.filter((item: any) => item.id !== productId)

    session.put('cart', cart)
    session.flash('success', 'Produto removido.')
    return response.redirect('/carrinho')
  }
}