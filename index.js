const { Plugin } = require('powercord/entities');
const { getModule, React } = require('powercord/webpack')
const { inject, uninject } = require('powercord/injector')
const Button = require("./Button");

module.exports = class PreviewHider extends Plugin {
    async startPlugin() {
        this.loadStylesheet("style.scss");

        const MiniPopover = await getModule(m => m.default && m.default.displayName === 'MiniPopover');
        const oldDefault = MiniPopover.default;

        inject('preview-hider', MiniPopover, 'default', (args, res) => {
            const attachments = res.props.children[0].props.message.attachments
            const embeds = res.props.children[0].props.message.embeds

            if (attachments.length == 0 && embeds.length == 0) {
                return res
            }

            res.props.children.unshift(React.createElement(Button, { res }));

            return res;
        });
        Object.assign(MiniPopover.default, oldDefault);
    }

    pluginWillUnload() {
        uninject('preview-hider')
    }
}