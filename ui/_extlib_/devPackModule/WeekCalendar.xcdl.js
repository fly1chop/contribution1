/*
 확인사항 : gfnGetDayKor 함수 없음
 */


//==============================================================================
//	Define the Component Class of the Compostie Component.
//==============================================================================
//==============================================================================
// Object : nexacro.WeekCalendar
// Group : Component
//==============================================================================
if (!nexacro.WeekCalendar)
{
	//==============================================================================
	// nexacro.WeekCalendar
	//==============================================================================
	nexacro.WeekCalendar = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
	{
		nexacro._CompositeComponent.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
	};

	var _pWeekCalendar = nexacro._createPrototype(nexacro._CompositeComponent, nexacro.WeekCalendar);
	nexacro.WeekCalendar.prototype = _pWeekCalendar;
	_pWeekCalendar._type_name = "WeekCalendar";
	
	/* accessibility */
	_pWeekCalendar.accessibilityrole = "form";
	
	/**
	*  DevPACK
	*  @FileName 	WeekCalendar.xcdl
	*  @Creator 	TOBESOFT
	*  @CreateDate 	2021/01/08
	*  @Desction   
	************** 소스 수정 이력 ***********************************************
	* Date					Modifier					Description
	*******************************************************************************
	* 2021/01/08			TOBESOFT					최초생성
	*******************************************************************************
	*/
	
	/*******************************************************************************************************************************
	 * 변수 선언 영역
	*******************************************************************************************************************************/
	_pWeekCalendar.fvLastDays = ["31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31"];

	_pWeekCalendar.fvIntThisYear  = -1;
	_pWeekCalendar.fvIntThisMonth = -1;
	_pWeekCalendar.fvIntThisDay   = -1;
	_pWeekCalendar.fvYear		    = -1;
	_pWeekCalendar.fvMonth 	    = -1;
	_pWeekCalendar.fvDay	 	    = -1;
	_pWeekCalendar.fvIntPrevYear  = -1;
	_pWeekCalendar.fvIntPrevMonth = -1;
	_pWeekCalendar.fvIntNextYear  = -1;
	_pWeekCalendar.fvIntNextMonth = -1;
	
	/*******************************************************************************************************************************
	 * Util Function 영역
	*******************************************************************************************************************************/
	
	/**
	 * @class null값 확인
	 * @param {Object} objDs - 확인 대상 Dataset
	 * @return {boolean}
	 */   
	_pWeekCalendar._isNull = function(sValue)
	{
		if (new String(sValue).valueOf() == "undefined") return true;
		if (sValue == null) return true;
		
		var ChkStr = new String(sValue);

		if (ChkStr == null) return true;
		if (ChkStr.toString().length == 0 ) return true;
		return false;
	};	
	
	/**
	 * @class 입력받은 date로 week(주차)를 리턴한다. <br>
	 * @param {String}  date
	 * @return {String} week
	 */
	_pWeekCalendar._dateToWeek = function (v)
	{
		var year  = nexacro.toNumber(v.substr(0, 4));
		var month = nexacro.toNumber(v.substr(4, 2));
		var day   = nexacro.toNumber(v.substr(6, 2));

		var week = this._calculateWeek(year, month, day);

		if ((month == 1) && (week > 50)){
		  year--;
		}else if ((month == 12) && (week < 2)){
		  year++;
		}

		return year.toString() + week.toString().padLeft(2, '0');	
	};
	
	/**
	 * @class 입력받은 date로 week(주차)를 리턴한다. <br>
	 * @param {String}  year
	 * @param {String}  month
	 * @param {String}  day
	 * @return {String} week
	 */
	_pWeekCalendar._calculateWeek = function(year, month, day)
	{
		var a = Math.floor((14 - month) / 12);
		var y = year + 4800 - a;
		var m = month + 12 * a - 3;
		var b = Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400);
		var J = day + Math.floor((153 * m + 2) / 5) + 365 * y + b - 32045;
		var d4 = (((J + 31741 - (J % 7)) % 146097) % 36524) % 1461;
		var L = Math.floor(parseInt(d4) / 1460);
		var d1 = ((d4 - L) % 365) + L;

		week = Math.floor(d1 / 7) + 1;

		return week;
	};
	
	/**
	 * @class 현재일자를 구한다. <br>
	 * @param {String} [sGubn] - date/null : 일자, time : 일자+시간, milli : Milliseconds
	 * @param {Boolean} [bFormat] - format 지정 여부
	 * @return {String} 날짜및시간 문자열
	 */
	_pWeekCalendar._getDate = function(sGubn, bFormat) 
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
	_pWeekCalendar._getDay = function(strDate)
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
	_pWeekCalendar._getDayKor = function(dateVal) 
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
	_pWeekCalendar.fnSetYear = function ()
	{
		for (var i = 1900; i < 2050; i++){
			nRow = this.form.dsYear.addRow();
			this.form.dsYear.setColumn(nRow, "year", i);
		}
	};

	/**
	 * @description  return date
	*/
	_pWeekCalendar.getDate = function ()
	{
		return this.form.calW.value;
	};

	/**
	 * @description  return week
	*/
	_pWeekCalendar.getWeek = function ()
	{
		return this.form.calW.uWeek;
	};

	/**
	 * @description date setting
	*/
	_pWeekCalendar.setDate = function (value)
	{
		this.form.calW.set_value(value);
		this.form.calW.uWeek = this._dateToWeek(value);
	};

	/**
	 * @description  필수여부 css 변경
	*/
	_pWeekCalendar.setRequired = function(bValue)
	{
		if (bValue) {
			this.form.calW.set_cssclass("essential");
		}else {
			this.form.calW.set_cssclass("");
		}
	};

	/**
	 * @description  ReadOnly여부 변경
	*/
	_pWeekCalendar.setReadOnly = function(bValue)
	{
		this.form.calW.set_readonly(bValue);
	};

	/**
	 * @description  캘린더 PopupDiv 호출
	*/
	_pWeekCalendar.fnOpenPopupdiv = function ()
	{
		this.form.pdivCal.trackPopupByComponent(this.form.calW, 0, this.form.calW.getOffsetHeight());
	};

	/**
	 * @description  캘린더 데이터 세팅
	*/
	_pWeekCalendar.fnShowCalendarData = function(sYear, sMonth, sDay, bCmbProc, bType)
	{
		this.form.dsCal.clearData();

		var sDate = sYear + sMonth + sDay;

		if (sDate == "000"){
		  var sToday = this._getDate();
		  sYear = sToday.substr(0, 4);
		  sMonth = sToday.substr(4, 2);
		  sDay = sToday.substr(6, 2);
		  sDate = sYear + sMonth + sDay;
		}

		this.fvIntThisYear  = parseInt(sYear);
		this.fvIntThisMonth = parseInt(sMonth);
		this.fvIntThisDay   = parseInt(sDay);

		if (bType){
		  this.fvYear = this.fvIntThisYear;
		  this.fvMonth = this.fvIntThisMonth;
		  this.fvDay = this.fvIntThisDay;
		}

		if (bCmbProc)
		{
		  this.form.pdivCal.form.cboYear.set_value(this.fvIntThisYear);
		  this.form.pdivCal.form.cboMonth.set_index(this.fvIntThisMonth - 1);
		}

		switch (this.fvIntThisMonth)
		{
		  case 1:
			this.fvIntPrevYear = this.fvIntThisYear - 1;
			this.fvIntPrevMonth = 12;
			this.fvIntNextYear = this.fvIntThisYear;
			this.fvIntNextMonth = 2;
			break;
		  case 12:
			this.fvIntPrevYear = this.fvIntThisYear;
			this.fvIntPrevMonth = 11;
			this.fvIntNextYear = this.fvIntThisYear + 1;
			this.fvIntNextMonth = 1;
			break;
		  default:
			this.fvIntPrevYear = this.fvIntThisYear;
			this.fvIntPrevMonth = parseInt(this.fvIntThisMonth) - 1;
			this.fvIntNextYear = this.fvIntThisYear;
			this.fvIntNextMonth = parseInt(this.fvIntThisMonth) + 1;
			break;
		}

		var d = new Date();
		d.setFullYear(parseInt(sYear), parseInt(sMonth) - 1, 1);
		d.setHours(0, 0, 0);
		d.setMilliseconds(0);

		var seq = d.getDay();
		var stopFlag = 0;

		// 4년마다 1번이면 (사로나누어 떨어지면)
		if ((this.fvIntThisYear % 4) == 0)
		{
		  if ((this.fvIntThisYear % 100) == 0)
		  {
			if ((this.fvIntThisYear % 400) == 0)
			{
			  this.fvLastDays[intPrevMonth] = "29";
			}
			else
			  this.fvLastDays[1] = "28";
		  }
		  else
		  {
			this.fvLastDays[1] = "29";
		  }
		}
		else
		{
		  this.fvLastDays[1] = "28";
		}

		var preStartDay = parseInt(this.fvLastDays[this.fvIntPrevMonth - 1]);

		if (this.fvIntThisDay > parseInt(this.fvLastDays[this.fvIntThisMonth - 1]))
		  this.fvIntThisDay = this.fvLastDays[this.fvIntThisMonth - 1];

		var i, j;
		var Day = 1;
		var ColSel;
		var RowSel;
		var lastDay = 0;
		var PreDay;

		//일요일 일경우 7로 셋팅
		if (seq == 0) seq = 7;

		//오늘일자
		var today = this._getDate();
		var nYear = parseInt(today.substr(0, 4));
		var nMonth = parseInt(today.substr(4, 2));
		var nDay = parseInt(today.substr(6, 2));

		for (i = 0; i < 6; i++)
		{	
		  if (stopFlag == 0)
		  {
			this.form.dsCal.addRow();
			this.form.dsCal.setColumn(this.form.dsCal.rowposition, "d0", this._calculateWeek(this.fvIntThisYear, this.fvIntThisMonth, Day));
			this.form.dsCal.setColumn(this.form.dsCal.rowposition, "css0", "CalendarWeekWeekColor");
		  }
		  for (j = 1; j < 8; j++)
		  {
			if (stopFlag == 1)
			{
			  this.form.dsCal.setColumn(i, "css" + (j), "CalendarWeekGrayColor");
			  this.form.dsCal.setColumn(i, "d" + (j), lastDay);
			}
			else
			{
			  if (i == 0)
			  {
				if (seq <= j)
				{
				  if (j == 7) //일요일
					this.form.dsCal.setColumn(i+1, "css" + (j), "CalendarWeekSunColor");
				  else if (j == 6) //토요일
					this.form.dsCal.setColumn(i, "css" + (j), "CalendarWeekSatColor");
				  else
					this.form.dsCal.setColumn(i, "css" + (j), "CalendarWeekDayColor");

				  //오늘일자 표시
				  if (nYear == this.form.pdivCal.form.cboYear.value && nMonth == this.form.pdivCal.form.cboMonth.value && nDay == Day)
					this.form.dsCal.setColumn(i, "css" + (j), "CalendarWeekTodayColor");

				  if (this.fvYear == this.fvIntThisYear && this.fvMonth == this.fvIntThisMonth && this.fvDay == Day)
					this.form.dsCal.setColumn(i, "css" + (j), "CalendarWeekSelectColor");
				  else
					this.form.dsCal.setColumn(i, "css" + (j), null);

				  this.form.dsCal.setColumn(i, "d" + (j), Day);
				  Day++;
				}
				else
				{
				  preDay = preStartDay - (seq - j - 1);
				  this.form.dsCal.setColumn(i, "css" + (j), "CalendarWeekGrayColor");
				  this.form.dsCal.setColumn(i, "d" + (j), preDay);
				}
			  }
			  else
			  {
				if (j == 7) //일요일
				  this.form.dsCal.setColumn(i+1, "css" + (j), "CalendarWeekSunColor");
				else if (j == 6) //토요일
				  this.form.dsCal.setColumn(i, "css" + (j), "CalendarWeekSatColor");
				else
				  this.form.dsCal.setColumn(i, "css" + (j), "CalendarWeekDayColor");

				//오늘일자 표시
				if (nYear == this.form.pdivCal.form.cboYear.value && nMonth == this.form.pdivCal.form.cboMonth.value && nDay == Day)
				  this.form.dsCal.setColumn(i, "css" + (j), "CalendarWeekSunColor");
				if (this.fvYear == this.fvIntThisYear && this.fvMonth == this.fvIntThisMonth && this.fvDay == Day)
				  this.form.dsCal.setColumn(i, "css" + (j), "CalendarWeekSelectColor");
				else
				  this.form.dsCal.setColumn(i, "css" + (j), null);

				this.form.dsCal.setColumn(i, "d" + (j), Day);
				Day++;
			  }
			}

			if (parseInt(this.fvLastDays[this.fvIntThisMonth - 1]) < Day)
			{
			  stopFlag = 1;
			  lastDay++;
			}
		  }
		}
		
		var nGrdHeight = 37 + (this.form.dsCal.rowcount * 37 ) + 2;
		var nPdivHeight = nGrdHeight + 39;
		this.form.pdivCal.set_height(nPdivHeight);
	};

	delete _pWeekCalendar;
}


	
	
	/************************************************************************
	FUNCTION : _get_form_module
	DESCRIPTION :
	RETURN :
	************************************************************************/
	nexacro.WeekCalendar.prototype._get_form_module = function ()
	{
		return function()
		{
			if (!this._is_form)
			return;
			
			var obj = null;
			
			this.on_create = function()
			{
				this.set_name("WeekCalendar");
				this.set_titletext("WeekCalendar");
				if (nexacro.Form == this.constructor)
				{
					this._setFormPosition(140,24);
				}
				
				// Object(Dataset, ExcelExportObject) Initialize
				obj = new nexacro.NormalDataset("dsYear", this);
				obj._setContents("<ColumnInfo><Column id=\"year\" type=\"INT\" size=\"4\"/></ColumnInfo>");
				this.addChild(obj.name, obj);
				
				
				obj = new nexacro.NormalDataset("dsMonth", this);
				obj._setContents("<ColumnInfo><Column id=\"month\" type=\"STRING\" size=\"256\"/></ColumnInfo><Rows><Row><Col id=\"month\">01</Col></Row><Row><Col id=\"month\">02</Col></Row><Row><Col id=\"month\">03</Col></Row><Row><Col id=\"month\">04</Col></Row><Row><Col id=\"month\">05</Col></Row><Row><Col id=\"month\">06</Col></Row><Row><Col id=\"month\">07</Col></Row><Row><Col id=\"month\">08</Col></Row><Row><Col id=\"month\">09</Col></Row><Row><Col id=\"month\">10</Col></Row><Row><Col id=\"month\">11</Col></Row><Row><Col id=\"month\">12</Col></Row></Rows>");
				this.addChild(obj.name, obj);
				
				
				obj = new nexacro.NormalDataset("dsCal", this);
				obj._setContents("<ColumnInfo><Column id=\"d0\" type=\"STRING\" size=\"10\"/><Column id=\"d1\" type=\"STRING\" size=\"10\"/><Column id=\"d2\" type=\"STRING\" size=\"10\"/><Column id=\"d3\" type=\"STRING\" size=\"10\"/><Column id=\"d4\" type=\"STRING\" size=\"10\"/><Column id=\"d5\" type=\"STRING\" size=\"10\"/><Column id=\"d6\" type=\"STRING\" size=\"10\"/><Column id=\"d7\" type=\"STRING\" size=\"10\"/><Column id=\"css0\" type=\"STRING\" size=\"256\"/><Column id=\"css1\" type=\"STRING\" size=\"256\"/><Column id=\"css2\" type=\"STRING\" size=\"256\"/><Column id=\"css3\" type=\"STRING\" size=\"256\"/><Column id=\"css4\" type=\"STRING\" size=\"256\"/><Column id=\"css5\" type=\"STRING\" size=\"256\"/><Column id=\"css6\" type=\"STRING\" size=\"256\"/><Column id=\"css7\" type=\"STRING\" size=\"256\"/></ColumnInfo>");
				this.addChild(obj.name, obj);
				
				// UI Components Initialize
				obj = new nexacro.Calendar("calW","0","0",null,null,"0","0",null,null,null,null,this);
				obj.set_taborder("0");
				obj.set_dateformat("yyyy-MM-dd");
				obj.set_popuptype("none");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.PopupDiv("pdivCal","2","40","234","302",null,null,null,null,null,null,this);
				obj.set_text("pdiv00");
				obj.set_visible("false");
				obj.set_cssclass("pdiv_WF_Bg");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btnPrev","7","5","25","25",null,null,null,null,null,null,this.pdivCal.form);
				obj.set_taborder("0");
				obj.set_cssclass("btn_WF_PreBtn");
				this.pdivCal.addChild(obj.name, obj);
				
				obj = new nexacro.Combo("cboYear","54","5","70","24",null,null,null,null,null,null,this.pdivCal.form);
				obj.set_taborder("1");
				obj.set_innerdataset("dsYear");
				obj.set_codecolumn("year");
				obj.set_datacolumn("year");
				obj.set_cssclass("cbo_WF_Cal");
				obj.set_text("2020");
				obj.set_value("");
				obj.set_index("-1");
				this.pdivCal.addChild(obj.name, obj);
				
				obj = new nexacro.Combo("cboMonth","129","5","60","24",null,null,null,null,null,null,this.pdivCal.form);
				obj.set_taborder("2");
				obj.set_innerdataset("dsMonth");
				obj.set_codecolumn("month");
				obj.set_datacolumn("month");
				obj.set_cssclass("cbo_WF_Cal");
				obj.set_text("01");
				obj.set_value("01");
				obj.set_index("0");
				this.pdivCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btnNext",null,"5","25","25","7",null,null,null,null,null,this.pdivCal.form);
				obj.set_taborder("3");
				obj.set_cssclass("btn_WF_NxtBtn");
				this.pdivCal.addChild(obj.name, obj);
				
				obj = new nexacro.Grid("grdCal","0","cboYear:5",null,null,"0","0",null,null,null,null,this.pdivCal.form);
				obj.set_taborder("4");
				obj.set_autofittype("col");
				obj.set_binddataset("dsCal");
				obj.set_selecttype("cell");
				obj.set_cssclass("grd_WF_Cal");
				obj._setContents("<Formats><Format id=\"default\"><Columns><Column size=\"48\"/><Column size=\"37\"/><Column size=\"37\"/><Column size=\"37\"/><Column size=\"37\"/><Column size=\"37\"/><Column size=\"37\"/><Column size=\"37\"/></Columns><Rows><Row size=\"37\" band=\"head\"/><Row size=\"37\"/></Rows><Band id=\"head\"><Cell text=\"주차\"/><Cell col=\"1\" text=\"월\"/><Cell col=\"2\" text=\"화\"/><Cell col=\"3\" text=\"수\"/><Cell col=\"4\" text=\"목\"/><Cell col=\"5\" text=\"금\"/><Cell col=\"6\" text=\"토\" cssclass=\"saturday\"/><Cell col=\"7\" text=\"일\" cssclass=\"sunday\"/></Band><Band id=\"body\"><Cell text=\"bind:d0\" cssclass=\"bind:css0\"/><Cell col=\"1\" text=\"bind:d1\" cssclass=\"bind:css1\"/><Cell col=\"2\" text=\"bind:d2\" cssclass=\"bind:css2\"/><Cell col=\"3\" text=\"bind:d3\" cssclass=\"bind:css3\"/><Cell col=\"4\" text=\"bind:d4\" cssclass=\"bind:css4\"/><Cell col=\"5\" text=\"bind:d5\" cssclass=\"bind:css5\"/><Cell col=\"6\" text=\"bind:d6\" cssclass=\"bind:css6\"/><Cell col=\"7\" text=\"bind:d7\" cssclass=\"bind:css7\"/></Band></Format></Formats>");
				this.pdivCal.addChild(obj.name, obj);
				// Layout Functions
				//-- Default Layout : this
				obj = new nexacro.Layout("default","",140,24,this,function(p){});
				this.addLayout(obj.name, obj);
				
				// BindItem Information
				
			};
			
			this.loadPreloadList = function()
			{
				
			};
			
			// User Script
			this.registerScript("WeekCalendar.xcdl", function() {
					
					this._onload = function(obj,e)
					{
						this.parent.fnSetYear();
					};
					
					/*******************************************************************************************************************************
					* 각 COMPONENT 별 EVENT 영역
					*******************************************************************************************************************************/
					this.calW_oneditclick = function(obj,e)
					{
						obj.uOrgValue = obj.value;
						this.parent.fnOpenPopupdiv();
					};
					
					this.calW_ondropdown = function(obj,e)
					{
						obj.uOrgValue = obj.value;
						this.parent.fnOpenPopupdiv();
					};
					
					this.calW_onchanged = function(obj,e)
					{
						obj.uWeek = this.parent._dateToWeek(e.postvalue);
					};
					
					this.pdivCal_onpopup = function(obj,e)
					{
						var sDate = this.calW.value;
						if(this.parent._isNull(sDate)){
							sDate = this.parent._getDate();
						}
						
						var sYear  = sDate.substr(0, 4);
						var sMonth = sDate.substr(4, 2);
						var sDay   = sDate.substr(6, 2);
						
						this.parent.fnShowCalendarData(sYear, sMonth, sDay, true, true);
					};
					
					this.pdivCal_btnPrev_onclick = function(obj,e)
					{
						if (this.pdivCal.form.cboMonth.index == 0) {
							this.pdivCal.form.cboMonth.set_index(this.pdivCal.form.cboMonth.getCount() - 1);
							if (this.pdivCal.form.cboYear.index > 0)
							{
								this.pdivCal.form.cboYear.set_index(this.pdivCal.form.cboYear.index - 1);
							}
						}else{
							this.pdivCal.form.cboMonth.set_index(this.pdivCal.form.cboMonth.index - 1);
						}
						this.parent.fnShowCalendarData(this.pdivCal.form.cboYear.value, this.pdivCal.form.cboMonth.value, this.fvIntThisDay, true);
					};
					
					this.pdivCal_btnNext_onclick = function(obj,e)
					{
						if (this.pdivCal.form.cboMonth.index >= (this.pdivCal.form.cboMonth.getCount() - 1))
						{
							this.pdivCal.form.cboMonth.set_index(0);
							if (this.pdivCal.form.cboYear.index < (this.pdivCal.form.cboYear.getCount() - 1))
							{
								this.pdivCal.form.cboYear.set_index(this.pdivCal.form.cboYear.index + 1);
							}
						}
						else
						{
							this.pdivCal.form.cboMonth.set_index(this.pdivCal.form.cboMonth.index + 1);
						}
						this.parent.fnShowCalendarData(this.pdivCal.form.cboYear.value, this.pdivCal.form.cboMonth.value, this.fvIntThisDay, true);
					};
					
					this.pdivCal_cboYear_onitemchanged = function(obj,e)
					{
						this.parent.fnShowCalendarData(e.postvalue, this.pdivCal.form.cboMonth.value, this.fvIntThisDay, true);
					};
					
					this.pdivCal_cboMonth_onitemchanged = function(obj,e)
					{
						this.parent.fnShowCalendarData(this.pdivCal.form.cboYear.value, e.postvalue, this.fvIntThisDay, true);
					};
					
					this.pdivCal_grdCal_oncellclick = function(obj,e)
					{
						if( e.cell == 0 ) return;
						
						var retval = "";
						if (this.dsCal.getColumn(e.row, "css" + (e.cell)) == "CalendarWeekGrayColor"){
							if (e.row == 0){
								retval = this.parent.fvIntPrevYear.toString() + this.parent.fvIntPrevMonth.toString().padLeft(2, '0') + this.dsCal.getColumn(e.row, "d" + (e.cell)).padLeft(2, '0');
							} else {
								retval = this.parent.fvIntNextYear.toString() + this.parent.fvIntNextMonth.toString().padLeft(2, '0') + this.dsCal.getColumn(e.row, "d" + (e.cell)).padLeft(2, '0');
							}
						}else{
							retval = this.parent.fvIntThisYear.toString() + this.parent.fvIntThisMonth.toString().padLeft(2, '0') + this.dsCal.getColumn(e.row, "d" + (e.cell)).padLeft(2, '0');
						}
						this.calW.set_value(retval);
						this.calW.uWeek = this.parent._dateToWeek(retval);
						this.pdivCal.closePopup();
					};
					
					
					
				});
			
			// Regist UI Components Event
			this.on_initEvent = function()
			{
				this.addEventHandler("onload",this._onload,this);
				this.calW.addEventHandler("oneditclick",this.calW_oneditclick,this);
				this.calW.addEventHandler("ondropdown",this.calW_ondropdown,this);
				this.calW.addEventHandler("onchanged",this.calW_onchanged,this);
				this.pdivCal.addEventHandler("onpopup",this.pdivCal_onpopup,this);
				this.pdivCal.form.btnPrev.addEventHandler("onclick",this.pdivCal_btnPrev_onclick,this);
				this.pdivCal.form.cboYear.addEventHandler("onitemchanged",this.pdivCal_cboYear_onitemchanged,this);
				this.pdivCal.form.cboMonth.addEventHandler("onitemchanged",this.pdivCal_cboMonth_onitemchanged,this);
				this.pdivCal.form.btnNext.addEventHandler("onclick",this.pdivCal_btnNext_onclick,this);
				this.pdivCal.form.grdCal.addEventHandler("oncellclick",this.pdivCal_grdCal_oncellclick,this);
			};
			this.loadIncludeScript("WeekCalendar.xcdl");
			this.loadPreloadList();
			
			// Remove Reference
			obj = null;
		};
	};