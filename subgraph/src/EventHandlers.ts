import { GMX_EventEmitter, PriceCandle, handlerContext } from "generated"
import { OrderStatus, PRICEFEED_INTERVAL_LIST } from "./const"
import { getAddressItem, getUintItem, getBytes32Item, EventLog, getAddressItemList, getBoolItem } from "./utils"



// Handler for the NewGreeting event
GMX_EventEmitter.EventLog1.handler(async ({ event, context }) => {
  if (event.params.eventName == "OraclePriceUpdate") {
    await onOraclePriceUpdate(event, context)
  } else if (event.params.eventName == "PositionIncrease") {
    await onPositionIncrease(event, context)
  } else if (event.params.eventName == "PositionDecrease") {
    await onPositionDecrease(event, context)
  }
  // else if (event.params.eventName == "PositionFeesCollected") {
  //   onPositionFeesInfo(event)
  // } else if (event.params.eventName == "PositionFeesInfo") {
  //   onPositionFeesInfo(event)
  // } else if (event.params.eventName == "OrderCollateralDeltaAmountAutoUpdated") {
  //   onOrderCollateralDeltaAmountAutoUpdated(event)
  // } else if (event.params.eventName == "OrderSizeDeltaAutoUpdated") {
  //   onOrderSizeDeltaAutoUpdated(event)
  // } else if (event.params.eventName == "MarketCreated") {
  //   const marketCreated = dto.createMarketCreated(event)
  //   marketCreated.save()
  // }
})

const orderStatusMap = {
  OrderCreated: OrderStatus.CREATED,
  OrderCancelled: OrderStatus.CANCELLED,
  OrderFrozen: OrderStatus.FROZEN
}

GMX_EventEmitter.EventLog2.handler(async ({ event, context }) => {
  if (event.params.eventName == "OrderCreated") {
    context.PositionRequest.set({
      account: getAddressItem(event, 0),
      receiver: getAddressItem(event, 1),
      callbackContract: getAddressItem(event, 2),
      uiFeeReceiver: getAddressItem(event, 3),
      market: getAddressItem(event, 4),
      initialCollateralToken: getAddressItem(event, 5),

      swapPath: getAddressItemList(event, 0),

      orderType: Number(getUintItem(event, 0)),
      decreasePositionSwapType: getUintItem(event, 1),
      sizeDeltaUsd: getUintItem(event, 2),
      initialCollateralDeltaAmount: getUintItem(event, 3),
      triggerPrice: getUintItem(event, 4),
      acceptablePrice: getUintItem(event, 5),
      executionFee: getUintItem(event, 6),
      callbackGasLimit: getUintItem(event, 7),
      minOutputAmount: getUintItem(event, 8),
      updatedAtBlock: getUintItem(event, 9),

      isLong: getBoolItem(event, 0),
      shouldUnwrapNativeToken: getBoolItem(event, 1),
      isFrozen: getBoolItem(event, 2),
      key: getBytes32Item(event, 0),
      id: getBytes32Item(event, 0)
    })
  }
  // else if (event.params.eventName == "OrderCancelled") {
  //   onOrderCancelled(event)
  // } else if (event.params.eventName == "OrderFrozen") {
  //   onOrderFrozen(event)
  // }

  const orderStatus: number | undefined = orderStatusMap[event.params.eventName as keyof typeof orderStatusMap]
  if (orderStatus) {
    

  }
})



