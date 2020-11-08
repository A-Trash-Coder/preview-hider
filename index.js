const { Plugin } = require('powercord/entities');
const { React, FluxDispatcher, getModule } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const { findInTree, findInReactTree } = require('powercord/util');

const TogglePreviews = require('./components/TogglePreviews');
const SuffixHidden = require('./components/SuffixHidden');

module.exports = class PreviewHider extends Plugin {
  get hiddenPreviews () {
    return this.settings.get('hiddenPreviews', []);
  }

  set hiddenPreviews (value = []) {
    return this.settings.set('hiddenPreviews', value);
  }

  async startPlugin () {
    this.loadStylesheet('style.css');

    const Message = await getModule(m => m.default?.displayName === 'Message');
    inject('preview-hider-message', Message, 'default', (_, res) => {
      const messageContent = findInReactTree(res, n => n?.content && n?.message);

      if (messageContent && this.hiddenPreviews.includes(messageContent.message.id)) {
        res.props.children.props.className += ' preview-hider-hidden';
        messageContent.content.push(React.createElement(SuffixHidden, { entityID: this.entityID }));
      }

      return res;
    });

    Message.default.displayName = 'Message';

    const MiniPopover = await getModule(m => m.default?.displayName === 'MiniPopover');
    inject('preview-hider-button', MiniPopover, 'default', (_, res) => {
      const message = findInTree(res, n => n?.id && n?.author, { walkable: [ 'props', 'children', 'message' ] });
      if (message && message.attachments.length === 0 && message.embeds.length === 0) {
        return res;
      }

      res.props.children.unshift(
        React.createElement(TogglePreviews, {
          message,
          settings: this.settings,
          onToggle: () => this.forceUpdateMessage(message)
        })
      );

      return res;
    });

    MiniPopover.default.displayName = 'MiniPopover';

    FluxDispatcher.subscribe('MESSAGE_DELETE', this.purgeStaleMessageIds.bind(this));
  }

  pluginWillUnload () {
    FluxDispatcher.unsubscribe('MESSAGE_DELETE', this.purgeStaleMessageIds.bind(this));

    uninject('preview-hider-message');
    uninject('preview-hider-button');
  }

  purgeStaleMessageIds (data) {
    if (this.hiddenPreviews.includes(data.id)) {
      this.hiddenPreviews = this.hiddenPreviews.filter(id => id !== data.id);
    }
  }

  forceUpdateMessage (message) {
    const messageStore = getModule([ 'initialize', 'getMessage' ], false);

    FluxDispatcher.dispatch({
      type: 'MESSAGE_UPDATE',
      message: messageStore.getRawMessages(message.channel_id)[message.id]
    });
  }
};
