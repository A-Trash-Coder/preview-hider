const { React, getModule } = require('powercord/webpack');
const { Tooltip, Icon } = require('powercord/components');

const MiniPopover = getModule([ 'Button', 'Separator' ], false);

class TogglePreviews extends React.PureComponent {
  constructor (props) {
    super(props);

    const get = (key, value) => props.settings.get(key, value);

    this.settings = props.settings;
    this.state = {
      hidden: get('hiddenPreviews').includes(this.props.message.id)
    };
  }

  handleHidePreviews () {
    const { get, set } = this.settings;
    const { message } = this.props;

    const hiddenPreviews = get('hiddenPreviews', []);
    if (hiddenPreviews.includes(message.id)) {
      hiddenPreviews.splice(hiddenPreviews.indexOf(message.id), 1);
    } else {
      hiddenPreviews.push(message.id);
    }

    set('hiddenPreviews', hiddenPreviews);

    this.props.onToggle();
    this.setState({ hidden: !this.state.hidden });
  }

  render () {
    const previewLabel = this.props.message.embeds.length > 1 || this.props.message.attachments.length > 1 ? 'Previews' : 'Preview';

    return (
      <Tooltip text={`${this.state.hidden ? 'Show' : 'Hide'} ${previewLabel}`}>
        <MiniPopover.Button
          className='preview-hider-button'
          onClick={this.handleHidePreviews.bind(this)}
        >
          <Icon name={this.state.hidden ? 'Eye' : 'EyeHidden'} width={20} height={20} />
        </MiniPopover.Button>
      </Tooltip>
    );
  }
}

module.exports = TogglePreviews;
