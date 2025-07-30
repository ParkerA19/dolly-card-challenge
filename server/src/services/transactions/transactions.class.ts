// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'
import Lithic from 'lithic'
import { TransactionsCursorPage } from 'lithic/resources/index'

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

  private lithicClient = new Lithic({
    apiKey: process.env.LITHIC_API_KEY,
    environment: 'sandbox'
  })

  async find(_params?: ServiceParams): Promise<Transactions[]> {
    return []
  }

  async genTransactionsFromCardToken(cardToken: string): Promise<{
    data: Lithic.Transactions.Transaction[]
    nextCursor?: string
  }> {
    const query: Lithic.Transactions.TransactionListParams = {
      card_token: cardToken,
      page_size: 100

      // TODO: add more filters here for begin/end/result/status
    }

    // TODO: handle the grouping of transactions by Merchant (id?), MCC, Location (Currency)

    const transactions = await this.lithicClient.transactions.list(query)

    return {
      data: transactions.data,
      nextCursor: transactions.has_more ? transactions.data[transactions.data.length - 1].token : undefined
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
