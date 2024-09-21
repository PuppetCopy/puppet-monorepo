import { Behavior, combineObject } from "@aelea/core"
import { $text, component, style } from "@aelea/dom"
import { $column, $row, layoutSheet, screenUtils } from "@aelea/ui-components"
import { colorAlpha, pallete } from "@aelea/ui-components-theme"
import { empty, map, now, startWith } from "@most/core"
import { Stream, Time } from "@most/types"
import { IntervalTime, getBasisPoints, getMappedValue, pagingQuery, readablePercentage } from "common-utils"
import { BaselineData, LineType } from "lightweight-charts"
import { IAccountLastAggregatedStats, queryAccountLastAggregatedStats } from "puppet-middleware-utils"
import { $Baseline, $ButtonToggle, $IntermediatePromise, $bear, $bull, $icon, $infoLabel, IMarker, IQuantumScrollPage, ISortBy, TableColumn, TablePageResponse } from "ui-components"
import { uiStorage } from "ui-storage"
import * as viem from "viem"
import { $TraderDisplay, $TraderRouteDisplay, $pnlDisplay, $size } from "../../common/$common.js"
import { $card2, $responsiveFlex } from "../../common/elements/$common.js"
import { subgraphClient } from "../../common/graphClient"
import { $SelectCollateralToken } from "../../components/$CollateralTokenSelector"
import { $LastAtivity, LAST_ACTIVITY_LABEL_MAP } from "../../components/$LastActivity.js"
import { $CardTable } from "../../components/$common"
import { IChangeSubscription } from "../../components/portfolio/$RouteSubscriptionEditor"
import { $tableHeader } from "../../components/table/$TableColumn.js"
import { getPositionListTimelinePerformance } from "../../components/trade/$ProfilePerformanceGraph"
import * as storeDb from "../../const/store.js"
import { $seperator2 } from "../common.js"
import { IUserActivityPageParams } from "../type.js"




