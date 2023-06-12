/**
*  devPack Library
*  @FileName 	Message.js 
*  @Creator 	TOBESOFT
*  @CreateDate 	2020.11.24
*  @Desction   
************** 소스 수정 이력 ***********************************************
*  date          		Modifier                Description
*******************************************************************************
* 2020.11.24			TOBESOFT				Message Library
*******************************************************************************
*/

var pForm = nexacro.Form.prototype;

/**
 * @class 메세지팝업오픈
 * @param {String} sMsgId - 메세지ID	
 * @param {Array} arrArg - 메세지에 치환될 부분은 "{0~N}"이 되고 치환값은 배열로 넘김 
 * @param {String} [sPopId] - 팝업ID(하나의 callback함수에서 중복된 메시지 처리를 할 경우 PopId구분을 위해 unique한 ID 반드시 사용)
 * @param {String} [sCallback] - 팝업콜백 (confirm성 메시지를 사용시 반드시 필요)
 * @param {Array} [arrButton] - 확인 창에서 버튼의 명칭 배열
 * @param {Array} [arrRtn]    - 확인 창에서 버튼 클릭시 리턴할 값 배열
 * @return N/A
 * @example
 * // {0} 항목의 최대 입력글자수를 초과하였습니다. 최대길이 : {1}
 * this.gfnAlert("NAA0023", ["이름", "3자"]);
 * // 저장하시겠습니까?
 * this.gfnAlert("NAA0012", null, "NAA0012", "fnMsgCallback", ["예", "아니오", "취소"], ["Y", "N", "C"]);
 */
