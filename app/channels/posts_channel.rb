class PostsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "post_#{params.fetch(:id)}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
