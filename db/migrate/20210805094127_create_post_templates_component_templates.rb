class CreatePostTemplatesComponentTemplates < ActiveRecord::Migration[6.1]
  def change
    create_table :post_templates_component_templates do |t|
      t.references :post_template, null: false, foreign_key: { to_table: :component_templates },
                                   index: { name: :post_template_component_template_post_idx }
      t.references :component_template, null: false, foreign_key: true,
                                        index: { name: :post_template_component_template_component_idx }
      t.bigint :ord, null: false

      t.index %i[ord post_template_id], unique: true, name: :index_post_template_component_template_on_ord_and_post_idx

      t.timestamps
    end
  end
end
