import React, { useEffect, useState } from 'react';
import ComponentTemplateForm, { CompoundComponentTemplateForm } from './ComponentTemplateForm'
import componentTemplateStore, { ComponentTemplateMapType } from './componentTemplateStore'

interface PostTemplateFormProps {
  componentTemplateIds: Array<number>,
  componentTemplateFormDatas: Array<any>,
  onComponentTemplateDataChange: (componentIndex: number) => (formData: any) => void
}

const PostTemplateForm = (props: PostTemplateFormProps) => {
  const [componentTemplateList, setComponentTemplateList] = useState<ComponentTemplateMapType>({})

  useEffect(() => {
    componentTemplateStore.fetchMap(props.componentTemplateIds)
      .then(componentTemplateList => setComponentTemplateList(componentTemplateList))
  }, [props.componentTemplateIds])

  return (
    <React.Fragment>
      {props.componentTemplateIds.map((id, index) => {
        if (!(id in componentTemplateList)) {
          return <div key={index}>Loading component template</div>
        }

        const componentTemplate = componentTemplateList[id]
        const formData = props.componentTemplateFormDatas[index]

        if (componentTemplate.componentName == 'CompoundComponent') {
          return <CompoundComponentTemplateForm
                   key={index}
                   postTemplateId={componentTemplate.id}
                   formData={formData}
                   onChange={props.onComponentTemplateDataChange(index)}
          />
        }

        return (
          <ComponentTemplateForm
            key={index}
            schema={componentTemplate.schema}
            formData={formData}
            onChange={props.onComponentTemplateDataChange(index)} />
        )
      })}
    </React.Fragment>
  )
}

export default PostTemplateForm
