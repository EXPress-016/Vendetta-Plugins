import { findByProps } from '@vendetta/metro';
import { instead } from '@vendetta/patcher';

class NS4NQN {
  patches: (() => boolean)[] = [];
  public onLoad() {
    let props = ['canUseEmojisEverywhere', 'canUseAnimatedEmojis'];
    let Usability = findByProps(...props);
    props.forEach((prop) => {
      this.patches.push(instead(prop, Usability, () => true));
    });
  }
  public onUnload() {
    this.patches.forEach((unpatch) => unpatch());
  }
}

export default new NS4NQN();
