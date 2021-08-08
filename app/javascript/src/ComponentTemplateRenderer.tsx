import React from 'react'
import Typography from '@material-ui/core/Typography';

import { ExistingPostEditorRenderer } from './PostTemplateRenderer'

interface ComponentTemplateRendererProps {
  id?: number,
  name: string,
  defaultProps: Record<string, any>,
  formData: any
}

const ComponentTemplateRenderer = (props: ComponentTemplateRendererProps) => {
  const { name, defaultProps, formData } = props

  switch(name) {
    case 'CompoundComponent':
      if ('id' in props) {
        return <ExistingPostEditorRenderer postTemplateId={props.id as number} componentTemplateFormDatas={formData} />
      } else {
        return <div>Compound!</div>
      }
    case 'Typography':
      return <Typography {...defaultProps} {...formData} />
    default:
      return <div>{`Component ${name} not found`}</div>
  }
}

export default ComponentTemplateRenderer
