import {Input} from "@nextui-org/react";
import {MailIcon} from "lucide-react";
import {LilHeader} from "../components/LilHeader.js";
import {BottomNav} from "../components/BottomNav.js";
import {Container} from "../components/Container.js";
import {useProjectStore} from "../store/store.js";

export default function CreateReceivers (){

	const receivers = useProjectStore((state) => state.draft.receivers);

	return (
		<>
		<div className="flex max-w-sm flex-col gap-8">
			<LilHeader>Modtager</LilHeader>
			<Input
				type="email"
				label="Email"
				placeholder="you@example.com"
				labelPlacement="outside"
				startContent={
					<MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
				}
			/>
		</div>
		<BottomNav disabled={receivers.length > 0} route="/create/overview" title={"Overblik"}/>
		</>
	)
}
