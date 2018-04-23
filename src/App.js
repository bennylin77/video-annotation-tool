import React, { Component } from 'react';
import Task from './task/Task'
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import {Alert} from 'reactstrap';



const colors = ["rgba(3, 169, 244, 0.7)", "rgba(244, 67, 54, 0.7)", "rgba(233, 30, 99, 0.7)"]
function getRandomInt (max) {
  return Math.floor(Math.random() * Math.floor(max));
}

class App extends Component {

	constructor(props) {
		super(props);
		this.state = { alertVisible: false, alertMessage: "", width: 640, height: 480, played: 0, playing: false, duration: 0,
									 loop: false, seeking: false, adding: false, objects: [] };

	}
	/* 		alert			*/
	onAlertDismiss = () => {
	 this.setState({alertVisible: false, alertMessage: "" })
 	}
	/* video player */
	playerRef = player => {
    this.player = player
  }
	handleVideoPlayPause = () => {
		this.setState({ playing: !this.state.playing })
	}
	handleVideoSeekMouseDown = e => {
		this.setState({ seeking: true })
	}
	handleVideoSeekChange = e => {
		const played = this.state.played
		const target = e.target
		this.setState((prevState, props) => {
			return { played: parseFloat(target.value), objects: prevState.objects.map( obj =>{
					let offsetX = obj.offset.x
					let offsetY = obj.offset.y
					let trajectories = obj.trajectories
					for( let i = 0; i < trajectories.length; i++){
						if(played >= trajectories[i].time){
							if(i!==trajectories.length-1 && played >= trajectories[i+1].time)
								continue;
							let x, y;

							if(i===trajectories.length-1){
								offsetX = trajectories[i].x - trajectories[0].x;
								offsetY = trajectories[i].y - trajectories[0].y;
							}else{
								let startTraj = trajectories[i], endTraj = trajectories[i+1]
								let lapseTime = endTraj.time - startTraj.time;
								let xSlope = (endTraj.x - startTraj.x)/lapseTime, ySlope = (endTraj.y - startTraj.y)/lapseTime;
								// set x and y position
								let curTime = played - startTraj.time;
								x = xSlope * curTime + startTraj.x;
								y = ySlope * curTime + startTraj.y;
								offsetX = x - trajectories[0].x;
								offsetY = y - trajectories[0].y;
								//obj.Group.x(offsetX)
								//obj.Group.y(offsetY)
							}
							obj.Group.x(offsetX)
							obj.Group.y(offsetY)
							break;
						}
					}
					//console.log(offsetX, offsetY);
					return { ...obj,
									 offset: {x:offsetX, y:offsetY }
              	 };
				})
			}
		})
	}
	handleVideoSeekMouseUp = e => {
		this.setState({ seeking: false })
    this.player.seekTo(parseFloat(e.target.value))
	}
	handleVideoProgress = state => {
		if (!this.state.seeking) {
    	//this.setState({played: state.played})
			const played = state.played
			//const target = e.target
			this.setState((prevState, props) => {
				return { played: played, objects: prevState.objects.map( obj =>{
						let offsetX = obj.offset.x
						let offsetY = obj.offset.y
						let trajectories = obj.trajectories
						for( let i = 0; i < trajectories.length; i++){
							if(played >= trajectories[i].time){
								if(i!==trajectories.length-1 && played >= trajectories[i+1].time)
									continue;
								let x, y;

								if(i===trajectories.length-1){
									offsetX = trajectories[i].x - trajectories[0].x;
									offsetY = trajectories[i].y - trajectories[0].y;
								}else{
									let startTraj = trajectories[i], endTraj = trajectories[i+1]
									let lapseTime = endTraj.time - startTraj.time;
									let xSlope = (endTraj.x - startTraj.x)/lapseTime, ySlope = (endTraj.y - startTraj.y)/lapseTime;
									// set x and y position
									let curTime = played - startTraj.time;
									x = xSlope * curTime + startTraj.x;
									y = ySlope * curTime + startTraj.y;
									offsetX = x - trajectories[0].x;
									offsetY = y - trajectories[0].y;
									//obj.Group.x(offsetX)
									//obj.Group.y(offsetY)
								}
								obj.Group.x(offsetX)
								obj.Group.y(offsetY)
								break;
							}
						}
						//console.log(offsetX, offsetY);
						return { ...obj,
										 offset: {x:offsetX, y:offsetY }
									 };
					})
				}
			})








		}
  }
  handleVideoDuration = duration => {
    this.setState({ duration })
  }
	handleVideoEnded = () => {
    this.setState({ playing: this.state.loop })
  }

