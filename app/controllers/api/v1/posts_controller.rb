module API
  module V1
    class PostsController < ApplicationController
      def broadcast
        Component.compound.find(params.fetch(:id)).update!(updated_at: Time.current)
        render json: {}
      end

      def create
        post = build_post(
          create_params.fetch(:post_template_id),
          create_params.fetch(:component_template_ids),
          params.dig(:payload, :component_props)
        )
        if post.save
          render json: { id: post.id }
        else
          render json: { errors: post.errors }
        end
      end

      def index
        render json: Component.compound.order(:id).pluck(:id, :id)
      end

      def show
        post = Component.compound.find(params.require(:id))
        render json: {
          id: post.id,
          componentTemplateIds: post.components.order_by_ord.pluck(:component_template_id),
          componentTemplateFormDatas: build_form_datas(post)
        }
      end

      def update
        post = Component.compound.find(params.fetch(:id))

        Component.transaction { update_post(post, params.dig(:payload, :component_props)) }

        render json: { id: post.id }
      end

      private

      def update_post(post, component_props)
        post.components.order_by_ord.each_with_index do |component, index|
          if component.component_template.component_templates.any?
            update_post(component, component_props.fetch(index))
          else
            component.update!(props: component_props.fetch(index).permit!)
          end
        end
      end

      def build_form_datas(post)
        post.components.order_by_ord.map do |component|
          next component.props unless component.components.any?

          build_form_datas(component)
        end
      end

      def build_post(post_template_id, component_template_ids, component_props)
        post = Component.new(component_template_id: post_template_id, props: 'post')

        component_template_ids.each_with_index do |component_template_id, index|
          component_template = ComponentTemplate.find(component_template_id)
          component = if component_template.component_templates.any?
                        build_post(
                          component_template_id,
                          component_template.component_templates.order_by_ord.pluck(:id),
                          component_props.fetch(index)
                        )
                      else
                        component_template.components.build(props: component_props.fetch(index).permit!)
                      end
          post.post_components.build(ord: index, component: component)
        end

        post
      end

      def create_params
        params.require(:payload).permit(:post_template_id, components: [:component_template_id, { props: {} }], component_template_ids: [], component_props: [{}])
      end
    end
  end
end
