export interface Inscription {
  id: string;
  address: string;
  content_type: "image/webp" | "text/html;charset=utf-8";
  content_length: number;
  output: string;
  location: string;
  genesis_tx_id: string;
}
