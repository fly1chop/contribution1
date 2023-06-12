//==============================================================================
//	Define the Component Class of the Compostie Component.
//==============================================================================
//==============================================================================
// Object : nexacro.PeriodCalendar
// Group : Component
//==============================================================================
if (!nexacro.PeriodCalendar)
{
	//==============================================================================
	// nexacro.PeriodCalendar
	//==============================================================================
	nexacro.PeriodCalendar = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
	{
		nexacro._CompositeComponent.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
	};

	var _pPeriodCalendar = nexacro._createPrototype(nexacro._CompositeComponent, nexacro.PeriodCalendar);
	nexacro.PeriodCalendar.prototype = _pPeriodCalendar;
	_pPeriodCalendar._type_name = "PeriodCalendar";
		
	/* accessibility */
	_pPeriodCalendar.accessibilityrole = "form";
	
	
	/*******************************************************************************************************************************
	 * Util Function 영역
	*******************************************************************************************************************************/
	
	/**
	 * @class null값 확인
	 * @param {Object} objDs - 확인 대상 Dataset
	 * @return {boolean}
	 */   
	_pPeriodCalendar._isNull = function(sValue)
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
	_pPeriodCalendar._getDate = function(sGubn, bFormat) 
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
	_pPeriodCalendar._getDay = function(strDate)
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
	_pPeriodCalendar._getDayKor = function(dateVal) 
	{
		var nDay = -1;
		var dayKorArray = ["일", "월", "화", "수", "목", "금", "토"];
		
		nDay = this._getDay(dateVal);
		
		if( nDay < 0 ) return "";
		
		return dayKorArray[nDay];
	};
	
	/**
	 * @class 메세지 치환 후 완성된 메시지 리턴
	 * @param {String} sMsgId - 메세지ID	
	 * @param {Array}  arrArg - 메세지에 치환될 부분은 "{0~N}"이 되고 치환값은 배열로 넘김 
	 * @return {String} 치환된 메시지
	 */
	_pPeriodCalendar._getMessage = function(sMsgId, arrArg) 
	{
		//var objApp = nexacro.getApplication();
		if(this.form.gdsMessage.findRow("msgId", sMsgId) < 0) return false;
		var sMsg = this.form.gdsMessage.lookup("msgId", sMsgId, "msgText");
		// 줄바꿈 변경
		sMsg = sMsg.replace(/\\\\n/g, String.fromCharCode(10));
		sMsg = sMsg.replace(/\\n/g, String.fromCharCode(10));	
		sMsg =  this._convertMessage(sMsg, arrArg);
		
		return sMsg;
	};
	
	/**
	 * @class 메세지 치환
	 * @param {String} msg - 메세지	
	 * @param {Array} values - 메세지에 치환될 부분은 "{0~N}"이 되고 치환값은 배열로 넘김 
	 * @return {String} 치환된 메시지
	 */
	_pPeriodCalendar._convertMessage = function(msg, values) 
	{
		var rtnMsg = "";
		if(!this._isNull(values)){
			for(var i = 0, len = values.length; i < len; i++)
			{
				rtnMsg = msg.replace(/\{(\d+)\}/i, values[i]);
			}
		} else {
			rtnMsg = msg;
		}
		
		return rtnMsg;
	};
	
	/**
	 * @class 두 일자간의 차이 일수 계산 <br>
	 * @param {String} sStartDate - yyyyMMdd형태의 From 일자 ( 예 : "20121122" )
	 * @param {String} sEndDate - yyyyMMdd형태의 To 일자   ( 예 : "20121202" )
	 * @return {Number} 숫자 형태의 차이일수( 예 : 10 ) 단, sEndDate < sStartDate이면 음수가 return된다.
	 */
	_pPeriodCalendar._getDiffDate = function(sStartDate, sEndDate)
	{
		var vFromDate = new Date(parseInt(sEndDate.substring(0,4),  10), parseInt(sEndDate.substring(4,6)-1,  10), parseInt(sEndDate.substring(6,8), 10));
		var vToDate = new Date(parseInt(sStartDate.substring(0,4),  10), parseInt(sStartDate.substring(4,6)-1,  10), parseInt(sStartDate.substring(6,8), 10));
		
		return parseInt((vFromDate - vToDate)/(1000*60*60*24));
	};
	/*******************************************************************************************************************************
	 * 사용자 Function 영역
	*******************************************************************************************************************************/
	_pPeriodCalendar.getFromDate = function ()
	{
		return this.form.calFrom.value;
	};

	_pPeriodCalendar.getToDate = function ()
	{
		return this.form.calTo.value;
	};

	_pPeriodCalendar.setFromDate = function (v)
	{
		this.form.calFrom.set_value(v);
	};

	_pPeriodCalendar.setToDate = function (v)
	{
		this.form.calTo.set_value(v);
	};

	_pPeriodCalendar.setRequired = function(bValue)
	{
		if (bValue) {
			this.form.calTo.set_cssclass("essential");
			this.form.calFrom.set_cssclass("");
		}else {
			this.form.calTo.set_cssclass("");
			this.form.calFrom.set_cssclass("");
		}
	};

	_pPeriodCalendar.setReadOnly = function(bValue)
	{
		this.form.calTo.set_readonly(bValue);
		this.form.calFrom.set_readonly(bValue);
	};

	_pPeriodCalendar.fnOpenPopupdiv = function ()
	{
		this.form.pdivCal.trackPopupByComponent(this.form.calFrom, 0, this.form.calFrom.getOffsetHeight());
	};

	_pPeriodCalendar.fnShowMessage = function (sMsgId, arrArg)
	{
		var sMsgTxt = this._getMessage(sMsgId, arrArg);
		
		this.form.pdivCal.form.staMsg.set_text(sMsgTxt);
		this.form.pdivCal.form.staMsg.set_visible(true);
		
		nexacro._OnceCallbackTimer.callonce(this, function () {
				this.form.pdivCal.form.staMsg.set_text("");
				this.form.pdivCal.form.staMsg.set_visible(false);
			}, 3000);
	};

	delete _pPeriodCalendar;
}


	
	
	/************************************************************************
	FUNCTION : _get_form_module
	DESCRIPTION :
	RETURN :
	************************************************************************/
	nexacro.PeriodCalendar.prototype._get_form_module = function ()
	{
		return function()
		{
			if (!this._is_form)
			return;
			
			var obj = null;
			
			this.on_create = function()
			{
				this.set_name("PeriodCalendar");
				this.set_titletext("PeriodCalendar");
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
				this.addChild(obj.name, obj);
				
				obj = new nexacro.PopupDiv("pdivCal","3","33","328","225",null,null,null,null,null,null,this);
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
			this.registerScript("PeriodCalendar.xcdl", function() {
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
						var sFrom = this.calFrom.value;
						var sTo   = this.calTo.value;
						if(this.parent._isNull(sFrom)) sFrom = this.parent._getDate();
						if(this.parent._isNull(sTo)) sTo = this.parent._getDate();
						
						this.pdivCal.form.calFromM.set_value(sFrom);
						this.pdivCal.form.calToM.set_value(sTo);
					};
					
					this.pdivCal_btnOk_onclick = function(obj,e)
					{
						var sFrom = this.pdivCal.form.calFromM.value;
						var sTo = this.pdivCal.form.calToM.value;
						
						if( this.parent._isNull(sFrom)){
							this.parent.fnShowMessage("msg.err.validator.required", ["시작"]);
							return;
						}
						if( this.parent._isNull(sTo)){
							this.parent.fnShowMessage("msg.err.validator.required", ["종료"]);
							return;
						}
						if( this.parent._getDiffDate(sFrom, sTo) < 0){
							this.parent.fnShowMessage("msg.err.validator.date.great");
							return;
						}
						
						this.calFrom.set_value(sFrom);
						this.calTo.set_value(sTo);
						this.pdivCal.closePopup();
					};
					
					this.pdivCal_btnCancle_onclick = function(obj,e)
					{
						this.calFrom.set_value(this.calFrom.uOrgValue);
						this.calTo.set_value(this.calTo.uOrgValue);
						
						this.pdivCal.closePopup();
					};
				});
			
			// Regist UI Components Event
			this.on_initEvent = function()
			{
				this.calFrom.addEventHandler("oneditclick",this.cal_oneditclick,this);
				this.calFrom.addEventHandler("ondropdown",this.cal_ondropdown,this);
				this.calTo.addEventHandler("oneditclick",this.cal_oneditclick,this);
				this.calTo.addEventHandler("ondropdown",this.cal_ondropdown,this);
				this.pdivCal.addEventHandler("onpopup",this.pdivCal_onpopup,this);
				this.pdivCal.form.btnOk.addEventHandler("onclick",this.pdivCal_btnOk_onclick,this);
				this.pdivCal.form.btnCancle.addEventHandler("onclick",this.pdivCal_btnCancle_onclick,this);
			};
			this.loadIncludeScript("PeriodCalendar.xcdl");
			this.loadPreloadList();
			
			// Remove Reference
			obj = null;
		};
	};