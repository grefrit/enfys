import { useState } from "react";
import { useRouter } from "next/router";
import useRoom, { Room } from "hooks/useRoom";
import OTPInput from "components/OTPInput";
import Button from "components/Button";
import Wrapper from "components/Wrapper";
import Input from "components/Input";
import fetcher from "lib/fetcher";

function NameForm({ room, onReset }: { room?: Room; onReset: () => void }) {
	const router = useRouter();
	const [name, setName] = useState(localStorage.username || "");

	function handleJoin() {
		localStorage.username = name;

		if (room?.code) router.push(`/room/${room.code}`);
		else
			fetcher("/room/create", { method: "POST" }).then(({ code }) =>
				router.push(`/room/${code}`)
			);
	}

	return (
		<Wrapper
			title={room?.title || "Create new room"}
			action={<Button onClick={onReset}>Join another room</Button>}
		>
			<Input
				value={name}
				onChange={(e) => setName(e.target.value.trimStart())}
				maxLength={32}
				placeholder="Enter your name / nickname"
			/>
			<Button onClick={handleJoin} disabled={!name}>
				Join room
			</Button>
		</Wrapper>
	);
}

export default function JoinRoom() {
	const [code, setCode] = useState("");
	const { room, isValidating } = useRoom(code);

	return room || code === null ? (
		<NameForm room={room} onReset={() => setCode("")} />
	) : (
		<Wrapper
			title="Join room"
			action={
				<Button disabled={isValidating} onClick={() => setCode(null)}>
					or create new
				</Button>
			}
		>
			<OTPInput disabled={isValidating} value={code} onChange={setCode} length={6} />
		</Wrapper>
	);
}