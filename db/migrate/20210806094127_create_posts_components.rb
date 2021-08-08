class CreatePostsComponents < ActiveRecord::Migration[6.1]
  def change
    create_table :post_components do |t|
      t.references :post, null: false, foreign_key: { to_table: :components }
      t.references :component, null: false, foreign_key: true
      t.bigint :ord, null: false

      t.index %i[ord post_id], unique: true

      t.timestamps
    end
  end
end
