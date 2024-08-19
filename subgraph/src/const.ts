export const IntervalUnixTime = {
  SEC: 1n,
  SEC60: 60n,
  MIN5: 300n,
  MIN15: 900n,
  MIN30: 1800n,
  MIN60: 3600n,
  HR2: 7200n,
  HR4: 14400n,
  HR6: 21600n,
  HR8: 28800n,
  HR24: 86400n,
  DAY7: 604800n,
  MONTH: 2628000n,
  MONTH2: 5256000n,
  YEAR: 31536000n,
}

export enum OrderStatus {
  CREATED = 0,
  CANCELLED = 1,
  FROZEN = 2,
}
export enum TokenDecimals {
  USDC = 6,
  USDT = 6,
  BTC = 8,
  WETH = 18,
  LINK = 18,
  UNI = 18,
  MIM = 18,
  SPELL = 18,
  SUSHI = 18,
  AVAX = 18,
  FRAX = 18,
  DAI = 18,
  GMX = 18,
  GLP = 18,
}



export const PRICEFEED_INTERVAL_LIST = [
  IntervalUnixTime.MIN5,
  IntervalUnixTime.MIN15,
  IntervalUnixTime.MIN60,
  IntervalUnixTime.HR6,
  IntervalUnixTime.HR24,
  IntervalUnixTime.DAY7,
  IntervalUnixTime.MONTH,
]

export const PLATFORM_STAT_INTERVAL = [
  IntervalUnixTime.MIN60,
  IntervalUnixTime.HR24,
  IntervalUnixTime.DAY7,
  IntervalUnixTime.MONTH,
  IntervalUnixTime.YEAR,
]



export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export const ZERO_BYTES32 = "0x0000000000000000000000000000000000000000000000000000000000000000"

export const BASIS_POINTS_DIVISOR = 10000n



export const MARKET_TOKEN_MAP = {
  "0x47c031236e19d024b42f8AE6780E44A573170703": "0x47904963fc8b2340414262125aF798B9655E58Cd",
  "0x70d95587d40A2caf56bd97485aB3Eec10Bee6336": "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  "0x6853EA96FF216fAb11D2d930CE3C508556A4bdc4": "0xC4da4c24fd591125c3F47b340b6f4f76111883d8",
  "0x09400D9DB990D5ed3f35D7be61DfAEB900Af03C9": "0x2bcC6D6CdBbDC0a4071e48bb3B969b06B3330c07",
  "0xD9535bB5f58A1a75032416F2dFe7880C30575a41": "0xB46A094Bc4B0adBD801E14b9DB95e05E28962764",
  "0xc7Abb2C5f3BF3CEB389dF0Eecd6120D451170B50": "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
  "0x7f1fa204bb700853D36994DA19F830b6Ad18455C": "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
  "0xC25cEf6061Cf5dE5eb761b50E4743c1F5D7E5407": "0x912CE59144191C1204E64559FE8253a0e49E6548",
  "0x9C2433dFD71096C435Be9465220BB2B189375eA7": "0x0000000000000000000000000000000000000000",
  "0xB686BcB112660343E6d15BDb65297e110C8311c4": "0x0000000000000000000000000000000000000000",
  "0xe2fEDb9e6139a182B98e7C2688ccFa3e9A53c665": "0x0000000000000000000000000000000000000000",
  "0x0CCB4fAa6f1F1B30911619f1184082aB4E25813c": "0xc14e065b0067dE91534e032868f5Ac6ecf2c6868",
}




