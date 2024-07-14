'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios'; 

interface Inscription {
  id: string
}
interface UTXO {
  inscriptions: Inscription[];
  id: string;
}

async function getOrdinalUtxos(address: string): Promise<UTXO[]> {
  //const response = await fetch(`https://api-3.xverse.app/v1/address/${bitcoinAddress}/ordinal-utxo`)
  const response = await  axios.get<UTXO[]>(`https://api-3.xverse.app/v1/address/${bitcoinAddress}/ordinal-utxo`);
   
  return response.data;
}

const Home = () => {
  const [address, setAddress] = useState<string>('bc1pe6y27ey6gzh6p0j250kz23zra7xn89703pvmtzx239zzstg47j3s3vdvvs');
  const [utxos, setUtxos] = useState<UTXO[]>([]);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setUtxos([]);

    try {
      //const utxos = await getOrdinalUtxos(address);
      axios.get(`https://api-3.xverse.app/v1/address/${address}/ordinal-utxo`).then((data) => {
        console.log(data);
        setUtxos(data?.data.results);
      });
      setUtxos(utxos);
    } catch (err) {
      setError('Failed to fetch UTXOs or invalid address.');
    }
  };

  return (
    <div>
      <h1>Bitcoin Ordinal Inscriptions Lookup</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Bitcoin Wallet Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <button type="submit">Lookup</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {/* <ul>
        {utxos?.map((insc) => (
          <li key={insc.id}>
              ID: {insc.id}
          </li>
        ))}
      </ul> */}
      {JSON.stringify(utxos)}
    </div>
  );
};

export default Home;
