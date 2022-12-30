import React from "react";
import { Component } from "react";
import './intro.css'
import logo from '../images/neural.png'
import algo from '../images/algo.png'
import wall from '../images/wall.png'
import maze from '../images/maze.png'
import speed from '../images/speed.png'
import blank from '../images/blank.png'


export default class intro extends Component {

    constructor(){
        super();
        this.state = {
            introClass:'intro',
            heading:"Welcome to Algorithm Visualizer",
            subheader:"This short tutorial will walk you through all of the features of this application.",
            subheader2:"Feel free to press the Skip Tutorial button below. Otherwise, press Next!",
            img:logo,
            pageNo:1
        }
        this.nextPage = this.nextPage.bind(this);
    }

    skipIntro(){
        this.setState({introClass:'skipIntro'})
    }
    nextPage(){
        if(this.state.pageNo === 6){
            this.setState({introClass:'skipIntro'})
        }
        this.setState({pageNo: this.state.pageNo+1});
        
        console.log(this.state.pageNo)
        if(this.state.pageNo === 1){
            this.setState({
                heading:"Pick an algorithm",
                subheader:"Choose an algorithm from the Algorithms drop-down menu.",
                subheader2:"Some algorithm will asure shortest path while some will not",
                img:algo,
            })
        }
        if(this.state.pageNo === 2){
            this.setState({
                heading:"Adding walls",
                subheader:"Click on the grid to add a wall",
                subheader2:"Walls are impenetrable, meaning that a path cannot cross through them",
                img:wall,
            })
        }
        if(this.state.pageNo === 3){
            this.setState({
                heading:"Various Patterns",
                subheader:"Choose an maze pattern from the maze drop-down menu.",
                subheader2:"These are pre-build patterns you can try with",
                img:maze,
            })
        }
        if(this.state.pageNo === 4){
            this.setState({
                heading:"Speed",
                subheader:"Change the speed of the traversal",
                subheader2:"You can change the speed of the algorithm according to you",
                img:speed,
            })
        }
        if(this.state.pageNo === 5){
            this.setState({
                heading:"Enjoy!",
                subheader:"I hope you have just as much fun playing around with this visualization tool",
                subheader2:"If you want to see the source code for this application, check out my github.",
                img:blank,
            })
        }
    }

    render() {
        return(
            <div className={this.state.introClass}>
                <a className="heading" >{this.state.heading}</a>
                <div></div>
                <h6 className="subheader">{this.state.subheader}</h6>
                <h6 className="subheader2">{this.state.subheader2}</h6>
                <img className="introImg" src={this.state.img}/>
                <a href="#" onClick={() => this.skipIntro()} id="skip">Skip Tutorial</a>
                <a href="#" onClick={() => this.nextPage()} id="next">Next</a>
                <a id="pageCounter">{this.state.pageNo}/6</a>
            </div>
            
        )
    }
};
