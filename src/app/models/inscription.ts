export interface Inscription {
  id: string;
  address: string;
  content_type: string;
  content_length: number;
  output: string;
  location: string;
  genesis_tx_id: string;
}
