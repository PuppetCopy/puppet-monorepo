import { Behavior, combineObject } from "@aelea/core"
import { $node, $text, component, style } from "@aelea/dom"
import { $column, $row, layoutSheet } from "@aelea/ui-components"
import { pallete } from "@aelea/ui-components-theme"
import { map, mergeArray, now, snapshot, startWith } from "@most/core"
import { ADDRESS_ZERO, IntervalTime, applyFactor, countdownFn, factor, getDenominator, getMappedValue, parseFixed, parseReadableNumber, readableTokenAmount, readableTokenAmountLabel, readableUsd, switchMap } from "common-utils"
import { ARBITRUM_ADDRESS, TOKEN_DESCRIPTION_MAP } from "gmx-middleware-const"
import { EIP6963ProviderDetail } from "mipd"
import * as PUPPET from "puppet-middleware-const"
import { queryPosition } from "puppet-middleware-utils"
import { $ButtonToggle, $defaulButtonToggleContainer, $FieldLabeled, $infoLabeledValue, $infoTooltip, $infoTooltipLabel, $intermediateText } from "ui-components"
import { uiStorage } from "ui-storage"
import * as viem from 'viem'
import { $heading2, $heading3 } from "../../common/$text"
import { $card, $responsiveFlex } from "../../common/elements/$common"
import { subgraphClient } from "../../common/graphClient"
import { $Vest } from "../../components/$Vest.js"
import { IChangeSubscription } from "../../components/portfolio/$RouteSubscriptionEditor.js"
import * as storeDb from "../../const/store.js"
import { readBalanceOf } from "../../logic/commonRead"
import { $seperator2 } from "../common"
import { IPageParams, IUserActivityParams, IWalletTab } from "../type.js"
import { $TraderPage } from "./$Trader.js"
import { $WalletPuppet } from "./$WalletPuppet.js"
import { $SubmitBar } from "../../components/form/$Form"
import * as walletLink from "wallet"
import { $AssetDepositEditor } from "../../components/portfolio/$AssetDepositEditor"
import { readAddressTokenBalance } from "../../logic/traderRead"
import tokenomics from "../../logic/tokenomicsReader.js"

const optionDisplay = {
  [IWalletTab.EARN]: {
    label: 'Earn',
    url: '/earn'
  },
  [IWalletTab.PUPPET]: {
    label: 'Puppet',
    url: '/puppet'
  },
  [IWalletTab.TRADER]: {
    label: 'Trader',
    url: '/trader'
  },
}


