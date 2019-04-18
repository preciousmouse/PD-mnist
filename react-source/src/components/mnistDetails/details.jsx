/*
 * @Author: preciousmouse 
 * @Date: 2019-03-28 02:36:52 
 * @Last Modified by: preciousmouse
 * @Last Modified time: 2019-04-01 00:06:24
 */


import React from 'React'
import ReactDom from 'react-dom'
import {Row, Col, Icon, Card} from 'antd';
import Zmage from 'react-zmage';
import $ from 'jquery'
import arrow from './arrow.png'
import number0 from './0.png'
import number1 from './1.png'
import number2 from './2.png'
import number3 from './3.png'
import number4 from './4.png'
import number5 from './5.png'
import number6 from './6.png'
import number7 from './7.png'
import number8 from './8.png'
import number9 from './9.png'

import './details.css';

export default class Details extends React.Component{
    constructor(prop){
		super(prop);
		
	}
	componentDidMount(){

	}

	upload = ()=>{
		if(this.props.upload){
			this.props.upload();
		}else{
			console.log('require props: upload');
		}
	}

    render(){
		const placeholder = (
			<div className='tip-wrapper'>
				<div className='tip-content' onClick={this.upload}>
					<table><tbody>
						<tr><td className='tip-title'>点击选择图片或拖拽图片到这里</td></tr>
						<tr><td className='tip-footer'>JPG JPEG PNG 5MB</td></tr>
					</tbody></table>
				</div>
			</div>
		);
		const showprocess = (
			<div className='tip-wrapper'>
				<div className='tip-content' onClick={this.upload}>
					<table><tbody>
						<tr><td className='tip-title'>图片处理中...</td></tr>
					</tbody></table>
				</div>
			</div>
		)
		const showerror = (
			<div className='tip-wrapper'>
				<div className='tip-content' onClick={this.upload}>
					<table><tbody>
						<tr><td className='tip-title'>图片处理失败！</td></tr>
					</tbody></table>
				</div>
			</div>
		)
		
		const labelImages = [
			number0,number1,number2,number3,number4,
			number5,number6,number7,number8,number9
		];

		const {
			predictRes, uploadUrl, createdAt, modelId
		} = this.props.focus||{};
		let modelPecision = window.modelPerformance&&modelId?window.modelPerformance[modelId].accurate:null;
		//test
		// const imgSrc = "http://127.0.0.1:8999/prediction/6dee29e0-0c71-4444-8f40-6eb6bb46de7c.png";
		const showpicture = (
			<div className='picture-preview'>
				<div className='preview-header'>
					<div className='header-close wrapper-left'><Icon type="close" /></div>
					<div className='header-title wrapper-left'>{createdAt}</div>
				</div>
				<div className='preview-content'>
					{/* <img src={predictUrl}/> */}
					<Zmage src={uploadUrl} />
					<img src={arrow}/>
					<Zmage src={labelImages[predictRes]}/>	
				</div>
				<div className='card-wrap'>
					<Card title='模型性能指标' bordered={false} style={{width:250,boxShadow: '5px 5px 5px #ddd'}}>
						<p>模型测试精确率： 0.1</p>
						<p>模型测试召回率: 100%</p>
						<p>模型测试准确度：{modelPecision||'98.46%'}</p>
					</Card>
					<Card title='上传图片信息' bordered={false} style={{width:250,boxShadow: '5px 5px 5px #ddd'}}>
						<p>图片分辨率： 28*28</p>
						<p>预测标签： {predictRes}</p>
					</Card>
				</div>
				
			</div>
		)

		const actions = [showprocess,showpicture,showerror,placeholder];
		//test
		// const actions = [showpicture,showpicture,showerror,placeholder];
		return (
			<div className='details'>
				{actions[this.props.focus?this.props.focus.code:3]}
			</div>
		)
    }
}
