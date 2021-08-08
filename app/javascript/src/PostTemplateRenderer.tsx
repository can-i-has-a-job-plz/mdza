import React, { useState, useEffect } from 'react';

import ComponentTemplateRenderer from './ComponentTemplateRenderer'

import { fetchAPI } from './api'
import componentTemplateStore, { ComponentTemplateMapType } from './componentTemplateStore'

const renderPostTemplate = (componentTemplateIds: Array<number>, componentTemplateList: ComponentTemplateMapType, componentTemplateFormDatas: Array<any>) => {
  return (
    <React.Fragment>
      {componentTemplateIds.map((id, index) => {
        if (!(id in componentTemplateList)) {
          return <div key={index}>Loading component template</div>
        }

        const componentTemplate = componentTemplateList[id]
        const formData = componentTemplateFormDatas[index]

        return <ComponentTemplateRenderer key={index} id={componentTemplate.id} name={componentTemplate.componentName} defaultProps={componentTemplate.componentDefaultProps} formData={formData} />
      })}
    </React.Fragment>
  )
}

interface PostTemplateProps {
  componentTemplateIds: Array<number>,
  componentTemplateFormDatas: Array<any>
}

const PostTemplateRenderer = (props: PostTemplateProps) => {
  const [componentTemplateList, setComponentTemplateList] = useState<ComponentTemplateMapType>({})

  useEffect(() => {
    componentTemplateStore.fetchMap(props.componentTemplateIds)
      .then(componentTemplateList => setComponentTemplateList(componentTemplateList))
  }, [props.componentTemplateIds])

  return renderPostTemplate(props.componentTemplateIds, componentTemplateList, props.componentTemplateFormDatas)
}

interface ExistingPostEditorRendererProps {
  postTemplateId: number,
  componentTemplateFormDatas: Array<any>
}

export const ExistingPostEditorRenderer = (props: ExistingPostEditorRendererProps) => {
  const [componentTemplateIds, setComponentTemplateIds] =  useState<Array<number>>([])
  const [componentTemplateList, setComponentTemplateList] = useState<ComponentTemplateMapType>({})

  useEffect(() => {
    fetchAPI(`post_templates/${props.postTemplateId}`)
      .then(json => {
        setComponentTemplateIds(json.component_template_ids)
      })
  }, [props.postTemplateId])

  useEffect(() => {
    componentTemplateStore.fetchMap(componentTemplateIds)
      .then(componentTemplateList => setComponentTemplateList(componentTemplateList))
  }, [componentTemplateIds])

  return renderPostTemplate(componentTemplateIds, componentTemplateList, props.componentTemplateFormDatas)
}


export default PostTemplateRenderer
