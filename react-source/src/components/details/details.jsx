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

	getTPS(posCnt,negCnt){
		posCnt = +posCnt;
		negCnt = +negCnt;
		return ((posCnt/(posCnt+negCnt))*100).toFixed(2) + '%';
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

		const {
			predictUrl, uploadUrl, createdAt, 
			posTumorsCount, negTumorsCount
		} = this.props.focus||{};
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
					<Zmage src={predictUrl}/>	
				</div>
				{/* <div className='preview-footer'>
					<div className='footer-content'>
						<Row gutter={16}>
							<Col span={6}>阳性细胞数量：</Col>
							<Col span={4}>{9999}</Col>
							<Col span={6} offset={3}>阴性细胞数量：</Col>
							<Col span={4}>{9999}</Col>
						</Row>
						<Row gutter={16}>
							<Col span={6}>模型像素精度：</Col>
							<Col span={4}>{'99.99%'}</Col>
							<Col span={6} offset={3}>模型准确率：</Col>
							<Col span={4}>{'99.99%'}</Col>
						</Row>
						<Row gutter={16}>
							<Col span={6}>模型召回率：</Col>
							<Col span={4}>{'99.99%'}</Col>
							<Col span={6} offset={3}>模型F1分数：</Col>
							<Col span={4}>{'99.99%'}</Col>
						</Row>
					</div>
				</div> */}
				<div className='card-wrap'>
					<Card title='肿瘤细胞分割分类指标' bordered={false} style={{width:250,boxShadow: '5px 5px 5px #ddd'}}>
						<p>总体像素精度： 90.07%</p>
						<p>计数误差（平均）: {'<5%'}</p>
						<p>TPS误差（平均）：{'<10%'}</p>
					</Card>
					<Card title='肿瘤细胞细胞计数' bordered={false} style={{width:250,boxShadow: '5px 5px 5px #ddd'}}>
						<p>阳性细胞数量： {posTumorsCount}</p>
						<p>阴性细胞数量： {negTumorsCount}</p>
						<p>TPS指标：{this.getTPS(posTumorsCount,negTumorsCount)}</p>
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
