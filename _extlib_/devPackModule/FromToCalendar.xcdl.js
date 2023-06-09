//==============================================================================
//	Define the Component Class of the Compostie Component.
//==============================================================================
//==============================================================================
// Object : nexacro.FromToCalendar
// Group : Component
//==============================================================================
if (!nexacro.FromToCalendar)
{
	//==============================================================================
	// nexacro.FromToCalendar
	//==============================================================================
	nexacro.FromToCalendar = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
	{
		nexacro._CompositeComponent.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
		
	};

	var _pFromToCalendar = nexacro._createPrototype(nexacro._CompositeComponent, nexacro.FromToCalendar);
	nexacro.FromToCalendar.prototype = _pFromToCalendar;
	_pFromToCalendar._type_name = "FromToCalendar";
	
	_pFromToCalendar.monthtype = false;
	_pFromToCalendar.defaultdatediff = 7;
	_pFromToCalendar.defaultmonthdiff = 1;
	_pFromToCalendar.maxdatediff = 30;
	_pFromToCalendar.maxmonthdiff = 5;
	_pFromToCalendar.monthselectcss = null;
	_pFromToCalendar.monthselectborderstyle = "1px solid red";
	_pFromToCalendar.predatedata = [];
	_pFromToCalendar.premonthdata = [];
	
	/* accessibility */
	_pFromToCalendar.accessibilityrole = "form";
	
	
	_pFromToCalendar.on_destroy_contents = function () {
		this.predatedata = this.premonthdata = null;
		nexacro._CompositeComponent.prototype.on_destroy_contents.call(this);
	};	
	/*******************************************************************************************************************************
	 * Util Function 영역
	*******************************************************************************************************************************/
	
	_pFromToCalendar.set_monthselectcss = function (v)
	{
		if(v == "") v = null;
		this.monthselectcss = v
	};	
	
	_pFromToCalendar.set_monthselectborderstyle = function (v)
	{
		if(v == "") v = null;
		this.monthselectborderstyle = v
	};		
	/**
	 * @class month, date type을 설정
	 * @param {Boolean} v - true/false
	 * @return
	 */   
	_pFromToCalendar.set_monthtype = function(v, isfirst)
	{
		var prefrom = this.form.calFrom.value;
		var preto = this.form.calTo.value;
		
		var monthtype = nexacro._toBoolean(v);
		if(!isfirst && this.monthtype == monthtype) return;
		this.monthtype = monthtype;
		if(this.monthtype == true) {
			this.form.calFrom.set_dateformat("yyyy-MM");
			this.form.calFrom.set_editformat("yyyy-MM");
			this.form.calTo.set_dateformat("yyyy-MM");
			this.form.calTo.set_editformat("yyyy-MM");
			if(this.premonthdata[0] == null || this.premonthdata[0] == "") {
				this.setDefaultDate();
			} else {
				if(this.premonthdata[0]) {
					this.form.calFrom.set_value(this.premonthdata[0].substr(0,6));
				}
				if(this.premonthdata[1]) {
					this.form.calTo.set_value(this.premonthdata[1].substr(0,6));
				}
			}
			this.premonthdata = [prefrom, preto];
		} else {
			this.form.calFrom.set_dateformat("yyyy-MM-dd");
			this.form.calTo.set_editformat("yyyy-MM-dd");
			if(this.predatedata[0] == null || this.predatedata[0] == "") {
				this.setDefaultDate();
			} else {
				if(this.predatedata[0]) {
					this.form.calFrom.set_value(this.predatedata[0]);
				}
				if(this.predatedata[1]) {
					this.form.calTo.set_value(this.predatedata[1]);
				}
			}
			this.predatedata = [prefrom, preto];
		}
	};
	/**
	 * @class monthtype이 일자일 경우 최대 조회일수
	 * @param {Number} v - 최대일수
	 * @return
	 */   
	_pFromToCalendar.set_maxdatediff = function(v)
	{
		if(isNaN(v)) return;
		this.maxdatediff = v;
	};	 
	/**
	 * @class monthtype이 월일 경우 최대 조회월수
	 * @param {Number} v - 최대월수
	 * @return
	 */   
	_pFromToCalendar.set_maxmonthdiff = function(v)
	{
		if(isNaN(v)) return;
		this.maxmonthdiff = v;
	};	
	
	/**
	 * @class monthtype이 일자일 경우 최초 기본 조회일수
	 * @param {Number} v - 최대일수
	 * @return
	 */   
	_pFromToCalendar.set_defaultdatediff = function(v)
	{
		if(isNaN(v)) return;
		this.defaultdatediff = v;
	};	 
	/**
	 * @class monthtype이 월일 경우 최초 기본 조회월수
	 * @param {Number} v - 최대월수
	 * @return
	 */   
	_pFromToCalendar.set_defaultmonthdiff = function(v)
	{
		if(isNaN(v)) return;
		this.defaultmonthdiff = v;
	};		
	/**
	 * @class null값 확인
	 * @param {Object} objDs - 확인 대상 Dataset
	 * @return {boolean}
	 */   
	_pFromToCalendar._isNull = function(sValue)
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
	_pFromToCalendar._getDateFormat = function(sGubn, bFormat, oDate) 
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
		var d;	
		if(oDate) {
			d = oDate;
		} else {
			d = new Date();	
		}
		
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
	_pFromToCalendar._getDay = function(strDate)
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
	_pFromToCalendar._getDayKor = function(dateVal) 
	{
		var nDay = -1;
		var dayKorArray = ["일", "월", "화", "수", "목", "금", "토"];
		
		nDay = this._getDay(dateVal);
		
		if( nDay < 0 ) return "";
		
		return dayKorArray[nDay];
	};
	

	/**
	 * @class 두 일자간의 차이 일수 계산 <br>
	 * @param {String} sStartDate - yyyyMMdd형태의 From 일자 ( 예 : "20121122" )
	 * @param {String} sEndDate - yyyyMMdd형태의 To 일자   ( 예 : "20121202" )
	 * @return {Number} 숫자 형태의 차이일수( 예 : 10 ) 단, sEndDate < sStartDate이면 음수가 return된다.
	 */
	_pFromToCalendar.getDiffDate = function(sStartDate, sEndDate)
	{
		if(this.monthtype) {
			var mon1 = (sEndDate.getFullYear() * 12) + sEndDate.getMonth();
			var mon2 = (sStartDate.getFullYear() * 12) + sStartDate.getMonth();
			return (mon1 - mon2) + 1;
		} else {
			var elapsedMSec = sEndDate.getTime() - sStartDate.getTime(); 
			return (elapsedMSec / (1000 * 60 * 60 * 24))+1; 
		}
	};
	/*******************************************************************************************************************************
	 * 사용자 Function 영역
	*******************************************************************************************************************************/
	_pFromToCalendar._getPopDiv = function ()
	{
		return this.monthtype?this.form.pdivMonthCal:this.form.pdivCal;
	};	
	
	_pFromToCalendar.closePopDiv = function ()
	{
		var pDiv = this._getPopDiv();
		pDiv.closePopup();
	};		
	_pFromToCalendar._getCalObj = function ()
	{
		var pDiv = this._getPopDiv();
		var isPop = pDiv.isPopup();
		if(isPop) {
			oFrom = pDiv.form.calFromM;
			oTo = pDiv.form.calToM;
		} else {	// 입력한 경우
			oFrom = this.form.calFrom;
			oTo = this.form.calTo;
		}
		return [oFrom, oTo, isPop];
	};	
	
	_pFromToCalendar.isValidDate = function (vValue)
	{ 
		var vValue_Num = vValue.replace(/[^0-9]/g, "");
		if (String(vValue_Num) == "undefined" || String(vValue_Num) == "null") { 
			return false;
		}
		var nLeng = (this.monthtype?6:8);
		if (vValue_Num.length < nLeng) { 
			return false;
		} 
		var rxDatePattern = /^(\d{4})(\d{1,2})(\d{1,2})$/;
		var dtArray = vValue_Num.match(rxDatePattern);
		if (dtArray == null) { 
			return false;
		} 
		//0번째는 원본 , 1번째는 yyyy(년) , 2번재는 mm(월) , 3번재는 dd(일) 입니다. 
		dtYear = dtArray[1];
		dtMonth = dtArray[2];
		dtDay = dtArray[3];
		//yyyymmdd 체크 
		if (dtMonth < 1 || dtMonth > 12) { 
			return false;
		} else if (dtDay < 1 || dtDay > 31) { 
			return false;
		} else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31) {
			return false;
		} else if (dtMonth == 2) { 
			var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
			if (dtDay > 29 || (dtDay == 29 && !isleap)) { 
				return false;
			} 
		} 
		return true;
	};
	
	_pFromToCalendar.isValidCheck = function ()
	{
		if(this.monthtype) {
			var pMonDiv = this.form.pdivMonthCal;
			if(!pMonDiv.fryear) {
				if(isPop) this.fnShowMessage("시작년도가 없습니다.");
				return false;
			}
			if(!pMonDiv.toyear) {
				if(isPop) this.fnShowMessage("종료년도가 없습니다.");
				return false;
			}
			if(pMonDiv.fryear.length < 4) {
				if(isPop) this.fnShowMessage("시작년도 형식 오류입니다.");
				return false;
			}
			if(pMonDiv.toyear.length < 4) {
				if(isPop) this.fnShowMessage("종료년도 형식 오류입니다.");
				return false;
			}
			if(!pMonDiv.frmonth) {
				if(isPop) this.fnShowMessage("시작월은 필수 입력 항목입니다.");
				return false;
			}
			if(!pMonDiv.tomonth) {
				if(isPop) this.fnShowMessage("종료월은 필수 입력 항목입니다.");
				return false;
			}
			if(pMonDiv.frmonth.length < 2) {
				if(isPop) this.fnShowMessage("시작월 형식 오류입니다.");
				return false;
			}
			if(pMonDiv.tomonth.length < 2) {
				if(isPop) this.fnShowMessage("종료월 형식 오류입니다.");
				return false;
			}
			pMonDiv.form.calFromM.set_value(pMonDiv.fryear + ":" + pMonDiv.frmonth);
			pMonDiv.form.calToM.set_value(pMonDiv.toyear + ":" + pMonDiv.tomonth);
		}
		
		var arrObj = this._getCalObj();
		var oFrom = arrObj[0];
		var oTo = arrObj[1];
		var isPop = arrObj[2];
		var oFromDate = oFrom._convertToDateObject(oFrom.value);
		var oToDate = oTo._convertToDateObject(oTo.value);
		var sFrom = this._getDateFormat("date", null, oFromDate);
		var sTo = this._getDateFormat("date", null, oToDate);
		if(!this.monthtype) {
			if( this._isNull(sFrom)){
				if(isPop) this.fnShowMessage("시작일은 필수 입력 항목입니다.");
				return false;
			}
			if( this._isNull(sTo)){
				if(isPop) this.fnShowMessage("종료일은 필수 입력 항목입니다.");
				return false;
			}
			if(!this.isValidDate(sFrom)) {
				if(isPop) this.fnShowMessage("시작일자 형식 오류입니다.");
				return false;		
			}
			if(!this.isValidDate(sTo)) {
				if(isPop) this.fnShowMessage("종료일자 형식 오류입니다.");
				return false;		
			}
		}
		var diff = this.getDiffDate(oFromDate, oToDate);
		if( diff <= 0){
			if(isPop) this.fnShowMessage("종료일이 시작일보다 빠릅니다.");
			return false;
		}
		var gap;
		if(this.monthtype) {
			gap = this.maxmonthdiff;
		} else {
			gap = this.maxdatediff;
		}
		if( diff > gap){
			if(isPop) this.fnShowMessage("최대 조회기간을 초과하였습니다. 최대:" + gap + (this.monthtype?"개월":"일"));
			return false;
		}
		return true;
	};
	
	_pFromToCalendar.setDefaultDate = function ()
	{
		//달력초기화
		var dateT = new Date();
		if(this.monthtype == true) {
			var dateF = new Date();
			dateF.setMonth(dateT.getMonth() - this.defaultmonthdiff); // 1달전으로~	
			this.form.calFrom.set_value(dateF);
			this.form.calTo.set_value(dateT);
			var sFrom = this.form.calFrom.value.substr(4,2);
			var sTo = this.form.calTo.value.substr(4,2);
			if(this.monthselectcss) {
				this.form.pdivMonthCal.form["fr_btn" + sFrom].set_cssclass(this.monthselectcss +sFrom);
				this.form.pdivMonthCal.form["to_btn" + sTo].set_cssclass(this.monthselectcss + sTo);
			} else if(this.monthselectborderstyle) {
				this.form.pdivMonthCal.form["fr_btn" + sFrom].set_border(this.monthselectborderstyle);
				this.form.pdivMonthCal.form["to_btn" + sTo].set_border(this.monthselectborderstyle);
			}
		} else {
			var dateF = new Date();
			dateF.setDate(dateT.getDate() - this.defaultdatediff); // 7일전으로~	
			this.form.calFrom.set_value(dateF);
			this.form.calTo.set_value(dateT);
		}
	};
	_pFromToCalendar.getFromDate = function ()
	{
		var cal = this.form.calFrom;
		var sFrom = cal.value;
		if(this._isNull(sFrom)) return "";
		if(!this.isValidDate(cal.value)) {
			if(this.form.calFrom.uOrgValue) this.form.calFrom.set_value(this.calFrom.uOrgValue);
			else this.calFrom.set_value("");
			return "";
		}
		if(this.monthtype == true) {
			return sFrom.substr(0,6);
		} else {
			return sFrom;
		}
	};
	_pFromToCalendar.getToDate = function ()
	{
		var cal = this.form.calTo;
		var sTo = cal.value;
		if(this._isNull(sTo)) return "";
		if(!this.isValidDate(sTo)) {
			if(this.form.calTo.uOrgValue) this.form.calTo.set_value(this.calTo.uOrgValue);
			else this.calTo.set_value("");
			return "";
		}
		
		if(this.monthtype == true) {
			return sTo.substr(0,6);
		} else {
			return sTo;
		}
	};
	_pFromToCalendar.getDates = function ()
	{
		return [this.getFromDate(), this.getToDate()];
	};	

	_pFromToCalendar.setFromDate = function (v)
	{
		this.form.calFrom.set_value(v);
	};

	_pFromToCalendar.setToDate = function (v)
	{
		this.form.calTo.set_value(v);
	};

	_pFromToCalendar.setRequired = function(bValue)
	{
		if (bValue) {
			this.form.calTo.set_cssclass("essential");
			this.form.calFrom.set_cssclass("");
		}else {
			this.form.calTo.set_cssclass("");
			this.form.calFrom.set_cssclass("");
		}
	};

	_pFromToCalendar.setReadOnly = function(bValue)
	{
		this.form.calTo.set_readonly(bValue);
		this.form.calFrom.set_readonly(bValue);
	};


	_pFromToCalendar.fnOpenPopupdiv = function ()
	{
		var pDiv = this._getPopDiv();
		pDiv.trackPopupByComponent(this.form.calFrom, 0, this.form.calFrom.getOffsetHeight());
	};
	
	_pFromToCalendar.fnSetOpenPopupCal = function ()
	{
		var sFrom = this.form.calFrom.value;
		var sTo   = this.form.calTo.value;
		if(this._isNull(sFrom)) sFrom = this._getDateFormat();
		if(this._isNull(sTo)) sTo = this._getDateFormat();
		var pDiv = this._getPopDiv();
		pDiv.form.calFromM.set_value(sFrom);
		pDiv.form.calToM.set_value(sTo);
		
		if(this.monthtype) {
			var fYear = sFrom.substr(0,4);
			var tYear = sTo.substr(0,4);
			pDiv.form.fr_staYear.set_text(fYear);
			pDiv.form.to_staYear.set_text(tYear);
			pDiv.fryear = fYear;
			pDiv.toyear = tYear;
			pDiv.frmonth = sFrom.substr(4,2);
			pDiv.tomonth = sTo.substr(4,2);
			pDiv.form["fr_btn" + pDiv.frmonth].setFocus();
			pDiv.form["to_btn" + pDiv.tomonth].setFocus();
			if(this.monthselectcss) {
				pDiv.form["fr_btn" + pDiv.frmonth].set_cssclass(this.monthselectcss + pDiv.frmonth);
				pDiv.form["to_btn" + pDiv.tomonth].set_cssclass(this.monthselectcss + pDiv.tomonth);
			} else if(this.monthselectborderstyle) {
				pDiv.form["fr_btn" + pDiv.frmonth].set_border(this.monthselectborderstyle);
				pDiv.form["to_btn" + pDiv.tomonth].set_border(this.monthselectborderstyle);
			}
		}
	};	
	
	_pFromToCalendar.fnSetClosePopupCal = function ()
	{
		var pDiv = this._getPopDiv();
		this.form.calFrom.set_value(pDiv.form.calFromM.value);
		this.form.calTo.set_value(pDiv.form.calToM.value);
		pDiv.closePopDiv();
	};
	
	_pFromToCalendar.fnClosePopup = function ()
	{
		var pDiv = this._getPopDiv();
		if(this.monthtype) {
			this.form.calFrom.set_value(pDiv.form.calFromM.value.substr(0,6));
			this.form.calTo.set_value(pDiv.form.calToM.value.substr(0,6));
		} else {
			this.form.calFrom.set_value(pDiv.form.calFromM.value);
			this.form.calTo.set_value(pDiv.form.calToM.value);
		}
		
		this.closePopDiv();	
	};	
	
	_pFromToCalendar.fnResetMonth = function (v)
	{
		var pDiv = this.form.pdivMonthCal.form;
		var prefix = "";
		if(v == "from") {	// fr_btn10
			prefix = "fr_";
		} else {
			prefix = "to_";
		}
		var sPost = "";
		for(var i=1;i<=12;i++) {
			sPost = (i+"").padLeft(2, "0");
			pDiv[prefix + "btn" + (i+"").padLeft(2,"0")].set_cssclass("btn_WF_Cal" + sPost);
			pDiv[prefix + "btn" + (i+"").padLeft(2,"0")].set_border("");
		}
	};

	_pFromToCalendar.fnShowMessage = function (sMsgTxt)
	{
		var pDiv = this._getPopDiv();
		pDiv.form.staMsg.set_text(sMsgTxt);
		pDiv.form.staMsg.set_visible(true);
		
		nexacro._OnceCallbackTimer.callonce(this, function () {
				pDiv.form.staMsg.set_text("");
				pDiv.form.staMsg.set_visible(false);
			}, 1500);
	};
	
	delete _pFromToCalendar;
}


	
	
	/************************************************************************
	FUNCTION : _get_form_module
	DESCRIPTION :
	RETURN :
	************************************************************************/
	nexacro.FromToCalendar.prototype._get_form_module = function ()
	{
		return function()
		{
			if (!this._is_form)
			return;
			
			var obj = null;
			
			this.on_create = function()
			{
				this.set_name("FromToCalendar");
				this.set_titletext("FromToCalendar");
				if (nexacro.Form == this.constructor)
				{
					this._setFormPosition(317,24);
				}
				
				// Object(Dataset, ExcelExportObject) Initialize
				obj = new nexacro.NormalDataset("gdsMessage", this);
				obj._setContents("<ColumnInfo><Column id=\"msgId\" type=\"STRING\" size=\"256\"/><Column id=\"msgText\" type=\"STRING\" size=\"256\"/><Column id=\"msgType\" type=\"STRING\" size=\"2\"/><Column id=\"msgTitle\" type=\"STRING\" size=\"256\"/></ColumnInfo><Rows><Row><Col id=\"msgId\">msg.server.error</Col><Col id=\"msgText\">서버 오류입니다.\\n관리자에게 문의하세요.</Col><Col id=\"msgType\">ERR</Col><Col id=\"msgTitle\">에러</Col></Row><Row><Col id=\"msgId\">msg.server.error.msg</Col><Col id=\"msgText\">서버에서 다음과 같은 에러메시지를 받았습니다.\\n{0}</Col><Col id=\"msgType\">ERR</Col><Col id=\"msgTitle\">에러</Col></Row><Row><Col id=\"msgId\">msg.session.timeout</Col><Col id=\"msgText\">세션이 종료되었습니다. 다시 로그인해주세요.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.login.url.error</Col><Col id=\"msgText\">정상적인 경로로 접속하시기 바랍니다.</Col><Col id=\"msgType\">ERR</Col><Col id=\"msgTitle\">에러</Col></Row><Row><Col id=\"msgId\">msg.login.error</Col><Col id=\"msgText\">해당하는 사용자 정보가 없습니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.call.nofile</Col><Col id=\"msgText\">해당하는 메뉴에 Program File이 등록되지 않았습니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.nomenu</Col><Col id=\"msgText\">해당 Menu가 존재하지 않습니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.mdicount.max</Col><Col id=\"msgText\">화면은 {0}개 까지만 실행 가능합니다. 화면을 닫고 다시 실행해주세요.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">confirm.logout</Col><Col id=\"msgText\">로그아웃 하시겠습니까?</Col><Col id=\"msgType\">CFN</Col><Col id=\"msgTitle\">확인</Col></Row><Row><Col id=\"msgId\">confirm.before.movepage</Col><Col id=\"msgText\">변경된 데이터가 있습니다. 현재 화면을 닫겠습니까?</Col><Col id=\"msgType\">CFN</Col><Col id=\"msgTitle\">확인</Col></Row><Row><Col id=\"msgId\">confirm.before.removeallpage</Col><Col id=\"msgText\">변경된 데이터가 있습니다. 전체 화면을 닫겠습니까?</Col><Col id=\"msgType\">CFN</Col><Col id=\"msgTitle\">확인</Col></Row><Row><Col id=\"msgId\">confirm.before.reopen</Col><Col id=\"msgText\">변경된 데이터가 있습니다. 화면을 다시 여시겠습니까?</Col><Col id=\"msgType\">CFN</Col><Col id=\"msgTitle\">확인</Col></Row><Row><Col id=\"msgId\">confirm.before.search</Col><Col id=\"msgText\">검색을 진행하면 변경된 데이터가 사라집니다. \\n계속 진행 하시겠습니까?</Col><Col id=\"msgType\">CFN</Col><Col id=\"msgTitle\">확인</Col></Row><Row><Col id=\"msgId\">confirm.before.moveropos</Col><Col id=\"msgText\">해당 row의 위치를 이동하면 변경된 데이터가 사라집니다. \\n계속 진행 하시겠습니까?</Col><Col id=\"msgType\">CFN</Col><Col id=\"msgTitle\">확인</Col></Row><Row><Col id=\"msgId\">confirm.before.delete</Col><Col id=\"msgText\">선택된 자료를 삭제 하시겠습니까? </Col><Col id=\"msgType\">CFN</Col><Col id=\"msgTitle\">확인</Col></Row><Row><Col id=\"msgId\">confirm.before.deletesave</Col><Col id=\"msgText\">선택된 자료를 삭제 후 저장하시겠습니까?</Col><Col id=\"msgType\">CFN</Col><Col id=\"msgTitle\">확인</Col></Row><Row><Col id=\"msgId\">confirm.before.save</Col><Col id=\"msgText\">변경된 내역을 저장 하시겠습니까?</Col><Col id=\"msgType\">CFN</Col><Col id=\"msgTitle\">확인</Col></Row><Row><Col id=\"msgId\">msg.noselect</Col><Col id=\"msgText\">{0} 을(를) 선택해 주십시요.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.search.nodata</Col><Col id=\"msgText\">지정된 조건에 해당하는 항목을 찾을 수 없습니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.save.nodata</Col><Col id=\"msgText\">저장할 데이터가 없습니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.save.nochange</Col><Col id=\"msgText\">변경된 내역이 없습니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.save.success</Col><Col id=\"msgText\">저장 되었습니다.</Col><Col id=\"msgType\">INF</Col><Col id=\"msgTitle\">알림</Col></Row><Row><Col id=\"msgId\">msg.update.success</Col><Col id=\"msgText\">수정 되었습니다.</Col><Col id=\"msgType\">INF</Col><Col id=\"msgTitle\">알림</Col></Row><Row><Col id=\"msgId\">msg.delete.success</Col><Col id=\"msgText\">삭제 되었습니다.</Col><Col id=\"msgType\">INF</Col><Col id=\"msgTitle\">알림</Col></Row><Row><Col id=\"msgId\">msg.action.success</Col><Col id=\"msgText\">처리 되었습니다.</Col><Col id=\"msgType\">INF</Col><Col id=\"msgTitle\">알림</Col></Row><Row><Col id=\"msgId\">msg.action.fail</Col><Col id=\"msgText\">프로세스가 실패하였습니다.</Col><Col id=\"msgType\">ERR</Col><Col id=\"msgTitle\">에러</Col></Row><Row><Col id=\"msgId\">msg.err.updateafter</Col><Col id=\"msgText\">변경된 내역을 저장 후 작업하세요.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.delete.child</Col><Col id=\"msgText\">하위 자료가 있어 삭제할 수 없습니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.grid.noselect</Col><Col id=\"msgText\">선택된 항목이 없습니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.before.delete</Col><Col id=\"msgText\">정말로 삭제 하시겠습니까?</Col><Col id=\"msgType\">CFN</Col><Col id=\"msgTitle\">확인</Col></Row><Row><Col id=\"msgId\">msg.err.validator</Col><Col id=\"msgText\">{0}</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgText\">중복된 {0}가 존재합니다.</Col><Col id=\"msgId\">msg.err.validator.duplcation</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.validator.required</Col><Col id=\"msgText\">{0} 은(는) 필수 입력 항목입니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgText\">{0} 은(는) {1} 보다 작아야 합니다.</Col><Col id=\"msgId\">msg.err.validator.sizemax</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgText\">{0} 은(는) {1} 보다 커야 합니다.</Col><Col id=\"msgId\">msg.err.validator.sizemin</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.validator.length</Col><Col id=\"msgText\">{0} 의 입력값은 {1} 자리이어야 합니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.validator.rangelength</Col><Col id=\"msgText\">{0} 은(는) {1} 와(과) {2} 사이의 자리이어야 합니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.validator.maxlength</Col><Col id=\"msgText\">{0} 항목의 최대 입력글자수를 초과하였습니다. 최대길이 : {1}</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.validator.minlength</Col><Col id=\"msgText\">{0} 항목은 최소 입력글자수 이상 입력해야 합니다. 최소길이 : {1} </Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.validator.maxlengthB</Col><Col id=\"msgText\">{0} 항목의 최대 입력글자수를 초과하였습니다. 최대길이 : {1}  byte</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.validator.minlengthB</Col><Col id=\"msgText\">{0} 항목은 최소 입력글자수 이상 입력해야 합니다. 최소길이 : {1} byte</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.validator.digits</Col><Col id=\"msgText\">{0} 은(는) 숫자만 입력 가능합니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.validator.min</Col><Col id=\"msgText\">{0} 은(는) {1} 이상의 숫자만 입력 가능합니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.validator.max</Col><Col id=\"msgText\">{0} 은(는) {1} 이하의 숫자만 입력 가능합니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.validator.date</Col><Col id=\"msgText\">{0} 은(는) 유효하지 않은 날짜 형식입니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.validator.dateym</Col><Col id=\"msgText\">{0} 은(는) 유효하지 않은 년월 형식입니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgText\">{0} 항목은 {1} 보다 이후 날짜 이여야 합니다.</Col><Col id=\"msgId\">msg.err.validator.fromtomax</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgText\">{0} 항목은 {1} 보다 이전 날짜 이여야 합니다.</Col><Col id=\"msgId\">msg.err.validator.fromtomin</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.validator.fromto</Col><Col id=\"msgText\">{0} 의 날짜가 {1} 의 날짜보다 작습니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.validator.comparebig</Col><Col id=\"msgText\">{0} 이(가) {1} 보다 작습니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.validator.comparesmall</Col><Col id=\"msgText\">{0} 이(가) {1} 보다 큽니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.validator.equalto</Col><Col id=\"msgText\">{0} 이(가) {1} 와(과) 일치하지 않습니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgText\">{0} 은(는) {1} 와(과) 값을 다르게 입력해야 합니다.</Col><Col id=\"msgId\">msg.err.validator.notequalto</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.validator.range</Col><Col id=\"msgText\">{0} 은(는) {1} 와(과) {2} 사이의 값입니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.validator.declimit</Col><Col id=\"msgText\">{0} 은(는) 소숫점 {1} 자리로 구성되어야 합니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.validator.code</Col><Col id=\"msgText\">{0} 은(는) {1} 중 하나의 값이어야 합니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.validator.ssn</Col><Col id=\"msgText\">{0} 항목은 유효하지 않은 주민등록번호입니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.validator.email</Col><Col id=\"msgText\">{0} 항목은 유효하지 않은 이메일 주소입니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.validator.url</Col><Col id=\"msgText\">웹사이트 주소가 잘못 입력 되었습니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.validator.tel</Col><Col id=\"msgText\">전화번호가 잘못된 형태로 입력 되었습니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgText\">{0} 항목은(는) 유효하지 않은 핸드폰번호입니다.</Col><Col id=\"msgId\">msg.err.validator.phone</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.validator.zipcode</Col><Col id=\"msgText\">우편번호가 잘못된 형태로 입력 되었습니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.validator.multicombo.maxcnt</Col><Col id=\"msgText\">{0}개 이상 선택 할 수 없습니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgText\">{0} 항목은 유효하지 않은 사업자등록번호입니다.</Col><Col id=\"msgId\">msg.err.validator.biznum</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgText\">{0} 항목은 유효하지 않은 법인등록번호입니다.</Col><Col id=\"msgId\">msg.err.validator.bubin</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgText\">{0} 항목은 한글만 입력하셔야 합니다.</Col><Col id=\"msgId\">msg.err.validator.hangle</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgText\">{0} 항목은 영문+숫자 조합으로 입력하셔야 합니다.</Col><Col id=\"msgId\">msg.err.validator.engnum</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgText\">{0} 항목은 특수문자를 입력 할 수 없습니다.</Col><Col id=\"msgId\">msg.err.validator.notspecialchar</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.maxdate</Col><Col id=\"msgText\">날짜의 입력 가능 범위를 벗어났습니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.err.validator.date.great</Col><Col id=\"msgText\">종료일이 시작일보다 빠릅니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.file.exist</Col><Col id=\"msgText\">{0} 은(는) 중복된 파일이 존재합니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.file.filesize</Col><Col id=\"msgText\">첨부 파일의 용량은 최고 {0}MB까지 입니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.file.filetotalsize</Col><Col id=\"msgText\">첨부 파일의 전체 용량은 최고 {0}MB까지 입니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.file.allowtype</Col><Col id=\"msgText\">{0} 은(는) 허용되지 않는 확장자입니다.[{1}]</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.file.itemcount</Col><Col id=\"msgText\">첨부 파일은 {0}개 이상 등록 할 수 없습니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.file.uploadfail</Col><Col id=\"msgText\">{0}로(으로) 파일업로드가 실패하였습니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.exist.code</Col><Col id=\"msgText\">입력하는 Code ({0})값이 이미 등록되어 있습니다.</Col><Col id=\"msgType\">WAN</Col><Col id=\"msgTitle\">경고</Col></Row><Row><Col id=\"msgId\">msg.confirm</Col><Col id=\"msgText\">{0}</Col><Col id=\"msgType\">CFN</Col><Col id=\"msgTitle\">확인</Col></Row></Rows>");
				this.addChild(obj.name, obj);
				
				// UI Components Initialize
				obj = new nexacro.Calendar("calFrom","0","0","47.32%",null,null,"0",null,null,null,null,this);
				obj.set_taborder("0");
				obj.set_dateformat("yyyy-MM-dd");
				obj.set_popuptype("none");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Static("staTerm","calFrom:0","0","17",null,null,"0",null,null,null,null,this);
				obj.set_taborder("1");
				obj.set_text("~");
				obj.set_cssclass("sta_WF_Center");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Calendar("calTo","staTerm:0","0",null,null,"0","0",null,null,null,null,this);
				obj.set_taborder("2");
				obj.set_dateformat("yyyy-MM-dd");
				obj.set_popuptype("none");
				obj.set_type("normal");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.PopupDiv("pdivCal","3","33","324","205",null,null,null,null,null,null,this);
				obj.set_text("pdiv00");
				obj.set_visible("false");
				obj.set_cssclass("pdiv_WF_Bg");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Calendar("calFromM","5","5","155",null,null,"38",null,null,null,null,this.pdivCal.form);
				obj.set_taborder("0");
				obj.set_dateformat("yyyy-MM-dd");
				obj.set_type("monthonly");
				this.pdivCal.addChild(obj.name, obj);
				
				obj = new nexacro.Calendar("calToM","calFromM:5","5","155",null,null,"38",null,null,null,null,this.pdivCal.form);
				obj.set_taborder("1");
				obj.set_dateformat("yyyy-MM-dd");
				obj.set_type("monthonly");
				this.pdivCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btnOk","110",null,"50","28",null,"5",null,null,null,null,this.pdivCal.form);
				obj.set_taborder("2");
				obj.set_text("확인");
				this.pdivCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btnCancle","btnOk:5",null,"50","28",null,"5",null,null,null,null,this.pdivCal.form);
				obj.set_taborder("3");
				obj.set_text("취소");
				obj.set_cssclass("btn_WF_Crud");
				this.pdivCal.addChild(obj.name, obj);
				
				obj = new nexacro.Static("staMsg","0","64",null,"60","0",null,null,null,null,null,this.pdivCal.form);
				obj.set_taborder("4");
				obj.set_text("sta00");
				obj.set_background("#ffffff");
				obj.set_border("1px solid red");
				obj.set_textAlign("center");
				obj.set_cssclass("sta_WF_GTxt02");
				obj.set_visible("false");
				this.pdivCal.addChild(obj.name, obj);
				
				obj = new nexacro.PopupDiv("pdivMonthCal","350","50","370","216",null,null,null,null,null,null,this);
				obj.set_text("pdiv00");
				obj.set_visible("false");
				obj.set_border("1px solid");
				obj.set_background("white");
				obj.set_cssclass("pdiv_WF_Bg");
				this.addChild(obj.name, obj);
				
				obj = new nexacro.Static("fr_staBg","0","0","178","175",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("0");
				obj.set_cssclass("sta_WF_Label");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Static("fr_staYear","0","7","178","29",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("1");
				obj.set_text("2020");
				obj.set_cssclass("sta_WF_Cal");
				obj.set_textAlign("center");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("fr_btnPrev","10","7","29","29",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("2");
				obj.set_cssclass("btn_WF_PreBtn");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("fr_btnNext","139","7","29","29",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("3");
				obj.set_cssclass("btn_WF_NxtBtn");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("fr_btn01","6","43","40","40",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("4");
				obj.set_cssclass("btn_WF_Cal01");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("fr_btn02","fr_btn01:2","43","40","40",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("5");
				obj.set_cssclass("btn_WF_Cal02");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("fr_btn03","fr_btn02:2","43","40","40",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("6");
				obj.set_cssclass("btn_WF_Cal03");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("fr_btn04","fr_btn03:2","43","40","40",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("7");
				obj.set_cssclass("btn_WF_Cal04");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("fr_btn05","6","fr_btn01:2","40","40",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("8");
				obj.set_cssclass("btn_WF_Cal05");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("fr_btn06","48","fr_btn02:2","40","40",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("9");
				obj.set_cssclass("btn_WF_Cal06");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("fr_btn07","90","fr_btn03:2","40","40",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("10");
				obj.set_cssclass("btn_WF_Cal07");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("fr_btn08","132","fr_btn04:2","40","40",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("11");
				obj.set_cssclass("btn_WF_Cal08");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("fr_btn09","6","127","40","40",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("12");
				obj.set_cssclass("btn_WF_Cal09");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("fr_btn10","48","127","40","40",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("13");
				obj.set_cssclass("btn_WF_Cal10");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("fr_btn11","90","127","40","40",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("14");
				obj.set_cssclass("btn_WF_Cal11");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("fr_btn12","132","127","40","40",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("15");
				obj.set_cssclass("btn_WF_Cal12");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Static("to_staBg","190","0","178","175",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("16");
				obj.set_cssclass("sta_WF_Label");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Static("to_staYear","190","7","178","29",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("17");
				obj.set_text("2020");
				obj.set_cssclass("sta_WF_Cal");
				obj.set_textAlign("center");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("to_btnPrev","200","7","29","29",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("18");
				obj.set_cssclass("btn_WF_PreBtn");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("to_btnNext","329","7","29","29",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("19");
				obj.set_cssclass("btn_WF_NxtBtn");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("to_btn01","196","43","40","40",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("20");
				obj.set_cssclass("btn_WF_Cal01");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("to_btn02","238","43","40","40",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("21");
				obj.set_cssclass("btn_WF_Cal02");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("to_btn03","280","43","40","40",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("22");
				obj.set_cssclass("btn_WF_Cal03");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("to_btn04","322","43","40","40",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("23");
				obj.set_cssclass("btn_WF_Cal04");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("to_btn05","196","85","40","40",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("24");
				obj.set_cssclass("btn_WF_Cal05");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("to_btn06","238","85","40","40",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("25");
				obj.set_cssclass("btn_WF_Cal06");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("to_btn07","280","85","40","40",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("26");
				obj.set_cssclass("btn_WF_Cal07");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("to_btn08","322","85","40","40",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("27");
				obj.set_cssclass("btn_WF_Cal08");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("to_btn09","196","127","40","40",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("28");
				obj.set_cssclass("btn_WF_Cal09");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("to_btn10","238","127","40","40",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("29");
				obj.set_cssclass("btn_WF_Cal10");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("to_btn11","280","127","40","40",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("30");
				obj.set_cssclass("btn_WF_Cal11");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("to_btn12","322","127","40","40",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("31");
				obj.set_cssclass("btn_WF_Cal12");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btnOk","132","175","50","28",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("32");
				obj.set_text("확인");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Button("btnCancle","187","175","50","28",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("33");
				obj.set_text("취소");
				obj.set_cssclass("btn_WF_Crud");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Static("staMsg","0","64",null,"60","1",null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("34");
				obj.set_text("sta00");
				obj.set_background("#ffffff");
				obj.set_border("1px solid red");
				obj.set_textAlign("center");
				obj.set_cssclass("sta_WF_GTxt02");
				obj.set_visible("false");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Calendar("calFromM","11","178","100","23",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("35");
				obj.set_visible("false");
				obj.set_dateformat("yyyy-MM");
				obj.set_editformat("yyyy-MM");
				this.pdivMonthCal.addChild(obj.name, obj);
				
				obj = new nexacro.Calendar("calToM","249","178","100","23",null,null,null,null,null,null,this.pdivMonthCal.form);
				obj.set_taborder("36");
				obj.set_visible("false");
				obj.set_dateformat("yyyy-MM");
				obj.set_editformat("yyyy-MM");
				this.pdivMonthCal.addChild(obj.name, obj);
				// Layout Functions
				//-- Default Layout : this
				obj = new nexacro.Layout("default","",317,24,this,function(p){});
				this.addLayout(obj.name, obj);
				
				// BindItem Information
				
			};
			
			this.loadPreloadList = function()
			{
				
			};
			
			// User Script
			this.registerScript("FromToCalendar.xcdl", function() {
					this._onload = function(obj,e)
					{
						this.parent.set_monthtype(false, true);
					};
					
					/*******************************************************************************************************************************
					* 각 COMPONENT 별 EVENT 영역
					*******************************************************************************************************************************/
					this.cal_oneditclick = function(obj,e)
					{
						this.calTo.uOrgValue = this.calTo.value;
						this.calFrom.uOrgValue = this.calFrom.value;
						this.parent.fnOpenPopupdiv();
					};
					
					this.cal_ondropdown = function(obj,e)
					{
						this.calTo.uOrgValue = this.calTo.value;
						this.calFrom.uOrgValue = this.calFrom.value;
						this.parent.fnOpenPopupdiv();
					};
					
					this.pdivCal_onpopup = function(obj,e)
					{
						this.parent.fnSetOpenPopupCal();
					};
					
					this.pdivCal_btnOk_onclick = function(obj,e)
					{
						var bCheck = this.parent.isValidCheck();
						if( !bCheck){
							return;
						}
						this.parent.fnClosePopup();
					};
					
					this.pdivCal_btnCancle_onclick = function(obj,e)
					{
						this.calFrom.set_value(this.calFrom.uOrgValue);
						this.calTo.set_value(this.calTo.uOrgValue);
						
						this.parent.closePopDiv();
					};
					
					
					// month - 년도 이전
					this.pdivCal_btnPrev_onclick = function(obj,e)
					{
						var nDate;
						if(obj.id.substr(0,2) == "fr") {
							nDate = nexacro.toNumber(this.pdivMonthCal.form.fr_staYear.text);
							this.pdivMonthCal.form.fr_staYear.set_text(nDate - 1 );
							this.pdivMonthCal.fryear = (nDate - 1) +"";
						} else {
							nDate = nexacro.toNumber(this.pdivMonthCal.form.to_staYear.text);
							this.pdivMonthCal.form.to_staYear.set_text(nDate - 1 );
							this.pdivMonthCal.toyear = (nDate - 1) +"";
						}
					};
					
					// month - 년도 다음
					this.pdivCal_btnNext_onclick = function(obj,e)
					{
						var nDate;
						if(obj.id.substr(0,2) == "fr") {
							nDate = nexacro.toNumber(this.pdivMonthCal.form.fr_staYear.text);
							this.pdivMonthCal.form.fr_staYear.set_text((nDate + 1) +"");
							this.pdivMonthCal.fryear = (nDate + 1) +"";
						} else {
							nDate = nexacro.toNumber(this.pdivMonthCal.form.to_staYear.text);
							this.pdivMonthCal.form.to_staYear.set_text((nDate + 1) + "");
							this.pdivMonthCal.toyear = (nDate + 1) +"";
						}
						
					};
					
					// month - 월
					this.btnMonth_onclick = function(obj,e)
					{
						var sMonth;
						if(obj.id.substr(0,2) == "fr") {
							sMonth = obj.name.replace("fr_btn","");
							this.pdivMonthCal.frmonth = sMonth;
							this.parent.fnResetMonth("from");
						} else {
							sMonth = obj.name.replace("to_btn","");
							this.pdivMonthCal.tomonth = sMonth;
							this.parent.fnResetMonth("to");
						}
						if(this.parent.monthselectcss) {
							obj.set_cssclass(this.parent.monthselectcss);
						} else if(this.parent.monthselectcolor) {
							obj.set_background(this.parent.monthselectcolor);
						}
					};
					
					
					
				});
			
			// Regist UI Components Event
			this.on_initEvent = function()
			{
				this.addEventHandler("onload",this._onload,this);
				this.calFrom.addEventHandler("oneditclick",this.cal_oneditclick,this);
				this.calFrom.addEventHandler("ondropdown",this.cal_ondropdown,this);
				this.calTo.addEventHandler("oneditclick",this.cal_oneditclick,this);
				this.calTo.addEventHandler("ondropdown",this.cal_ondropdown,this);
				this.pdivCal.addEventHandler("onpopup",this.pdivCal_onpopup,this);
				this.pdivCal.form.btnOk.addEventHandler("onclick",this.pdivCal_btnOk_onclick,this);
				this.pdivCal.form.btnCancle.addEventHandler("onclick",this.pdivCal_btnCancle_onclick,this);
				this.pdivMonthCal.addEventHandler("onpopup",this.pdivCal_onpopup,this);
				this.pdivMonthCal.form.fr_btnPrev.addEventHandler("onclick",this.pdivCal_btnPrev_onclick,this);
				this.pdivMonthCal.form.fr_btnNext.addEventHandler("onclick",this.pdivCal_btnNext_onclick,this);
				this.pdivMonthCal.form.fr_btn01.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivMonthCal.form.fr_btn02.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivMonthCal.form.fr_btn03.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivMonthCal.form.fr_btn04.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivMonthCal.form.fr_btn05.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivMonthCal.form.fr_btn06.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivMonthCal.form.fr_btn07.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivMonthCal.form.fr_btn08.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivMonthCal.form.fr_btn09.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivMonthCal.form.fr_btn10.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivMonthCal.form.fr_btn11.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivMonthCal.form.fr_btn12.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivMonthCal.form.to_btnPrev.addEventHandler("onclick",this.pdivCal_btnPrev_onclick,this);
				this.pdivMonthCal.form.to_btnNext.addEventHandler("onclick",this.pdivCal_btnNext_onclick,this);
				this.pdivMonthCal.form.to_btn01.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivMonthCal.form.to_btn02.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivMonthCal.form.to_btn03.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivMonthCal.form.to_btn04.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivMonthCal.form.to_btn05.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivMonthCal.form.to_btn06.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivMonthCal.form.to_btn07.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivMonthCal.form.to_btn08.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivMonthCal.form.to_btn09.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivMonthCal.form.to_btn10.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivMonthCal.form.to_btn11.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivMonthCal.form.to_btn12.addEventHandler("onclick",this.btnMonth_onclick,this);
				this.pdivMonthCal.form.btnOk.addEventHandler("onclick",this.pdivCal_btnOk_onclick,this);
				this.pdivMonthCal.form.btnCancle.addEventHandler("onclick",this.pdivCal_btnCancle_onclick,this);
			};
			this.loadIncludeScript("FromToCalendar.xcdl");
			this.loadPreloadList();
			
			// Remove Reference
			obj = null;
		};
	};