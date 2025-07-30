// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'
import Lithic from 'lithic'
import { TransactionsCursorPage } from 'lithic/resources/index'

type Transactions = Lithic.Transactions.Transaction
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

  async genTransactionsFromCardToken(input: {
    cardToken: string
    cursor?: string
    begin?: string // These need to be in UTC format for Lithic
    end?: string
    // Would be better to get this type directly from Lithic but not available in the package.
    status?: 'PENDING' | 'VOIDED' | 'SETTLED' | 'DECLINED' | 'EXPIRED'
    result?: 'APPROVED' | 'DECLINED'
  }): Promise<{
    data: Lithic.Transactions.Transaction[]
    nextCursor?: string
  }> {
    const { cardToken, cursor } = input

    const query: Lithic.Transactions.TransactionListParams = {
      card_token: cardToken,
      page_size: 100,
      starting_after: cursor && cursor !== '' ? cursor : undefined,
      begin: input.begin,
      end: input.end,
      status: input.status,
      result: input.result
    }

    // TODO: handle the grouping of transactions by Merchant (id?), MCC, Location (Currency)
    // We handle grouping on the frontend actually so probably not needed here.
    // Also we can't include mcc, merchant, or currency in the query so directly filtering with the query is not possible.

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
