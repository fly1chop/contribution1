//==============================================================================
//	Define the Component Class of the Compostie Component.
//==============================================================================
//==============================================================================
// Object : nexacro.DaumPostCode
// Group : Component
//==============================================================================
if (!nexacro.DaumPostCode)
{
	//==============================================================================
	// nexacro.DaumPostCode
	//==============================================================================
	nexacro.DaumPostCode = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
	{
		nexacro._CompositeComponent.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
		
		/*
		 *	HTML5 만 지원함으로 예외처리
		 */

		if(system.navigatorname != "nexacro")
		{
			nexacro.load_daumpostcode();
		}
		else
		{
			trace("DaumPostCode composite component supports only the web browsers");
		}
	};
	
	var _pDaumPostCode = nexacro._createPrototype(nexacro._CompositeComponent, nexacro.DaumPostCode);
	nexacro.DaumPostCode.prototype = _pDaumPostCode;
	_pDaumPostCode._type_name = "DaumPostCode";
	
	nexacro.daumpostcode_loaded = false;
	nexacro.load_daumpostcode = function()
	{
		if (nexacro.daumpostcode_loaded)
		{
			return;
		}
		nexacro.daumpostcode_loaded = true;
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "//dmaps.daum.net/map_js_init/postcode.v2.js?autoload=false";
		document.body.appendChild(script);
	};
		
	/* accessibility */
	_pDaumPostCode.accessibilityrole = "form";
	
	/* Property setter */
	_pDaumPostCode.postcode = "";
	_pDaumPostCode.set_postcode = function (v)
	{
		if(this.form.editPostcode)
		{
			this.form.editPostcode.set_value(v);
		}
		this.postcode = v;
	};
	
	_pDaumPostCode.address = "";
	_pDaumPostCode.set_address = function (v)
	{
		if(this.form.edtAddress)
		{
			this.form.edtAddress.set_value(v);
		}
		this.address = v;
	};
	
	_pDaumPostCode.detailAddress = "";
	_pDaumPostCode.set_detailAddress = function (v)
	{
		if(this.form.editDetailAddress)
		{
			this.form.editDetailAddress.set_value(v);
		}
		this.detailAddress = v;
	};

	delete _pDaumPostCode;
}


	
	
	/************************************************************************
	FUNCTION : _get_form_module
	DESCRIPTION :
	RETURN :
	************************************************************************/
	nexacro.DaumPostCode.prototype._get_form_module = function ()
	{
		return function()
		{
			if (!this._is_form)
			return;
			
			var obj = null;
			
			this.on_create = function()
			{
				this.set_name("DaumPostCode");
				this.set_titletext("DaumPostCode");
				if (nexacro.Form == this.constructor)
				{
					this._setFormPosition(350,78);
				}
				
				// Object(Dataset, ExcelExportObject) Initialize
				
				
				// UI Components Initialize
				obj = new nexacro.Edit("edtPostcode","0","0","140","24",null,null,null,null,null,null,this);
				obj.set_taborder("0");
				obj.set_displaynulltext("우편번호");
				obj.set_readonly("true");
				obj.set_cssclass("edt_WF_Read");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Edit("edtAddress","0","27",null,"24","0",null,null,null,null,null,this);
				obj.set_taborder("1");
				obj.set_displaynulltext("도로명주소");
				obj.set_readonly("true");
				obj.set_cssclass("edt_WF_Read");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Edit("editDetailAddress","0","54",null,"24","0",null,null,null,null,null,this);
				obj.set_taborder("2");
				obj.set_displaynulltext("상세주소");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btnFindPostcode","143","0","95","24",null,null,null,null,null,null,this);
				obj.set_taborder("3");
				obj.set_text("우편번호 찾기");
				obj.set_cssclass("btn_WF_Detail");
				this.addChild(obj.name, obj);
				// Layout Functions
				//-- Default Layout : this
				obj = new nexacro.Layout("default","",350,78,this,function(p){});
				this.addLayout(obj.name, obj);
				
				// BindItem Information
				
			};
			
			this.loadPreloadList = function()
			{
				
			};
			
			// User Script
			this.registerScript("DaumPostCode.xcdl", function() {
					
					var that = this;
					this.btnFindPostcode_onclick = function(obj,e)
					{
						if(daum)
						{
							daum.postcode.load(function(){
									new daum.Postcode({
											oncomplete: function(data) {
												that.parent.set_postcode(data.zonecode);
												that.parent.set_address(data.roadAddress);
											}
										}).open();
								});
						}
					};
					
					this.editDetailAddress_onchanged = function(obj,e)
					{
						this.parent.set_detailAddress(e.postvalue);
					};
					
				});
			
			// Regist UI Components Event
			this.on_initEvent = function()
			{
				this.editDetailAddress.addEventHandler("onchanged",this.editDetailAddress_onchanged,this);
				this.btnFindPostcode.addEventHandler("onclick",this.btnFindPostcode_onclick,this);
			};
			this.loadIncludeScript("DaumPostCode.xcdl");
			this.loadPreloadList();
			
			// Remove Reference
			obj = null;
		};
	};