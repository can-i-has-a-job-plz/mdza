import { ComponentTemplate } from './PostTemplateEditor'
import { fetchComponentTemplate } from './api'

export type ComponentTemplateMapType =  Record<number, ComponentTemplate>

class ComponentTemplateStore {
  #componentTemplates: Record<number, ComponentTemplate> = {}
  #inFlight: Record<number, Promise<ComponentTemplate>> = {}

  async fetchSingle(componentTemplateId: number | string): Promise<ComponentTemplate> {
    if (typeof componentTemplateId !== 'number') {
      componentTemplateId = Number(componentTemplateId)
    }

    if (componentTemplateId in this.#componentTemplates) {
      const componentTemplate = this.#componentTemplates[componentTemplateId]

      return new Promise(resolve => resolve(componentTemplate))
    }

    if (componentTemplateId in this.#inFlight) {
      return this.#inFlight[componentTemplateId]
    }

    this.#inFlight[componentTemplateId] = fetchComponentTemplate(componentTemplateId)

    const componentTemplate = await this.#inFlight[componentTemplateId]
    this.#componentTemplates[componentTemplateId] = componentTemplate
    delete this.#inFlight[componentTemplateId]

    return componentTemplate
  }

  fetch(componentTemplateIds: Array<number>) {
    return Promise.all(componentTemplateIds.map(componentTemplateId => this.fetchSingle(componentTemplateId)))
  }

  async fetchMap(componentTemplateIds: Array<number>): Promise<ComponentTemplateMapType> {
    const componentTemplates = await this.fetch(componentTemplateIds)

    const componentTemplateMap: Record<number, ComponentTemplate> = {}

    componentTemplates.forEach(componentTemplate => componentTemplateMap[componentTemplate.id] = componentTemplate)

    return componentTemplateMap
  }
}

const componentTemplateStore = new ComponentTemplateStore

export default componentTemplateStore
