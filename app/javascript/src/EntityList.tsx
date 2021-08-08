import React, { useEffect, useState } from 'react'
import { makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link as RouterLink } from 'react-router-dom';
import { fetchAPI } from './api'

interface ComponentTemplateListProps {
  path: string
}

const useStyles = makeStyles((theme: Theme)  => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  }
}))

type Entity = [entityId: number, EntityName: number]

const EntityList = (props: ComponentTemplateListProps) => {
  const { path } = props

  const [entityList, setEntityList] = useState<Entity[]>([])
  useEffect(() => { fetchAPI(props.path).then(json => setEntityList(json)) }, [])

  const classes = useStyles(useTheme())

  return (
    <div className={classes.root}>
      <List component="nav">
        {entityList.map(([EntityId, EntityName]) => (
          <ListItem button key={EntityId} component={RouterLink} to={`/${path}/${EntityId}`}>
            <ListItemText primary={EntityName} />
          </ListItem>
        ))}
      </List>
    </div>
  )
}
export default EntityList
