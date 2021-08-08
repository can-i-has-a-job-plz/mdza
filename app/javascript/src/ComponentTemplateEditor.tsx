import React, { Suspense } from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import { RouteComponentProps } from 'react-router'

import ComponentTemplateForm from './ComponentTemplateForm'
import ComponentTemplateRenderer from './ComponentTemplateRenderer'

const MonacoEditor = React.lazy(() => import('react-monaco-editor'))

import { fetchAPI } from './api'

interface ComponentTemplateEditorProps extends RouteComponentProps {
}

interface ComponentTemplateEditorState {
  schemaString: string,
  formData: any,
  name: string,
  componentName: string,
  componentProps: string
}

const DEFAULT_SCHEMA = JSON.stringify({
  "type": "object",
  "required": [
    "children"
  ],
  "properties": {
    "children": {
      "type": "string",
      "title": "Heading text"
    }
  }
}, null, 2)

export default class ComponentTemplateEditor extends React.Component<ComponentTemplateEditorProps, ComponentTemplateEditorState> {
  state: ComponentTemplateEditorState = {
    schemaString: DEFAULT_SCHEMA,
    componentName: 'Typography',
    componentProps: '{"color": "primary", "variant": "h1"}',
    name: 'Primary h1 Heading',
    formData: {}
  }

  onSchemaEdited = (schemaString: string) => this.setState({ schemaString })
  onComponentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ componentName: e.target.value })
  onComponentPropsChange = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ componentProps: e.target.value })

  onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ name: e.target.value })

  onFormDataChange = (formData: any) => this.setState({ formData })

  onComponentTemplateSubmit = async (e: any) => {
    e.preventDefault()

    const content = await fetchAPI('component_templates', {
      method: 'POST',
      body: {
        name: this.state.name,
        component_name: this.state.componentName,
        default_props: JSON.parse(this.state.componentProps),
        schema: JSON.parse(this.state.schemaString)
      }
    })

    if (content.id) {
      this.props.history.push(`/component_templates/${content.id}`)
    } else {
      return content.errors
    }
  }

  render() {
    const { schemaString } = this.state

    let defaultProps
    try {
      defaultProps = JSON.parse(this.state.componentProps)
    } catch(e) {
      // nothing
    }

    return (
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <form noValidate autoComplete="off">
            <TextField required label="Component Template name" value={this.state.name} onChange={this.onNameChange} />
            <TextField required label="Component name" value={this.state.componentName} onChange={this.onComponentNameChange} />
            <TextField required label="Default component props" value={this.state.componentProps} onChange={this.onComponentPropsChange} />
            <Suspense fallback={<div>Loading...</div>}>
              <MonacoEditor language='json' value={schemaString} onChange={this.onSchemaEdited} height='800px' />
            </Suspense>
            <Button onClick={this.onComponentTemplateSubmit} href="/api/component_templates">Submit</Button>
          </form>
        </Grid>
        <Grid item xs={4}>
          <ComponentTemplateForm schema={schemaString} formData={this.state.formData} onChange={this.onFormDataChange} />
        </Grid>
        <Grid item xs={4}>
          <ComponentTemplateRenderer name={this.state.componentName} defaultProps={defaultProps} formData={this.state.formData} />
        </Grid>
      </Grid>
    )
  }
}
