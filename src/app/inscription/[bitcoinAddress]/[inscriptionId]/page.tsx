import { Inscription } from "@/app/models/inscription";
import styles from "./page.module.css";

async function getInscriptionDetails(
  bitcoinAddress: string,
  inscriptionId: string
): Promise<Inscription> {
  const apiEndpoint = `https://api-3.xverse.app/v1/address/${bitcoinAddress}/ordinals/inscriptions/${inscriptionId}`;
  const res = await fetch(apiEndpoint);
  return res.json();
}

interface InscriptionContent {
  rawData: any;
}

async function getInscriptionTextContent(contentApiEndpoint: string) {
  const response = await fetch(contentApiEndpoint);
  const data = await response.text();
  return data;
}

async function getInscriptionContent(
  contentApiEndpoint: string,
  contentType: "image/webp" | "application/json"
): Promise<InscriptionContent> {
  const res = await fetch(contentApiEndpoint);

  const buffer = await res.arrayBuffer();

  let imageUrl = "";

  if (contentType === "image/webp") {
    const blob = new Blob([buffer], { type: contentType });
    imageUrl = URL.createObjectURL(blob);
    const img = new Image();
    img.src = imageUrl;
    await img.decode();
    return {
      rawData: imageUrl,
    };
  } else if (contentType === "application/json") {
    // Try to decode as JSON
    const text = new TextDecoder().decode(buffer);
    try {
      const json = JSON.parse(text);
      return {
        rawData: JSON.stringify(json, null, 2),
      };
    } catch (e) {
      // Not JSON, treat as plain text
      //setContent(text);
      return {
        rawData: text,
      };
    }
  }

  return {
    rawData: null,
  };
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
  // const inscriptionContent = await getInscriptionContent(
  //   contentApiEndpoint,
  //   inscriptionDetails.content_type
  // );

  const rawData = await getInscriptionTextContent(contentApiEndpoint)    ;

  // const rawData =
  //   inscriptionDetails.content_type === "application/json"
  //     ? await getInscriptionTextContent(contentApiEndpoint)
  //     : null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.leftArrow}>←</div>
        <div className={styles.title}>
          <h1>Details</h1>
        </div>
      </div>

[{inscriptionDetails.content_type}]
      {inscriptionDetails.content_type === "image/webp" && (
        <img src={contentApiEndpoint} />
      )}

      {inscriptionDetails.content_type  && (
        <textarea>{rawData}</textarea>
      )}

      <div>
        {/* {inscriptionContent?.type === "json" && (
          <textarea>{inscriptionContent.rawData}</textarea>
        )}
        {inscriptionContent?.type === "text" && (
          <textarea>{inscriptionContent.rawData}</textarea>
        )}
        {inscriptionContent?.type === "image" && (
          <img src={contentApiEndpoint} />
        )} */}
      </div>
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
        <input type="text" value={inscriptionDetails?.content_length} />
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