pForm.gfnAlert = function (sMsgId, arrArg, sPopId, sCallback, arrButton, arrRtn)
{
    var objApp = nexacro.getApplication();
	
	var nCnt   = 1;
	
	// 버튼 명칭 사용 시
	if (!this.gfnIsNull(arrButton) && !this.gfnIsNull(arrRtn))
	{
		if (arrButton.length != arrRtn.length) 
		{
			alert("Button 명 배열의 크기와 Return 될 값 배열의 크기가 다릅니다.");
			return;
		}

		if (arrButton.length == 1 || arrButton.length > 3) 
		{
			alert("Button 의 갯수는 2 ~ 3개 만 지원됩니다.");
			return;
		}		
	}
	
	// 서비스 오류, 사용자 오류(Transaction에서 공통 처리)
	if (sMsgId.indexOf("|") > -1) 
	{
		var sMsg = (sMsgId.split("|"))[1];
		// 줄바꿈 변경
		sMsg = sMsg.replace(/\\\\n/g, String.fromCharCode(10));
		sMsg = sMsg.replace(/\\n/g, String.fromCharCode(10));
		
		// 공백문자 변경
		sMsg = sMsg.replace(/&#32;/g, " ");
		
		var sMsgType = objApp.gdsMessage.lookup("MSGE_CD", (sMsgId.split("|"))[0], "MSGE_FLAG_CD");
		if( this.gfnIsNull(sMsgType) ) sMsgType = "WAN";
	// UI 메시지
	} else 
	{
		// validation.js 에서 사용시(화면에서는 sMsgId에 "{0}" 사용 불가)
		if (sMsgId == "msg.validator") 
		{
			var sMsg = "{0}";
			var sMsgType = "WAN";
		// 프레임에서 사용시(화면에서는 sMsgId에 "{0}" 사용 불가)
		} else if (sMsgId == "msg.confirm") 
		{
			var sMsg = "{0}";
			var sMsgType = "CFN";
			var sMsgTitle = "확인";
		// 화면에서 사용시
		} else 
		{			
			if (objApp.gdsMessage.findRow("MSGE_CD", sMsgId) < 0) 
			{
				this.gfnAlert("msg.general",["해당하는 메시지 코드가 없습니다. 메시지 코드를 확인하세요!"]);
				return false;
			}

			var sMsg = objApp.gdsMessage.lookup("MSGE_CD", sMsgId, "KORN_MSGE");
			var sMsgType = objApp.gdsMessage.lookup("MSGE_CD", sMsgId, "MSGE_FLAG_CD");
			var sMsgTitle = "";
			if( sMsgType == "INF") sMsgTitle = "알림";
			else if( sMsgType == "WAN") sMsgTitle = "경고";
			else if( sMsgType == "ERR") sMsgTitle = "에러";
			else if( sMsgType == "CFN") sMsgTitle = "확인";
		}
		
		// 아이콘옆에 메시지 표시를 위해 줄바꿈 갯수에 따라 빈줄 삽입
		var arrMsg = sMsg.split("\\n");
		nCnt = arrMsg.length;
		
		// 줄바꿈 변경
		sMsg = sMsg.replace(/\\\\n/g, String.fromCharCode(10));
		sMsg = sMsg.replace(/\\n/g, String.fromCharCode(10));
		
		// 공백문자 변경
		sMsg = sMsg.replace(/&#32;/g, " ");
		
		// 메시지 생성
		sMsg =  this.gfnConvertMessage(sMsg, arrArg);
	}
	
	if (this.gfnIsNull(sPopId)) sPopId = sMsgId;

	var sMsgUrl ="";
	switch(sMsgType) 
	{
		case "WAN": case "ERR":	case "INF":
			sMsgUrl = "common::cmmAlert.xfdl";
			break;
			
		case "CFN":
			sMsgUrl = "common::cmmConfirm.xfdl";
			if(this.gfnIsNull(sCallback)) trace("callback함수를 지정하지 않았습니다");
			break;
	}
	
	if(this.gfnIsNull(sCallback)){
		sCallback = "gfnMsgCallback";
	}
	
	var objArg = {paramContents:sMsg, paramType:sMsgType, paramButton:arrButton, paramRtn:arrRtn};
	var objOption = {titlebar:"true", title:sMsgTitle};	
	
	// messagePopup
	if (nexacro.getEnvironmentVariable("evMessagePopup") == "true") 
	{
		this.gfnOpenPopup(sPopId, sMsgUrl, objArg, sCallback, objOption);
	// alert-cofirm
	} else {
		if (sMsgType == "WAN" || sMsgType == "ERR" ||sMsgType == "INF") 
		{
			alert(sMsg);
		} else 
		{
			confirm(sMsg);
		}
	}
};

pForm.gfnMsgCallback = function (sPopupId, sRtn)
{
	//TODO..
	//공통 메세지 콜백
};

/**
 * @class 메세지 치환 후 완성된 메시지 리턴
 * @param {String} sMsgId - 메세지ID	
 * @param {Array}  arrArg - 메세지에 치환될 부분은 "{0~N}"이 되고 치환값은 배열로 넘김 
 * @return {String} 치환된 메시지
 */
pForm.gfnGetMessage = function(sMsgId, arrArg) 
{
    var objApp = nexacro.getApplication();
	if(objApp.gdsMessage.findRow("MSGE_CD", sMsgId) < 0) return false;

	//var sMsg = objApp.gdsMessage.lookup("msgId", sMsgId, "ntcnMsgCn");
	var sMsg = objApp.gdsMessage.lookup("MSGE_CD", sMsgId, "KORN_MSGE");

	// 줄바꿈 변경
	sMsg = sMsg.replace(/\\\\n/g, String.fromCharCode(10));
	sMsg = sMsg.replace(/\\n/g, String.fromCharCode(10));	
	sMsg =  this.gfnConvertMessage(sMsg, arrArg);
	
	return sMsg;
};

/**
 * @class 메세지 치환
 * @param {String} msg - 메세지	
 * @param {Array} values - 메세지에 치환될 부분은 "{0~N}"이 되고 치환값은 배열로 넘김 
 * @return {String} 치환된 메시지
 */
pForm.gfnConvertMessage = function(msg, values) 
{
    return msg.replace(/\{(\d+)\}/g, function() 
	{
		return values[arguments[1]];
    });
};

// 
// /**
//  * @class 메세지팝업오픈
//  * @param {String} sMsgId - 메세지ID	
//  * @param {Array} arrArg - 메세지에 치환될 부분은 "{0~N}"이 되고 치환값은 배열로 넘김 
//  * @param {String} [sPopId] - 팝업ID(하나의 callback함수에서 중복된 메시지 처리를 할 경우 PopId구분을 위해 unique한 ID 반드시 사용)
//  * @param {String} [sCallback] - 팝업콜백 (confirm성 메시지를 사용시 반드시 필요)
//  * @return N/A
//  * @example
//  * this.gfnAlert(this, "A", "확인하세요");	
//  */
// pForm.gfnAlert = function (sMsgId, arrArg, sPopId, sCallback)
// {
//     var objApp = nexacro.getApplication();
// 	if(objApp.gdsMessage.findRow("msgId", sMsgId) < 0) return false;
// 
// 	//message text 
// 	var sMsg = this.gfnGetMessage(sMsgId, arrArg);
// 	
// 	//message type
// 	var sMsgType = objApp.gdsMessage.lookup("msgId", sMsgId, "msgType");	
// 	
// 	//popup id  지정
// 	if(this.gfnIsNull(sPopId)) sPopId = sMsgId;
// 	
// 	//popup url..
// 	var sMsgUrl ="";
// 	var sTitle = "";
// 	switch(sMsgType) {
// 		case "A":
// 			sMsgUrl = "common::cmmAlert.xfdl";
// 			sTitle = "알림";
// 			break;
// 		case "C":
// 			sMsgUrl = "common::cmmConfirm.xfdl";
// 			//callback 지정안했을 경우 디폴트로지정
// 			if(this.gfnIsNull(sCallback)) sCallback = "fnMsgCallback";
// 			sTitle = "확인";
// 			break;
// 	}
// 	
// 	//argument
// 	var oArg    = {pvMsg:sMsg};
// 	var oOption = {titlebar:"true"
// 				  ,title:sTitle};	
// 	
// 	//show message
// 	if (nexacro.getEnvironmentVariable("evMessagePopup") == "true") {
// 		// messagePopup
// 		this.gfnOpenPopup(sPopId,sMsgUrl,oArg,sCallback,oOption);
// 	}else { 
// 		//System message
// 		if (sMsgType == "A") {
// 			this.alert(sMsg);
// 		}else {
// 			this.confirm(sMsg);
// 		}
// 	}
// };
// 
// /**
//  * @class 메세지 치환
//  * @param {String} msg - 메세지	
//  * @param {Array} values - 메세지에 치환될 부분은 "{0~N}"이 되고 치환값은 배열로 넘김 
//  * @return {String} 치환된 메시지
//  */
// pForm.gfnConvertMessage = function(msg, values) 
// {
//     return msg.replace(/\{(\d+)\}/g, function() {
//         return values[arguments[1]];
//     });
// };
// 
// 
// /**
//  * @class 메세지 치환 후 완성된 메시지 리턴
//  * @param {String} sMsgId - 메세지ID	
//  * @param {Array}  arrArg - 메세지에 치환될 부분은 "{0~N}"이 되고 치환값은 배열로 넘김 
//  * @return {String} 치환된 메시지
//  */
// pForm.gfnGetMessage = function(sMsgId, arrArg) 
// {
//      var objApp = nexacro.getApplication();
// 	if(objApp.gdsMessage.findRow("msgId", sMsgId) < 0) return false;
// 
// 	//message text
// 	var sMsg = objApp.gdsMessage.lookup("msgId", sMsgId, "msgText");
// 	if(this.gfnIsNull(sMsg))    sMsg = "확인";
// 	
// 	// 줄바꿈 변경
// 	sMsg = sMsg.replace(/\\\\n/g, String.fromCharCode(10));
// 	sMsg = sMsg.replace(/\\n/g, String.fromCharCode(10));
// 	
// 	// 공백문자 변경
// 	sMsg = sMsg.replace(/&#32;/g, " ");
// 	
// 	//argument
// 	if(!this.gfnIsNull(arrArg)) sMsg =  this.gfnConvertMessage(sMsg, arrArg);
// 	
// 	return sMsg;
// };

pForm = null;