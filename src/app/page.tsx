"use client";

import { useState, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { UTXO } from "./models/utxo";

import styles from "./page.module.css";

const Home = () => {
  const searchParams = useSearchParams();
  const bitcoinAddress = searchParams.get("bitcoinAddress") ?? "";

  const [address, setAddress] = useState<string>(bitcoinAddress);
  const [utxos, setUtxos] = useState<UTXO[]>([]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setUtxos([]);

    axios
      .get(`https://api-3.xverse.app/v1/address/${address}/ordinal-utxo`)
      .then((data) => {
        setUtxos(data?.data.results);
      });
    setUtxos(utxos);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bitcoin Ordinal Inscriptions Lookup</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.section}>
          <label htmlFor="btctext">Owner Bitcoin Address:</label>
        </div>
        <div className={styles.section}>
          <input
            type="text"
            id="btctext"
            placeholder="Enter Bitcoin Wallet Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className={styles.section}>
          <button type="submit">Lookup</button>
        </div>
      </form>

      {utxos.length > 0 && (
        <>
          <div>Results:</div>
          <ul className="list">
            {utxos?.map((utxo) => (
              <div>
                {utxo.inscriptions.map((inscription) => {
                  return (
                    <Link
                      className={styles.listItemText}
                      key={inscription.id}
                      href={`/inscription/${address}/${inscription.id}`}
                    >
                      <li className={styles.listItem}>
                        Inscription {inscription.id.slice(0, 8)}
                        <span className={styles.listItemArrow}>&gt;</span>
                      </li>{" "}
                    </Link>
                  );
                })}
              </div>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Home;
