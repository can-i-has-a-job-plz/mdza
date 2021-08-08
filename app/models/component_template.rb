class ComponentTemplate < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  validates :component_name, :schema, presence: true

  scope :compound, -> { where(id: PostTemplatesComponentTemplate.select(:post_template_id)) }
  scope :single, -> { where.not(id: PostTemplatesComponentTemplate.select(:post_template_id)) }
  scope :order_by_ord, -> { order(PostTemplatesComponentTemplate.arel_table[:ord]) }

  has_many :post_templates_component_templates, foreign_key: :post_template_id, dependent: :destroy, inverse_of: :post_template
  has_many :component_template_post_templates, class_name: 'PostTemplatesComponentTemplate', inverse_of: :component_template

  has_many :post_templates, class_name: 'ComponentTemplate', through: :component_template_post_templates, source: :post_template
  has_many :component_templates, through: :post_templates_component_templates, source: :component_template
  has_many :components

  def self.compound_new(*args, **kwargs, &block)
    new(*args, component_name: 'CompoundComponent', schema: { type: 'string' }, **kwargs, &block)
  end
end
