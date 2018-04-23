import React from 'react';
import ReactPlayer from 'react-player'
import './CustomizedPlayer.css';
//import 'bootstrap/dist/css/bootstrap.css';

class CustomizedPlayer extends React.Component {
	constructor(props) {
		super(props);
		this.handleProgress = this._handleProgress.bind(this);
		this.handleDuration = this._handleDuration.bind(this);
		this.handleEnded = this._handleEnded.bind(this);
		this.handleRef = this._handleRef.bind(this);
	}

	_handleProgress(state) {
    this.props.onVideoProgress(state);
  }
	_handleDuration(state) {
    this.props.onVideoDuration(state);
  }
	_handleEnded (state) {
    this.props.onVideoEnded(state);
  }
	_handleRef (player) {
    this.props.onPlayerRef(player);
  }

	render() {
		const {playing, height, width} = this.props
		const styles = { height: height, width: width }
		return(
						<div className='player-wrapper' style={styles}>
							<ReactPlayer url='https://www.youtube.com/watch?v=f0UGnI5N8lg'
													 ref={this.handleRef}
													 onProgress={this.handleProgress}
	 											 	 onDuration={this.handleDuration}
													 onEnded ={this.handleEnded }
													 playing = {playing}
													 className='customized-player'
													 progressInterval={100}
													 muted={true}
													 width='100%'
	          							 height='100%' />
						</div>
					);
	}
}
export default CustomizedPlayer;
