/*
 * @Author: preciousmouse 
 * @Date: 2018-12-18 17:18:05 
 * @Last Modified by: preciousmouse
 * @Last Modified time: 2019-03-28 05:52:14
 */
import React from 'React'
import ReactDom from 'react-dom'
import {Layout} from 'antd';
import $ from 'jquery'

import Apisample from '../components/apisample/apisample.jsx';
import Pageside from '../components/pageside/pageside.jsx';
import Details from '../components/details/details.jsx';
import './index.css';
import { resolve } from 'url';

const {
	Header,Footer,Sider,Content,
} = Layout;

export default class App extends React.Component{
    constructor(prop){
		super(prop);
		this.fileInput = React.createRef();
		this.sider = React.createRef();
		this.state = {
			focus: false, 
		};
		this.focus = {};
	}
	componentDidMount(){
		let input = $("#fileupload");
		$(input).change((e)=>{
			if($(e.target).val()!=""){
				this.submit();
			}
		})
	}
	changeFocus = (focus)=>{
		console.log('focus',focus);
		if(focus){
			this.focus = focus;
		}
		this.setState({
			focus: !(!focus)
		})
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
			this.sider.current.getList();
			window.setTimeout(()=>{
				// console.log('after 5s');
				this.sider.current.getList();
			},5000);
		});
	}
	upload = ()=>{
		$("#fileupload").click();
	}
	
    render(){
		const left_side_style = {
			height: '100vh',
			backgroundColor: '#fff',
		};
		const focusData = this.state.focus?this.focus:null;
		return (
			<div className='app'>
				{/* <Apisample></Apisample> */}
				<Layout className='page'>
					<Sider className='left-sider' style={left_side_style}> 
						<Pageside upload={this.upload} change={this.changeFocus} ref={this.sider}></Pageside>
					</Sider>
					<Content className='right-sider'>
						<Details upload={this.upload} focus={focusData}></Details>
					</Content>
				</Layout>
				<input id='fileupload' type='file' ref={this.fileInput} style={{display:'none'}}/>
			</div>
		)
    }
}

ReactDom.render(<App />,document.querySelector("#content"));