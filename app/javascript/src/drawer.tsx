import React from 'react'
import {
  AppBar,
  Box,
  CssBaseline,
  Container,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar
}
from '@material-ui/core'
import {
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core/styles';

import {
  Link as RouterLink,
  Route,
  Switch
} from 'react-router-dom'

import EntityList from './EntityList'

import ComponentTemplateEditor from './ComponentTemplateEditor'
import ComponentTemplate from './ComponentTemplate'

import PostTemplateEditor from './PostTemplateEditor'
import PostTemplate, { ExistingPostTemplate } from './PostTemplate'

import Post from './Post'

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3)
    }
  })
)

interface RouteConfig {
  path: string,
  component: React.ComponentType
}

interface LinkConfig extends RouteConfig {
  text: string,
  to: string,
}

const ROUTES: Array<RouteConfig | LinkConfig> = [
  {
    text: 'New Component Template',
    to: '/component_templates/new',
    path: '/component_templates/new',
    component: ComponentTemplateEditor
  },
  {
    path: '/component_templates/:id',
    component: ComponentTemplate
  },
  {
    text: 'Component Templates List',
    to: '/component_templates',
    path: '/component_templates',
    component: (props) => <EntityList path='component_templates' {...props}/>
  },
  {
    text: 'New Post Template',
    to: '/post_templates/new',
    path: '/post_templates/new',
    component: PostTemplateEditor
  },
  {
    path: '/post_templates/:id',
    component: PostTemplate
  },
  {
    text: 'Post Templates List',
    to: '/post_templates',
    path: '/post_templates',
    component:  (props) => <EntityList path='post_templates' {...props}/>
  },
  {
    path: '/posts/:id/edit',
    component: ExistingPostTemplate
  },
  {
    path: '/posts/:id',
    component: Post
  },
  {
    text: 'Posts List',
    to: '/posts',
    path: '/posts',
    component:  (props) => <EntityList path='posts' {...props}/>
  },
  {
    path: '/',
    component: () => <div>Home Page</div>
  }
]

export default function AppDrawer() {
  const classes = useStyles()

   return (
    <Box className={classes.root}>
      <CssBaseline />
      <AppBar>
        <Toolbar />
      </AppBar>
      <Drawer open variant="permanent" className={classes.drawer}>
        <div className={classes.toolbar} />
        <Divider />
      <List>
        {ROUTES.filter((route): route is LinkConfig => ('text' in route)).map(({text, to}) => (
          <ListItem button key={text} component={RouterLink} to={to}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      </Drawer>
      <Container className={classes.content} >
        <div className={classes.toolbar} />
        <Switch>
          {ROUTES.map(({path, component}) => <Route key={path} path={path} component={component} />)}
        </Switch>
      </Container>
    </Box>
  )
}
