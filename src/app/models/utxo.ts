import { Inscription } from "./inscription";

export interface UTXO {
  inscriptions: Inscription[];
  id: string;
}
