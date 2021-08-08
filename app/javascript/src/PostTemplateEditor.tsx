import React from 'react'
import { Theme, withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'

import PostTemplateForm from './PostTemplateForm'
import PostTemplateRenderer from './PostTemplateRenderer'

import { JSONSchema7 } from 'json-schema'

import { fetchAPI } from './api'

const styles = (theme: Theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  }
})

interface PostTemplateEditorProps {
  classes: any,
  history: {
    push: any
  }
}

interface ComponentTemplateShort {
  id: number,
  name: string
}

export interface ComponentTemplate extends ComponentTemplateShort {
  schema: JSONSchema7,
  componentName: string,
  componentDefaultProps: Record<string, any>
}

interface PostTemplateEditorState {
  componentTemplateList: { [key: number]: ComponentTemplateShort | ComponentTemplate  },
  componentTemplateIds: Array<number>,
  componentTemplateFormDatas: Array<any>,
  name: string
}

class PostTemplateEditor extends React.Component<PostTemplateEditorProps, PostTemplateEditorState> {
  state: PostTemplateEditorState = {
    componentTemplateList: {},
    componentTemplateIds: [],
    componentTemplateFormDatas: [],
    name: ''
  }

  componentDidMount() {
    fetchAPI('component_templates'
    ).then((json: Array<[number, string]>) => {
      const componentTemplateList: { [key: number]: ComponentTemplateShort } = {}
      json.forEach(([id, name]) => componentTemplateList[id] = {id: id, name: name})
      this.setState({ componentTemplateList })
    })
  }

  onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ name: e.target.value });

  onComponentTemplateAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { componentTemplateIds } = this.state

    const componentTemplateId = Number(e.target.value)
    this.setState({ componentTemplateIds: [...componentTemplateIds, componentTemplateId] })
  }

  onPostTemplateSubmit = async (e: any) => {
    e.preventDefault()

    const content = await fetchAPI('post_templates', {
      method: 'POST',
      body: {
        name: this.state.name,
        component_template_ids: this.state.componentTemplateIds
      }
    })
    if (content.id) {
      this.props.history.push(`/post_templates/${content.id}`)
    } else {
      return content.errors
    }
  }

  onComponentTemplateDataChange = (componentIndex: number) => (formData: any) => {
    const { componentTemplateFormDatas } = this.state
    componentTemplateFormDatas[componentIndex] = formData

    this.setState({ componentTemplateFormDatas })
  }

  render() {
    return (
      <Grid container>
        <Grid item>
          <Grid container>
            <TextField
              required
              id="standard-basic"
              label="Post Template name"
              value={this.state.name}
              onChange={this.onNameChange}
            />
          </Grid>
          <Grid container>
            <Button variant="contained" color="primary" onClick={this.onPostTemplateSubmit}>
              Submit
            </Button>
          </Grid>
          <Grid container>
            <FormControl className={this.props.classes.formControl}>
              <InputLabel id="component-template-label">Component Template</InputLabel>
              <Select
                value=''
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                onChange={this.onComponentTemplateAdd}>
                {Object.entries(this.state.componentTemplateList).map(([id, { name }]) => (
                  <MenuItem key={id} value={id}>{name}</MenuItem>
                ))}
              </Select>
              <FormHelperText>Select to add</FormHelperText>
            </FormControl>
          </Grid>
          <List component="nav" aria-label="main mailbox folders">
            {this.state.componentTemplateIds.map((id, index) => {
              const componentTemplate = this.state.componentTemplateList[id]
              return (
                <ListItem key={index}>
                  <ListItemText primary={componentTemplate['name']} />
                </ListItem>
              )
            })}
          </List>
        </Grid>
        <Grid item>
          <PostTemplateForm
            componentTemplateIds={this.state.componentTemplateIds}
            componentTemplateFormDatas={this.state.componentTemplateFormDatas}
            onComponentTemplateDataChange={this.onComponentTemplateDataChange} />
        </Grid>
        <Grid item>
          <PostTemplateRenderer
            componentTemplateIds={this.state.componentTemplateIds}
            componentTemplateFormDatas={this.state.componentTemplateFormDatas} />
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PostTemplateEditor)
