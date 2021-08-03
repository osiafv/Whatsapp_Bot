import { proto, WAMessage } from "@adiwajshing/baileys"

export declare class Validasi {
	from: string | null | undefined;
	message: proto.IFutureProofMessage | undefined
	isGroupMsg: boolean | undefined;
	type: string;
	quotedType: string[] | null;
	typeQuoted: string;
	quotedMsg: proto.IContextInfo | null | undefined;
	bodyQuoted: string | null | undefined;
	bodyButton: string | null | undefined;
	body: string | null | undefined;
	media: WAMessage | null;
	sender: string | null | undefined;
	Filesize: number | Long | undefined | null;
	FileSha: string | null | undefined
	Command: string
	mentioned: string[] | undefined
}