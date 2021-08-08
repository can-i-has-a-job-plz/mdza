class CreateComponentTemplates < ActiveRecord::Migration[6.1]
  def change
    create_table :component_templates do |t|
      t.text :name, null: false
      t.text :component_name, null: false
      t.jsonb :schema, null: false
      t.jsonb :default_props, default: {}, null: false

      t.timestamps

      t.index %i[name], unique: true
    end
  end
end