	/* canvas */
	handleAddObject = () =>{
		this.setState((prevState, props) => {
			return {adding: !prevState.adding, playing: false};
		});
	}
	handleCanvasStageMouseMove = e =>{
		//const position = e.target.getPointerPosition()
		//this.setState({ cursor: { x: position.x, y: position.y }})
	}
	handleCanvasStageMouseDown = e =>{
		if(!this.state.adding)
			return;
		const position = e.target.getPointerPosition()
		this.setState((prevState, props) => {
			const id = (new Date()).getTime();
			const stroke = colors[getRandomInt(3)]
			const trajectories = []
			trajectories.push({x: position.x, y: position.y, height: 20, width: 20, time: prevState.played})
			return { adding: !prevState.adding, objects: [...prevState.objects, {id: id, stroke: stroke, trajectories: trajectories, offset: {x:0 , y:0}, dragging: false}]};
		});
	}
	handleCanvasStageMouseUp = e =>{

	}
	handleCanvasGroupMouseDown = e =>{
		//this.setState({ playing: !this.state.playing })
		//this.setState({ playing: !this.state.playing })
	}
	handleCanvasGroupDragStart = e =>{
		const target = e.target
		this.setState((prevState, props) => {
			return { objects: prevState.objects.map( obj =>{
					if(obj.id !== parseInt(target.id(), 10))
						return obj;
					return { ...obj, dragging: true };
				})
			}
		})
	}
	handleCanvasGroupDragEnd = e =>{
		const target = e.target
		const offsetX = parseInt(target.x(), 10)
		const offsetY = parseInt(target.y(), 10)

		this.setState((prevState, props) => {
			return { playing: false, objects: prevState.objects.map( obj =>{
					if(obj.id !== parseInt(target.id(), 10))
						return obj;
					let trajectories = [ ...obj.trajectories, {x: obj.trajectories[0].x+offsetX, y: obj.trajectories[0].y+offsetY, height: 20, width: 20, time: prevState.played}];
					trajectories.sort(function(a, b) {
					  var timeA = a.time;
					  var timeB = b.time;
					  if (timeA < timeB)
					    return -1;
					  if (timeA > timeB)
					    return 1;
					  return 0;
					});
					return { ...obj,
									 offset: {x:offsetX, y:offsetY },
									 dragging: false,
                	 trajectories: trajectories
              	 };
				})
			}
		})
	}

	handleCanvasGroupRef = r =>{
		//console.log(r)
		this.setState((prevState, props) => {
			return {  objects: prevState.objects.map( obj =>{
					if(obj.id !== parseInt(r.id(), 10))
						return obj;
					//console.log(trajectories)
					return { ...obj, Group: r };
				})
			}
		})
	}

	/*
	_handleEventSelect(event){
		const value = event.target.value;
		this.setState((prevState, props) => {
			const newSelectedEvents = prevState.selectedEvents
			const index = newSelectedEvents.indexOf(value);
			if (index === -1) {
					newSelectedEvents.push(value);
			} else {
					newSelectedEvents.splice(index, 1);
			}
			return {selectedEvents: newSelectedEvents.sort()};
		});
	}
	_handleLandingNext(){
		if(this.state.selectedEvents.length!==0)
			this.setState({step: 2})
		else
			this.setState({alertVisible: true, alertMessage: "You must select some emergent event(s)" })
	}
	_handleWoAssistNext(event) {
    alert(this.state);
    event.preventDefault();
  }
	_handlePlay(){
			this.setState((prevState, props) => {
				return {playing: !this.state.playing};
			});
	}
	_handleEmergence(){
			const buf = CaptureFrame(this.player.getInternalPlayer())
			const frame = window.URL.createObjectURL(new window.Blob([buf]))
			console.log('captured frame', frame)

			this.setState((prevState, props) => {
				const id = (new Date()).getTime();
				const elapsed = prevState.duration * prevState.played
				return {eventTimeList: [...prevState.eventTimeList, {id: id, elapsed: elapsed, frame: frame}]};
			});
	}
*/
	// video


