import { findByProps } from '@vendetta/metro';
import { instead } from '@vendetta/patcher';

class ClientThemesSpoof {
  unpatch: () => boolean;
  public onLoad() {
    let prop = 'canUseClientThemes';
    instead(prop, findByProps(prop), () => true);
  }
  public onUnload() {
    this.unpatch();
  }
}

export default new ClientThemesSpoof();
