module API
  module V1
    class PostTemplatesController < ApplicationController
      def create
        post_template = ComponentTemplate.compound_new(name: create_params[:name])
        create_params.fetch(:component_template_ids).each_with_index do |component_template_id, ord|
          post_template.post_templates_component_templates.build(component_template_id: component_template_id, ord: ord)
        end
        if post_template.save
          render json: { id: post_template.id }
        else
          render json: { errors: post_template.errors.messages }
        end
      end

      def index
        render json: ComponentTemplate.compound.order(:name).pluck(:id, :name)
      end

      def show
        post_template = ComponentTemplate.select(:id, :name).compound.find(params.require(:id))
        component_template_ids = post_template.component_templates.order_by_ord.pluck(:id)

        render json: { **post_template.as_json, component_template_ids: component_template_ids }
      end

      private

      def create_params
        params.require(:payload).permit(:name, component_template_ids: [])
      end
    end
  end
end
