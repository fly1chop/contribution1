//==============================================================================
//	Define the Component Class of the Compostie Component.
//==============================================================================
//==============================================================================
// Object : nexacro.JusoPostCode
// Group : Component
//==============================================================================
if (!nexacro.JusoPostCode)
{
	//==============================================================================
	// nexacro.JusoPostCode
	//==============================================================================
	nexacro.JusoPostCode = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
	{
		nexacro._CompositeComponent.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
	};

	var _pJusoPostCode = nexacro._createPrototype(nexacro._CompositeComponent, nexacro.JusoPostCode);
	nexacro.JusoPostCode.prototype = _pJusoPostCode;
	_pJusoPostCode._type_name = "JusoPostCode";
	
	/* accessibility */
	_pJusoPostCode.accessibilityrole = "form";	
	
	_pJusoPostCode.jspUrl = "";
	_pJusoPostCode.set_jspUrl = function (v)
	{
		// TODO : enter your code here.
		this.jspUrl = v;
	};
	
	
	/**
	 * @class null값 확인
	 * @param {Object} objDs - 확인 대상 Dataset
	 * @return {boolean}
	 */   
	_pJusoPostCode._isNull = function(sValue)
	{
		if (new String(sValue).valueOf() == "undefined") return true;
		if (sValue == null) return true;
		
		var ChkStr = new String(sValue);

		if (ChkStr == null) return true;
		if (ChkStr.toString().length == 0 ) return true;
		return false;
	};
	
	/**
	* @class 행정안전부 우편번호 검색 <br>
	* @param {Object} obj - Button Component
	* @return N/A - 웹브라우져 onusernotify에서 (식별자 ::: 주소1 ::: 주소2 ::: 상세주소 :::  우편번호) 형태로 전달
	* @example 
	* this.gfnPostSearch(obj);
	*/
	_pJusoPostCode._postSearch = function(obj)
	{
		if(this._isNull(this.jspUrl)){
			// 메시지 출력
		} else {
			if (!this.form.components[obj.name+"_webPost"]) 
			{
				var objWeb = new WebBrowser();  
				objWeb.init(obj.name+"_webPost", obj.left, obj.top+obj.height+10, 500, 500, null, null);

				// Add Object to Parent Form  
				this.form.addChild(obj.name+"_webPost", objWeb);
				 
				// Show Object
				objWeb.show();
			} else 
			{
				var objWeb = this.form.components[obj.name+"_webPost"];
			}
			
			//var sUrl = nexacro.getEnvironment().services['svcUrl'].url + "thirdParty/post/PostCall.jsp";
			trace(this.jspUrl);
			objWeb.set_url(this.jspUrl);
			// onusernotify 이벤트 추가
			objWeb.addEventHandler("onusernotify", this._webPost_onusernotify, this);	
		}
	};
	
	/**
	 * @description 우편번호 선택 시 콜백함수 호출
	*/
	_pJusoPostCode._webPost_onusernotify = function(obj, e)
	{
		var sPost = e.userdata;
		trace(sPost);
		if (sPost.indexOf("OK!!!:::") == 0) 
		{
			// e.userdata ==>(식별자 ::: 주소1 ::: 주소2 ::: 상세주소 :::  우편번호)
			var aAddress = sPost.split(":::");

			// form에 callback 함수가 있을때
			trace("1 :: " + this.form["fnPostCallBack"]);
			trace("2 :: " + this.form.lookupFunc("fnPostCallBack"));
			trace("3 :: " + (obj.name).replace("_webPost",""));
			
			if (this.form["fnPostCallBack"]) this.form.lookupFunc("fnPostCallBack").call((obj.name).replace("_webPost",""), aAddress);
		}
	};	

	delete _pJusoPostCode;
}


	
	
	/************************************************************************
	FUNCTION : _get_form_module
	DESCRIPTION :
	RETURN :
	************************************************************************/
	nexacro.JusoPostCode.prototype._get_form_module = function ()
	{
		return function()
		{
			if (!this._is_form)
			return;
			
			var obj = null;
			
			this.on_create = function()
			{
				this.set_name("JusoPostCode");
				this.set_titletext("JusoPostCode");
				if (nexacro.Form == this.constructor)
				{
					this._setFormPosition(900,24);
				}
				
				// Object(Dataset, ExcelExportObject) Initialize
				
				
				// UI Components Initialize
				obj = new nexacro.Edit("edtSculZip","0","0","92","24",null,null,null,null,null,null,this);
				obj.set_taborder("0");
				obj.set_displaynulltext("우편번호");
				obj.set_readonly("true");
				obj.set_cssclass("edt_WF_Read");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btnSearchPost","95","0","24","24",null,null,null,null,null,null,this);
				obj.set_taborder("1");
				obj.set_cssclass("btn_WF_Sch");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Edit("edtBasAddr","122","0","448","24",null,null,null,null,null,null,this);
				obj.set_taborder("2");
				obj.set_readonly("true");
				obj.set_maxlength("200");
				obj.set_cssclass("edt_WF_Read");
				obj.set_displaynulltext("도로명주소");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Edit("edtDetailAddr","573","0",null,"24","0",null,null,null,null,null,this);
				obj.set_taborder("3");
				obj.set_maxlength("200");
				obj.set_displaynulltext("상세주소");
				this.addChild(obj.name, obj);
				// Layout Functions
				//-- Default Layout : this
				obj = new nexacro.Layout("default","",900,24,this,function(p){});
				this.addLayout(obj.name, obj);
				
				// BindItem Information
				obj = new nexacro.BindItem("item0","edtDetailAddr","value","ds_list","DETL_ADDR");
				this.addChild(obj.name, obj);
				obj.bind();
			};
			
			this.loadPreloadList = function()
			{
				
			};
			
			// User Script
			this.registerScript("JusoPostCode.xcdl", function() {
					this.btn_searchPost_onclick = function(obj,e)
					{
						this.parent._postSearch(obj);
					};
					
					/**
					* @description 우편번호 CallBack 함수(선택)
					*/
					this.fnPostCallBack = function(sName, aAddr)
					{
						if (sName == "btnSearchPost") {
							trace("onusernotify ----------------------------");
							trace("array[1]=>주소1          ==> " +	aAddr[1] );
							trace("array[2]=>주소2          ==> " +	aAddr[2] );
							trace("array[3]=>상세주소      ==> " + aAddr[3] );
							trace("array[4]=>우편번호      ==> " +	aAddr[4] );
							trace("-----------------------------------------");
							
							this.edtSculZip.set_value(aAddr[4]);	        // 우편번호
							this.edtBasAddr.set_value(aAddr[1]+aAddr[2]);	// 주소
							this.edtDetailAddr.set_value(aAddr[3]);	    	// 상세 주소
						}
					};
					
					
				});
			
			// Regist UI Components Event
			this.on_initEvent = function()
			{
				this.btnSearchPost.addEventHandler("onclick",this.btn_searchPost_onclick,this);
			};
			this.loadIncludeScript("JusoPostCode.xcdl");
			this.loadPreloadList();
			
			// Remove Reference
			obj = null;
		};
	};