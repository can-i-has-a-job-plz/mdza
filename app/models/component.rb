class Component < ApplicationRecord
  belongs_to :post, class_name: 'Component', optional: true
  belongs_to :component_template

  has_many :post_components, foreign_key: :post_id, dependent: :destroy, inverse_of: :post
  has_many :component_posts, class_name: 'PostComponent', inverse_of: :component

  has_many :posts, class_name: 'Component', through: :component_posts, source: :post
  has_many :components, through: :post_components, source: :component

  validates :props, presence: true

  scope :compound, -> { where(id: PostComponent.select(:post_id)) }
  scope :order_by_ord, -> { order(PostComponent.arel_table[:ord]) }

  after_update :notify_viewers

  def notify_viewers
    collect_posts = ->(post) { [post, *post.posts.flat_map(&collect_posts)] }

    collect_posts.call(self).each do |post|
      ActionCable.server.broadcast("post_#{post.id}", { updated: true })
    end
  end
end
