import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('stock').defaultTo(0)
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('stock')
    })
  }
}
