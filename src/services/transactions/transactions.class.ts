// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'

type Transactions = any
type TransactionsData = any
type TransactionsPatch = any
type TransactionsQuery = any

export type { Transactions, TransactionsData, TransactionsPatch, TransactionsQuery }

export interface TransactionsServiceOptions {
  app: Application
}

export interface TransactionsParams extends Params<TransactionsQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class TransactionsService<ServiceParams extends TransactionsParams = TransactionsParams>
  implements ServiceInterface<Transactions, TransactionsData, ServiceParams, TransactionsPatch>
{
  constructor(public options: TransactionsServiceOptions) {}

  async find(_params?: ServiceParams): Promise<Transactions[]> {
    return []
  }

  async get(id: Id, _params?: ServiceParams): Promise<Transactions> {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
  }

  async create(data: TransactionsData, params?: ServiceParams): Promise<Transactions>
  async create(data: TransactionsData[], params?: ServiceParams): Promise<Transactions[]>
  async create(
    data: TransactionsData | TransactionsData[],
    params?: ServiceParams
  ): Promise<Transactions | Transactions[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)))
    }

    return {
      id: 0,
      ...data
    }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id: NullableId, data: TransactionsData, _params?: ServiceParams): Promise<Transactions> {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id: NullableId, data: TransactionsPatch, _params?: ServiceParams): Promise<Transactions> {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<Transactions> {
    return {
      id: 0,
      text: 'removed'
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
