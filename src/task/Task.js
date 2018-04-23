import React, { Component } from 'react';
import CustomizedPlayer from '../customized-player/CustomizedPlayer';
import Canvas from '../canvas/Canvas';
//import EventTimeList from '../event-time-list/EventTimeList';
import Duration from '../duration/Duration'
import './Task.css'
import './Range.css'
//import './Range.css'

//import Measure from 'react-measure'

import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col, Button} from 'reactstrap';




class Task extends Component {

		constructor(props) {
			super(props);
			this.state = {}
		}
		/* video player */
		handlePlayerRef = player => {
			this.props.onTaskPlayerRef(player)
		}
		handleVideoDuration = state => {
	    this.props.onTaskVideoDuration(state);
	  }
		handleVideoProgress = state => {
	    this.props.onTaskVideoProgress(state);
	  }
		handleVideoEnded = () => {
	    this.props.onTaskVideoEnded();
	  }
		handleVideoSeekMouseDown = e => {
			this.props.onTaskVideoSeekMouseDown(e);
	  }
	  handleVideoSeekChange = e => {
	    this.props.onTaskVideoSeekChange(e);
	  }
	  handleVideoSeekMouseUp = e => {
			this.props.onTaskVideoSeekMouseUp(e);
	  }
		handleVideoPlayPause = () => {
			this.props.onTaskVideoPlayPause();
		}
		/* canvas */
		handleAddObject = () => {
			this.props.onTaskAddObject();
		}
		handleCanvasStageMouseMove = e => {
			this.props.onTaskCanvasStageMouseMove(e);
		}
		handleCanvasStageMouseDown = e => {
			this.props.onTaskCanvasStageMouseDown(e);
		}
		handleCanvasStageMouseUp = e => {
			this.props.onTaskCanvasStageMouseUp(e);
		}
		handleCanvasGroupMouseDown = e => {
			this.props.onTaskCanvasGroupMouseDown(e);
		}
		handleCanvasGroupDragStart = e => {
			this.props.onTaskCanvasGroupDragStart(e);
		}
		handleCanvasGroupDragEnd = e => {
			this.props.onTaskCanvasGroupDragEnd(e);
		}
		handleCanvasGroupRef = r => {
			this.props.onTaskCanvasGroupRef(r);
		}

		/*
		_handleEventTimeDelete (id) {
	    this.props.onTaskEventTimeDelete(id);
	  }
		_handleEventTimeAdd(){
			this.props.onTaskEventTimeAdd();
		}
		_handleEventTimeInputChange(e){
			this.props.onTaskEventTimeInputChange(e);
		}*/

		/*
		handleVideoSetTimeMouseDown = e => {
			this.props.onTaskVideoSetTimeMouseDown(e);
	  }
		handleVideoSetTimeChange = e => {
			this.props.onTaskVideoSetTimeChange(e);
	  }
		handleVideoSetTimeMouseUp = e => {
			this.props.onTaskVideoSetTimeMouseUp(e);
	  }
		*/



	  render() {
			const {width, height, playing, played, duration, adding, cursor, objects} = this.props;

	    return (
				<Container>
					<Row className="pt-3">
	          <Col>
							<div className="player-canvas-wraper">
								<CustomizedPlayer width={width}
																	height={height}
																	playing={playing}
																	onPlayerRef = {this.handlePlayerRef}
																	onVideoDuration={this.handleVideoDuration}
																	onVideoProgress={this.handleVideoProgress}
																	onVideoEnded={this.handleVideoEnded} />

								<Canvas width = {width}
												height = {height}
												cursor = {cursor}
												objects= {objects}
												played = {played}
												onCanvasStageMouseMove={this.handleCanvasStageMouseMove}
												onCanvasStageMouseDown={this.handleCanvasStageMouseDown}
												onCanvasStageMouseUp={this.handleCanvasStageMouseUp}
												onCanvasGroupRef={this.handleCanvasGroupRef}
												onCanvasGroupMouseDown={this.handleCanvasGroupMouseDown}
												onCanvasGroupDragStart={this.handleCanvasGroupDragStart}
												onCanvasGroupDragEnd={this.handleCanvasGroupDragEnd} />

							</div>
						</Col>
	        </Row>
					<Row className="py-1">
						<Col><Button outline color="danger" onClick={this.handleVideoPlayPause}>{playing ? 'Pause video' : 'Play video'}</Button></Col>
						<Col><Button outline color="primary" onClick={this.handleAddObject}>{adding ? 'Adding object' : 'Add object'}</Button></Col>
						<Col><div className="text-right text-muted"><Duration seconds={played*duration}/> / <Duration seconds={duration}/></div></Col>
					</Row>
					<Row className="py-1">
						<Col>
							<section className="player-slider">
								<input
									type='range' min={0} max={1} step='any'
									value={played}
									onMouseDown={this.handleVideoSeekMouseDown}
									onChange={this.handleVideoSeekChange}
									onMouseUp={this.handleVideoSeekMouseUp}
								 />
							</section>
						</Col>
					</Row>
					<Row className="py-1">
						<Col>
							<canvas id="myCanvas" width="200" height="100"></canvas>
						</Col>
					</Row>
				</Container>
	    );
	  }
}
export default Task;
