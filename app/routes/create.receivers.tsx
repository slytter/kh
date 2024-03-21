import {Input, Switch} from "@nextui-org/react";
import {MailIcon, TrashIcon} from "lucide-react";
import {LilHeader} from "../components/LilHeader.js";
import {BottomNav} from "../components/BottomNav.js";
import {useProjectStore} from "../store/store.js";
import {useState} from "react";

const emailValid = (value: string) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

const EmailInput = ({value, onChange, canDelete, onDelete} : {
	value: string;
	onChange: (value: string) => void;
	onDelete: () => void;
	canDelete: boolean;
}) => {

	const [isInvalid, setIsInvalid] = useState(false)

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
				<MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0"/>
			}
            endContent={ canDelete ? <button className="focus:outline-none" type="button" onClick={onDelete}>
				<TrashIcon className="text-md text-default-400 pointer-events-none flex-shrink-0"/>
			</button> : null
			}
		/>
	)
}


export default function CreateReceivers() {

	const receivers = useProjectStore((state) => state.draft.receivers);
	const setReceivers = useProjectStore((state) => state.setReceivers);
	const selfReceive = useProjectStore((state) => state.draft.selfReceive);
	const setSelfReceive = useProjectStore((state) => state.setSelfReceive);

	const setReceiver = (index: number, value: string) => {
		const newReceivers = [...receivers];
		newReceivers[index] = value;
		setReceivers(newReceivers);
	}

	const addReceiver = () => {
		setReceivers([...receivers, ""]);
	}

	const removeReceiver = (index: number) => {
		const newReceivers = [...receivers];
		newReceivers.splice(index, 1);
		setReceivers(newReceivers);
	}

	const hasInvalidEmail = receivers.some((email) => !emailValid(email));



	return (
		<div className={"min-h-dvh flex flex-col justify-between"}>
			<div>
				<LilHeader>Modtager{receivers.length > 1 ? "e" : ""}</LilHeader>
				<p className={"text-default-500 text-sm px-2 mb-2"}>Indtast de email adresser som du vil sende fotos til</p>
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

				<button onClick={addReceiver} className="text-primary-500 p-4">Tilføj modtager</button>
				<div className="flex items-center gap-">
					<Switch isSelected={selfReceive} onValueChange={setSelfReceive}
						className="" color="primary" name={'Send til mig selv'}/>
					<p className="text-default-500">Send en kopi til mig selv</p>
				</div>

			</div>
			<BottomNav disabled={hasInvalidEmail} route="/create/overview" title={"Overblik"}/>
		</div>
	)
}
