async function getInscriptionDetails(
  bitcoinAddress: string,
  inscriptionId: string
) {
  const apiEndpoint = `https://api-3.xverse.app/v1/address/${bitcoinAddress}/ordinals/inscriptions/${inscriptionId}`;
  const res = await fetch(apiEndpoint);
  return res.json();
}

interface InscriptionContent {
  type: 'image' | 'json' | 'text';
  rawData: any;
}

async function getInscriptionContent(inscriptionId: string): Promise<InscriptionContent> {
  const apiEndpoint = `https://ord.xverse.app/content/${inscriptionId}`;
  const res = await fetch(apiEndpoint);

  const buffer = await res.arrayBuffer();
        
  // Try to decode as an image
  const imageTypes = ['image/jpeg', 'image/gif'];
  let isImage = false;
  let imageUrl = '';
  
  for (let imageType of imageTypes) {
    try {
      const blob = new Blob([buffer], { type: imageType });
      imageUrl = URL.createObjectURL(blob);
      const img = new Image();
      img.src = imageUrl;
      await img.decode();
      isImage = true;
      break;
    } catch (e) {
      // Failed to decode as image, try the next type
    }
  }

  if (isImage) {
    return {
      type: 'image',
      rawData: imageUrl
    }
    
  } else {
    // Try to decode as JSON
    const text = new TextDecoder().decode(buffer);
    try {
      const json = JSON.parse(text);
      return {
        type: 'json',
        rawData: JSON.stringify(json, null, 2)
      }
       
    } catch (e) {
      // Not JSON, treat as plain text
      //setContent(text);
      return {
        type: 'json',
        rawData: text
      }
    }
  }
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
  const inscriptionContent = await getInscriptionContent(inscriptionId);
  console.log(inscriptionContent);

  return <div>
    <div>{JSON.stringify(inscriptionContent)}</div>
    {inscriptionDetails?.address}</div>;
}
