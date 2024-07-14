import axios from "axios";
import { UTXO } from "../models/utxo";

export async function getOrdinalUtxos(address: string): Promise<UTXO[]> {
    //const response = await fetch(`https://api-3.xverse.app/v1/address/${bitcoinAddress}/ordinal-utxo`)
    const response = await axios.get<UTXO[]>(
      `https://api-3.xverse.app/v1/address/${bitcoinAddress}/ordinal-utxo`
    );
  
    return response.data;
  }