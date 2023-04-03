import { Activity } from '../types/Activity';
import { RPLogger } from '../utils/Logger';
import RPCClient from "./RPCClient";

export default class RPWebSocket extends WebSocket {
    rpcClient: RPCClient;

    constructor(port: number, rpcClient: RPCClient) {
        super(`wss://localhost.direct:${port}`)
        this.rpcClient = rpcClient;
        this.addEventListener('open', this.onopen)
        this.addEventListener('message', this.onmessage)
        this.addEventListener('close', this.onclose)
        this.addEventListener('error', this.onerror)
    }

    onopen: (event: Event) => void = (event) => {
        RPLogger.info(`[OPEN] Connected to websocket: ${this.url}`);
    }
    onmessage: (event: MessageEvent) => void = async (event) => {
        if ((event.data as string).includes("[READY] Websocket is ready to send rpc")) {
            this.send("[READY] Websocket is ready to receive rpc");
            return
        }

        if ((event.data as string).includes("[INFO] Stop showing")) {
            await this.rpcClient.clearRPC()
            return
        }

        RPLogger.info(`[MESSAGE] Data received from websocket: ${event.data}`);
        
        if (!(event.data as string).startsWith("{")) return
        const response = JSON.parse(event.data);
        const converted = this.convert(response)
        const request = await this.rpcClient.sendRPC(converted)
        RPLogger.info('[INFO] Sent RPC Data', request)

    }
    onclose: (event: CloseEvent) => void = (event) => {
        if (event.wasClean) {
            RPLogger.info(`[CLOSE] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            RPLogger.warn(`[CLOSE] Connection died`);
        }
        this.rpcClient.clearRPC()
    }
    onerror: (event: Event) => void = (event) => {
        RPLogger.error(`[ERROR] ${(event as ErrorEvent).message}`)
    }

    convert: (JSON: any) => Activity = (JSON) => {
        const activity = JSON.d.activities[0]
        const buttons: Array<{
            label: string;
            url: string;
        }> = []
        if (activity?.buttons?.length) {
            activity.buttons.forEach((x: string, i: number) => {
                buttons.push({
                    label: x ?? null,
                    url: activity.metadata.button_urls[i] ?? null
                })
            })
        
        }

        const assets: {
            large_image?: string;
            large_text?: string;
            small_image?: string;
            small_text?: string;
        } = activity.assets ?? null

        if (assets) {
            if (assets.large_image) assets.large_image = this.replaceHostname(assets.large_image);
            if (assets.small_image) assets.small_image = this.replaceHostname(assets.small_image);
        }

        return {
            name: activity.name ?? undefined,
            type: activity.type as number ?? undefined,
            state: activity.state ?? undefined,
            details: activity.details ?? undefined,
            timestamps: activity.timestamps ?? undefined,
            assets: assets ?? undefined,
            buttons: buttons ?? undefined,

        } as Activity
    }

    private replaceHostname(url: string) { 
        return url.replace(/^(mp:)?(https?:\/\/)?([^\/]+\.)?discordapp\.(com|net)\/(.*)$/i, 'https://dcp.developerland.ml?url=https://cdn.discordapp.com/$5')
        .replace(/^(mp:)(attachments\/.*)$/i, 'https://dcp.developerland.ml?url=https://cdn.discordapp.com/$2')
    }

}
