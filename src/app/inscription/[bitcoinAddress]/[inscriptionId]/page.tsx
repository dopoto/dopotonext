 
async function getInscriptionDetails2(bitcoinAddress: string, inscriptionId:string) {
  const apiEndpoint = `https://api-3.xverse.app/v1/address/${bitcoinAddress}/ordinals/inscriptions/${inscriptionId}`;
  const res = await fetch(apiEndpoint)
  return res.json()
}

interface Props {
  params: {
    bitcoinAddress: string;
    inscriptionId: string;
  };
}
 
export default async function InscriptionDetailsPage ({params}: Props) {
  const { bitcoinAddress, inscriptionId } = params;

  const inscription = await getInscriptionDetails2(bitcoinAddress, inscriptionId);
  console.log(inscription)

  return <div>{inscription?.address}</div>;
};

 