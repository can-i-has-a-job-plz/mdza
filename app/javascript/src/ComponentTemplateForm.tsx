import React, { useEffect, useState } from 'react'
import { JSONSchema7 } from 'json-schema'

import Form from '@rjsf/material-ui'
import PostTemplateForm from './PostTemplateForm'

import { fetchAPI } from './api'

interface UncontrolledComponentTemplateFormProps {
  schema: JSONSchema7 | string
}

interface ControlledComponentTemplateFormProps extends UncontrolledComponentTemplateFormProps {
  onChange: (formdata: any) => void,
  formData: any
}

type ComponentTemplateFormProps = UncontrolledComponentTemplateFormProps | ControlledComponentTemplateFormProps

const renderForm = (schema: JSONSchema7, formData: any, onChange: (formData: any) => void) => (
  <Form
    schema={schema}
    formData={formData}
    onChange={({ formData }: ({formData: any})) => onChange(formData)}
    children={true}
    noHtml5Validate={true}
    liveOmit={true}
    liveValidate={true}
    showErrorList={false}
  />
)

interface CompoundComponentTemplateFormProps {
  postTemplateId: number,
  onChange: (formData: any) => void,
  formData?: any
}

export const CompoundComponentTemplateForm = (props: CompoundComponentTemplateFormProps) => {
  const [componentTemplateIds, setComponentTemplateIds] =  useState<Array<number>>([])
  const [componentTemplateFormDatas, setComponentTemplateFormDatas] = useState<Array<any>>([])

  useEffect(() => {
    if ('formData' in props && props.formData) {
      setComponentTemplateFormDatas(props.formData)
    } else {
      setComponentTemplateFormDatas([])
    }
  }, [(('formData' in props) && props.formData), props.postTemplateId])

  useEffect(() => {
    fetchAPI(`post_templates/${props.postTemplateId}`)
      .then(json => {
        setComponentTemplateIds(json.component_template_ids)
      })
  }, [props.postTemplateId])

  const onComponentTemplateDataChange = (componentIndex: number) => (formData: any) => {
    componentTemplateFormDatas[componentIndex] = formData
    setComponentTemplateFormDatas(componentTemplateFormDatas)
    props.onChange(componentTemplateFormDatas)
  }

  return (
    <PostTemplateForm
      componentTemplateIds={componentTemplateIds}
      componentTemplateFormDatas={componentTemplateFormDatas}
      onComponentTemplateDataChange={onComponentTemplateDataChange}
    />
  )
}

const ComponentTemplateForm = (props: ComponentTemplateFormProps) => {
  let { schema } = props

  try {
    schema = typeof schema !== 'object' ? JSON.parse(schema) as JSONSchema7 : schema
  } catch(error) {
    return <div>`Invalid json schema, cannot render: ${error.name} ${error.message}`</div>
  }

  if ('onChange' in props) {
    return renderForm(schema, props.formData, props.onChange)
  }

  const [formData, setFormData] = useState()

  return renderForm(schema, formData, (formData: any) => setFormData(formData))
}

export default ComponentTemplateForm
