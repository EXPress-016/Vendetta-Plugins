import { logger, patcher } from '@vendetta';
import { findByStoreName } from '@vendetta/metro';
import { FluxDispatcher } from '@vendetta/metro/common';
import { storage } from '@vendetta/plugin';
import RPCClient from './client/RPCClient';
import RPWebSocket from './client/WebSocketClient';
import RichPresenceSettingsPage from './pages/RichPresenceSettings';
import { ActivityTypes } from './types/Activity';
import { RPLogger, setLogger } from './utils/Logger';
import { settings as RichPresenceSettings } from './utils/Settings';

class RichPresence {
  rpcClient = new RPCClient();
  rpWebSocket?: RPWebSocket;
  storage = storage;
  settings = RichPresenceSettingsPage;
  logger = logger;

  public async init() {
    await this.rpcClient.clearRPC();

    this.rpWebSocket?.close();

    if (!RichPresenceSettings.enabled) {
      return;
    }

    this.logger.info('Starting RPC...');

    switch (RichPresenceSettings.mode) {
      case 'custom':
        const settings = RichPresenceSettings.custom;
        this.logger.info('Starting user-set RPC...');

        const largeImage = settings.get('large_image');
        const smallImage = settings.get('small_image');

        const startTimestamp = settings.get('start_timestamp', -1);
        const endTimestamp = settings.get('end_timestamp');

        const request = await this.rpcClient.sendRPC({
          name: settings.get('app_name', 'Discord'),
          type: ActivityTypes.GAME, // PLAYING
          state: settings.get('state'),
          details: settings.get('details'),
          ...(settings.get('enable_timestamps')
            ? {
                timestamps: {
                  start:
                    Number(startTimestamp) === -1
                      ? (Date.now() / 1000) | 0
                      : Number(startTimestamp),
                  ...(!!endTimestamp && !isNaN(+endTimestamp)
                    ? { end: Number(endTimestamp) }
                    : {}),
                },
              }
            : {}),
          ...(largeImage || smallImage
            ? {
                assets: {
                  large_image: largeImage,
                  large_text: !!largeImage
                    ? settings.get('large_image_text')
                    : undefined,
                  small_image: settings.get('small_image'),
                  small_text: !!largeImage
                    ? settings.get('small_image_text')
                    : undefined,
                },
              }
            : {}),
          buttons: [
            {
              label: settings.get('button1_text'),
              url: settings.get('button1_URL'),
            },
            {
              label: settings.get('button2_text'),
              url: settings.get('button2_URL'),
            },
          ].filter((x) => !!x.label),
        });
        this.logger.info('Started user-set RPC. SET_ACTIVITY: ', request);
        break;
      case 'ws':
        this.logger.info('Starting Websocket RPC...');
        let port = 6463;
        this.createWebsocket(port, this.rpcClient);
        break;
      case 'none':
        const err = "RPC mode is set to none while it's enabled";
        throw new Error(err);
    }
  }

  public onLoad() {
    const init = () =>
      this.init()
        .then(() => {
          this.logger.info('RPC started!');
        })
        .catch((e) => {
          this.logger.error(e);
        });

    setLogger(this.logger);
    //patchUI(this);
    this.rpcClient.patchFilter(patcher);

    const UserStore = findByStoreName('UserStore');

    if (UserStore.getCurrentUser()) {
      init();
    } else {
      FluxDispatcher.subscribe('CONNECTION_OPEN', init);
    }
  }
  public onUnload() {
    this.rpWebSocket?.close();
    this.rpcClient.clearRPC();
  }

  private async createWebsocket(port: number, rpcClient: RPCClient) {
    this.rpWebSocket = new RPWebSocket(port, rpcClient);
    this.rpWebSocket.onerror = () => {
      if (port > 6472) return;
      this.createWebsocket(port + 1, rpcClient);
      RPLogger.info(`Trying with port: ${port}`);
    };
  }
}

export default new RichPresence();
