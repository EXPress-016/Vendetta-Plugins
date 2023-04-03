
import { findByProps } from "@vendetta/metro";
import { FluxDispatcher } from "@vendetta/metro/common";
import { Activity, ActivityTypes } from "../types/Activity";
import { settings as RichPresenceSettings } from "../utils/Settings";

const { SET_ACTIVITY } = findByProps('SET_ACTIVITY')
const { handler } = SET_ACTIVITY;

export default class RPCClient {
    private lastActivityType: ActivityTypes = ActivityTypes.GAME;

    private replaceHostname(url: string) { 
        return url.replace(/^(mp:)?(https?:\/\/)?([^\/]+\.)?discordapp\.(com|net)\/(.*)$/i, 'https://dcp.developerland.ml?url=https://cdn.discordapp.com/$5')
        .replace(/^(mp:)(attachments\/.*)$/i, 'https://dcp.developerland.ml?url=https://cdn.discordapp.com/$2')
    }

    public patchFilter(patcher) {
        patcher.before('dispatch', FluxDispatcher, (args) => {
            const { type, activity }: { type: string, activity: Activity } = args[0]
            if (type === "LOCAL_ACTIVITY_UPDATE" && !!activity) {
                activity.type = this.lastActivityType;
                this.lastActivityType = ActivityTypes.GAME;

                if (activity.assets) {
                    // Direct link to Discord's CDN are not accepted for some reason
                    if (activity.assets.large_image)
                        activity.assets.large_image = this.replaceHostname(activity.assets.large_image);
                    if (activity.assets.small_image)
                        activity.assets.small_image = this.replaceHostname(activity.assets.small_image);
                }
            }
        });
    }

    public async sendRPC(activity: Activity): Promise<any> {
        // Remove empty properties/arrays
        Object.keys(activity).forEach((k) => activity[k] === undefined 
                                            || activity[k].length === 0
                                            && delete activity[k]);

        if (activity.assets) {
            Object.keys(activity.assets).forEach((k) => activity.assets![k] === undefined 
                                                        || activity.assets![k].length === 0
                                                        && delete activity.assets![k]);
        }

        this.lastActivityType = activity.type ?? ActivityTypes.GAME;
        return await this.sendRequest(activity);
    }

    private async sendRequest(activity?: Activity): Promise<any> {
        return await handler({
            isSocketConnected: () => true,
            socket: {
                id: 110,
                application: {
                    id: RichPresenceSettings.applicationId,
                    name: activity?.name ?? "RichPresence"
                },
                transport: "ipc"
            },
            args: {
                pid: 110,
                activity: activity ?? null
            }
        });
    }

    public async clearRPC(): Promise<any> {
        this.lastActivityType = ActivityTypes.GAME;
        return await this.sendRequest(undefined);
    }
}
