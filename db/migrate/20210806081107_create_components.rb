class CreateComponents < ActiveRecord::Migration[6.1]
  def change
    create_table :components do |t|
      t.references :component_template, null: false, foreign_key: true
      t.jsonb :props, null: false

      t.timestamps
    end
  end
end
