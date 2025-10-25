import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddNameToUsers extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('name').notNullable().defaultTo('') 
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('name')
    })
  }
}

