import { Stream } from "@most/types"
import { Abi, ExtractAbiEvent } from "abitype"
import { IntervalTime } from "common-utils"
import { TOKEN_DESCRIPTION_MAP } from "gmx-middleware-const"
import * as GMX from "gmx-middleware-const"
import * as viem from "viem"

export type ITokenSymbol = keyof typeof TOKEN_DESCRIPTION_MAP

export interface IIdentifiableEntity {
  id: string
}

export interface ILogIndex<TQuantity = bigint, TIndex = number> {
  blockNumber: TQuantity
  // transactionIndex: TIndex
  logIndex: TIndex
}

export interface ILogOrdered {
  orderId: number
}

export type ILogType<T extends string> = {
  __typename: T
}

export type ILogTypeId<T extends string> = ILogType<T> & {
  id: string
}

export type ILogTxType<T extends string> = ILogTypeId<T> & {
  blockTimestamp: number
  transactionHash: viem.Hex
}


export type ILogArgs<TAbi extends viem.Abi = viem.Abi, TEventName extends string = string> = viem.GetEventArgs<TAbi, TEventName, { Required: true }>
export type ILogEvent<TAbi extends viem.Abi = viem.Abi, TEventName extends string = string> = viem.Log<bigint, number, false, ExtractAbiEvent<TAbi, TEventName>, true, TAbi, TEventName> // ILogIndex & ILogOrdered & viem.GetEventArgs<TAbi, TEventName, { Required: true }>
export type ILogOrderedEvent<TAbi extends viem.Abi = viem.Abi, TEventName extends string = string> = ILogOrdered & Omit<ILogEvent<TAbi, TEventName>, 'data'>
export type ILog<TAbi extends viem.Abi = viem.Abi, TEventName extends string = string> = ILogTxType<TEventName> & ILogArgs<TAbi, TEventName>


export interface IEnsRegistration {
  id: string
  labelName: string
  expiryDate: number
  domain: {
    resolvedAddress: {
      id: string
    }
    resolver: {
      texts: string[]
    }
  }
}


export interface IPriceCandle extends ILogTypeId<'PriceCandle'> {
  token: viem.Address
  interval: IntervalTime
  slotTime: number
  o: bigint // open
  h: bigint // high
  l: bigint // low
  c: bigint // close
}

export interface IPricetick {
  price: bigint
  timestamp: number
}

export type IPriceTickListMap = Record<viem.Address, IPricetick[]>
export type IPricefeedMap = Record<viem.Address, IPriceCandle[]>
export type IPriceOracleMap = Record<viem.Address, IOraclePrice>


export type ILatestPriceMap = Record<viem.Address, IPricetick>



export interface IChainParamApi {
  chain: number
}


export interface IRequestTimerangeApi {
  from: number
  to: number
}


export type IRequestAccountApi = IChainParamApi & { account: viem.Address }

export type IRequestPriceTimelineApi = IChainParamApi & IRequestTimerangeApi & { tokenAddress: viem.Address }
export type IRequestAccountHistoricalDataApi = IChainParamApi & IRequestAccountApi & IRequestTimerangeApi
export type IRequestPricefeedApi = IChainParamApi & IRequestTimerangeApi & { interval: IntervalTime, tokenAddress: viem.Address }


export interface IRequestGraphEntityApi extends IChainParamApi, IIdentifiableEntity { }





export type StreamInputArray<T extends readonly unknown[]> = {
  [P in keyof T]: Stream<T[P]>
}

export type StreamInput<T> = {
  [P in keyof T]: Stream<T[P]> | T[P]
}

export type ContractParams<
  TAbi extends Abi,
  TAddress extends viem.Address = viem.Address,
> = {
  abi: TAbi
  address: TAddress
}

export type ContractClientParams<
  TAbi extends Abi,
  TAddress extends viem.Address = viem.Address,
  TTransport extends viem.Transport = viem.Transport,
  TChain extends viem.Chain = viem.Chain,
> = ContractParams<TAbi, TAddress> & { client: viem.PublicClient<TTransport, TChain> }


