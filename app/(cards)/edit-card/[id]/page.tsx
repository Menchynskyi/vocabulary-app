import { getWordById } from "@/server/notion/queries";
import { EditCardForm } from "../../_components/EditCardForm";

export default async function EditCard({ params }: { params: { id: string } }) {
  const word = await getWordById(params.id);

  return <EditCardForm wordData={word} />;
}
