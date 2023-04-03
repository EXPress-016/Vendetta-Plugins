import { React } from "@vendetta/metro/common";
import RichPresence from "..";

const settingsInstance = () => RichPresence.storage;

export const defaults = {
    discord_application_id: "1054951789318909972",
};

export const settings = {
    get enabled() { return settingsInstance()["enabled"] ?? false },
    get mode() { return settingsInstance()["mode"] ?? "none" },
    get applicationId() { return settingsInstance()["appID"] ?? defaults.discord_application_id },

    custom: {
        get enabled() { return (settingsInstance()['mode'] ?? 'none') === "custom" },
        get(name: string, defaultValue?: any) {
            if (!settingsInstance()['customRpc']) return {}
            return (settingsInstance()["customRpc"] ?? {})[name] || defaultValue;
        }
    },
    ws: {
        get enabled() {
            return (settingsInstance()['mode'] ?? 'none') === "ws"
        },
        get(name: string, defaultValue?: any) {
            return (settingsInstance()['ws'] ?? {})[name] || defaultValue;
        }
    }
}

export const getSettings = (name?: string) => {
    const [, forceUpdate] = React.useReducer(x => x + 1, 0);
    return {
        get(key, defaultValue?) {
            if (name) {
                return (settingsInstance()[name] ?? {})[key] ?? defaultValue;
            }
            return settingsInstance()[key] ?? defaultValue;
        },
        set(key, value) {
            if (name) {
                const obj = settingsInstance()[name] ?? {}
                obj[key] = value.length === 0 ? undefined : value;
                settingsInstance()[name] = obj
            } else {
                settingsInstance()[key] = value
            }
            forceUpdate();
        }
    };
}