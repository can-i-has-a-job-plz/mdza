import React, { useEffect, useState } from 'react';
import PostTemplateRenderer from './PostTemplateRenderer'
import { RouteComponentProps } from 'react-router'
import { fetchAPI } from './api'

import consumer from "./consumer"
import { Subscription } from '@rails/actioncable'

import { Button, Typography } from '@material-ui/core'

import { Link as RouterLink } from 'react-router-dom';

interface PostProps extends RouteComponentProps<{id: string}>  {
  children?: any
}

const Post = (props: PostProps) => {
  const [hasUpdates, setHasUpdates] = useState<boolean>(false)
  const [componentTemplateIds, setComponentTemplateIds] = useState<Array<number>>([])
  const [componentTemplateFormDatas, setComponentTempalateFormDatas] = useState<Array<Record<number, any>>>([])
  const [actionCableSubscription, setActionCableSubscription] = useState<Subscription>()

  const updatePost = () => {
    fetchAPI(`posts/${props.match.params.id}`).then(json => {
      setComponentTemplateIds(json.componentTemplateIds)
      setComponentTempalateFormDatas(json.componentTemplateFormDatas)
      setHasUpdates(false)
    })
  }

  const triggerUpdate = () => {
    fetchAPI(`posts/${props.match.params.id}/broadcast`)
  }

  useEffect(() => {
    fetchAPI(`posts/${props.match.params.id}`).then(json => {
      setComponentTemplateIds(json.componentTemplateIds)
      setComponentTempalateFormDatas(json.componentTemplateFormDatas)
      consumer.subscriptions.create(
        { channel: 'PostsChannel', id: props.match.params.id }, {
          received(data) {
            if (data.updated) {
              setHasUpdates(true)
            }
          }
        }
      )

      return () => {
        actionCableSubscription?.unsubscribe()
        setActionCableSubscription(undefined)
      }
    })
  }, [props.match.params.id])

  return (
    <React.Fragment>
      <Button color='primary' component={RouterLink} to={`/posts/${props.match.params.id}/edit`}>Edit post</Button>
      <Button color='primary' onClick={triggerUpdate}>Trigger post update</Button>
      {hasUpdates && <Typography color='primary'>Post was updated</Typography>}
      {hasUpdates && <Button color='primary' onClick={updatePost}>Update</Button>}
      <PostTemplateRenderer
        componentTemplateIds={componentTemplateIds}
        componentTemplateFormDatas={componentTemplateFormDatas}
      />
    </React.Fragment>
  )
}

export default Post
