/**
*  devPack Library
*  @FileName 	ExtLib.js 
*  @Creator 	TOBESOFT
*  @CreateDate 	2021.01.05
*  @Desction    외부 모듈 연동 관련 공통함수
************** 소스 수정 이력 ***********************************************
*  date          		Modifier                Description
*******************************************************************************
* 2020.11.24			TOBESOFT				Frame Library
*******************************************************************************
*/

var pForm = nexacro.Form.prototype;

/**
 * @class Web Editor 를 생성한다.<br>
 * @param {Object} objWebrowser - Webrowser 콤포넌트
 */
pForm.gfnCreateWebEditor = function(objWebrowser)
{
	var sUrl = "";
	
	//if( objWebrowser == null || !(objWebrowser instanceof WebBrowser)) return;

	sUrl = nexacro.getEnvironment().services['svcUrl'].url + "devPack/thirdParty/ckeditor/html/ckeditor.html";

	objWebrowser.set_url(sUrl);
};

/**
 * @class HTML Viewer를 생성한다.<br>
 * @param {Object} objWebrowser - Webrowser 콤포넌트
 */
pForm.gfnCreateHtmlViewer = function(objWebrowser)
{
	var sUrl = "";
	
	if( objWebrowser == null || !(objWebrowser instanceof WebBrowser)) return;
	
	//sUrl = nexacro.getEnvironment().services['svcUrl'].url + "html/htmlviewer.html";
	sUrl = nexacro.getEnvironment().services['svcUrl'].url + "devPack/thirdParty/ckeditor/html/ckeditor2.html";
	
	objWebrowser.set_url(sUrl);
};

/**
 * @class HTML을 보여준다.<br>
 * @param {Object} objWebrowser - Webrowser 콤포넌트
 */
pForm.gfnSetHtmlView = function(objWebrowser,  sHtml)
{
	if( objWebrowser == null || !(objWebrowser instanceof WebBrowser)) return;
	if( this.gfnIsNull(sHtml) ) sHtml = "";

	objWebrowser.callMethod("setInnerHtml", sHtml);
};

/**
* @class 행정안전부 우편번호 검색 <br>
* @param {Object} obj - Button Component
* @return N/A - 웹브라우져 onusernotify에서 (식별자 ::: 주소1 ::: 주소2 ::: 상세주소 :::  우편번호) 형태로 전달
* @example 
* this.gfnPostSearch(obj);
*/
pForm.gfnPostSearch = function(obj)
{
	var objApp = nexacro.getApplication();	

	if (!this.components[obj.name+"_webPost"]) 
	{
		var objWeb = new WebBrowser();  
		objWeb.init(obj.name+"_webPost", obj.left, obj.top+obj.height+10, 500, 500, null, null);

		// Add Object to Parent Form  
		this.addChild(obj.name+"_webPost", objWeb);
		 
		// Show Object
		objWeb.show();
	} else 
	{
		var objWeb = this.components[obj.name+"_webPost"];
	}
	
	var sUrl = nexacro.getEnvironment().services['svcUrl'].url;
	if( sUrl.indexOf("localhost") > -1) {
		sUrl="http://127.0.0.1:8083/devPack/";
	}
	sUrl	+= "thirdParty/post/PostCall.jsp";
	objWeb.set_url(sUrl);
	
	// onusernotify 이벤트 추가
	objWeb.addEventHandler("onusernotify", this._gfnWebPost_onusernotify, this);	
};

/**
 * @description 우편번호 선택 시 콜백함수 호출
*/
pForm._gfnWebPost_onusernotify = function(obj, e)
{
	var sPost = e.userdata;

	if (sPost.indexOf("OK!!!:::") == 0) 
	{
		// e.userdata ==>(식별자 ::: 주소1 ::: 주소2 ::: 상세주소 :::  우편번호)
		var aAddress = sPost.split(":::");
		// form에 callback 함수가 있을때
		if (this["fnPostCallback"]) this.lookupFunc("fnPostCallback").call((obj.name).replace("_webPost",""), aAddress);
	}
};

pForm = null;