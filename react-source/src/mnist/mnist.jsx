/*
 * @Author: preciousmouse 
 * @Date: 2018-12-18 17:18:05 
 * @Last Modified by: preciousmouse
 * @Last Modified time: 2019-04-02 21:43:34
 */
import React from 'React'
import ReactDom from 'react-dom'
import {Layout, message} from 'antd';
import $ from 'jquery'

import Apisample from '../components/apisample/apisample.jsx';
import Pageside from '../components/mnistPageside/pageside.jsx';
import Details from '../components/mnistDetails/details.jsx';
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
		this.type = 0;

		this.posturls=[
			'/mnist-predict',
			'/mnist-predict/new',
		]
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

	changeType = (type)=>{
		console.log('type',+type);
		this.type = +type;
	}

	submitSuccess = () => {
		message.loading('正在提交图片...', 1)
		  .then(() => message.success('提交成功，正在计算...', 1))
	};
	submit = ()=>{
		let url = this.posturls[this.type];

		let formData = new FormData();
		console.log('file',this.fileInput.current.files);
		formData.append('file',this.fileInput.current.files[0]);
		this.submitSuccess();
		fetch(url,{
			method: 'post',
			body: formData,
		}).then(res=>{return res.json()}).then(data=>{
			console.log('submit',data);
			this.sider.current.getList();
			window.setTimeout(()=>{
				// console.log('after 5s');
				this.sider.current.getList();
			},1000);
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
						<Pageside upload={this.upload} change={this.changeFocus} ref={this.sider} typeChange={this.changeType}></Pageside>
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