//==============================================================================
//	Define the Component Class of the Compostie Component.
//==============================================================================
//==============================================================================
// Object : nexacro.MultiCombo
// Group : Component
//==============================================================================
if (!nexacro.MultiCombo)
{
	//==============================================================================
	// nexacro.MultiCombo
	//==============================================================================
	nexacro.MultiCombo = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
	{
		nexacro._CompositeComponent.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
	};

	var _pMultiCombo = nexacro._createPrototype(nexacro._CompositeComponent, nexacro.MultiCombo);
	nexacro.MultiCombo.prototype = _pMultiCombo;
	_pMultiCombo._type_name = "MultiCombo";
		
	/* accessibility */
	_pMultiCombo.accessibilityrole = "form";	
	
	_pMultiCombo.value = "";
	_pMultiCombo.set_value = function (v)
	{
		// TODO : enter your code here.
		//value 값이 변경되었을 경우
		if (this.value != v) {
			this.value = v;
			//value 변경 처리 함수 호출
			this.on_apply_value("value", v);
		}
	};	
	
	_pMultiCombo.text = "";
	_pMultiCombo.set_text = function (v)
	{
		// TODO : enter your code here.
		//text 값이 변경되었을 경우
		if (this.text != v) {
			this.text = v;
			//text 변경 처리 함수 호출
			this.on_apply_value("text", v);
		}
	};	
	
	_pMultiCombo.on_apply_value = function(propId, v)
	{
		var i;
		var idx;
		var ds 			= this._innerdataset;
		var codecolumn  = this.codecolumn;
		var datacolumn  = this.datacolumn == "" ? codecolumn : this.datacolumn;
		var checkcolumn = this.checkcolumn;
		var arr_value 	= [];
		var arr_text 	= [];
		var value;

		//값이 없으면 
		if(!v)
		{
			//checkdataset, codecolumn, checkcolumn이 설정되어있을 경우
			if (ds && codecolumn && checkcolumn) 
			{
				//checkcolumn 전체 체크 해제
				for(i=0;i<ds.rowcount;i++)
				{
					ds.setColumn(i, checkcolumn, 0);
				}
				//속성 값 초기화
				this.value = null;
				this.text = null;
			}
		}
		else
		{
			//checkdataset, codecolumn, checkcolumn이 설정되어있을 경우
			if (ds && codecolumn && checkcolumn) 
			{
				//checkcolumn 전체 체크 해제
				for(i=0;i<ds.rowcount;i++)
				{
					ds.setColumn(i, checkcolumn, 0);
				}
				//value 속성이 변경되었을 경우
				if(propId=="value"){
					arr_value = v.split(",");
					//value에 해당하는 text 값 및 check 값 설정
					for(i=0;i<arr_value.length;i++){
						val = arr_value[i];
						idx = ds.findRow(codecolumn, val);
						if(idx>-1)
						{
							arr_text[arr_text.length] = ds.getColumn(idx, datacolumn);
							ds.setColumn(idx, checkcolumn, 1);
						}
					}  
				}
				//text 속성이 변경되었을 경우
				else if(propId=="text")
				{
					arr_text = v.split(",");
					//text에 해당하는 value 값 및 check 값 설정
					for(i=0;i<arr_text.length;i++){
						text = arr_text[i];
						idx = ds.findRow(datacolumn, text); 
						if(idx>-1)
						{
							arr_value[arr_value.length] = ds.getColumn(idx, codecolumn);
							ds.setColumn(idx, checkcolumn, 1);
						}
					}
				}
				//속성에 값 설정
				this.value = arr_value.toString();
				this.text = arr_text.toString();
			}
		}
		//comboedit가 존재할 경우 value 값 변경
		if(this.form.comboedit)this.form.comboedit.set_value(this.text);
		
		//bind된 데이터셋에 적용 함수 호출
		this.applyto_bindSource("value", this.value);
	};
	
	
	
	_pMultiCombo.datacolumn = "";
	_pMultiCombo.set_datacolumn = function (v)
	{
		// TODO : enter your code here.
		if (this.datacolumn != v) {
			this.datacolumn=v;
			//text 변경 처리 함수 호출
			this.on_apply_datacolumn(v);
		}
	};	
	
	_pMultiCombo.on_apply_datacolumn = function (v)
	{
		//combolist 존재할 경우
		if(this.form.combolist)
		{
			//combogrid 가져오기
			var grid = this.form.combolist.form.combogrid;

			//combogrid Row size 변경
			if(!this._isNull(v)){
			  grid.setCellProperty("body", 2, "text", "bind:"+v);
			}else{
			  grid.setCellProperty("body", 2, "text", "bind:data");
			}
		}
	};
	_pMultiCombo.checkcolumn = "";
	_pMultiCombo.set_checkcolumn = function (v)
	{
		if (this.checkcolumn != v) {
			this.checkcolumn = v;
			//text 변경 처리 함수 호출
			this.on_apply_checkcolumn(v);
		}

	};	
	_pMultiCombo.on_apply_checkcolumn = function (v)
	{
		//combolist 존재할 경우
		if(this.form.combolist)
		{
			//combogrid 가져오기
			var grid = this.form.combolist.form.combogrid;

			//combogrid Row size 변경
			if(!this._isNull(v)){
			  grid.setCellProperty("body", 0, "text", "bind:"+v);
			}else{
			  grid.setCellProperty("body", 0, "text", "bind:chk");
			}
		}
	};
	_pMultiCombo.codecolumn = "";
	_pMultiCombo.set_codecolumn = function (v)
	{
		//text 값이 변경되었을 경우
		if (this.codecolumn != v) {
			this.codecolumn = v;
			//text 변경 처리 함수 호출
			this.on_apply_codecolumn(v);
		}
	};	
	_pMultiCombo.on_apply_codecolumn = function (v)
	{
		//combolist 존재할 경우
		if(this.form.combolist)
		{
			//combogrid 가져오기
			var grid = this.form.combolist.form.combogrid;

			//combogrid Row size 변경
			if(!this._isNull(v)){
			  grid.setCellProperty("body", 1, "text", "bind:"+v);
			}else{
			  grid.setCellProperty("body", 1, "text", "bind:code");
			}
		}
	};
	_pMultiCombo.displayrowcount = "";
	_pMultiCombo.set_displayrowcount = function (v)
	{
		// TODO : enter your code here.
		//displayrowcount 값이 잘못된 값이면 리턴
		if (v !== undefined) {
			if (isNaN(v = +v) || v < 0) {
			  return;
			}
		}

		// displayrowcount 값이 변경되었을 경우
		if (this.displayrowcount != v) {
			this.displayrowcount = v;
		}
	};	
	
	_pMultiCombo.innerdataset = "";
	_pMultiCombo.set_innerdataset = function (v)
	{

		if (typeof v != "string") {
			this.setInnerDataset(v);
			return;
		}

		if (this.innerdataset != v) {
			//this._removeEventHandlerToInnerDataset();

			if (!v) {
				this._innerdataset = null;
				this.innerdataset = "";
			}
			else {
				v = v.replace("@", "");
				var _v = this._findDataset(v);
				this._innerdataset = _v ? _v : "";
				this.innerdataset = v;
			}
			this.on_apply_innerdataset(this._innerdataset);
		}
		else if (this.innerdataset && !this._innerdataset) {
			this._setInnerDatasetStr(this.innerdataset);
			this.on_apply_innerdataset(this._innerdataset);
		}
	};	
	
	//checkdataset 변경에 따른 후처리 함수
	_pMultiCombo.on_apply_innerdataset = function (v)
	{
	  //combolist 존재할 경우
	  if(this.form.combolist)
	  {
		//combogrid에 데이터셋 bind
		this.form.combolist.form.combogrid.set_binddataset(v);
		this.form.combolist.form.combogrid.set_enableredraw(true);
	  }

		if (v) {
			this.redraw();
		}
	};
	
	_pMultiCombo.redraw = function () {
		if (this.text || !nexacro._isNull(this.value)) {
			this.set_value("text",this.text);
		}
		else {
			this.set_value("text",undefined);
		}
	};
	
	_pMultiCombo.setInnerDataset = function (obj) {
		//this._removeEventHandlerToInnerDataset();

		if (!obj) {
			this._innerdataset = null;
			this.innerdataset = "";
			this.on_apply_innerdataset(null);
		}
		else if (obj instanceof nexacro.Dataset || (typeof obj == "object" && obj._type_name == "Dataset")) {
			this._innerdataset = obj;
			this.innerdataset = obj.id;
			this.on_apply_innerdataset(obj);
			if (this._is_created) {
				this.redraw();
			}
		}
	};
	
	_pMultiCombo._setInnerDatasetStr = function (str) {
		//this._removeEventHandlerToInnerDataset();

		if (str) {
			str = str.replace("@", "");
			this._innerdataset = this._findDataset(str);
			this.innerdataset = str;
		}
		else {
			this._innerdataset = null;
			this.innerdataset = "";
		}
	};
	
	_pMultiCombo.itemheight = "";
	_pMultiCombo.set_itemheight = function (v)
	{
		// TODO : enter your code here.
		//itemheight 값이 잘못된 값이면 리턴
		if (v !== undefined) {
			if (isNaN(v = +v)) {
			  return;
			}
		}

		//itemheight 값이 변경되었을 경우
		if (this.itemheight != v) {
			//itemheight 값 변경
			this.itemheight = v;
			
			//itemheight 변경에 따른 후처리 함수 호출
			this.on_apply_itemheight(v);
		}
	};
	
	_pMultiCombo.on_apply_itemheight = function (v)
	{
		//combolist 존재할 경우
		if(this.form.combolist)
		{
			//combogrid 가져오기
			var grid = this.form.combolist.form.combogrid;
			grid.set_enableredraw(false);
			//combogrid Row size 변경
			if(!v){
			  grid.setFormatRowProperty(0, "size", 28);
			}else{
			  grid.setFormatRowProperty(0, "size", v);
			}
			grid.set_enableredraw(true);
		}
	};	
	
	/************************************************************************
	FUNCTION : on_created_contents
	DESCRIPTION : Called when running on_created() TFunctionItem.
	on_created() TFunctionItem creates the element of the component as a node and becomes an entity.
	Dynamically called when a component is created.
	PARAMETER : win : nexacro._Window (nexacro._Window to which Component belongs)
	RETURN : void
	************************************************************************/
	_pMultiCombo.on_created_contents = function (win)
	{
		nexacro._CompositeComponent.prototype.on_created_contents.call(this, win);
		// TODO : enter your code here.
		//컴포넌트에 설정된 property 값을 반영
		this.on_apply_innerdataset(this.innerdataset);
		this.on_apply_checkcolumn(this.checkcolumn);
		this.on_apply_codecolumn(this.codecolumn);
		this.on_apply_datacolumn(this.datacolumn);
		this.on_apply_value(this.value);
		this.on_apply_itemheight(this.itemheight);
	};
	/************************************************************************
	FUNCTION : on_create_contents
	DESCRIPTION : Called after creating nexacro.ControlElement when running createComponent.
	PARAMETER : void
	RETURN : void
	************************************************************************/
	_pMultiCombo.on_create_contents = function ()
	{
		nexacro._CompositeComponent.prototype.on_create_contents.call(this);
		// TODO : enter your code here.
		//컴포넌트에 설정된 property 값을 반영
		this.on_apply_innerdataset(this.innerdataset);
		this.on_apply_checkcolumn(this.checkcolumn);
		this.on_apply_codecolumn(this.codecolumn);
		this.on_apply_datacolumn(this.datacolumn);
		this.on_apply_value(this.value);
		this.on_apply_itemheight(this.itemheight);
	};	
	/**
	 * @class null값 확인
	 * @param {Object} objDs - 확인 대상 Dataset
	 * @return {boolean}
	 */   
	_pMultiCombo._isNull = function(sValue)
	{
		if (new String(sValue).valueOf() == "undefined") return true;
		if (sValue == null) return true;
		
		var ChkStr = new String(sValue);

		if (ChkStr == null) return true;
		if (ChkStr.toString().length == 0 ) return true;
		return false;
	};	
	
	/************************************************************************
	FUNCTION : on_change_bindSource
	DESCRIPTION : Called when dataset and column information is changed when it is bound to property set by simple bind of component.
	PARAMETER : propid : string(bind property), ds : dataset object(Object of bound dataset), row : int(Row position of bound dataset), col : int(Column index of bound dataset)
	RETURN : void
	************************************************************************/
	_pMultiCombo.on_change_bindSource = function (propid, ds, row, col)
	{
		// TODO : enter your code here.
		if (propid == "value")
		{    
			this.set_value(ds.getColumn(row, col));
		}

	};	
	
	/************************************************************************
	FUNCTION : on_getBindableProperties
	DESCRIPTION : Returns a property name that supports simple bind as a TFunctionItem to support simple bind of component.
	PARAMETER : void
	RETURN : bindproperty : array(Property name that supports simplebind)
	************************************************************************/
	_pMultiCombo.on_getBindableProperties = function ()
	{
		//return ["value"];
		// TODO : enter your code here.
		return "value";
	};	
	
	/************************************************************************
	FUNCTION : on_init_bindSource
	DESCRIPTION : Called when a data set and column information does not exist when bound to a property set with a simple bind of the component, definition an initialization TFunctionItem.
	PARAMETER : columnid : string(Column ID of bound dataset), propid : string(bind property), ds : dataset object(Object of bound dataset)
	RETURN : void
	************************************************************************/
	_pMultiCombo.on_init_bindSource = function (columnid, propid, ds)
	{
		nexacro._CompositeComponent.prototype.on_init_bindSource.call(this, columnid, propid, ds);
		// TODO : enter your code here.
		if (propid == "value")
		{    
			this.value = undefined;
		}
	};	
	

	

	delete _pMultiCombo;
}


	
	
	/************************************************************************
	FUNCTION : _get_form_module
	DESCRIPTION :
	RETURN :
	************************************************************************/
	nexacro.MultiCombo.prototype._get_form_module = function ()
	{
		return function()
		{
			if (!this._is_form)
			return;
			
			var obj = null;
			
			this.on_create = function()
			{
				this.set_name("MultiCombo");
				this.set_titletext("MultiCombo");
				if (nexacro.Form == this.constructor)
				{
					this._setFormPosition(200,29);
				}
				
				// Object(Dataset, ExcelExportObject) Initialize
				
				
				// UI Components Initialize
				obj = new nexacro.Edit("comboedit","0","0",null,null,"0","0",null,null,null,null,this);
				obj.set_taborder("0");
				obj.set_displaynulltext("선택하세요");
				obj.set_readonly("true");
				obj.set_cssclass("edt_WF_Cbo");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Button("dropbutton",null,"0","28",null,"0","0",null,null,null,null,this);
				obj.set_taborder("1");
				obj.set_cssclass("btn_WF_Drop");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.PopupDiv("combolist","0","31",null,"289","0",null,null,null,null,null,this);
				obj.set_visible("false");
				obj.set_cssclass("pdiv_WF_Bg");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Grid("combogrid","0","0",null,null,"0","0",null,null,null,null,this.combolist.form);
				obj.set_taborder("0");
				obj.set_autofittype("col");
				obj.set_binddataset("");
				obj.set_cssclass("grd_WF_Cbo");
				obj._setContents("<Formats><Format id=\"default\"><Columns><Column size=\"24\"/><Column size=\"37\"/><Column size=\"141\"/></Columns><Rows><Row size=\"32\"/></Rows><Band id=\"body\"><Cell displaytype=\"checkboxcontrol\" edittype=\"checkbox\"/><Cell col=\"1\"/><Cell col=\"2\"/></Band></Format></Formats>");
				this.combolist.addChild(obj.name, obj);
				// Layout Functions
				//-- Default Layout : this
				obj = new nexacro.Layout("default","",200,29,this,function(p){});
				this.addLayout(obj.name, obj);
				
				// BindItem Information
				
			};
			
			this.loadPreloadList = function()
			{
				
			};
			
			// User Script
			this.registerScript("MultiCombo.xcdl", function() {
					
					
					this.dropbutton_onclick = function(obj,e)
					{
						var nLeft;
						var nTop;
						var nWidth;
						var nHeight;
						var nCount 			= this.parent._innerdataset.getRowCount();
						var itemheight 		= this.parent.itemheight;
						var displayrowcount 	= this.parent.displayrowcount;
						
						//itemheight 값이 없을 경우 28px로 초기화
						if(!itemheight)itemheight = 28;
						
						//displayrowcount 값이 없을 경우 5로 초기화
						if(!displayrowcount)displayrowcount = 5;
						
						//displayrowcount 값 보다 bind된 Dataset의 rowcount가 적을 경우
						// Dataset의 rowcount로 설정
						if(displayrowcount>nCount)displayrowcount = nCount;
						
						nLeft  = 0;
						nTop   = this.getOffsetHeight();
						nWidth = this.getOffsetWidth();
						
						//combolist의 높이 구하기
						nHeight = displayrowcount*itemheight+3;
						this.combolist.form.combogrid.set_enableredraw(true);
						//combolist popup 호출
						this.combolist.trackPopupByComponent(this, nLeft, nTop, nWidth, nHeight);
					};
					
					this.combolist_combogrid_oncellclick = function(obj,e)
					{
						var i;
						var ds 			= this.parent._innerdataset;
						var nCount 		= this.parent._innerdataset.rowcount;
						var codecolumn 	= this.parent.codecolumn;
						var datacolumn  = this.parent.datacolumn;
						var checkcolumn = this.parent.checkcolumn;
						
						var bCheck;
						var arrCode = [];
						var arrValue = [];
						
						//check된 정보 구하기
						for(i=0;i<nCount;i++)
						{
							bCheck = ds.getColumn(i, checkcolumn);
							if(bCheck==1)
							{
								arrCode[arrCode.length] = ds.getColumn(i, codecolumn);
								arrValue[arrValue.length] = ds.getColumn(i, datacolumn);
							}
						}
						
						//checkcombo의 value 값 변경 함수 호출
						this.parent.set_value(arrCode.toString());
					};
					//
					// this.fnTest = function()
					// {
					// 	trace("설정 시작");
					// 	this.parent.set_innerdataset("Dataset00");
					// 	this.parent.set_checkcolumn("chk");
					// 	this.parent.set_codecolumn("code");
					// 	this.parent.set_datacolumn("value");
					// 	trace("설정 완료");
					// }
					//
					// this.fnTest2 = function ()
					// {
					// 	trace(" 선택한 코드는 : " + this.parent.value);
					// 	trace(" 선택한 data는 : " + this.parent.text);
					// };
				});
			
			// Regist UI Components Event
			this.on_initEvent = function()
			{
				this.dropbutton.addEventHandler("onclick",this.dropbutton_onclick,this);
				this.combolist.form.combogrid.addEventHandler("oncellclick",this.combolist_combogrid_oncellclick,this);
			};
			this.loadIncludeScript("MultiCombo.xcdl");
			this.loadPreloadList();
			
			// Remove Reference
			obj = null;
		};
	};