import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import Order from '#models/order' // 1. IMPORTAR O MODELO ORDER

export default class CheckoutController {

 public async finalize({ session, response, view, auth }: HttpContext) {
    
    // 1. FORÇAR A VERIFICAÇÃO DO USUÁRIO
    await auth.check() 
    
    // Debug: Se quiser ver no terminal quem está logado, descomente abaixo:
    // console.log('Usuário tentando comprar:', auth.user?.id)

    const cart = session.get('cart', [])

    if (cart.length === 0) {
      session.flash('error', 'Seu carrinho está vazio.')
      return response.redirect('/carrinho')
    }
    try {
      // Loop para verificar e descontar o estoque
      for (const item of cart) {
        const product = await Product.find(item.id)

        if (!product) {
          throw new Error(`Produto ${item.name} não encontrado.`)
        }

        if (product.quantity < item.quantity) {
          throw new Error(`Estoque insuficiente para o produto: ${product.name}. Restam apenas ${product.quantity}.`)
        }

        // Atualiza o estoque (RETIRA O PRODUTO)
        product.quantity = product.quantity - item.quantity
        await product.save()
      }

      // ---------------------------------------------------------
      // 3. INÍCIO DO CÓDIGO NOVO (SALVAR O PEDIDO)
      // ---------------------------------------------------------

      // A. Calcular o total do pedido
      // O 'reduce' soma (preço * quantidade) de todos os itens
      const total = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)

      // B. Criar o registro na tabela 'orders'
      await Order.create({
        userId: auth.user?.id, // Pega o ID do usuário logado (se houver)
        total: total,
        items: cart, // O Adonis converte automaticamente para JSON se a coluna for do tipo json
        status: 'Confirmado' // Define o status inicial
      })

      // ---------------------------------------------------------
      // FIM DO CÓDIGO NOVO
      // ---------------------------------------------------------

      // Limpa o carrinho após o sucesso
      session.forget('cart')
      
      // Mostra a tela de sucesso
      return view.render('compra_realizada')

    } catch (error) {
      console.error(error)
      session.flash('error', error.message || 'Erro ao processar a compra.')
      return response.redirect('/carrinho')
    }
  }
}