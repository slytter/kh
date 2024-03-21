import {DragDropContext, Draggable, Droppable} from "@hello-pangea/dnd";
import {Photo, useProjectStore} from "~/store/store";
import dayjs from "dayjs";
import {DragHandleHorizontalIcon} from "@radix-ui/react-icons";
import {LilHeader} from "~/components/LilHeader";
import {BottomNav} from "~/components/BottomNav";
// import {PhotoSlider} from "~/components/PhotoSlider";

const reorder = (photos: Photo[], startIndex: number, endIndex: number) => {
  const result = Array.from(photos);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};



function Quote({ photo, index, numPhotos, onClick }: { photo: Photo; index: number, numPhotos: number, onClick: (id: string) => void }) {

  return (
      <Draggable draggableId={photo.id} index={index}>
        {(provided, snapshot) => (
            <div className={`bg-white p-2 mb-2 rounded-xl shadow-${snapshot.isDragging ? 'lg' :'sm'} transition-shadow border transition-height ${snapshot.isDropAnimating ? 'h-10' : ''} overflow-hidden` }
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
            >
              <button
                type={"button"}
                className={"flex flex-row items-center w-full"}
                onClick={() => alert('open ' + photo.id)}
              >
                <img
                    className={"h-16 w-16 object-cover rounded-md shadow-sm"}
                    src={`${photo.url}/-/preview/-/resize/x200/`}
                    alt={photo.id}
                />

                <div className={"flex flex-1 flex-row justify-between items-center"}>
                  <div className={"ml-2"}>
                    <p className={'text-xs'}>
                      Billede {index + 1} af {numPhotos}
                    </p>
                    <p className={'text-sm'}>Sendes {dayjs(photo.send_at).format("D. MMM YY")}</p>
                  </div>
                  <DragHandleHorizontalIcon
                    className={"w-7 h-7 text-default-400 cursor-move"}
                  />
                </div>

              </button>

            </div>
        )}
      </Draggable>
  );
}



const PhotoList = ((props: { photos: Photo[], onClick: (id: string) => void }) => {
  const photos = props.photos;
  const onClick = props.onClick;


  return photos.map((photo: Photo, index: number) => (
      <Quote photo={photo} index={index} key={photo.id} numPhotos={photos.length} onClick={onClick} />
  ));
});

export default function CreateOverview() {

  const photos = useProjectStore((state) => state.draft.photos);
  const setDraftPhotos = useProjectStore((state) => state.setDraftPhotos);

  function onDragEnd(result : { destination: { index: number; }; source: { index: number; }, }) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const quotes = reorder(
        photos,
        result.source.index,
        result.destination.index
    );

    setDraftPhotos(quotes);
  }


  return (<div className={'flex flex-1 flex-col flex-shrink-0'}>
    <LilHeader>Overblik</LilHeader>
    <p className={"text-default-500 text-sm px-2 mb-2"}>Her kan du se og redigere dine fotos</p>
    {/*<PhotoSlider/>*/}
    <DragDropContext
        className={"flex flex-shrink-0 flex-col gap-4"}
        onDragEnd={onDragEnd}
        onDragStart={ () => {
          console.log('dragging')
          if (window.navigator.vibrate) {
            window.navigator.vibrate(100)
          }
        }// good times
      }
    >
      <Droppable droppableId="list" >
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <PhotoList photos={photos} onClick={(id) => alert('open '  +id)}/>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
    <BottomNav route="/create/overview" title={"Overblik"}/>
    </div>
  );
}
