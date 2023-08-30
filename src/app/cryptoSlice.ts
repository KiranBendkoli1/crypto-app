import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { MyApiKey, getCoinBaseUrl, getCoinsBaseUrl } from "../config/keys";

export interface CryptoAPITypes {
  status: string;
  data: Data;
}

export interface Data {
  stats: Stats;
  coins: Coin[];
}

export interface Coin {
  uuid: string;
  symbol: string;
  name: string;
  color: string;
  iconUrl: string;
  marketCap: string;
  price: string;
  btcPrice: string;
  listedAt: number;
  change: string;
  rank: number;
  sparkline: string[];
  coinrankingUrl: string;
  "24hVolume": string;
}

export interface Stats {
  total: number;
  totalCoins: number;
  totalMarkets: number;
  totalExchanges: number;
  totalMarketCap: string;
  total24hVolume: string;
}

interface stateType extends Data {
  coin: OneCoin;
  isLoading: boolean;
  error: string | null | undefined;
  history: History[];
  change: string;
}
// Generated by https://quicktype.io

export interface OneCoin {
  uuid: string;
  symbol: string;
  name: string;
  description: string;
  color: string;
  iconUrl: string;
  websiteUrl: string;
  links: Link[];
  supply: Supply;
  numberOfMarkets: number;
  numberOfExchanges: number;
  "24hVolume": string;
  marketCap: string;
  fullyDilutedMarketCap: string;
  price: string;
  btcPrice: string;
  priceAt: number;
  change: string;
  rank: number;
  sparkline: string[];
  allTimeHigh: AllTimeHigh;
  coinrankingUrl: string;
  tier: number;
  lowVolume: boolean;
  listedAt: number;
  hasContent: boolean;
  notices: null;
  tags: string[];
}

export interface AllTimeHigh {
  price: string;
  timestamp: number;
}

export interface Link {
  name: string;
  type: string;
  url: string;
}

export interface Supply {
  confirmed: boolean;
  supplyAt: number;
  max: null;
  total: string;
  circulating: string;
}

// Generated by https://quicktype.io

export interface HistoryType {
  status: string;
  data: HData;
}

export interface HData {
  change: string;
  history: History[];
}

export interface History {
  price: string;
  timestamp: number;
}

const initialCryptoState: stateType = {
  coin: {
    uuid: "",
    symbol: "",
    name: "",
    description: "",
    color: "",
    iconUrl: "",
    websiteUrl: "",
    links: [],
    supply: {
      confirmed: false,
      supplyAt: 0,
      max: null,
      total: "",
      circulating: "",
    },
    numberOfMarkets: 0,
    numberOfExchanges: 0,
    "24hVolume": "",
    marketCap: "",
    fullyDilutedMarketCap: "",
    price: "",
    btcPrice: "",
    priceAt: 0,
    change: "",
    rank: 0,
    sparkline: [],
    allTimeHigh: {
      price: "",
      timestamp: 0,
    },
    coinrankingUrl: "",
    tier: 0,
    lowVolume: false,
    listedAt: 0,
    hasContent: false,
    notices: null,
    tags: [],
  },
  change: "", // c
  history: [],
  coins: [],
  stats: {
    total: 0,
    totalCoins: 0,
    totalMarkets: 0,
    total24hVolume: "",
    totalExchanges: 0,
    totalMarketCap: "",
  },
  isLoading: false,
  error: null,
};

export const getCryptoData = createAsyncThunk(
  "content/getData",
  async (count: number) => {
    try {
      const response = await axios.get(
        getCoinsBaseUrl,
        {
          params:{
            limit:count
          },
          headers: {
            "X-RapidAPI-Key":
              MyApiKey,
            "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
          },
        }
      );
      const data = await response.data;
      console.log(data.data);
      return data.data;
    } catch (error) {
      return error;
    }
  }
);

export const getCoinData = createAsyncThunk(
  "getCoinData",
  async (coinId: string) => {
    try {
      const response = await axios.get(
        `${getCoinBaseUrl}/${coinId}`,
        {
          headers: {
            "X-RapidAPI-Key":
              MyApiKey,
            "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
          },
        }
      );
      const data = await response.data;
      const coin = data.data.coin;
      console.log(coin);
      // return data.data;
      return coin;
    } catch (error) {
      return error;
    }
  }
);

export const getCoinHistory = createAsyncThunk(
  "getCoinHistory",
  async (data: { coinId: string; timeperiod: string }) => {
    const { coinId, timeperiod } = data;
    try {
      const response = await axios.get(
        `${getCoinBaseUrl}/${coinId}/history`,
        {
          params: {
            timePeriod: timeperiod,
          },
          headers: {
            "X-RapidAPI-Key":
              MyApiKey,
            "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
          },
        }
      );
      const data = await response.data;
      console.log(data.data);
      const history = data.data.history;
      // return data.data;
      console.log(history);
      return data.data;
    } catch (error) {
      return error;
    }
  }
);

const cryptoSlice = createSlice({
  name: "crypto",
  initialState: initialCryptoState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getCryptoData.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCryptoData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.stats = action.payload.stats;
      state.coins = action.payload.coins;
    });
    builder.addCase(getCryptoData.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(getCoinData.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCoinData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.coin = action.payload;
    });
    builder.addCase(getCoinData.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(getCoinHistory.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCoinHistory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.history = action.payload.history;
      state.change = action.payload.change;
    });
    builder.addCase(getCoinHistory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export default cryptoSlice.reducer;