async function onOraclePriceUpdate(event: EventLog, context: handlerContext) {
  const token = getAddressItem(event, 0)
  const price = getUintItem(event, 1)
  const timestamp = getUintItem(event, 2)


  for (let index = 0; index < PRICEFEED_INTERVAL_LIST.length; index++) {
    const interval = PRICEFEED_INTERVAL_LIST[index]
    const slot = timestamp / interval
    const timeSlot = slot * interval
    const latestId = `${token}:${interval}`

    const stored = await context.PriceCandleSeed.get(latestId)

    const latest = stored ? { ...stored } : {
      token: token,
      interval: Number(interval),
      timestamp: Number(timeSlot),
      o: price,
      h: price,
      l: price,
      c: price,
      id: latestId
    }


    if (timeSlot > latest.timestamp) {
      // store previous candle and initialize next candle
      const candleId = `${latest.token}:${interval}:${latest.timestamp}`
      const candle: PriceCandle = {
        id: candleId,
        token: latest.token,
        interval: latest.interval,
        timestamp: timeSlot,
        o: price,
        h: price,
        l: price,
        c: price
      }

      context.PriceCandle.set(candle)

    } else {
      if (price > latest.h) {
        latest.h = price
      } else if (price < latest.l) {
        latest.l = price
      }
    }

    latest.c = price

    context.PriceCandleSeed.set(latest)
  }
}

async function onPositionIncrease(event: EventLog, context: handlerContext) {
  const orderId = getBytes32Item(event, 0)
  const request = context.PositionRequest.get(orderId)

  if (!request) {
    context.log.error("PositionRequest not found")
    return
  }

  const account = getAddressItem(event, 0)
  const market = getAddressItem(event, 1)
  const collateralToken = getAddressItem(event, 2)

  const orderKey = getBytes32Item(event, 0)
  const positionKey = getBytes32Item(event, 1)

  const openSlot = await context.PositionOpen.get(positionKey)

  const sizeInUsd = getUintItem(event, 0)
  const sizeInTokens = getUintItem(event, 1)
  const collateralAmount = getUintItem(event, 2)
  const isLong = getBoolItem(event, 0)

  const collateralTokenPriceMax = getUintItem(event, 10)

  let positionLinkId
  if (!openSlot) {
    context.PositionLink.set({
      key: positionKey,
      id: orderKey,
    })


    positionLinkId = orderKey

    context.PositionOpen.set({
      id: positionKey,
      link_id: orderKey,
      key: positionKey,

      account: account,
      market: market,
      collateralToken: collateralToken,
      // indexToken: getAddressItem(event, 3),

      sizeInUsd: sizeInUsd,
      sizeInTokens: sizeInTokens,
      collateralAmount: collateralAmount,

      cumulativeSizeUsd: 0n,
      cumulativeSizeToken: 0n,
      cumulativeCollateralUsd: 0n,
      cumulativeCollateralToken: 0n,

      maxSizeUsd: 0n,
      maxSizeToken: 0n,
      maxCollateralToken: 0n,
      maxCollateralUsd: 0n,

      isLong: isLong,

      realisedPnlUsd: 0n,

      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      logIndex: event.transaction.transactionIndex
    })
  } else {
    positionLinkId = openSlot.link_id

    const collateralUsd = openSlot.collateralAmount * collateralTokenPriceMax

    context.PositionOpen.set({
      ...openSlot,
      sizeInUsd: openSlot.sizeInUsd + sizeInUsd,
      sizeInTokens: openSlot.sizeInTokens + sizeInTokens,
      collateralAmount: openSlot.collateralAmount + collateralAmount,

      cumulativeSizeUsd: openSlot.cumulativeSizeUsd + sizeInUsd,
      cumulativeSizeToken: openSlot.cumulativeSizeToken + sizeInTokens,
      cumulativeCollateralUsd: openSlot.cumulativeCollateralUsd + collateralUsd,
      cumulativeCollateralToken: openSlot.cumulativeCollateralToken + collateralAmount,

      maxSizeUsd: openSlot.maxSizeUsd > openSlot.sizeInUsd ? openSlot.maxSizeUsd : openSlot.sizeInUsd,
      maxSizeToken: openSlot.maxSizeToken > openSlot.maxSizeToken ? openSlot.maxSizeToken : openSlot.maxSizeToken,
      maxCollateralToken: openSlot.maxCollateralToken > openSlot.collateralAmount ? openSlot.maxCollateralToken : openSlot.collateralAmount,
      maxCollateralUsd: openSlot.maxCollateralUsd > collateralUsd ? openSlot.maxCollateralUsd : collateralUsd
    })
  }

  context.PositionIncrease.set({
    id: orderId,
    feeCollected_id: orderId,
    link_id: positionLinkId,

    account: account,
    market: market,
    collateralToken: collateralToken,

    sizeInUsd: sizeInUsd,
    sizeInTokens: sizeInTokens,
    collateralAmount: collateralAmount,
    borrowingFactor: getUintItem(event, 3),
    fundingFeeAmountPerSize: getUintItem(event, 4),
    longTokenClaimableFundingAmountPerSize: getUintItem(event, 5),
    shortTokenClaimableFundingAmountPerSize: getUintItem(event, 6),
    executionPrice: getUintItem(event, 7),
    indexTokenPriceMax: getUintItem(event, 8),
    indexTokenPriceMin: getUintItem(event, 9),
    collateralTokenPriceMax: collateralTokenPriceMax,
    collateralTokenPriceMin: getUintItem(event, 11),
    sizeDeltaUsd: getUintItem(event, 12),
    sizeDeltaInTokens: getUintItem(event, 13),
    orderType: Number(getUintItem(event, 14)),

    collateralDeltaAmount: getUintItem(event, 0),
    priceImpactUsd: getUintItem(event, 1),
    priceImpactAmount: getUintItem(event, 2),

    isLong: isLong,

    orderKey: orderKey,
    positionKey: positionKey,

    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
    logIndex: event.transaction.transactionIndex
  })

}

