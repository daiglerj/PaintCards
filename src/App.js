import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Card} from './ColorCard'
import PaletteInput from './paletteInput'
import PaletteSection from './PaletteSection'
import Palette from "./Palette"
import ToggleDisplay from 'react-toggle-display';
  // Initialize Firebase

class App extends Component {
    constructor(){
        super();
        this.state = {
            paletteName:"",
            existingPaletteInput: "",
            squares: [
            ],
            inputValue: "",
            count: 1
        }
        this.handleColorCodeChange = this.handleColorCodeChange.bind(this)
        this.handleAddColor = this.handleAddColor.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleGetPaletteInputChange = this.handleGetPaletteInputChange.bind(this)
        this.handleGetPalette = this.handleGetPalette.bind(this)
    }
    componentWillMount(){
        var count = -1
        var colors= []
    }
    
    handleColorCodeChange(event){
        var newValue = ""
        var currentInput = event.target.value
        console.log(currentInput)
        if((!currentInput.includes("#"))){
            newValue = "#" + currentInput
        }
        else if(currentInput == "#"){
            newValue = ""
        }
        else{
            newValue = currentInput
        }
        this.setState({
            inputValue: newValue
        })
    }
    
    handleAddColor(event){
        console.log("hello")
        this.setState({
            count: this.state.count+1
        })
        var count = this.state.count;
        
        console.log(this.state.squares)
        this.setState({
            squares: [...this.state.squares,{id:this.state.count,color:this.state.inputValue}],
        },()=>{
            console.log(this.state.squares)
        })
        
    }
    handleRemove(index,event){
        var length = this.state.squares.length
        var updatedSquares = []
        console.log(index)
        //remove from interface
        for(var i=0;i<length;i++){
            //console.log(i)
            //console.log(this.state.squares[0])
            if(this.state.squares[i].id != index){
                var updatedSquares = [...updatedSquares,this.state.squares[i]] 
            }
        }
        
        this.setState({
            squares: updatedSquares
        })
        
        
    }
    handleGetPaletteInputChange(event){
        this.setState({
            existingPaletteInput: event.target.value
        })
    }
    handleGetPalette(event){
        //Set the palette name appropriatly
        var name = this.state.existingPaletteInput
        this.setState({
            paletteName:name
        })
        var nameWithoutSpaces = name.replace(" ","%20")
        console.log("name ",name)

        //update the color cards
        var colors = []
        let url = "http://localhost:8080/getColorsByName/"+nameWithoutSpaces
        fetch(url).then((response)=>{
            response.json().then(result=>{
                colors = result.colors
                colors.forEach(color=>{
                    this.setState({
                        squares: [...this.state.squares,{id:this.state.count,color}],
                        count:this.state.count+1
                    })
                })
            })
        })
       
    }
 


  render() {
    var appStyle = {
        padding:50
    }


    var formStyle = {
        display: "block",
        border:"solid"
    }
    var squareStyle = {
            display:"inline-block",
            marginRight: 10
    }

    var inputStyle = {
        width: 250,
        height: 20,
        fontSize:16,
        padding: 5
    }

    return (
      <div style={appStyle} className="App">
        <ToggleDisplay if={this.state.paletteName != ""}>
            <h1>{this.state.paletteName}</h1>
        </ToggleDisplay>
        <ToggleDisplay if={this.state.paletteName == ""}>
            <PaletteInput inputStyles={inputStyle} handleExistingPaletteInput={this.handleGetPaletteInputChange} handleGetPalette = {this.handleGetPalette}/>
        </ToggleDisplay>
        
        <Palette handleRemove = {this.handleRemove} colors={this.state.squares} count={this.state.count}/>
        
        <PaletteSection value= {this.state.inputValue} handleChange = {this.handleColorCodeChange} inputStyle = {inputStyle} handleAddColor = {this.handleAddColor} />
            
      </div>
    );
  }
}



export default App;
