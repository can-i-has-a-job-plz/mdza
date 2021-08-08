import { ComponentTemplate } from './PostTemplateEditor'

interface RequestInitAPI extends Omit<RequestInit, 'body'> {
  body?: {}
}

const fetchAPI = async (input: RequestInfo, init?: RequestInitAPI | undefined) => {
  if (init && 'body' in init) {
    init.body = JSON.stringify({ payload: init.body })
  }

  const response = await fetch(`/api/v1/${input}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    ...(init as RequestInit)
  })

  if (!response.ok) {
    return { errors: `fetch failed, ${response.statusText}` }
  }

  return await response.json()
}

const fetchComponentTemplate = async (componentTemplateId: number) => {
  const json = await fetchAPI(`component_templates/${componentTemplateId}`)

  return ({
    id: json.id,
    name: json.name,
    componentName: json.component_name,
    componentDefaultProps: json.default_props,
    schema: json.schema
  }) as ComponentTemplate
}

 export { fetchAPI, fetchComponentTemplate }