export const OrderType = {
  // the order will be cancelled if the minOutputAmount cannot be fulfilled
  MarketSwap: 0n,
  // @dev LimitSwap: swap token A to token B if the minOutputAmount can be fulfilled
  LimitSwap: 1n,
  // @dev MarketIncrease: increase position at the current market price
  // the order will be cancelled if the position cannot be increased at the acceptablePrice
  MarketIncrease: 2n,
  // @dev LimitIncrease: increase position if the triggerPrice is reached and the acceptablePrice can be fulfilled
  LimitIncrease: 3n,
  // @dev MarketDecrease: decrease position at the curent market price
  // the order will be cancelled if the position cannot be decreased at the acceptablePrice
  MarketDecrease: 4n,
  // @dev LimitDecrease: decrease position if the triggerPrice is reached and the acceptablePrice can be fulfilled
  LimitDecrease: 5n,
  // @dev StopLossDecrease: decrease position if the triggerPrice is reached and the acceptablePrice can be fulfilled
  StopLossDecrease: 6n,
  // @dev Liquidation: allows liquidation of positions if the criteria for liquidation are met
  Liquidation: 7n,
}

export enum DecreasePositionSwapType {
  NoSwap = 0,
  SwapPnlTokenToCollateralToken = 1,
  SwapCollateralTokenToPnlToken = 2,
}

export type IEventEmitterAbi = typeof GMX.CONTRACT['42161']['EventEmitter']['abi']

export type IEventLog1Args = ILogOrderedEvent<IEventEmitterAbi, 'EventLog1'>


export interface PositionReferralFees {
  referralCode: viem.Hex
  affiliate: viem.Address
  trader: viem.Address

  totalRebateFactor: bigint
  traderDiscountFactor: bigint
  totalRebateAmount: bigint
  traderDiscountAmount: bigint
  affiliateRewardAmount: bigint

}


export interface IPositionFeesCollected extends ILogTxType<'PositionFeesCollected'> {
  affiliate: viem.Address
  positionKey: viem.Address

  totalRebateFactor: bigint
  traderDiscountFactor: bigint
  totalRebateAmount: bigint
  traderDiscountAmount: bigint
  affiliateRewardAmount: bigint
  fundingFeeAmount: bigint
  claimableLongTokenAmount: bigint
  claimableShortTokenAmount: bigint
  latestFundingFeeAmountPerSize: bigint
  latestLongTokenClaimableFundingAmountPerSize: bigint
  latestShortTokenClaimableFundingAmountPerSize: bigint
  borrowingFeeUsd: bigint
  borrowingFeeAmount: bigint
  borrowingFeeReceiverFactor: bigint
  borrowingFeeAmountForFeeReceiver: bigint
  positionFeeFactor: bigint
  protocolFeeAmount: bigint
  positionFeeReceiverFactor: bigint
  feeReceiverAmount: bigint
  feeAmountForPool: bigint
  positionFeeAmountForPool: bigint
  positionFeeAmount: bigint
  totalCostAmount: bigint
  uiFeeReceiverFactor: bigint
  uiFeeAmount: bigint
}


export interface IPositionFundingFees {
  fundingFeeAmount: bigint
  claimableLongTokenAmount: bigint
  claimableShortTokenAmount: bigint
  latestFundingFeeAmountPerSize: bigint
  latestLongTokenClaimableFundingAmountPerSize: bigint
  latestShortTokenClaimableFundingAmountPerSize: bigint
}


export interface PositionBorrowingFees {
  borrowingFeeUsd: bigint
  borrowingFeeAmount: bigint
  borrowingFeeReceiverFactor: bigint
  borrowingFeeAmountForFeeReceiver: bigint
}

export interface IPositionUiFees {
  uiFeeReceiver: viem.Address
  uiFeeReceiverFactor: bigint
  uiFeeAmount: bigint
}

export interface IPriceMinMax {
  min: bigint
  max: bigint
}



