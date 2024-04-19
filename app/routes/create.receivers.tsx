import { Input, Switch } from "@nextui-org/react";
import { ListChecks, MailIcon, TrashIcon } from "lucide-react";
import { LilHeader } from "../components/LilHeader.js";
import { BottomNav } from "../components/BottomNav";
import { useProjectStore } from "../store/store.js";
import { useState } from "react";

const emailValid = (value: string) =>
  value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

const EmailInput = ({
  value,
  onChange,
  canDelete,
  onDelete,
}: {
  value: string;
  onChange: (value: string) => void;
  onDelete: () => void;
  canDelete: boolean;
}) => {
  const [isInvalid, setIsInvalid] = useState(false);

  return (
    <Input
      type="email"
      className="max-w-sm"
      isInvalid={isInvalid}
      color={isInvalid ? "danger" : "default"}
      errorMessage={isInvalid && "Please enter a valid email"}
      onValueChange={onChange}
      value={value}
      onBlur={() => {
        setIsInvalid(!emailValid(value));
      }}
      onChange={() => {
        if (isInvalid) {
          setIsInvalid(false);
        }
      }}
      placeholder="you@example.com"
      startContent={
        <MailIcon className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
      }
      endContent={
        canDelete ? (
          <button
            className="focus:outline-none"
            type="button"
            onClick={onDelete}
          >
            <TrashIcon className="text-md pointer-events-none flex-shrink-0 text-default-400" />
          </button>
        ) : null
      }
    />
  );
};

export default function CreateReceivers() {
  const receivers = useProjectStore((state) => state.draftProject.receivers);
  const setReceivers = useProjectStore((state) => state.setReceivers);
  const selfReceive = useProjectStore(
    (state) => state.draftProject.self_receive,
  );
  const setSelfReceive = useProjectStore((state) => state.setSelfReceive);

  const setReceiver = (index: number, value: string) => {
    const newReceivers = [...receivers];
    newReceivers[index] = value;
    setReceivers(newReceivers);
  };

  const addReceiver = () => {
    setReceivers([...receivers, ""]);
  };

  const removeReceiver = (index: number) => {
    const newReceivers = [...receivers];
    newReceivers.splice(index, 1);
    setReceivers(newReceivers);
  };

  const hasInvalidEmail = receivers.some((email) => !emailValid(email));

  return (
    <div className={"flex min-h-dvh flex-col justify-between"}>
      <div>
        <LilHeader>Modtager{receivers.length > 1 ? "e" : ""}</LilHeader>
        <p className={"mb-2 px-2 text-sm text-default-500"}>
          Indtast de email adresser som du vil sende fotos til
        </p>

        <div className="flex flex-col gap-4">
          {receivers.map((receiver, i) => (
            <EmailInput
              canDelete={receivers.length > 1}
              onDelete={() => removeReceiver(i)}
              key={i}
              value={receiver}
              onChange={(value) => setReceiver(i, value)}
            />
          ))}
        </div>

        <button onClick={addReceiver} className="p-4 text-primary-500">
          Tilføj modtager
        </button>
        <div className="gap- flex items-center">
          <Switch
            isSelected={selfReceive}
            onValueChange={setSelfReceive}
            className=""
            color="primary"
            name={"Send til mig selv"}
          />
          <p className="text-default-500">Send en kopi til mig selv</p>
        </div>
      </div>
      <BottomNav
        disabled={hasInvalidEmail}
        disabledReason={"Indtast venligst en gyldig email"}
        route="/create/overview"
        title={"Overblik"}
        startContent={<ListChecks />}
      />
    </div>
  );
}
