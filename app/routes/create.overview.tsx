import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Photo, useProjectStore } from "~/store/store";
import { LilHeader } from "~/components/LilHeader";
import { BottomNav } from "~/components/BottomNav";
import { PhotoSlider } from "~/components/PhotoSlider";
import { useState } from "react";
import { Form } from "@remix-run/react";
import { PhotoDragList } from "~/components/planning/PhotoDragList";
import { createSupabaseServerClient } from "~/utils/supabase.server";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { DragAndDropPhotos } from "~/components/DragAndDropPhotos";

export const action = async ({ request }: ActionFunctionArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });

  const { message } = Object.fromEntries(await request.formData());

  await supabase.from("messages").insert({ content: String(message) });

  return json(null, { headers: response.headers });
};

export default function CreateOverview() {
  const photos = useProjectStore((state) => state.draft.photos);
  const setDraftPhotos = useProjectStore((state) => state.setDraftPhotos);

  return (
    <Form>
      <div className={"flex flex-1 flex-shrink-0 flex-col"}>
        <LilHeader>Overblik</LilHeader>
        <p className={"text-default-500 mb-2 px-2 text-sm"}>
          Her kan du se og sortere dine fotos
        </p>
        <DragAndDropPhotos photos={photos} setPhotos={setDraftPhotos} />
        <BottomNav
          route="/create/overview"
          title={"Overblik"}
          type={"submit"}
        />
      </div>
    </Form>
  );
}