export interface IPositionFees {
  referral: PositionReferralFees
  funding: IPositionFundingFees
  borrowing: PositionBorrowingFees
  ui: IPositionUiFees
  collateralTokenPrice: IPriceMinMax

  positionFeeFactor: bigint
  protocolFeeAmount: bigint
  positionFeeReceiverFactor: bigint
  feeReceiverAmount: bigint
  feeAmountForPool: bigint
  positionFeeAmountForPool: bigint
  positionFeeAmount: bigint
  totalCostAmountExcludingFunding: bigint
  totalCostAmount: bigint
}


export interface IExecutionPriceResult {
  priceImpactUsd: bigint
  priceImpactDiffUsd: bigint
  executionPrice: bigint
}

export type IPositionAddresses = {
  account: viem.Address
  collateralToken: viem.Address
  market: viem.Address
}

export type IPositionNumbers = {
  sizeInUsd: bigint
  sizeInTokens: bigint
  collateralAmount: bigint
  borrowingFactor: bigint
  fundingFeeAmountPerSize: bigint
  longTokenClaimableFundingAmountPerSize: bigint
  shortTokenClaimableFundingAmountPerSize: bigint
}


export interface IPositionInfo {
  position: {
    addresses: IPositionAddresses,
    numbers: IPositionNumbers
    flags: {
      isLong: boolean
    }
  }
  fees: IPositionFees
  executionPriceResult: IExecutionPriceResult
  basePnlUsd: bigint
  uncappedBasePnlUsd: bigint
  pnlAfterPriceImpactUsd: bigint
}

export interface IOrderCreated extends ILogTypeId<'OrderCreated'> {
  key: viem.Hex

  account: viem.Address
  receiver: viem.Address
  callbackContract: viem.Address
  uiFeeReceiver: viem.Address
  market: viem.Address
  initialCollateralToken: viem.Address

  swapPath: viem.Address[]

  orderType: bigint
  decreasePositionSwapType: bigint
  sizeDeltaUsd: bigint
  initialCollateralDeltaAmount: bigint
  triggerPrice: bigint
  acceptablePrice: bigint
  executionFee: bigint
  callbackGasLimit: bigint
  minOutputAmount: bigint
  updatedAtBlock: bigint

  isLong: boolean
  shouldUnwrapNativeToken: boolean
  isFrozen: boolean
}


export interface IOrderStatus extends ILogTxType<'OrderStatus'> {
  order: IOrderCreated
  orderType: bigint
  statusType: bigint
  message: string
}

export interface IPositionLink extends ILogTypeId<'PositionLink'> {
  id: string
  key: viem.Hex

  increaseList: IPositionIncrease[]
  decreaseList: IPositionDecrease[]
  // feeUpdateList: IPositionFeesCollected[]
}



export type IPositionIncrease = ILogTxType<'PositionIncrease'> & IPositionAddresses & IPositionNumbers & {
  order: IOrderStatus
  positionKey: viem.Hex

  account: viem.Address
  market: viem.Address
  collateralToken: viem.Address

  executionPrice: bigint
  indexTokenPriceMax: bigint
  indexTokenPriceMin: bigint
  collateralTokenPriceMax: bigint
  collateralTokenPriceMin: bigint
  sizeDeltaUsd: bigint
  sizeDeltaInTokens: bigint
  orderType: bigint

  collateralDeltaAmount: bigint
  priceImpactUsd: bigint
  priceImpactAmount: bigint

  isLong: boolean

  feeCollected: IPositionFeesCollected
}


export type IPositionDecrease = ILogTxType<'PositionDecrease'> & IPositionAddresses & IPositionNumbers & {
  order: IOrderStatus
  positionKey: viem.Hex

  executionPrice: bigint
  indexTokenPriceMax: bigint
  indexTokenPriceMin: bigint
  collateralTokenPriceMax: bigint
  collateralTokenPriceMin: bigint
  sizeDeltaUsd: bigint
  sizeDeltaInTokens: bigint
  collateralDeltaAmount: bigint
  valuesPriceImpactDiffUsd: bigint
  orderType: bigint
  
  priceImpactUsd: bigint
  basePnlUsd: bigint
  uncappedBasePnlUsd: bigint

  isLong: boolean

  feeCollected: IPositionFeesCollected
}