	/*
	handleVideoSetTimeMouseDown = () =>{
	}
	handleVideoSetTimeChange = e =>{
		const name = e.target.name;
		const value = parseFloat(e.target.value);
		this.setState((prevState, props) => {
			const ind1 = (name ==='indicator1'? value : prevState.indicator1);
			const ind2 = (name ==='indicator2'? value : prevState.indicator2);
			console.log(ind1)
			console.log(ind2)
			const start = Math.min(ind1, ind2);
			const end = Math.max(ind1, ind2);
			return { selectedStart: start, selectedEnd: end, indicator1: ind1, indicator2: ind2 };
		});
	}
	handleVideoSetTimeMouseUp = () =>{
	}
*/

	// event time
	/*
	_handleEventTimeAdd(){
		const { selectedEvent, selectedStart, selectedEnd } = this.state;
		if(parseFloat(selectedEvent)==-1){
				this.setState({alertVisible: true, alertMessage: "You must select an event" })
				return;
		}
		this.setState((prevState, props) => {
			const id = (new Date()).getTime();
			const elapsed = prevState.duration * prevState.played
			return { selectedEvent: "-1", eventTimeList: [...prevState.eventTimeList, {id: id, startTime: selectedStart, endTime: selectedEnd, selectedEvent: selectedEvent}]};
		});
	}
	_handleEventTimeDelete(id){
		this.setState((prevState) => {
				const newEventTimeList = prevState.eventTimeList.filter( eventTime => eventTime.id !== id );
				return { eventTimeList: newEventTimeList };
		});
	}
	_handleEventTimeInputChange(e){
		const target = e.target;
		const name = target.name;
		const value = target.value;
		this.setState({[name]: value})
	}*/
	// player



  render() {
		const {	alertVisible, alertMessage, width, height, playing, played, duration, adding, objects} = this.state;
		return (
			<div>
				<Alert className="fixed-top" color="danger" isOpen={alertVisible} toggle={this.onAlertDismiss}>{alertMessage}</Alert>
				<Task
							width={width}
							height={height}
							playing={playing}
							played={played}
							duration={duration}
							adding={adding}
							objects={objects}
							onTaskPlayerRef={this.playerRef}
							onTaskVideoPlayPause={this.handleVideoPlayPause}
							onTaskVideoSeekMouseDown={this.handleVideoSeekMouseDown}
							onTaskVideoSeekChange={this.handleVideoSeekChange}
							onTaskVideoSeekMouseUp={this.handleVideoSeekMouseUp}
							onTaskVideoDuration={this.handleVideoDuration}
							onTaskVideoProgress={this.handleVideoProgress}
							onTaskVideoEnded={this.handleVideoEnded}
							onTaskAddObject={this.handleAddObject}
							onTaskCanvasStageMouseMove={this.handleCanvasStageMouseMove}
							onTaskCanvasStageMouseDown={this.handleCanvasStageMouseDown}
							onTaskCanvasStageMouseUp={this.handleCanvasStageMouseUp}
							onTaskCanvasGroupMouseDown={this.handleCanvasGroupMouseDown}
							onTaskCanvasGroupDragStart={this.handleCanvasGroupDragStart}
							onTaskCanvasGroupDragEnd={this.handleCanvasGroupDragEnd}
							onTaskCanvasGroupRef={this.handleCanvasGroupRef}
							/>
			</div>
		);
  }
}

export default App;
