import { getAddress } from "@/app/actions/address";
import AddressInputs from "@/components/home/AddressInputs";

export default async function AddressPage() {
  const address = await getAddress();

  return <AddressInputs address={address} />;
}
