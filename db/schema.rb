# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_08_06_094127) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "component_templates", force: :cascade do |t|
    t.text "name", null: false
    t.text "component_name", null: false
    t.jsonb "schema", null: false
    t.jsonb "default_props", default: {}, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["name"], name: "index_component_templates_on_name", unique: true
  end

  create_table "components", force: :cascade do |t|
    t.bigint "component_template_id", null: false
    t.jsonb "props", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["component_template_id"], name: "index_components_on_component_template_id"
  end

  create_table "post_components", force: :cascade do |t|
    t.bigint "post_id", null: false
    t.bigint "component_id", null: false
    t.bigint "ord", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["component_id"], name: "index_post_components_on_component_id"
    t.index ["ord", "post_id"], name: "index_post_components_on_ord_and_post_id", unique: true
    t.index ["post_id"], name: "index_post_components_on_post_id"
  end

  create_table "post_templates_component_templates", force: :cascade do |t|
    t.bigint "post_template_id", null: false
    t.bigint "component_template_id", null: false
    t.bigint "ord", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["component_template_id"], name: "post_template_component_template_component_idx"
    t.index ["ord", "post_template_id"], name: "index_post_template_component_template_on_ord_and_post_idx", unique: true
    t.index ["post_template_id"], name: "post_template_component_template_post_idx"
  end

  add_foreign_key "components", "component_templates"
  add_foreign_key "post_components", "components"
  add_foreign_key "post_components", "components", column: "post_id"
  add_foreign_key "post_templates_component_templates", "component_templates"
  add_foreign_key "post_templates_component_templates", "component_templates", column: "post_template_id"
end
