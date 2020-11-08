const { React, Flux } = require('powercord/webpack');

class SuffixHidden extends React.Component {
  render () {
    return (
      <span className='preview-hider-hidden-suffix' role='note'>
        (hidden)
      </span>
    );
  }
}

module.exports = Flux.connectStores(
  [ powercord.api.settings.store ], () => ({ ...powercord.api.settings._fluxProps(this.entityID) })
)(SuffixHidden);
