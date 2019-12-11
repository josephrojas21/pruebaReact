import React, { Component } from 'react';
import './App.css';

import Controls from './components/Controls';
import Board from './components/Board';
import {btnNoBack, btnAll, btnNoForward}  from './utils/buttonCond'

const NUM_STAGES = 4;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [
          { name: 'task 0', stage: 0 },
          { name: 'task 1', stage: 0 },
          { name: 'task 2', stage: 0 },
          { name: 'task 3', stage: 0 },
          { name: 'task 4', stage: 1 },
          { name: 'task 5', stage: 1 },
          { name: 'task 6', stage: 1 },
          { name: 'task 7', stage: 2 },
          { name: 'task 8', stage: 2 },
          { name: 'task 9', stage: 3 },
      ],
      nameTask: '',
      buttonCond: true,
      selectedTask: '',
      activateButtons: {
        back: true,
        forward: true,
        delete:true
      }
    };
    this.stagesNames = ['Backlog', 'To Do', 'Ongoing', 'Done'];

    this.OnClickCreateTask = this.OnClickCreateTask.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleButtonActions = this.handleButtonActions.bind(this);
  }

  // this function is for create  a new task
  OnClickCreateTask(){
    let newTask = this.state.tasks;
    newTask.push({name:this.state.nameTask, stage: 0});
    document.getElementById("taskInput").value = "";
    this.setState({
      tasks: newTask
    })
  }

  // this function is to get the name of the task and set the name in the input, and control the state of buttons
  OnclickSelected = (e) =>{
    const {id} = e.target;
    let name = document.getElementById(id).innerHTML;
    let tasks = this.state.tasks;
    let buttons = this.state.activateButtons;
    let stage = null;

    for (const key in tasks) {
        const element = tasks[key];
        if(element.name === name){
            stage = element.stage
        }
    }
    if(stage === 0 ){
      buttons = btnNoBack
    }else if(stage === 1 || stage === 2){
      buttons = btnAll
    }else{
      buttons = btnNoForward
    }
    this.setState({
      selectedTask: document.getElementById(id).innerHTML,
      activateButtons: buttons
    })
  }

  // this function for disabled or enable create button
  handleOnChange(e){
    const {value } = e.target;
    if(value.length > 0){
      this.setState({
        buttonCond: false,
        nameTask: value
      });
    }else{
      this.setState({buttonCond: true});
    }
  }

  handleButtonActions(e){
    let task = this.state.tasks;
    let pos = null, temp = null, buttons = this.state.activateButtons;
    switch (e.target.id) {
      case 'move-back-btn':
          for (const key in task) {
            task[key].name === this.state.selectedTask ? pos = key   : false ;
          }
          temp = task[pos];
          task.splice(pos,1);
          temp.stage--;
          temp.stage === 0 ? buttons = btnNoBack : false;
          temp.stage === 1 || temp.stage === 2 ?  buttons = btnAll : false;
          //temp.stage === 3 ? buttons = btnNoForward : false
          task.push(temp)
          this.setState({ tasks: task, activateButtons: buttons})
        break;
      case 'move-forward-btn':
          for (const key in task) {
            task[key].name === this.state.selectedTask ? pos = key  : false ;
          }
          temp = task[pos];
          task.splice(pos,1);
          temp.stage++;
          //temp.stage === 0 ? buttons = btnNoBack : false;
          temp.stage === 1 || temp.stage === 2 ?  buttons = btnAll : false;
          temp.stage === 3 ? buttons = btnNoForward : false;
          task.push(temp)
          this.setState({tasks: task})
        break;
      case 'delete-btn':
        for (const key in task) {
          task[key].name === this.state.selectedTask ? pos = key  : false ;
        }
        task.splice(pos,1)
        this.setState({tasks: task , selectedTask: ''})
        
        break;
      default:

        break;
    }
  }

  
  

  render() {
    const { tasks, buttonCond, activateButtons, selectedTask } = this.state;

    let stagesTasks = [];
    for (let i = 0; i < NUM_STAGES; ++i) {
      stagesTasks.push([]);
    }
    for (let task of tasks) {
      const stageId = task.stage;
      stagesTasks[stageId].push(task);
    }

    return (
      <div className="App">
        <Controls 
        OnClickCreateTask={this.OnClickCreateTask}
        buttonCond={buttonCond}
        selectedTask={selectedTask}
        activateButtons={activateButtons}
        handleOnChangeButtons={this.handleOnChangeButtons}
        handleOnChange={this.handleOnChange}
        handleButtonActions={this.handleButtonActions}/>
        <Board
          stagesTasks={stagesTasks}
          stagesNames={this.stagesNames}
          OnclickSelected={this.OnclickSelected}
        />
      </div>
    );
  }
}

export default App;