export type IOraclePrice = IPriceMinMax & {
  priceSourceType: bigint
  timestamp: number
  token: viem.Address
}


export type IInsolventClose = {
  orderKey: viem.Hex
  positionCollateralAmount: bigint
  remainingCostUsd: bigint
  basePnlUsd: bigint
}



export interface IMarketPrice {
  indexTokenPrice: IPriceMinMax,
  longTokenPrice: IPriceMinMax,
  shortTokenPrice: IPriceMinMax
}

export type IMarket = {
  indexToken: viem.Address
  longToken: viem.Address
  shortToken: viem.Address
  marketToken: viem.Address
}

export interface IMarketPool {
  poolValue: bigint
  longPnl: bigint
  shortPnl: bigint
  netPnl: bigint

  longTokenAmount: bigint
  shortTokenAmount: bigint
  longTokenUsd: bigint
  shortTokenUsd: bigint

  borrowingFeePoolFactor: bigint
  totalBorrowingFees: bigint

  impactPoolAmount: bigint
}

export interface IMarketFees {
  borrowingFactorPerSecondForLongs: bigint
  borrowingFactorPerSecondForShorts: bigint
  baseFunding: IBaseFundingValues
  nextFunding: IGetNextFundingAmountPerSizeResult
  virtualInventory: IVirtualInventory
  isDisabled: boolean
}

export interface IMarketUsageInfo {
  longInterestInTokens: bigint
  shortInterestInTokens: bigint

  longInterestUsd: bigint
  shortInterestUsd: bigint

  longInterestInTokensUsingLongToken: bigint
  longInterestInTokensUsingShortToken: bigint
  shortInterestInTokensUsingLongToken: bigint
  shortInterestInTokensUsingShortToken: bigint

  positionImpactPoolAmount: bigint
}

export interface IMarketConfig {
  reserveFactorLong: bigint
  reserveFactorShort: bigint

  maxPnlFactorForTradersLong: bigint
  maxPnlFactorForTradersShort: bigint

  openInterestReserveFactorLong: bigint
  openInterestReserveFactorShort: bigint

  positionFeeFactorForPositiveImpact: bigint
  positionFeeFactorForNegativeImpact: bigint
  minCollateralFactor: bigint

  positionImpactFactorPositive: bigint
  positionImpactFactorNegative: bigint
  positionImpactExponentFactor: bigint

  maxPositionImpactFactorForLiquidations: bigint
  maxPositionImpactFactorPositive: bigint
}

export interface IMarketInfo {
  market: IMarket
  price: IMarketPrice
  fees: IMarketFees
  pool: IMarketPool
  config: IMarketConfig
  usage: IMarketUsageInfo
}


export type IMarketCreatedEvent = ILogTxType<'MarketCreated'> & IMarket & {
  salt: viem.Hex
}


export type IOraclePriceUpdateEvent = ILogTxType<'OraclePriceUpdate'> & {
  token: viem.Address
  maxPrice: bigint
  minPrice: bigint
  priceSourceType: bigint
  timestamp: bigint
}


interface ICollateralType {
  longToken: bigint
  shortToken: bigint
}

export type IPositionType = {
  long: ICollateralType
  short: ICollateralType
}


export interface IBaseFundingValues {
  fundingFeeAmountPerSize: IPositionType
  claimableFundingAmountPerSize: IPositionType
}

export interface IGetNextFundingAmountPerSizeResult {
  longsPayShorts: boolean
  fundingFactorPerSecond: bigint

  fundingFeeAmountPerSizeDelta: IPositionType
  claimableFundingAmountPerSizeDelta: IPositionType
}

export interface IVirtualInventory {
  virtualPoolAmountForLongToken: bigint
  virtualPoolAmountForShortToken: bigint
  virtualInventoryForPositions: bigint
}

