/*
 * @Author: preciousmouse 
 * @Date: 2019-03-28 02:36:10 
 * @Last Modified by: preciousmouse
 * @Last Modified time: 2019-04-02 21:40:11
 */

import React from 'React';
import ReactDom from 'react-dom';
import {Icon, message, Progress, Switch,} from 'antd';
import $ from 'jquery';
import uuid from 'uuid';

import './pageside.css';

export default class Pageside extends React.Component{
    constructor(prop){
		super(prop);
		this.state = {
			lists: [],
			focus: -1,
		};
	}
	componentDidMount(){
		this.getList();
	}

	emptySuccess = () => {
		message.loading('正在清空列表...', 1)
		  .then(() => message.success('清空列表成功', 1))
	};

	emptyList = ()=>{
		this.emptySuccess();
		// const hide = message.loading('正在清空列表...', 0 ,()=>{
		// 	message.success('清空列表成功');
		// });
		fetch('/mnist-predict',{
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
		let url = '/mnist-predict';

		fetch(url,{
			method: 'get',
		}).then(res=>{return res.json()}).then(data=>{
			console.log('get',data);
			this.resetFocus();
			this.setState({
				lists: data.data.lists,
			})
			if(data.data.modelPerformance){
				window.modelPerformance = data.data.modelPerformance;
			}
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
		  .then(() => message.success('加载模型成功', 1))
	}
	trainModel = ()=>{
		//train
		this.resetFocus();
		this.trainSuccess();
	}

    render(){
		const percentList = [0,100,50];
		const statusList = ['active','success','exception'];
		return (
			<div className='page-side'>
				<div className='header-wrapper'>
					<div className='wrapper-right' onClick={this.emptyList}><Icon type="delete" /></div>
					<div className='wrapper-right' onClick={this.upload}><Icon type="cloud-upload" /></div>
					<div className='wrapper-right' onClick={this.getList}><Icon type="reload" /></div>
					<div className='wrapper-right' onClick={this.trainModel}>
						{/* <Icon type="plus" /> */}
						<Switch checkedChildren="1" unCheckedChildren="0" onChange={(checked)=>{this.props.typeChange(checked)}}/>
					</div>
					<div className='wrapper-main'>
						<div className='wrapper-main-content'>Mnist Demo</div>
					</div>
				</div>
				<div className='content-wrapper'>
					{this.state.lists.map((ele,index)=>{
						let isFocus = this.state.focus==index;
						let extClass = isFocus?'item-focus':'';
						return (
							<div className={'item-wrapper '+extClass} key={index}>
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
							</div>
						)
					})}
				</div>
			</div>
		)
    }
}
