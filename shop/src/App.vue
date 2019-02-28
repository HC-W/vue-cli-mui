<template>
	<div id="app">
		<!--头部列表选项卡-->
		<header class="mui-bar mui-bar-nav">
			<div class="tab_nav_div">
			<!--商品分类-->
				<ul class="tab_nav_ul">
					<li v-for="(item,index) in obj" class="mui-control-item" :class="num == item.id?'redClass':'blockClass'" @tap="tab(item.id)">{{item.classname}}</li>
				</ul>
			</div>
		</header>

		<!--中间详细数据-->
		<div id="refreshContainer" class="mui-content mui-scroll-wrapper">
		
			<div class="mui-scroll">
			
				<!--数据列表-->
			
				<ul class="mui-table-view mui-table-view-chevron" id="ull">
				
					<li class="mui-table-view-cell mui-media" v-for="(item, index) in listObj">
						<img :src="item.goods_url" />
						<p class="cont_li_p1">{{item.goods_name}}</p>
						<p class="cont_li_p2">券后<span>￥{{item.price_after_coupons}}</span></p>
						<p class="cont_li_p3">{{Number(item.price_coupons)}}元券</p>
						</li>

					</ul>
				</div>
				<span id="scrollToTop" v-if="topShow" class="callTop">
					返回顶部
				</span>
			</div>

		<!--底部选项卡-->
		<nav class="mui-bar mui-bar-tab">
			<a class="mui-tab-item">
				<span class="mui-icon mui-icon-home"></span>
				<span class="mui-tab-label">返券</span>
			</a>
			<a class="mui-tab-item">
				<span class="mui-icon mui-icon-phone"></span>
				<span class="mui-tab-label">搜索</span>
			</a>
			<a class="mui-tab-item mui-active">
				<span class="mui-icon mui-icon-email"></span>
				<span class="mui-tab-label">全网榜单</span>
			</a>
			<a class="mui-tab-item">
				<span class="mui-icon mui-icon-gear"></span>
				<span class="mui-tab-label">个人中心</span>
			</a>
		</nav>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				obj: [],
				listObj: [],
				page: 1,
				isShow: false,
				topShow: false,
				show:false,
				num:1,
				count: 0,
				conHeight:700,
			};
		},
		methods: {
			bindTouchEvent() {
				this.el.addEventListener('scroll', this.scrollBottom);
			},
			//上拉加载数据请求
			getJoke() {
				let self = this;
				self.page += 1;
				self.show = false;
//				上滑加载请求数据
				this.$.ajax({
					type: "get",
					url: "/Api/phalapi/public/index.php?s=App.Goodslink.index&page="+self.page+"&cid=" + self.num,
					success(data) {
						let json = data.data;
						for(let i=0;i<json.length;i++) {
							self.listObj.push(json[i]);
						}
						
						self.count += json.length;
//						console.log("oo");
//						self.topShow = true;
//						到达条件加载停止
						mui('#refreshContainer').pullRefresh().endPullupToRefresh(self.count >= 200);
					}
				})
			},
			//请求第一页的数据
			requ() {
				
				let self = this;
				self.topShow = false;
//				上滑加载请求数据
				this.$.ajax({
					type: "get",
					url: "/Api/phalapi/public/index.php?s=App.Goodslink.index&page=1&cid=" + self.num,
					success(data) {
						let json = data.data;
						self.listObj = json;
						self.count = self.listObj.length;
					}
				})
			},
			//下拉刷新
			pulldownRefresh() {
				let self = this;
				self.requ();
				setTimeout(() => {
					mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
					self.count = self.listObj.length;
					self.page = 1;
					self.topShow = false;
					//恢复拉动
					mui('#refreshContainer').pullRefresh().refresh(true); 
				}, 1000)
			},
			//上拉加载数据
			pullupRefresh() {
				let self = this;
				if(this.hh>667) {
					let o =1;
					if(o<=2) {
						self.getJoke();
						o++;
					}
				}else{
					self.getJoke();
				}
				
			},
			tab(num) {
				this.num = num;
				this.page = 1;
				this.topShow = false;
				this.requ();
				mui('#refreshContainer').pullRefresh().refresh(true); 
			},
		},
		created(e) {
			let self = this;
			mui.ready(function() {
				mui.init({
					pullRefresh: {
						container: '#refreshContainer',
						down: {
							callback: self.pulldownRefresh
						},
						up: {
							auto:true,
							contentrefresh: '正在加载...',
							callback: self.pullupRefresh
						}
					}
				});
				self.requ();
			});
			this.$.ajax({
				type: "get",
				url: "/Api/phalapi/public/index.php?s=Classlist.index",
				success(data) {
					let json = data.data;
					self.obj = json;
				}
			});
		},
		mounted() {
			this.hh = window.screen.height;
			this.el = document.querySelector(".mui-scroll");
			this.bindTouchEvent();
		}
	};
</script>

<style lang="css" scoped>
	/*全局样式去除*/
	
	* {
		touch-action: pan-y;
		padding: 0;
	}
	header {
		background-color: white;
	}
	.title {
		font-size: 19px;
		width: 100%;
		text-align: center;
	}
	
	.mui-bar-tab .mui-tab-item.mui-active {
		color: red;
	}
	.mui-bar-nav~.mui-content[data-v-7ba5bd90] {
	    padding-top: 55px;
	}
	.mui-pull {
		bottom: -15px;
	}
	.redClass {
		color: red;
	}
	
	.blockClass {
		color: black;
	}
	.mui-table-view {
		background-color: transparent;
	}
	img {
		width: 100%;
		height: 130px;
		border-radius: 5px;
	}
	
	.mui-scroll ul {
		width: 100%;
		overflow: hidden;
	}
	
	.mui-table-view-chevron .mui-table-view-cell {
		padding-right: 0;
	}
	
	.mui-scroll ul li {
		float: left;
		width: 31%;
		margin: 0 1% 10px 1%;
		position: relative;
		background-color: white;
		border-radius: 5px;
	}
	.callTop {
		position: fixed;
		z-index: 30;
		display: block;
		background-color: skyblue;
		top: 50%;
		right: 20%;
	}
	.cont_li_p1 {
		width: 100%;
		height: auto;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 17px;
	}
	
	.cont_li_p2 {
		width: 100%;
		text-align: center;
		font-size: 15px;
		margin: 6px auto;
	}
	
	.cont_li_p2 span {
		font-size: 16px;
		color: red;
	}
	
	.cont_li_p3 {
		position: absolute;
		top: 0;
		left: 0;
		text-align: center;
		font-size: 15px;
		background-color: red;
		color: white;

	}
.tab_nav_div {
	width: 100%;
	background-color: white;
}
.tab_nav_ul {
	list-style: none;
	width: 200%;
	display: flex;
	justify-content: space-around;
}
.tab_nav_ul	li {
	font-size: 18px;
}
.tab_nav_ul2 li {
		float: left;
		margin: 5px 5px;
		font-size: 16px;
	}
.isshow {
	font-size: 16px;
	color: red;
	width: 100%;
	text-align: center;
}
</style>