export const $Leaderboard = (config: IUserActivityPageParams) => component((
  [modifySubscriber, modifySubscriberTether]: Behavior<IChangeSubscription>,

  [scrollRequest, scrollRequestTether]: Behavior<IQuantumScrollPage>,
  [sortByChange, sortByChangeTether]: Behavior<ISortBy>,

  [changeActivityTimeframe, changeActivityTimeframeTether]: Behavior<IntervalTime>,
  [selectMarketTokenList, selectMarketTokenListTether]: Behavior<viem.Address[]>,

  [routeChange, routeChangeTether]: Behavior<any, string>,
  [switchIsLong, switchIsLongTether]: Behavior<boolean | undefined>,
) => {

  const { activityTimeframe, selectedCollateralTokenList, walletClientQuery, pricefeedMapQuery, route } = config

  const sortBy = uiStorage.replayWrite(storeDb.store.leaderboard, sortByChange, 'sortBy')
  const isLong = uiStorage.replayWrite(storeDb.store.leaderboard, switchIsLong, 'isLong')

  const accountStatsList = queryAccountLastAggregatedStats(subgraphClient, { activityTimeframe, sortBy })

  const tableParams = map(async pageParams => {
    const accountStatsList = await pageParams.accountStatsList
    const pricefeedMap = await pageParams.pricefeedMapQuery
    const activityTimeframe = pageParams.activityTimeframe

    return { accountStatsList, pricefeedMap, sortBy: pageParams.sortBy, activityTimeframe }
  }, combineObject({ sortBy, accountStatsList, pricefeedMapQuery, activityTimeframe }))



  return [
    $column(layoutSheet.spacing, style({ paddingTop: '36px' }))(

      $card2(style({ padding: "0", gap: 0 }))(
        $responsiveFlex(layoutSheet.spacingBig, style({ padding: '26px', placeContent: 'space-between', alignItems: 'center' }))(
          $SelectCollateralToken({
            selectedList: selectedCollateralTokenList,
          })({
            selectMarketTokenList: selectMarketTokenListTether()
          }),
          $ButtonToggle({
            selected: isLong,
            options: [
              undefined,
              true,
              false,
            ],
            $$option: map(il => {
              return $row(layoutSheet.spacingTiny, style({ alignItems: 'center' }))(
                il === undefined
                  ? empty()
                  : $icon({ $content: il ? $bull : $bear, width: '18px', viewBox: '0 0 32 32' }),
                $text(il === undefined ? 'Both' : il ? 'Long' : 'Short'),
              )
            })
          })({
            select: switchIsLongTether()
          }),
          $LastAtivity(activityTimeframe)({
            changeActivityTimeframe: changeActivityTimeframeTether()
          }),
        ),
        $IntermediatePromise({
          query: tableParams,
          $$done: map(params => {

            const accountStatsList = params.accountStatsList
            if (accountStatsList.length === 0) {
              return $column(layoutSheet.spacingSmall, style({ padding: '30px' }))(
                $text('No positions found'),
                $infoLabel(`Try changing filters or selecting a different markets`),
              )
            }

            const paging = startWith({ offset: 0, pageSize: 20 }, scrollRequest)
            const dataSource: Stream<TablePageResponse<IAccountLastAggregatedStats>> = map(scroll => {

              return pagingQuery(scroll, accountStatsList)
            }, paging)


            const columns: TableColumn<IAccountLastAggregatedStats>[] = [
              {
                $head: $text('Trader'),
                gridTemplate: '155px',
                // columnOp: style({ placeContent: 'flex-end' }),
                $bodyCallback: map(pos => {
                  return $TraderDisplay({
                    route: config.route,
                    trader: pos.trader.id,
                    puppets: [],
                  })({
                    click: routeChangeTether()
                  })
                })
              },
              {
                $head: $text('Trade Route'),
                gridTemplate: screenUtils.isDesktopScreen ? '210px' : '80px',
                $bodyCallback: map(pos => {
                  return $TraderRouteDisplay({
                    walletClientQuery,
                    selectedCollateralTokenList,
                    collateralTokenList: [...new Set(pos.trader.increaseList.map(i => i.collateralToken))],
                    trader: pos.trader.id
                  })({
                    modifySubscribeList: modifySubscriberTether()
                  })
                })
              },
              ...screenUtils.isDesktopScreen
                ? [

                  {
                    $head: $text('Win/Loss'),
                    gridTemplate: '70px',
                    columnOp: style({ alignItems: 'center', placeContent: 'center' }),
                    $bodyCallback: map((pos: IAccountLastAggregatedStats) => {
                      const totalCount = pos.trader.increaseList.length + pos.trader.decreaseList.length
                      const winCount = pos.trader.decreaseList.reduce((acc, next) => acc + (next.basePnlUsd > 0n ? 1 : 0), 0)
                      return $row(layoutSheet.spacingSmall)(
                        $text(`${winCount} / ${totalCount - winCount}`)

                      )
                    })
                  },
                  {
                    $head: $column(style({ textAlign: 'right' }))(
                      $text('Size'),
                      $text(style({ fontSize: '.85rem' }))('Leverage'),
                    ),
                    sortBy: 'maxSizeInUsd',
                    columnOp: style({ placeContent: 'flex-end' }),
                    $bodyCallback: map((pos: IAccountLastAggregatedStats) => {
                      return $size(pos.maxSizeInUsd, pos.maxCollateralInUsd)
                    })
                  },
                ]
                : [],
              {
                columnOp: style({ placeContent: 'flex-start' }),
                $head: $row(layoutSheet.spacingSmall, style({ flex: 1, placeContent: 'space-between' }))(
                  $tableHeader('PnL $', 'ROI %'),
                  $text(style({ alignSelf: 'center' }))(
                    map(tf => `${getMappedValue(LAST_ACTIVITY_LABEL_MAP, tf)} Activtiy`, activityTimeframe)
                  )
                ),
                sortBy: 'pnl',
                gridTemplate: screenUtils.isDesktopScreen ? '200px' : '165px',
                $bodyCallback: map(pos => {
                  const adjustList = [...pos.trader.increaseList, ...pos.trader.decreaseList]
                  const timeline = getPositionListTimelinePerformance({
                    activityTimeframe: params.activityTimeframe,
                    list: [...pos.trader.increaseList, ...pos.trader.decreaseList],
                    pricefeedMap: params.pricefeedMap,
                    tickCount: 25,
                  })

                  const markerList = adjustList
                    .map(pos => {
                      return {
                        position: 'inBar',
                        color: colorAlpha(pallete.message, .15),
                        time: pos.blockTimestamp as Time,
                        size: 0.1,
                        shape: 'circle'
                      }
                    })
                    .sort((a, b) => Number(a.time) - Number(b.time))

                  const pnl = timeline[timeline.length - 1].pnl
                  return $row(style({ position: 'relative', flex: 1 }))(
                    $row(style({ position: 'relative', pointerEvents: 'none', width: `100%`, height: `80px` }))(
                      $Baseline({
                        containerOp: style({ inset: '0px 0px 0px 0px', position: 'absolute' }),
                        markers: now(markerList as IMarker[]),
                        chartConfig: {
                          width: 100,
                          leftPriceScale: {
                            // autoScale: true,
                            ticksVisible: true,
                            scaleMargins: {
                              top: 0,
                              bottom: 0,
                            }
                          },
                          crosshair: {
                            horzLine: {
                              visible: false,
                            },
                            vertLine: {
                              visible: false,
                            }
                          },
                          // height: 150,
                          // width: 100,
                          timeScale: {
                            visible: false
                          },
                          // ...config.chartConfig
                        },
                        data: timeline as any as BaselineData[],
                        // containerOp: style({  inset: '0px 0px 0px 0px' }),
                        baselineOptions: {
                          baseValue: {
                            price: 0,
                            type: 'price',
                          },
                          lineWidth: 1,
                          lineType: LineType.Curved,
                        },
                      })({}),
                    ),
                    $row(style({ position: 'absolute', background: `linear-gradient(to right, ${pallete.background} 0%, ${pallete.background} 23%, transparent 100%)`, inset: 0, zIndex: 1, alignItems: 'center' }))(
                      $column(layoutSheet.spacingTiny)(
                        $pnlDisplay(pnl),
                        $seperator2,
                        $text(style({ fontSize: '.85rem' }))(
                          readablePercentage(getBasisPoints(pnl, pos.maxCollateralInUsd))
                        )
                      )
                    )
                  )
                })
              },
              // {
              //   $head: $tableHeader('PnL $', 'ROI %'),
              //   gridTemplate: screenUtils.isDesktopScreen ? '120px' : '80px',
              //   sortBy: 'pnl',
              //   columnOp: style({ placeContent: 'flex-start' }),
              //   $bodyCallback: map(tr => {

              //     return $PnlAndRoi(tr)
              //   })
              // },
            ]

            return $CardTable({
              sortBy: params.sortBy,
              dataSource,
              columns,
            })({
              sortBy: sortByChangeTether(),
              scrollRequest: scrollRequestTether(),
            })
          })
        })({})
      )

    ),

    {
      routeChange, modifySubscriber, changeActivityTimeframe, selectMarketTokenList,
      // unSubscribeSelectedTraders: snapshot((params, trader) => {
      //   const selectedIdx = params.selection.indexOf(trader)
      //   selectedIdx === -1 ? params.selection.push(trader) : params.selection.splice(selectedIdx, 1)
      //   return params.selection
      // }, combineObject({ selection: config.selectedTraders, subscription: config.subscription }), selectTrader),
    }
  ]
})

