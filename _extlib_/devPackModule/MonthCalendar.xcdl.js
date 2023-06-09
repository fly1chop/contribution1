//==============================================================================
//	Define the Component Class of the Compostie Component.
//==============================================================================
//==============================================================================
// Object : nexacro.MonthCalendar
// Group : Component
//==============================================================================
if (!nexacro.MonthCalendar)
{
	//==============================================================================
	// nexacro.MonthCalendar
	//==============================================================================
	nexacro.MonthCalendar = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
	{
		nexacro._CompositeComponent.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
	};

	var _pMonthCalendar = nexacro._createPrototype(nexacro._CompositeComponent, nexacro.MonthCalendar);
	nexacro.MonthCalendar.prototype = _pMonthCalendar;
	_pMonthCalendar._type_name = "MonthCalendar";
		
	/* accessibility */
	_pMonthCalendar.accessibilityrole = "form";
	
	/**
	*  DevPACK
	*  @FileName 	MonthCalendar.xcdl
	*  @Creator 	TOBESOFT
	*  @CreateDate 	2021/01/11
	*  @Desction   
	************** 소스 수정 이력 ***********************************************
	* Date					Modifier					Description
	*******************************************************************************
	* 2021/01/11			TOBESOFT					최초생성
	*******************************************************************************
	*/

	/*******************************************************************************************************************************
	 * 변수 선언 영역
	*******************************************************************************************************************************/
	
	
	
	/*******************************************************************************************************************************
	 * Util Function 영역
	*******************************************************************************************************************************/
	
	/**
	 * @class null값 확인
	 * @param {Object} objDs - 확인 대상 Dataset
	 * @return {boolean}
	 */   
	_pMonthCalendar._isNull = function(sValue)
	{
		if (new String(sValue).valueOf() == "undefined") return true;
		if (sValue == null) return true;
		
		var ChkStr = new String(sValue);

		if (ChkStr == null) return true;
		if (ChkStr.toString().length == 0 ) return true;
		return false;
	};
	
	/**
	 * @class 현재일자를 구한다. <br>
	 * @param {String} [sGubn] - date/null : 일자, time : 일자+시간, milli : Milliseconds
	 * @param {Boolean} [bFormat] - format 지정 여부
	 * @return {String} 날짜및시간 문자열
	 */
	_pMonthCalendar._getDate = function(sGubn, bFormat) 
	{
		if (this._isNull(sGubn)) sGubn = "date";
		if (this._isNull(bFormat)) {
			bFormat = false;
			var sDFormat = "";
			var sTFormat = "";
			var sSplit = "";
		}
		else {
			bFormat = true;
			var sDFormat = "-";	
			var sTFormat = ":";
			var sSplit = " ";
		}	
		
		var s;	
		
		var d = new Date();	
		if (sGubn == "date") {
			s = d.getFullYear() + sDFormat
			  + ((d.getMonth() + 1) + "").padLeft(2, '0') + sDFormat
			  + (d.getDate() + "").padLeft(2, '0');
		}
		else if (sGubn == "day") {
			s = d.getFullYear() + sDFormat
			  + ((d.getMonth() + 1) + "").padLeft(2, '0') + sDFormat
			  + (d.getDate() + "").padLeft(2, '0') + sSplit
			  + this._getDayKor(d.getFullYear()+((d.getMonth() + 1) + "").padLeft(2, '0')+(d.getDate() + "").padLeft(2, '0'));
		}
		else if (sGubn == "time") {
			s = d.getFullYear() + sDFormat
			  + ((d.getMonth() + 1) + "").padLeft(2, '0') + sDFormat
			  + (d.getDate() + "").padLeft(2, '0') + sSplit
			  + (d.getHours() + "").padLeft(2, '0') + sTFormat
			  + (d.getMinutes() + "").padLeft(2, '0') + sTFormat
			  + (d.getSeconds() + "").padLeft(2, '0');
		}
		else if (sGubn == "milli") {
			s = d.getFullYear() + sDFormat
			  + ((d.getMonth() + 1) + "").padLeft(2, '0') + sDFormat
			  + (d.getDate() + "").padLeft(2, '0') + sSplit
			  + (d.getHours() + "").padLeft(2, '0') + sTFormat
			  + (d.getMinutes() + "").padLeft(2, '0') + sTFormat
			  + (d.getSeconds() + "").padLeft(2, '0') + sTFormat
			  + (d.getMilliseconds() + "").padLeft(3, '0');
		}
		return (s);
	};
	
	/**
	 * @class 입력된 날자로부터 요일을 구함 <br>
	 * @param {String} strDate - 'yyyyMMdd' 형태로 표현된 날짜.
	 * @return {Number} 0 = 일요일 ~ 6 = 토요일. 오류가 발생할 경우 -1 Return.
	 */
	_pMonthCalendar._getDay = function(strDate)
	{
		var date = new Date();

		var iYear = parseInt(strDate.substr(0, 4));
		var iMonth = parseInt(strDate.substr(4, 2) - 1);
		var iDate = parseInt(strDate.substr(6, 2));
		
		date.setFullYear(iYear,iMonth,iDate);
		return date.getDay();
	};

	/**
	 * @class 입력된 날자로부터 한글 요일을 구함 <br>
	 * @param {String} dateVal - 'yyyyMMdd' 형태로 표현된 날짜.
	 * @return {String} 0 = 일요일 ~ 6 = 토요일. 오류가 발생할 경우 "" Return.
	 */
	_pMonthCalendar._getDayKor = function(dateVal) 
	{
		var nDay = -1;
		var dayKorArray = ["일", "월", "화", "수", "목", "금", "토"];
		
		nDay = this._getDay(dateVal);
		
		if( nDay < 0 ) return "";
		
		return dayKorArray[nDay];
	};
	
	/*******************************************************************************************************************************
	 * 사용자 Function 영역
	*******************************************************************************************************************************/
	_pMonthCalendar.fnOpenPopupdiv= function ()
	{
		this.form.pdivCal.trackPopupByComponent(this.form.calM, 0, this.form.calM.getOffsetHeight());
	};

	_pMonthCalendar.fnShowCalendarData = function (sYear, sMonth)
	{	
		if( sYear == "0000"){
			sYear = this._getDate().substr(0,4);
		}
		this.form.pdivCal.form.staYear.set_text(sYear);
		var sCurValue = this.form.calM.value;
		
		if( !this._isNull(sCurValue)){
			for( var i=0; i<this.form.fvBtn.length; i++){
				if( this.form.fvBtn[i].name.replace("btn","") == sCurValue.substr(4,2) && sCurValue.substr(0,4)==sYear){
					//this.form.fvBtn[i].set_cssclass(_pMonthCalendar.fvSelectCss);
				}else{
					//this.form.fvBtn[i].set_cssclass("");
				}
			}
		}
		
	};


	/**
	 * @description  return date
	*/
	_pMonthCalendar.getDate = function ()
	{
		if( !this._isNull(this.form.calM.value)) return this.form.calM.value.substr(0,6);
		else return this.form.calM.value;
	};

	/**
	 * @description date setting
	*/
	_pMonthCalendar.setDate = function (value)
	{
		this.form.calM.set_value(value.substr(0,4)+""+value.substr(4,2)+"01");
	};

	/**
	 * @description  필수여부 css 변경
	*/
	_pMonthCalendar.setRequired = function(bValue)
	{
		if (bValue) {
			this.form.calM.set_cssclass("essential");
		}else {
			this.form.calM.set_cssclass("");
		}
	};

	/**
	 * @description  ReadOnly여부 변경
	*/
	_pMonthCalendar.setReadOnly = function(bValue)
	{
		this.form.calM.set_readonly(bValue);
	};

	delete _pMonthCalendar;
}


	
	
	/************************************************************************
	FUNCTION : _get_form_module
	DESCRIPTION :
	RETURN :
	************************************************************************/
	nexacro.MonthCalendar.prototype._get_form_module = function ()
	{
		return function()
		{
			if (!this._is_form)
			return;
			
			var obj = null;
			
			this.on_create = function()
			{
				this.set_name("MonthCalendar");
				this.set_titletext("MonthCalendar");
				if (nexacro.Form == this.constructor)
				{
					this._setFormPosition(175,24);
				}
				
				// Object(Dataset, ExcelExportObject) Initialize
				
				
				// UI Components Initialize
				obj = new nexacro.Calendar("calM","0","0",null,null,"0","0",null,null,null,null,this);
				obj.set_taborder("0");
				obj.set_dateformat("yyyy-MM");
				obj.set_editformat("yyyy-MM");
				obj.set_popuptype("none");
				obj.set_enable("true");
				obj.set_readonly("false");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.PopupDiv("pdivCal","0","40","180","175",null,null,null,null,null,null,this);
				obj.set_text("pdiv00");
				obj.set_visible("false");
				obj.set_cssclass("pdiv_WF_Bg");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Static("staBg","0","0",null,null,"0","0",null,null,null,null,this.pdivCal.form);
				obj.set_taborder("0");
				obj.set_cssclass("sta_WF_GBg01");
				this.pdivCal.addChild(obj.name, obj);
				
				obj = new nexacro.Static("staYear","0","7",null,"29","0",null,null,null,null,null,this.pdivCal.form);
				obj.set_taborder("1");
				obj.set_text("2020");
				obj.set_cssclass("sta_WF_Cal");
				obj.set_textAlign("center");
				this.pdivCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btnPrev","10","7","29","29",null,null,null,null,null,null,this.pdivCal.form);
				obj.set_taborder("2");
				obj.set_cssclass("btn_WF_PreBtn");
				this.pdivCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btnNext",null,"7","29","29","10",null,null,null,null,null,this.pdivCal.form);
				obj.set_taborder("3");
				obj.set_cssclass("btn_WF_NxtBtn");
				this.pdivCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btn01","6","43","40","40",null,null,null,null,null,null,this.pdivCal.form);
				obj.set_taborder("4");
				obj.set_cssclass("btn_WF_Cal01");
				this.pdivCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btn02","btn01:2","43","40","40",null,null,null,null,null,null,this.pdivCal.form);
				obj.set_taborder("5");
				obj.set_cssclass("btn_WF_Cal02");
				this.pdivCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btn03","btn02:2","43","40","40",null,null,null,null,null,null,this.pdivCal.form);
				obj.set_taborder("6");
				obj.set_cssclass("btn_WF_Cal03");
				this.pdivCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btn04","btn03:2","43","40","40",null,null,null,null,null,null,this.pdivCal.form);
				obj.set_taborder("7");
				obj.set_cssclass("btn_WF_Cal04");
				this.pdivCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btn05","6","btn01:2","40","40",null,null,null,null,null,null,this.pdivCal.form);
				obj.set_taborder("8");
				obj.set_cssclass("btn_WF_Cal05");
				this.pdivCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btn06","48","btn02:2","40","40",null,null,null,null,null,null,this.pdivCal.form);
				obj.set_taborder("9");
				obj.set_cssclass("btn_WF_Cal06");
				this.pdivCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btn07","90","btn03:2","40","40",null,null,null,null,null,null,this.pdivCal.form);
				obj.set_taborder("10");
				obj.set_cssclass("btn_WF_Cal07");
				this.pdivCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btn08","132","btn04:2","40","40",null,null,null,null,null,null,this.pdivCal.form);
				obj.set_taborder("11");
				obj.set_cssclass("btn_WF_Cal08");
				this.pdivCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btn09","6","127","40","40",null,null,null,null,null,null,this.pdivCal.form);
				obj.set_taborder("12");
				obj.set_cssclass("btn_WF_Cal09");
				this.pdivCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btn10","48","127","40","40",null,null,null,null,null,null,this.pdivCal.form);
				obj.set_taborder("13");
				obj.set_cssclass("btn_WF_Cal10");
				this.pdivCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btn11","90","127","40","40",null,null,null,null,null,null,this.pdivCal.form);
				obj.set_taborder("14");
				obj.set_cssclass("btn_WF_Cal11");
				this.pdivCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btn12","132","127","40","40",null,null,null,null,null,null,this.pdivCal.form);
				obj.set_taborder("15");
				obj.set_cssclass("btn_WF_Cal12");
				this.pdivCal.addChild(obj.name, obj);
				// Layout Functions
				//-- Default Layout : this
				obj = new nexacro.Layout("default","",175,24,this,function(p){});
				this.addLayout(obj.name, obj);
				
				// BindItem Information
				
			};
			
			this.loadPreloadList = function()
			{
				
			};
			
			// User Script
			this.registerScript("MonthCalendar.xcdl", function() {
					this.fvDiv = null;
					this.fvSelectCss = "btn_WF_Crud";
					this.fvBtn = null;
					
					/*******************************************************************************************************************************
					* 각 COMPONENT 별 EVENT 영역
					*******************************************************************************************************************************/
					this.calM_ondropdown = function(obj,e)
					{
						obj.uOrgValue = obj.text;
						this.parent.fnOpenPopupdiv();
					};
					
					this.calM_oneditclick = function(obj,e)
					{
						obj.uOrgValue = obj.text;
						this.parent.fnOpenPopupdiv();
					};
					
					this.pdivCal_onpopup = function(obj,e)
					{
						var sDate = this.calM.value;
						if(this.parent._isNull(sDate)){
							sDate = "00000000";//this.gfnGetDate();
						}
						
						var sYear  = sDate.substr(0, 4);
						var sMonth = sDate.substr(4, 2);
						var sDay   = sDate.substr(6, 2);
						
						this.parent.fnShowCalendarData(sYear, sMonth);
					};
					
					this.btnMonth_onclick = function(obj,e)
					{
						var sYear = this.pdivCal.form.staYear.text;
						var sMonth = obj.name.replace("btn","");
						
						this.calM.set_value(sYear+""+sMonth+"01");
						this.pdivCal.closePopup();
					};
					
					this.pdivCal_btnPrev_onclick = function(obj,e)
					{
						var sDate = nexacro.toNumber(this.pdivCal.form.staYear.text);
						this.pdivCal.form.staYear.set_text(sDate - 1 );
						
						this.parent.fnShowCalendarData(sDate - 1 , "00");
					};
					
					this.pdivCal_btnNext_onclick = function(obj,e)
					{
						var sDate = nexacro.toNumber(this.pdivCal.form.staYear.text);
						this.pdivCal.form.staYear.set_text(sDate + 1 );
						
						this.parent.fnShowCalendarData(sDate + 1, "00");
					};
					this._onload = function(obj,e)
					{
						this.fvDiv = this.form;
						
						this.fvBtn = [];
						this.fvBtn.push(this.pdivCal.form.btn01);
						this.fvBtn.push(this.pdivCal.form.btn02);
						this.fvBtn.push(this.pdivCal.form.btn03);
						this.fvBtn.push(this.pdivCal.form.btn04);
						this.fvBtn.push(this.pdivCal.form.btn05);
						this.fvBtn.push(this.pdivCal.form.btn06);
						this.fvBtn.push(this.pdivCal.form.btn07);
						this.fvBtn.push(this.pdivCal.form.btn08);
						this.fvBtn.push(this.pdivCal.form.btn09);
						this.fvBtn.push(this.pdivCal.form.btn10);
						this.fvBtn.push(this.pdivCal.form.btn11);
						this.fvBtn.push(this.pdivCal.form.btn12);
					};
					
				});
			
			// Regist UI Components Event
			this.on_initEvent = function()
			{
				this.addEventHandler("onload",this._onload,this);
				this.calM.addEventHandler("ondropdown",this.calM_ondropdown,this);
				this.calM.addEventHandler("oneditclick",this.calM_oneditclick,this);
				this.pdivCal.addEventHandler("onpopup",this.pdivCal_onpopup,this);
				this.pdivCal.form.btnPrev.addEventHandler("onclick",this.pdivCal_btnPrev_onclick,this);
				this.pdivCal.form.btnNext.addEventHandler("onclick",this.pdivCal_btnNext_onclick,this);
				this.pdivCal.form.btn01.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivCal.form.btn02.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivCal.form.btn03.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivCal.form.btn04.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivCal.form.btn05.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivCal.form.btn06.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivCal.form.btn07.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivCal.form.btn08.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivCal.form.btn09.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivCal.form.btn10.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivCal.form.btn11.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivCal.form.btn12.addEventHandler("onclick",this.btnMonth_onclick,this);
			};
			this.loadIncludeScript("MonthCalendar.xcdl");
			this.loadPreloadList();
			
			// Remove Reference
			obj = null;
		};
	};