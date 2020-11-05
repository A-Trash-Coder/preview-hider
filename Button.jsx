const { React } = require("powercord/webpack");
const { Clickable } = require("powercord/components");

class DownloadButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isHidden: document.getElementById("chat-messages-" + this.props.res.props.children[1].props.message.id).classList.contains('hidden-w2eshj')
        };
    }

    toggleHidden() {
    this.setState({ isHidden: !this.state.isHidden });
    }

    render() {
        return (
            <div className={["PreviewHider"]}>
                <Clickable onClick={() => {
                    const ele = document.getElementById("chat-messages-" + this.props.res.props.children[1].props.message.id)
                    if (this.state.isHidden) {
                        ele.classList.remove('hidden-w2eshj')
                    } else {
                        ele.classList.add('hidden-w2eshj')
                    }
                    this.toggleHidden()}}>
                    {this.state.isHidden ? 'Un-Hide Previews' : 'Hide Previews'}
                </Clickable>
            </div>
        );
    }
}

module.exports = DownloadButton;