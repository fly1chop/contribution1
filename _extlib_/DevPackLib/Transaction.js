/**
*  devPack Library
*  @FileName 	Transaction.js 
*  @Creator 	TOBESOFT
*  @CreateDate 	2020.11.24
*  @Desction   
************** 소스 수정 이력 ***********************************************
*  date          		Modifier                Description
*******************************************************************************
* 2020.11.24			TOBESOFT				Transaction Library
*******************************************************************************
*/

var pForm = nexacro.Form.prototype;


/**
 * @class 서비스 호출 공통함수 <br>
 * Dataset의 값을 갱신하기 위한 서비스를 호출하고, 트랜젝션이 완료되면 콜백함수을 수행하는 함수
 * @param {String} strSvcId - 서비스 ID
 * @param {String} strSvcUrl - 서비스 호출 URL 
 * @param {String} [inData]	- input Dataset list("입력ID=DataSet ID" 형식으로 설정하며 빈칸으로 구분)
 * @param {String} [outData] - output Dataset list("DataSet ID=출력ID" 형식으로 설정하며 빈칸으로 구분)
 * @param {String} [strArg]	- 서비스 호출시 Agrgument
 * @param {String} [callBackFnc] - 콜백 함수명
 * @param {Boolean} [isAsync] - 비동기통신 여부 
 * @return N/A
 * @example
 * var strSvcUrl = "transactionSaveTest.do";
 * var inData    = "dsList=dsList:U";
 * var outData   = "dsList=dsList";
 * var strArg    = "";
 * this.gfnTransaction("save", strSvcUrl, inData, outData, strArg, "fnCallback", true);
 */ 
pForm.gfnTransaction = function(strSvcId, strSvcUrl, inData, outData, strArg, callBackFnc, isAsync)
{
	if (this.gfnIsNull(strSvcId) || this.gfnIsNull(strSvcUrl))
	{
		trace("Error : gfnTransaction() 함수의 인자값이 부족합니다.");
		return false;
	}
	
	// fnCallback 함수 기본값 설정
	if (this.gfnIsNull(callBackFnc)) callBackFnc = "fnCallback";
	
	var objDate = new Date();
	var nStartTime = objDate.getTime();
    var sStartDate = objDate.getYear()
						+"-"+String(objDate.getMonth()).padLeft(2, '0')
						+"-"+String(objDate.getDate()).padLeft(2, '0')
						+" "+String(objDate.getHours()).padLeft(2, '0')
						+":"+String(objDate.getMinutes()).padLeft(2, '0')
						+":"+String(objDate.getSeconds()).padLeft(2, '0')
						+" "+objDate.getMilliseconds();

	// Async
	if ((isAsync != true) && (isAsync != false)) isAsync = true;	
	
	// 1. callback에서 처리할 서비스 정보 저장
	var objSvcID = { 
			svcId     : strSvcId,
			svcUrl    : strSvcUrl,
			callback  : callBackFnc,
			isAsync   : isAsync,
			startDate : sStartDate,
			startTime : nStartTime };
	
	// 2. strServiceUrl
	var strServiceUrl = "svcUrl::" + strSvcUrl;
	
	// 3. strArg
	var strArguments = "";
	if (this.gfnIsNull(strArg)) {
		strArguments = "";
	}else { 
		strArguments = strArg;
	}

	// 개발 및 개발서버 에는 xml, 운영서버는 SSV로 통신
	var nDataType;	
	if (nexacro.getEnvironmentVariable("evRunMode") == "R") {
		nDataType = 2;
	}else {
		nDataType = 0;
	}
	this.transaction( JSON.stringify(objSvcID)  //1.svcID
					, strServiceUrl             //2.strServiceUrl
					, inData                    //3.inDataSet
					, outData                   //4.outDataSet
					, strArguments              //5.arguments
					, "gfnCallback"				//6.strCallbackFunc
					, isAsync                   //7.bAsync
					, nDataType                 //8.nDataType : 0(XML 타입), 1((Binary 타입),  2(SSV 타입) --> HTML5에서는 Binary 타입은 지원안함
					, false);                   //9.bCompress ( default : false ) 
};

pForm.gfnCallback = function (svcID, errorCode, errorMsg)
{
	var objSvcID = JSON.parse(svcID);

	// 서비스 실행결과 출력
	var sStartDate = objSvcID.startDate;
	var nStartTime = objSvcID.startTime;
	
	var objDate = new Date();
	var sEndDate = objDate.getYear()
					+"-"+String(objDate.getMonth()).padLeft(2, '0')
					+"-"+String(objDate.getDate()).padLeft(2, '0')
					+" "+String(objDate.getHours()).padLeft(2, '0')
					+":"+String(objDate.getMinutes()).padLeft(2, '0')
					+":"+String(objDate.getSeconds()).padLeft(2, '0')
					+" "+objDate.getMilliseconds();
	var nElapseTime = (objDate.getTime() - nStartTime)/1000;
	
	var sMsg = "";
	// studio 실행시에만 transaction 실행 log 표시
	if (nexacro.getEnvironmentVariable("evRunMode") == "S") {
		if (errorCode == 0){
			sMsg = "gfnCallback : svcID>>"+objSvcID.svcId+ ",  svcUrl>>"+objSvcID.svcUrl+ ",  errorCode>>"+errorCode + ", errorMsg>>"+errorMsg + ", isAsync>>" + objSvcID.isAsync + ", sStartDate>>" + sStartDate + ", sEndDate>>"+sEndDate + ", nElapseTime>>"+nElapseTime;
			trace(sMsg);
		}else {
			sMsg = "gfnCallback : svcID>>"+objSvcID.svcId+ ",  svcUrl>>"+objSvcID.svcUrl+ ",  errorCode>>"+errorCode + ", isAsync>>" + objSvcID.isAsync + ", sStartDate>>" + sStartDate + ", sEndDate>>"+sEndDate + ", nElapseTime>>"+nElapseTime;
			sMsg += "\n==================== errorMsg =======================\n"+errorMsg+"\n==================================================";
			trace(sMsg);
		}
	}
	
	// 에러 공통 처리
	if(errorCode != 0)
	{
		switch(errorCode)
		{
			case -1 :
				// 서버 오류입니다.\n관리자에게 문의하세요.
				this.gfnAlert("msg.server.error");
				return;
				// return; 서버 에러 와 업무 에러 코드 분리시에 return 처리 결정
				break;
				
			case -2463215:
				//@todo : 임의 에러코드  처리
				//return false;
				break;
		}
	}

	// 화면의 callBack 함수 실행 (callback실행시키지 않을 경우 gfnStopCallback 지정)
	if(!this.gfnIsNull(objSvcID.svcId) && objSvcID.callback != "gfnStopCallback")
	{
		// form에 callback 함수가 있을때
		if (this[objSvcID.callback]) this.lookupFunc(objSvcID.callback).call(objSvcID.svcId, errorCode, errorMsg);
	}
};


pForm = null;