export const $WalletPage = (config: IPageParams & IUserActivityParams) => component((
  [changeRoute, changeRouteTether]: Behavior<string, string>,
  [selectProfileMode, selectProfileModeTether]: Behavior<IWalletTab>,
  [modifySubscriber, modifySubscriberTether]: Behavior<IChangeSubscription>,

  [changeActivityTimeframe, changeActivityTimeframeTether]: Behavior<any, IntervalTime>,
  [selectMarketTokenList, selectMarketTokenListTether]: Behavior<viem.Address[]>,

  [changeWallet, changeWalletTether]: Behavior<any, EIP6963ProviderDetail | null>,
) => {

  const {
    route, walletClientQuery, providerClientQuery,
    activityTimeframe, selectedCollateralTokenList, pricefeedMapQuery
  } = config


  const profileMode = uiStorage.replayWrite(storeDb.store.wallet, selectProfileMode, 'selectedTab')


  const puppetTokenPriceInUsd = switchMap(async providerQuery => {
    const provider = await providerQuery

    return 0n
  }, providerClientQuery)




  return [

    $column(layoutSheet.spacingBig)(
      $node(),

      // $row(style({ flex: 1, placeContent: 'center' }))(
      //   $IntermediateConnectButton({
      //     walletClientQuery,
      //     $$display: map(wallet => {
      //       // return empty()
      //       return $ButtonSecondary({
      //         $content: $text('Disconnect')
      //       })({
      //         click: changeWalletTether(constant(null))
      //       })
      //     })
      //   })({
      //     changeWallet: changeWalletTether()
      //   }),
      // ),

      $row(
        $node(style({ flex: 1 }))(),
        $ButtonToggle({
          $container: $defaulButtonToggleContainer(style({ alignSelf: 'center', })),
          selected: profileMode,
          options: [IWalletTab.EARN, IWalletTab.PUPPET, IWalletTab.TRADER],
          $$option: map(option => {
            return $text(optionDisplay[option].label)
          })
        })({ select: selectProfileModeTether() }),
        $node(style({ flex: 1 }))(),
      ),

      switchMap(params => {
        const address = switchMap(async walletQuery => {
          return (await walletQuery)?.account.address || ADDRESS_ZERO
        }, walletClientQuery)

        // if (params.profileMode === IWalletTab.PUPPET) {
        //   const puppetTradeRouteListQuery = queryPuppetTradeRoute(subgraphClient, { address, activityTimeframe, collateralToken })

        //   const settledPositionListQuery = map(async tradeRoute => {
        //     return (await tradeRoute).map(x => x.settledList).flatMap(pp => pp.map(x => x.position))
        //   }, puppetTradeRouteListQuery)
        //   const openPositionListQuery = map(async tradeRoute => {
        //     return (await tradeRoute).map(x => x.openList).flatMap(pp => pp.map(x => x.position))
        //   }, puppetTradeRouteListQuery)

        //   return $WalletPuppet({
        //     walletClientQuery, route, pricefeedMapQuery, positionListQuery, puppetTradeRouteListQuery,
        //     activityTimeframe, collateralTokenList, routeTypeListQuery, providerClientQuery,
        //   })({
        //     changeRoute: changeRouteTether(),
        //     modifySubscriber: modifySubscriberTether(),
        //     changeActivityTimeframe: changeActivityTimeframeTether(),
        //     selectMarketTokenList: selectMarketTokenListTether(),
        //   })
        // } else if (params.profileMode === IWalletTab.TRADER) {
        //   const settledPositionListQuery = queryPosition(subgraphClient, { activityTimeframe, collateralTokenList, address })
        //   const openPositionListQuery = queryPosition(subgraphClient, { address, collateralTokenList })

        //   return $column(layoutSheet.spacingTiny)(
        //     $TraderPage({ ...config, positionListQuery })({ 
        //       changeActivityTimeframe: changeActivityTimeframeTether(),
        //     })
        //   ) 
        // }


        return $column(layoutSheet.spacingBig)(
          $card(layoutSheet.spacingBig)(

            $responsiveFlex(layoutSheet.spacingBig)(

              $Vest({ ...config, puppetTokenPriceInUsd })({
                changeWallet: changeWalletTether()
              }),

              $seperator2,
              $column(layoutSheet.spacing, style({ flex: 1 }))(
                $row(style({ alignItems: 'center' }))(
                  $heading3('Protocol Flywheel'),
                  $infoTooltip(`Puppet's smart contracts integrate a simple emissions model. Tokens are minted and rewarded as the protocol's revenue grows, aligning token supply with actual usage.\nFor every dollar of revenue generated through Copy-Trading, earn a corresponding amount in PUPPET tokens.`),
                ),
                // style({ placeContent: 'space-between' })(
                //   $infoLabeledValue(
                //     'Price',
                //     $intermediateText(
                //       map(async puppetPrice => {
                //         const price = puppetPrice * getDenominator(24)

                //         return readableUsd(price)
                //       }, puppetTokenPriceInUsd)
                //     )
                //   )
                // ),
                style({ placeContent: 'space-between' })(
                  $infoLabeledValue(
                    $infoTooltipLabel(`Protocol revenue from Copy-trading is used to buy back PUPPET tokens. This is done through public contract auctions. The bought-back tokens are then distributed to lockers based on proportionally to their Voting Power`, 'Revenue Bought-back'),
                    $row(layoutSheet.spacingSmall, style({ alignItems: 'center' }))(
                      // $text(style({ color: pallete.foreground, fontSize: '.75rem' }))(readableTokenAmount(TOKEN_DESCRIPTION_MAP.PUPPET, BigInt(1e18))),
                      $text(readableTokenAmountLabel(TOKEN_DESCRIPTION_MAP.PUPPET, BigInt(1e18)))
                    ),
                  )
                ),
                style({ placeContent: 'space-between' })(
                  $infoLabeledValue(
                    $infoTooltipLabel(`Tokens are minted and distributed to active participants as the protocol generates more revenue. This ensures that the token supply directly reflects the protocol's growth and usage`, 'Total Rewarded'),
                    $intermediateText(
                      map(async providerQuery => {
                        const provider = await providerQuery
                        const puppetSupply = tokenomics.PuppetToken.getTotalSupply(provider)


                        return readableTokenAmount(TOKEN_DESCRIPTION_MAP.PUPPET, await puppetSupply - PUPPET.INITIAL_SUPPLY)
                      }, providerClientQuery)
                    ),
                  )
                ),
                // style({ placeContent: 'space-between' })(
                //   $infoLabeledValue(
                //     $infoTooltipLabel('The total value of all PUPPET in circulation', 'Market Cap'),
                //     $text('10,000,000'),
                //   )
                // ),
                $seperator2,
                style({ placeContent: 'space-between' })(
                  $infoLabeledValue(
                    $text('Locked In (vePUPPET)'),
                    $intermediateText(
                      map(async providerQuery => {
                        const provider = await providerQuery
                        // const totalSupply = await tokenomics.PuppetToken.totalSupply(provider)
                        const vTokenSupply = await tokenomics.PuppetVoteToken.getTotalSupply(provider)

                        return `${readableTokenAmount(TOKEN_DESCRIPTION_MAP.PUPPET, vTokenSupply)}`
                      }, providerClientQuery)
                    ),
                  )
                )
              ),

            ),
          ),
        )
      }, combineObject({ profileMode })),

      $node(),

      component((
        [inputDepositAmount, inputDepositAmountTether]: Behavior<string, bigint>,
        [submitContribute, submitContributeTether]: Behavior<walletLink.IWalletClient, any>,

        [inputBuybackAmount, inputBuybackAmountTether]: Behavior<string, bigint>,
        [submitBuyback, submitBuybackTether]: Behavior<walletLink.IWalletClient, any>,

      ) => {

        const walletBalance = switchMap(async walletQuery => {
          const wallet = await walletQuery

          if (wallet == null) {
            return 0n
          }

          return readAddressTokenBalance(wallet, ARBITRUM_ADDRESS.USDC, wallet.account.address)
        }, walletClientQuery)

        const contributedUsdcQuery = switchMap(async walletClientQuery => {
          const wallet = await walletClientQuery

          if (wallet == null) {
            return 0n
          }

          return tokenomics.ContributeStore.getCursorBalance(wallet, ARBITRUM_ADDRESS.USDC)
        }, walletClientQuery)

        const usdcBuybackQuote = map(async walletClientQuery => {
          const wallet = await walletClientQuery

          if (wallet == null) {
            return 0n
          }

          return tokenomics.ContributeStore.getBuybackQuote(wallet, ARBITRUM_ADDRESS.USDC)
        }, walletClientQuery)




        return [
          $card(layoutSheet.spacingBig, style({ placeSelf: 'center', maxWidth: '600px', width: '100%', flex: 1 }))(
            $heading2('Contribution Tooling (Testnet)'),
            $seperator2,

            $column(layoutSheet.spacing)(
              $text('Contribute USDC to the Protocol'),
              $FieldLabeled({
                label: 'Amount',
                placeholder: 'Enter amount',
                hint: map(amount => `Balance: ${readableTokenAmountLabel(TOKEN_DESCRIPTION_MAP.USDC, amount)}`, walletBalance),
              })({
                change: inputDepositAmountTether(map(value => {
                  return parseFixed(TOKEN_DESCRIPTION_MAP.USDC.decimals, value)
                }))
              })
            ),



            $SubmitBar({
              spend: {
                token: ARBITRUM_ADDRESS.USDC,
                spender: getMappedValue(PUPPET.CONTRACT, 42161).Router.address,
              },
              txQuery: submitContribute,
              walletClientQuery,
              $submitContent: $text('User Contribute USDC'),
            })({
              changeWallet: changeWalletTether(),
              click: submitContributeTether(
                snapshot(async (params, wallet) => {
                  return walletLink.writeContract({
                    ...getMappedValue(PUPPET.CONTRACT, wallet.chain.id).StubPublicContribute,
                    walletClient: wallet,
                    functionName: 'contribute',
                    args: [ARBITRUM_ADDRESS.USDC, params.inputDepositAmount] as const
                  })
                }, combineObject({ inputDepositAmount }))
              )
            }),

            $seperator2,
            $text('Swap your PUPPET tokens in return for USDC accrued from contributions'),

            $infoLabeledValue(
              $text('Accrued USDC for sale'),
              $text(map(amount => `${readableTokenAmountLabel(TOKEN_DESCRIPTION_MAP.USDC, amount)}`, contributedUsdcQuery)),
            ),
            $infoLabeledValue(
              $text('Offered Quote'),
              $intermediateText(
                map(async durationQuery => {
                  return readableTokenAmountLabel(TOKEN_DESCRIPTION_MAP.PUPPET, await durationQuery)
                }, usdcBuybackQuote)
              ),
            ),

            $column(layoutSheet.spacing)(
              $FieldLabeled({
                label: 'Amount',
                placeholder: 'Enter amount'
              })({
                change: inputBuybackAmountTether(map(value => {
                  return parseFixed(TOKEN_DESCRIPTION_MAP.USDC.decimals, parseReadableNumber(value))
                }))
              })
            ),

            $SubmitBar({
              spend: {
                token: getMappedValue(PUPPET.CONTRACT, 42161).PuppetToken.address,
                spender: getMappedValue(PUPPET.CONTRACT, 42161).Router.address,
              },
              txQuery: submitBuyback,
              walletClientQuery,
              $submitContent: $text('Buyback'),
            })({
              changeWallet: changeWalletTether(),
              click: submitBuybackTether(
                snapshot(async (params, wallet) => {

                  return walletLink.writeContract({
                    ...getMappedValue(PUPPET.CONTRACT, wallet.chain.id).RewardRouter,
                    walletClient: wallet,
                    functionName: 'buyback',
                    args: [ARBITRUM_ADDRESS.USDC, wallet.account.address, params.inputBuybackAmount]
                  })
                }, combineObject({ inputBuybackAmount }))
              )
            })


          ),
        ]
      })({})

    ),

    {
      modifySubscriber, changeActivityTimeframe, selectMarketTokenList, changeRoute, changeWallet
    }
  ]
})


