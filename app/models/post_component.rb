class PostComponent < ApplicationRecord
  belongs_to :post, class_name: 'Component'
  belongs_to :component

  validates :ord, presence: true, uniqueness: { scope: :post_id }
end
