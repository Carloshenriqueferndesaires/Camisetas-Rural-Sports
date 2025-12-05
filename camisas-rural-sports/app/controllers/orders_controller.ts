import type { HttpContext } from '@adonisjs/core/http'
import Order from '#models/order'

export default class OrdersController {
  
  public async index({ view, auth, response }: HttpContext) {
    
    // --- CÓDIGO DE DIAGNÓSTICO ---
    await auth.check() // Força verificar
    console.log('--------------------------------------------------')
    console.log('ESTOU LOGADO?', auth.isAuthenticated)
    console.log('QUEM SOU EU?', auth.user?.name)
    console.log('ID DO USUÁRIO:', auth.user?.id)
    console.log('--------------------------------------------------')
    // --------------------------------

    if (!auth.user) {
      // Se cair aqui, é porque o login NÃO funcionou ou a sessão caiu
      return "ERRO: O sistema diz que você NÃO está logado. Verifique o terminal."
    }

    const orders = await Order.query()
      .where('user_id', auth.user.id)
      .orderBy('created_at', 'desc')

    return view.render('meus_pedidos', { orders })
  }
}