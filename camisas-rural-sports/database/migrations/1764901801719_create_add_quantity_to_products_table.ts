import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Adiciona a coluna quantity, padrão 0, não pode ser nulo
      table.integer('quantity').defaultTo(0).notNullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('quantity')
    })
  }
}