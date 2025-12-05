import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // ADICIONE ESTAS LINHAS:
  @column()
  declare userId: number | null

  @column()
  declare total: number

 @column({
  prepare: (value: any) => JSON.stringify(value), // Antes de SALVAR: Converte Array -> Texto
  consume: (value: string) => JSON.parse(value)   // Depois de LER: Converte Texto -> Array
})
declare items:any

  @column()
  declare status: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}