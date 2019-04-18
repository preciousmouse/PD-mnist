/*
 * @Author: preciousmouse 
 * @Date: 2019-03-27 23:23:26 
 * @Last Modified by: preciousmouse
 * @Last Modified time: 2019-03-28 04:34:27
 */
import React from 'React'
import ReactDom from 'react-dom'
import $ from 'jquery'


export default class Apisample extends React.Component{
    constructor(prop){
		super(prop);
		this.fileInput = React.createRef();
	}
	
	
	submit = ()=>{
		let formData = new FormData();
		console.log('file',this.fileInput.current.files);
		formData.append('file',this.fileInput.current.files[0]);
		fetch('/predict',{
			method: 'post',
			body: formData,
		}).then(res=>{return res.json()}).then(data=>{
			console.log('submit',data);
		})
	}
	getList = ()=>{
		fetch('/predict',{
			method: 'get',
		}).then(res=>{return res.json()}).then(data=>{
			console.log('get',data);
		})
	}
	emptyList = ()=>{
		fetch('/predict',{
			method: 'delete',
		}).then(res=>{return res.json()}).then(data=>{
			console.log('delete',data);
		})
	}

    render(){
		return (
			<div className='apisample'>
				<input type='file' ref={this.fileInput}/>
				<button onClick={this.submit}>提交</button>
				<button onClick={this.getList}>getlist</button>
				<button onClick={this.emptyList}>empty</button>
			</div>
		)
    }
}