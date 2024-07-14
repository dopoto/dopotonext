"use client";

import { useState, FormEvent } from "react";
import axios from "axios";
import Link from "next/link";
import { UTXO } from "./models/utxo";

const Home = () => {
  const [address, setAddress] = useState<string>(
    "bc1pe6y27ey6gzh6p0j250kz23zra7xn89703pvmtzx239zzstg47j3s3vdvvs"
  );
  const [utxos, setUtxos] = useState<UTXO[]>([]);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setUtxos([]);

    try {
      axios
        .get(`https://api-3.xverse.app/v1/address/${address}/ordinal-utxo`)
        .then((data) => {
          setUtxos(data?.data.results);
        });
      setUtxos(utxos);
    } catch (err) {
      setError("Failed to fetch UTXOs or invalid address.");
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
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {utxos?.map((utxo) => (
          <div>
            <b>{utxo.id}</b>
            {utxo.inscriptions.map((insc) => {
              return (
                <Link key={insc.id}  href={`/inscription/${address}/${insc.id}`}>                   
                  Inscription ID: {insc.id}{" "}
                </Link>
              );
            })}
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Home;
