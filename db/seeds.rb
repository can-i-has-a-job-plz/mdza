# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

(1..5).map { |size| "h#{size}" }.each do |heading_tag|
  ComponentTemplate.create!(
    name: "#{heading_tag} Heading",
    component_name: 'Typography',
    schema: {
      type: 'object',
      required: ['text'],
      properties: {
        children: {
          type: 'string',
          title: 'Heading text'
        }
      }
    },
    default_props: { variant: heading_tag }
  )
end
