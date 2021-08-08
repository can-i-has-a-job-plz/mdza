Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  namespace :api do
    namespace :v1 do
      resources :component_templates, only: %i[create index show]
      resources :post_templates, only: %i[create index show]
      resources :posts, only: %i[create index show update] do
        get :broadcast, on: :member
      end
    end
  end
end
