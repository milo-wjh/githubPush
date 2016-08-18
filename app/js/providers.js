angular.module('providers', [])
.factory('viewport', ['$document', '$window', function($document, $window){
		var $ = function(ele){
		 return angular.element(ele);
		}
		var _uid =0 ;
		var _list = [];
		var elements = function(){

			 return {

				 // 获取图片集合
				 push : function(ele){
					 _list[_uid ++] = ele ;
				 },

				 // 从集合中删除已load的子集
				 del : function(key){
					_list[key] && delete _list[key] ;
				 },

				 get : function(){
					 return _list  ;
				 },

				 size : function(){
					 return _list.length ;
				 }

			 }

		};
		//  元素是否在可视区域
		var isVisible = function(ele){
			var element = ele[0];
			var o = {};
			var offsetTop = element.offsetTop;
			var offsetLeft = element.offsetLeft;
			while(element = element.offsetParent) {
				offsetTop += element.offsetTop;
				offsetLeft += element.offsetLeft;
			}
			o.left = offsetLeft;
			o.top = offsetTop;

			if($(window)[0].parent.innerHeight < o.top
				&&  $(window)[0].pageYOffset + $(window)[0].parent.innerHeight < o.top 
				||  $(window)[0].pageYOffset >( o.top + ele[0].height)) {
			 return false;
			}else{
			 return true;
			}

		}

		//  检查图片是否可见
		var checkImage = function(){
			var eles = elements().get();
			angular.forEach(eles ,function(v , k){
			 isVisible(v.elem) ? eles[k].load(k) : false ;
			})
		}

		var initload = function(){
			checkImage();
			$(window).on('scroll' , checkImage)
		}
	return {
		'elements': elements(),
		'isVisible': isVisible,
		'checkImage': checkImage,
		'initload': initload
	}
}])
.factory('linkService', ['$http', function($http) {
	return {
		getlist: function(name) {
			return $http.get('json/' + name + '.json');
		}
	}
}])
.factory('scroll', ['$document', '$window', function($document, $window){
	var scrollPage = 0;
	var loading_flag = false;
	var scrollWay = function() {
		var winTop = $(window).scrollTop() + 100;
		var docHeight = $(document).height();
		var winHeight = $(window).height();
		if (docHeight - winHeight < winTop && !loading_flag) {
			scrollPage++;
			loading_flag = !loading_flag;
		}
		console.log('winTop=' + winTop)
		console.log('docHeight=' + docHeight)
		console.log('winHeight=' + winHeight)
		console.log(docHeight - winTop <= winHeight)
		return {
			'scrollPage': scrollPage,
			'loading_flag': loading_flag,
			'change': change
		}
	}
	var change = function() {
		loading_flag = false;
	}
	return {
		'scrollWatch': scrollWay,
		'change': change
	}
}])