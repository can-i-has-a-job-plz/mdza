import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { RouteComponentProps } from 'react-router'

import ComponentTemplateForm from './ComponentTemplateForm'
import ComponentTemplateRenderer from './ComponentTemplateRenderer'

import { ComponentTemplate as ComponentTemplateType } from './PostTemplateEditor'
import componentTemplateStore from './componentTemplateStore'

interface ComponentTemplateProps extends RouteComponentProps<{id: string}> {
}

interface ComponentTemplateState {
  formData: any,
  componentTemplate: ComponentTemplateType
}

export default class ComponentTemplate extends React.Component<ComponentTemplateProps, ComponentTemplateState> {
  state: ComponentTemplateState = {
    componentTemplate: {
      id: -1,
      name: 'Loading',
      componentName: 'div',
      schema: {},
      componentDefaultProps: {}
    },
    formData: null
  }

  onFormDataChange = (formData: any) => this.setState({ formData })

  componentDidMount() {
    componentTemplateStore.fetchSingle(this.props.match.params.id).then(componentTemplate => this.setState({ componentTemplate }))
  }

  render() {
    const {
      formData,
      componentTemplate
     } = this.state;

    const { schema, name, componentName, componentDefaultProps } = componentTemplate

    return (
      <React.Fragment>
        <Typography variant="h5">
          Preview of Component Template «{name}»
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <ComponentTemplateForm schema={schema} formData={formData} onChange={this.onFormDataChange} />
          </Grid>
          <Grid item xs={6}>
            <ComponentTemplateRenderer name={componentName} defaultProps={componentDefaultProps} formData={formData} />
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}
