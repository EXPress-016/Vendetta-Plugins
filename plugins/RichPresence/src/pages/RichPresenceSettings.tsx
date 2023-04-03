import { NavigationNative, React, ReactNative } from '@vendetta/metro/common';
import { getAssetIDByName } from '@vendetta/ui/assets';
import { Forms } from '@vendetta/ui/components';
import { showToast } from '@vendetta/ui/toasts';
import RichPresence from '..';
import { RPLogger } from '../utils/Logger';
import { defaults, getSettings } from '../utils/Settings';
import RichPresenceSetupPage from './RichPresenceSetupPage';

const { ScrollView } = ReactNative;

const { FormRow, FormSection, FormSwitch, FormInput, FormDivider, FormText } = Forms;

export default () => {
  const navigation = NavigationNative.useNavigation();
  const { get, set } = getSettings();
  const checkIcon = getAssetIDByName('checked');

  return (
    <>
      {/*// @ts-ignore */}
      <ScrollView>
        <FormSection title='Rich Presence Settings' android_noDivider={true}>
          <FormRow
            label='Enable Rich Presence'
            subLabel='Rich presence will be updated when this toggle is turned on or after your Discord client is restarted.'
            trailing={
              <FormSwitch
                value={get('enabled', false)}
                onValueChange={(v) => {
                  if (v && get('mode', 'none') == 'none') {
                    showToast(
                      'Please select a mode before enabling rich presence.',
                      getAssetIDByName('Small')
                    );
                    return;
                  }

                  set('enabled', v);
                  RichPresence.init()
                    .then(() => {
                      showToast(
                        `Rich presence ${v ? 'enabled' : 'disabled'}.`,
                        null
                      );
                    })
                    .catch((e) => {
                      showToast(
                        `Failed to ${v ? 'enable' : 'disable'} rich presence.`,
                        getAssetIDByName('Small')
                      );
                      RPLogger.error(e);
                    });
                }}
              />
            }
          />
          <FormRow
            label='Force update rich presence'
            subLabel='Use this to apply changes to your rich presence settings.'
            trailing={FormRow.Arrow}
            disabled={!get('enabled', false)}
            onPress={() => {
              RichPresence.init()
                .then(() => {
                  showToast('Rich presence updated.', null);
                })
                .catch((e) => {
                  showToast(
                    'Failed to update rich presence.',
                    getAssetIDByName('Small')
                  );
                  RPLogger.error(e);
                });
            }}
          />
        </FormSection>
        <FormSection title='Mode'>
          <FormRow
            label='Custom settings'
            subLabel='Set the rich presence according to your own settings.'
            trailing={
              get('mode', 'none') === 'custom' ? (
                <FormRow.Icon source={checkIcon} color='#5865F2' />
              ) : undefined
            }
            onPress={() => {
              set('mode', 'custom');
              RichPresence.init()
                .then(() => {
                  showToast('Rich presence updated to mode custom.', null);
                })
                .catch((e) => {
                  showToast(
                    'Failed to update rich presence.',
                    getAssetIDByName('Small')
                  );
                  RPLogger.error(e);
                });
            }}
          />
          <FormRow
            label='Websocket'
            subLabel='Set the rich presence using websocket.'
            trailing={
              get('mode', 'none') === 'ws' ? (
                <FormRow.Icon source={checkIcon} color='#5865F2' />
              ) : undefined
            }
            onPress={() => {
              set('mode', 'ws');
              RichPresence.init()
                .then(() => {
                  showToast('Rich presence updated to mode websocket.', null);
                })
                .catch((e) => {
                  showToast(
                    'Failed to update rich presence (websocket).',
                    getAssetIDByName('Small')
                  );
                  RPLogger.error(e);
                });
            }}
          />
        </FormSection>
        <FormSection title='Configurations'>
          <FormInput
            title='Discord Application ID [optional]'
            value={get('appID')}
            placeholder={defaults.discord_application_id}
            onChange={(v) => set('appID', v)}
          />
          <FormDivider />
          <FormRow
            label='Configure custom rich presence'
            subLabel='Show how cool you are to your friends by manually customizing your rich presence.'
            trailing={FormRow.Arrow}
            onPress={() =>
              navigation.push('VendettaCustomPage', {
                title: 'Rich Presence Setup',
                render: () => RichPresenceSetupPage(),
              })
            }
          />
        </FormSection>
      </ScrollView>
    </>
  );
};
