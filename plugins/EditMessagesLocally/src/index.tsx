import { findByName, findByProps, findByStoreName } from '@vendetta/metro';
import { FluxDispatcher, React } from '@vendetta/metro/common';
import { after, before, instead } from '@vendetta/patcher';
import { getAssetIDByName } from '@vendetta/ui/assets';
import { Forms } from '@vendetta/ui/components';

class EditMessagesLocally {
  static message: any;
  patches: (() => boolean)[] = [];
  public onLoad() {
    const ActionSheet = findByProps('openLazy', 'hideActionSheet');
    const EditManager = findByProps('startEditMessage', 'editMessage');
    const MessageStore = findByStoreName('MessageStore');
    const UserStore = findByStoreName('UserStore');
    const { FormRow } = Forms;
    const Icon = findByName('Icon');

    this.patches.push(before('openLazy', ActionSheet, (ctx) => {
      const [component, args, actionMessage] = ctx;
      if (args == 'MessageLongPressActionSheet')
        component.then((instance) => {
          const unpatch = after('default', instance, (_, component: any) => {
            const [msgProps, oldbuttons] =
              component.props?.children?.props?.children?.props?.children;
            if (!msgProps) EditMessagesLocally.message = actionMessage.message;
            else EditMessagesLocally.message = msgProps.props.message;
            if (
              oldbuttons &&
              EditMessagesLocally.message.author.id !==
                UserStore.getCurrentUser().id
            ) {
              const MarkUnreadIndex = oldbuttons.findIndex(
                (a: { props: { message: string } }) =>
                  a.props.message == 'Reply'
              );
              const ReplyButton = oldbuttons[MarkUnreadIndex];
              oldbuttons[MarkUnreadIndex] = (
                <FormRow
                  label='Edit Message Locally'
                  leading={<Icon source={getAssetIDByName('ic_message_edit')} />}
                  onPress={() => {
                    ActionSheet.hideActionSheet();
                    EditManager.startEditMessage(
                      EditMessagesLocally.message.channel_id,
                      EditMessagesLocally.message.id,
                      EditMessagesLocally.message.content
                    );
                  }}
                />
              );
              component.props.children.props.children.props.children[1] = [
                ReplyButton,
                ...oldbuttons,
              ];
            }
            unpatch();
          });
        });
  }));

    this.patches.push(
      instead('editMessage', EditManager, (args, origFunc) => {
        let message = MessageStore.getMessage(args[0], args[1]);
        if (message?.author?.id === UserStore.getCurrentUser().id) {
          origFunc(...args);
          return;
        }

        FluxDispatcher.dispatch({
          type: 'MESSAGE_UPDATE',
          message: {
            channel_id: message.channel_id,
            id: message.id,
            content: args[2].content,
          },
        });
      })
    );
  }

  public onUnload() {
    this.patches.forEach((unpatch) => unpatch());
  }
}

export default new EditMessagesLocally();