async function onPositionDecrease(event: EventLog, context: handlerContext) {
  const orderId = getBytes32Item(event, 0)

  const account = getAddressItem(event, 0)
  const market = getAddressItem(event, 1)
  const collateralToken = getAddressItem(event, 2)

  const orderKey = getBytes32Item(event, 0)
  const positionKey = getBytes32Item(event, 1)

  const openPosition = await context.PositionOpen.get(positionKey)

  if (!openPosition) {
    context.log.error("PositionOpen not found")
    return
  }

  const sizeInUsd = getUintItem(event, 0)
  const sizeInTokens = getUintItem(event, 1)
  const collateralAmount = getUintItem(event, 2)
  const basePnlUsd = getUintItem(event, 1)


  if (sizeInTokens > 0) {
    context.PositionOpen.set({
      ...openPosition,
      sizeInUsd,
      sizeInTokens,
      collateralAmount,
      realisedPnlUsd: openPosition.realisedPnlUsd + basePnlUsd,
    })
  } else {

    context.PositionSettled.set({
      ...openPosition,
      realisedPnlUsd: openPosition.realisedPnlUsd + basePnlUsd,
    })


    context.PositionOpen.deleteUnsafe(positionKey)
  }

  context.PositionDecrease.set({
    id: orderId,
    feeCollected_id: orderId,
    link_id: openPosition.link_id,

    account: account,
    market: market,
    collateralToken: collateralToken,

    sizeInUsd: sizeInUsd,
    sizeInTokens: sizeInTokens,
    collateralAmount: collateralAmount,
    borrowingFactor: getUintItem(event, 3),
    fundingFeeAmountPerSize: getUintItem(event, 4),
    longTokenClaimableFundingAmountPerSize: getUintItem(event, 5),
    shortTokenClaimableFundingAmountPerSize: getUintItem(event, 6),
    executionPrice: getUintItem(event, 7),
    indexTokenPriceMax: getUintItem(event, 8),
    indexTokenPriceMin: getUintItem(event, 9),
    collateralTokenPriceMax: getUintItem(event, 10),
    collateralTokenPriceMin: getUintItem(event, 11),
    sizeDeltaUsd: getUintItem(event, 12),
    sizeDeltaInTokens: getUintItem(event, 13),
    collateralDeltaAmount: getUintItem(event, 14),
    valuesPriceImpactDiffUsd: getUintItem(event, 15),
    orderType: Number(getUintItem(event, 16)),

    priceImpactUsd: getUintItem(event, 0),
    basePnlUsd: getUintItem(event, 1),
    uncappedBasePnlUsd: getUintItem(event, 2),

    isLong: getBoolItem(event, 0),

    orderKey: orderKey,
    positionKey: positionKey,

    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
    logIndex: event.transaction.transactionIndex
  })


}

