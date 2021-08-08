module API
  module V1
    class ComponentTemplatesController < ApplicationController
      def create
        component_template = ComponentTemplate.new(create_params)
        if component_template.save
          render json: { id: component_template.id }
        else
          render json: { errors: component_template.errors.messages }
        end
      end

      def index
        render json: ComponentTemplate.order(:name).pluck(:id, :name)
      end

      def show
        render json: ComponentTemplate
          .select(:id, :name, :component_name, :schema, :default_props)
          .find(params.require(:id))
      end

      private

      def create_params
        params.require(:payload).permit(:name, :component_name, schema: {}, default_props: {})
      end
    end
  end
end
