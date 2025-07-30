import rest from '@feathersjs/rest-client'

import { createClient } from 'dolly-card-backend'

export * from 'dolly-card-backend'

const restConnection = rest('http://localhost:3030')

export const client = createClient(restConnection.fetch(window.fetch.bind(window)))
