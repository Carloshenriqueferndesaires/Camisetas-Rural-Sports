import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddSexoToUsers extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('sexo').notNullable().defaultTo('não informado')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('sexo')
    })
  }
}
