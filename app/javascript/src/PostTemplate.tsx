import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import PostTemplateForm from './PostTemplateForm'

import PostTemplateRenderer from './PostTemplateRenderer'
import { RouteComponentProps } from 'react-router'

import { fetchAPI } from './api'

interface PostTemplatePreviewProps {
  componentTemplateIds: Array<number>,
  componentTemplateFormDatas: Array<any>,
  onComponentTemplateDataChange: (componentIndex: number) => (formData: any) => void
}

const PostTemplatePreview = (props: PostTemplatePreviewProps) => {
  return (
    <Grid container>
      <Grid item>
        <PostTemplateForm
          componentTemplateIds={props.componentTemplateIds}
          componentTemplateFormDatas={props.componentTemplateFormDatas}
          onComponentTemplateDataChange={props.onComponentTemplateDataChange} />
      </Grid>
      <Grid item>
        <PostTemplateRenderer
          componentTemplateIds={props.componentTemplateIds}
          componentTemplateFormDatas={props.componentTemplateFormDatas}
        />
      </Grid>
    </Grid>
  )
}

export const ExistingPostTemplate = (props: any) => {
  const [post, setPost] = useState<{id: number, componentTemplateIds: Array<number>, componentTemplateFormDatas: Array<any>}>()

  useEffect(() => { fetchAPI(`posts/${props.match.params.id}`).then(json => setPost(json)) }, [props.match.params.id])

  if (!post) {
    return <div>Loading</div>
  }

  const onComponentTemplateDataChange = (componentIndex: number) => (formData: any) => {
    post.componentTemplateFormDatas[componentIndex] = formData
    setPost({...post})
  }

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    fetchAPI(`posts/${post.id}`, {
      method: 'PATCH',
      body: {
        component_template_ids: post.componentTemplateIds,
        component_props: post.componentTemplateFormDatas
      }
    }).then(content => {
      if (content.id) {
        props.history.push(`/posts/${content.id}`)
      } else {
        return content.errors
      }
    })
  }

  return (
    <React.Fragment>
      <Typography variant="h5">
        Edit Post «{post.id}»
      </Typography>
      <PostTemplatePreview
        componentTemplateIds={post.componentTemplateIds}
        componentTemplateFormDatas={post.componentTemplateFormDatas}
        onComponentTemplateDataChange={onComponentTemplateDataChange} />
      <Button variant="contained" color="primary" onClick={onSubmit}>
        Update Post
      </Button>
    </React.Fragment>
  )
}

interface PostTemplateProps extends RouteComponentProps<{id: string}> {
}

interface PostTemplateState {
  componentTemplateIds: Array<number>,
  componentTemplateFormDatas: Array<any>,
  postTemplateId: number,
  postTemplateName: string
}

export default class PostTemplate extends React.Component<PostTemplateProps, PostTemplateState> {
  state: PostTemplateState = {
    postTemplateId: -1,
    postTemplateName: 'Loading',
    componentTemplateIds: [],
    componentTemplateFormDatas: []
  }

  componentDidMount() {
    fetchAPI(`post_templates/${this.props.match.params.id}`)
      .then(json => this.setState({
        postTemplateId: json.id,
        postTemplateName: json.name,
        componentTemplateIds: json.component_template_ids
      }))
  }

  onComponentTemplateDataChange = (componentIndex: number) => (formData: any) => {
    const { componentTemplateFormDatas }  = this.state

    componentTemplateFormDatas[componentIndex] = formData

    this.setState({ componentTemplateFormDatas })
  }

  onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const { componentTemplateIds, componentTemplateFormDatas, postTemplateId } = this.state

    const components = componentTemplateIds.map((_componentTemplateId, index) => (
      {component_template_id: componentTemplateIds[index], props: componentTemplateFormDatas[index]}
    ))

    const content = await fetchAPI('posts', {
      method: 'POST',
      body: {
        post_template_id: postTemplateId,
        component_template_ids: componentTemplateIds,
        component_props: componentTemplateFormDatas,
        components: components
      }
    })
    if (content.id) {
      this.props.history.push(`/posts/${content.id}`)
    } else {
      return content.errors
    }
  }

  render() {
    const { componentTemplateIds, componentTemplateFormDatas, postTemplateId, postTemplateName } = this.state
    if (postTemplateId < 0) {
      return 'Loading'
    }

    return (
      <React.Fragment>
        <Typography variant="h5">
          Preview of Post Template «{postTemplateName}»
        </Typography>
        <PostTemplatePreview
          componentTemplateIds={componentTemplateIds}
          componentTemplateFormDatas={componentTemplateFormDatas}
          onComponentTemplateDataChange={this.onComponentTemplateDataChange} />
        <Button variant="contained" color="primary" onClick={this.onSubmit}>
          Submit Post
        </Button>
      </React.Fragment>
    )
  }
}
