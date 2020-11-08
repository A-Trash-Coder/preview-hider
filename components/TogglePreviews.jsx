const { React, getModule } = require('powercord/webpack');
const { Tooltip, Icon } = require('powercord/components');

const MiniPopover = getModule([ 'Button', 'Separator' ], false);

class TogglePreviews extends React.Component {
  constructor (props) {
    super(props);

    const get = (key, value) => props.settings.get(key, value);

    this.settings = props.settings;
    this.state = {
      isHidden: get('hiddenPreviews').includes(this.props.message.id)
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
    this.setState({ isHidden: !this.state.isHidden });
  }

  render () {
    return (
      <Tooltip text={`${this.state.isHidden ? 'Show' : 'Hide'} Previews`}>
        <MiniPopover.Button
          className='preview-hider-button'
          onClick={this.handleHidePreviews.bind(this)}
        >
          <Icon name={this.state.isHidden ? 'Eye' : 'EyeHidden'} width={20} height={20} />
        </MiniPopover.Button>
      </Tooltip>
    );
  }
}

module.exports = TogglePreviews;
