import {Outlet} from "@remix-run/react";
import { Container } from "../components/Container.js";

export default function Create () {
	return (
		<Container>
			<div className="flex max-w-sm flex-col gap-8">
				<Outlet />
			</div>
		</Container>
	)
}
