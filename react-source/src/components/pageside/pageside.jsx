/*
 * @Author: preciousmouse 
 * @Date: 2019-03-28 02:36:10 
 * @Last Modified by: preciousmouse
 * @Last Modified time: 2019-04-02 21:36:24
 */

import React from 'React';
import ReactDom from 'react-dom';
import {Icon, message, Progress,} from 'antd';
import $ from 'jquery';
import uuid from 'uuid';

import './pageside.css';

export default class Pageside extends React.Component{
    constructor(prop){
		super(prop);
		this.state = {
			lists: [],
			focus: -1
		};
	}
	componentDidMount(){
		this.getList();
	}

	success = () => {
		message.loading('正在清空列表...', 1)
		  .then(() => message.success('清空列表成功', 1))
	};

	emptyList = ()=>{
		this.success();
		// const hide = message.loading('正在清空列表...', 0 ,()=>{
		// 	message.success('清空列表成功');
		// });
		fetch('/predict',{
			method: 'delete',
		}).then(res=>{return res.json()}).then(data=>{
			console.log('delete',data);
			this.getList();
			// return hide();
		})
		// .then(data=>{
		// 	message.success('清空列表成功');
		// })
	}
	getList = ()=>{
		fetch('/predict',{
			method: 'get',
		}).then(res=>{return res.json()}).then(data=>{
			console.log('get',data);
			this.resetFocus();
			this.setState({
				lists: data.data,
				//test
				// lists: [{
				// 	code: 0,
				// 	status: 'pending',
				// 	predictId: 0,
				// 	predictUrl: '',
				// 	uploadUrl: '',
				// 	createdAt: '2019/3/29 02:00:00',
				// },{
				// 	code: 1,
				// 	status: 'finished',
				// 	predictId: 1,
				// 	predictUrl: 'http://127.0.0.1:8999/prediction/6dee29e0-0c71-4444-8f40-6eb6bb46de7c.png',
				// 	uploadUrl: 'http://127.0.0.1:8999/uploads/004fdd20-50fe-11e9-ba8e-b11d15df98b1.png',
				// 	createdAt: '2019/3/29 01:00:00',
				// },{
				// 	code: 2,
				// 	status: 'failed',
				// 	predictId: 2,
				// 	predictUrl: '',
				// 	uploadUrl: '',
				// 	createdAt: '2019/3/29 00:00:00',
				// }]
			})
		})
	}
	upload = ()=>{
		if(this.props.upload){
			this.props.upload();
		}else{
			console.log('require props: upload');
		}
	}

	resetFocus = ()=>{
		this.setState({
			focus: -1
		});
		if(this.props.change){
			this.props.change(null);
		}
	}
	changeFocus = (e)=>{
		console.log('change focus',e.target,e.target.dataset.index);
		let index = e.target.dataset.index;
		if(this.state.focus==index){
			index = -1;
		};
		this.setState({
			focus: index
		});
		if(this.props.change){
			let focusItem = index===-1?null:this.state.lists[index];
			this.props.change(focusItem);
		}
	}

	trainSuccess = ()=>{
		message.loading('正在加载训练模型...', 1)
		  .then(() => message.success('加载新模型成功', 1))
	}
	trainModel = ()=>{
		this.trainSuccess();
	}

    render(){
		// const statusIcon = {
		// 	0: <Icon type="loading" />,
		// 	1: <Icon type="check" />,
		// 	2: <Icon type="close" />,
		// };
		const percentList = [0,100,50];
		const statusList = ['active','success','exception'];

		return (
			<div className='page-side'>
				<div className='header-wrapper'>
					<div className='wrapper-right' onClick={this.emptyList}><Icon type="delete" /></div>
					<div className='wrapper-right' onClick={this.upload}><Icon type="cloud-upload" /></div>
					<div className='wrapper-right' onClick={this.getList}><Icon type="reload" /></div>
					<div className='wrapper-right' onClick={this.trainModel}><Icon type="plus" /></div>
					<div className='wrapper-main'>
						<div className='wrapper-main-content'>Deep learning</div>
					</div>
				</div>
				<div className='content-wrapper'>
					{this.state.lists.map((ele,index)=>{
						let isFocus = this.state.focus==index;
						let extClass = isFocus?'item-focus':'';
						return (
							<div className={'item-wrapper '+extClass} key={index}>
								{/* <div className='wrapper-left'>{statusIcon[ele.code]}</div> */}
								<div className='wrapper-left progress-wrapper'>
									<Progress type="circle" strokeWidth={5} width={44} 
												percent={percentList[ele.code]} status={statusList[ele.code]}
												format={percent=>{
													const progressText = ['queue','error','done'];
													return progressText[Math.floor(percent/50)];
												}}/>
								</div>
								<div className='wrapper-right'><Icon type="delete" /></div>
								<div className='wrapper-main' >
									<div className='wrapper-main-content' data-index={index} onClick={this.changeFocus}>
										{ele.createdAt}
									</div>
								</div>
								{/* <div></div> */}
							</div>
						)
					})}
				</div>
			</div>
		)
    }
}
