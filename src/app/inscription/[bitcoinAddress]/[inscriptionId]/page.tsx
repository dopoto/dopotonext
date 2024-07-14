import { Inscription } from "@/app/models/inscription";
import styles from "./page.module.css";
import Link from "next/link";

async function getInscriptionDetails(
  bitcoinAddress: string,
  inscriptionId: string
): Promise<Inscription> {
  const apiEndpoint = `https://api-3.xverse.app/v1/address/${bitcoinAddress}/ordinals/inscriptions/${inscriptionId}`;
  const res = await fetch(apiEndpoint);
  return res.json();
}

async function getInscriptionTextContent(contentApiEndpoint: string) {
  const response = await fetch(contentApiEndpoint);
  const data = await response.text();
  return data;
}

interface Props {
  params: {
    bitcoinAddress: string;
    inscriptionId: string;
  };
}

export default async function InscriptionDetailsPage({ params }: Props) {
  const { bitcoinAddress, inscriptionId } = params;

  const inscriptionDetails = await getInscriptionDetails(
    bitcoinAddress,
    inscriptionId
  );
  const contentApiEndpoint = `https://ord.xverse.app/content/${inscriptionId}`;

  const rawData = await getInscriptionTextContent(contentApiEndpoint);

  const content = inscriptionDetails?.content_type.startsWith("image/") ? (
    <img src={contentApiEndpoint} alt="" />
  ) : (
    <textarea>{rawData}</textarea>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link
          className={styles.leftArrow}
          href={`/?bitcoinAddress=${bitcoinAddress}`}
        >
          &lt;
        </Link>
        <div className={styles.title}>
          <h1>Details</h1>
        </div>
      </div>
      {content}
      <div className={styles.secondaryTitle}>
        Inscription {inscriptionDetails?.id}
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Inscription ID</div>
        <div className={styles.sectionContent}>{inscriptionDetails?.id}</div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Owner Address</div>
        <div className={styles.sectionContent}>{bitcoinAddress}</div>
      </div>
      <div className={styles.secondaryTitle}>Attributes</div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Output Value</div>
        <input type="text" disabled value={inscriptionDetails?.output} />
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Content type</div>
        <input type="text" disabled value={inscriptionDetails?.content_type} />
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Content length</div>
        <input
          type="text"
          disabled
          value={inscriptionDetails?.content_length}
        />
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Location</div>
        <input type="text" disabled value={inscriptionDetails?.location} />
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Genesis transaction</div>
        <input type="text" disabled value={inscriptionDetails?.genesis_tx_id} />
      </div>
    </div>
  );
}
