class PostTemplatesComponentTemplate < ApplicationRecord
  belongs_to :post_template, class_name: 'ComponentTemplate'
  belongs_to :component_template

  validates :ord, presence: true, uniqueness: { scope: :post_template_id }
end
