import { schema as gmxSchema, IPriceCandle, ISchema } from "gmx-middleware-utils"
import { IMirror, IMirrorPosition, IPuppetPosition, ISetRouteType } from "./types.js"



const puppetPosition: ISchema<IPuppetPosition> = {
  id: 'string',
  key: 'string',
  positionKey: 'string',

  account: 'address',
  market: 'address',
  collateralToken: 'address',

  collateral: 'uint',

  // position: mirror,

  __typename: 'PuppetPosition',
}

const mirror: ISchema<IMirror> = {
  id: 'string',
  key: 'string',
  positionKey: 'string',

  trader: 'address',

  cumulativeTransactionCost: 'uint',
  amountOut: 'uint',
  profit: 'uint',
  totalPerformanceFee: 'uint',
  traderPerformanceCutoffFee: 'uint',

  puppetList: puppetPosition,

  __typename: 'MirrorPosition',
}

const mirrorPosition: ISchema<IMirrorPosition> = {
  ...gmxSchema.position,
  mirror,

  __typename: 'Position',
}

const setRouteType: ISchema<ISetRouteType> = {
  id: 'string',
  collateralToken: 'address',
  indexToken: 'address',
  isLong: 'bool',
  routeTypeKey: 'string',
  // data: 'string',

  __typename: 'SetRouteType',
}

const priceCandle: ISchema<IPriceCandle> = {
  id: 'string',
  timestamp: 'int',
  token: 'address',
  c: 'int',
  __typename: 'PriceCandle',
}


export const schema = {
  priceCandle, puppetPosition, mirrorPosition, setRouteType,
}
