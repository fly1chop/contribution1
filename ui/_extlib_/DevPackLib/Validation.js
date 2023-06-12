/**
*  devPack Library
*  @FileName 	Validation.js 
*  @Creator 	TOBESOFT
*  @CreateDate 	2020.11.24
*  @Desction   
************** 소스 수정 이력 ***********************************************
*  date          		Modifier                Description
*******************************************************************************
* 2020.11.24			TOBESOFT				Validation Library
*******************************************************************************
*/

var pForm = nexacro.Form.prototype;


// Validation ERROR class 사용 여부
pForm.useErrorClass = true;

/**
 * @class Dataset에 설정된 정합성체크 RuleSet을 Clear한다.
 * @param {Dataset} obj - 데이터셋 Object
 * @return N/A
 */  
pForm.gfnClearValidation = function(obj)
{
	obj.validationRuleSet = "";
	
	// Validation ERROR class 사용 시 cssclass 원복
	if (this.useErrorClass) {
		this.gfnResetValidationCss(obj);
	}	
};

/**
 * @class Dataset의 Column별로 설정된 정합성체크 Rule을 제거한다.
 * @param  {Dataset} 데이터셋 Object
 * @param  {String} 체크대상 컬럼명
 * @return N/A
 */  
pForm.gfnRemoveValidation = function(obj, sColumID)
{
	var newvalidObj = new Array();

	if (!this.gfnIsNull(obj.validationRuleSet))
	{
		validObj = JSON.parse(obj.validationRuleSet);

		for(var index in validObj)
		{
			var validationRule = validObj[index];

			// 제거 대상이 아닐때만 정합성체크 대상에 넣는다.
			if (validationRule.name != sColumID)
			{
				newvalidObj.push(validationRule);
			}
		}
	}
				
	obj.validationRuleSet = JSON.stringify(newvalidObj);            
};

/**
 * @class Dataset의 Column별로 정합성체크 Rule을 등록한다.
 * @param {Dataset} obj - 데이터셋 Object
 * @param {String} sColumID - 체크대상 컬럼명
 * @param {String} sColumName - 컬럼명의 오류메세지 처리 제목
 * @param {String} sValidRule - 정합성체크 Rule(required, length, min, max, code 등의 체크 형식)
 * @return N/A
 */
pForm.gfnSetValidation = function(obj, sColumID, sColumName, sValidRule)
{
	var validObj = new Array();
	
	// title이 2개가 올 경우 구분자를 변경
	// checkrule == "fromto" || checkrule == "fromtosmall" || checkrule == "comparebig" || checkrule == "comparesmall" || checkrule == "compareequal"
	if (sColumName.indexOf(",") != -1) sColumName = nexacro.replaceAll(sColumName, ",", "^_^");
    
	// Dataset에 RuleSet이 존재하면
	if (!this.gfnIsNull(obj.validationRuleSet))
	{
		validObj = JSON.parse(obj.validationRuleSet);
		for(var index in validObj)
		{
			// 컬럼에 Rule이 존재하면 변경 처리
			if( validObj[index].name == sColumID )
			{            
				validObj[index].title = sColumName;
				validObj[index].value = sValidRule;
				if (""+sValidRule.indexOf("required") > -1) {
					validObj[index].notnull = true;
				}
				else {
					validObj[index].notnull = false;
				}
				obj.validationRuleSet = JSON.stringify(validObj);
				return true;
			}
		}
	}
	
	// Rule 지정
	var validationRule = 
	{
		 name  : sColumID		// Column
		,title : sColumName		// Title
		,value : sValidRule		// 정합성 Rule
	};
	
	// Rule에 필수여부 추가
	if (""+sValidRule.indexOf("required") > -1) {
		validationRule.notnull = true;
	}
	else {
		validationRule.notnull = false;
	}				
	validObj.push(validationRule);

	obj.validationRuleSet = JSON.stringify(validObj);
};


/**
 * @class Dataset에 등록된 데이터 정합성체크 RuleSet에의해 정합성을 체크를 하고 이상 여부를 리턴한다.
 * @param  {Dataset||Grid,String} Check 대상 Object(Dataset, Grid)
                                  Check 모드 A: 모든 row에 대해서 체크, U: 변경된 row에 대해서만 체크(default)
 * @param  {String} sCheckRow - A : 모든 row에 대해서 체크, U : 변경된 row에 대해서만 체크(default), nRow : 해당 Dataset의 Row
 * @return {Boolean} 정상 true / 오류 false
 */
pForm.gfnValidation = function(objVal, sCheckRow)
{
	var dataset;
	var objtype     = "";
	var checkmode   = "U";

	// 데이터셋
	if (objVal instanceof Dataset) {
		dataset = objVal;
		objtype = "dataset";
	}
	// 그리드
	else if (objVal instanceof Grid ) {
		dataset = objVal.getBindDataset();
		objtype = "grid";
	}
	// 처리 제외
	else {
		alert("Validation Check 대상에는 Dataset or Grid만 됩니다.");
		return false;
	}
	
	// Check Mode(A / U / Row)를 지정
	if (sCheckRow == "A" || sCheckRow == "U" ) {
		checkmode = sCheckRow;
	}
	else {
		if (this.gfnTypeOf(sCheckRow) == "number") {
			checkmode = "Row";
		}
		else {
			alert("Validation Check대상의 Row는 'U' or 'A' or Dataset의 row만 됩니다.");
			return false;
		}
	}

	// 데이터셋의 RuleSet
	var validlist = new Array();
	if (!this.gfnIsNull(dataset.validationRuleSet) )
	{
		validlist = JSON.parse(dataset.validationRuleSet);
	}
	else {
		alert("Validation Check RuleSet이 없습니다.");
		return false;
	}

	var updatecount = 0;
	// 해당 Row만 정합성 체크
	if (checkmode == "Row") {
		++updatecount;
		
		// Rule 만큼 처리
		for(var j=0;j<validlist.length;j++)
		{
			var columid   = validlist[j].name;
			var columname = new String(validlist[j].title);
			var columvalue= dataset.getColumn(sCheckRow, columid);
			var checklist = (""+validlist[j].value).split(",");
			var nullcheck = validlist[j].notnull;

			// 필수입력 체크
			if (nullcheck == true)
			{	
				if (this.gfnIsNull(columvalue))
				{
					// row 이동 및 focus 저장
					dataset.set_rowposition(sCheckRow);
					this.validationObject = objVal;
					this.validationColumn = columid;

					var titile = "";
					if (columname.indexOf("^_^") != -1) {
						titile = columname.split("^_^")[0];
					}
					else {
						titile = columname;
					}

					// {0} 항목은 필수입력사항입니다.
					this.gfnAlert("msg.err.validator.required", [titile], null, "gfnValidationCallback");
					
					return false;
				}
			}

			// 필수값이 아닌 경우는 체크할 값이 null이 아닌 경우에만 체크
			if (!this.gfnIsNull(columvalue))
			{
				// Rule에 따른 정합성 체크
				for(var k=0;k<checklist.length;k++)
				{
					var msg = "";

					// 컬럼의 두개의 값을 이용해서 처리하는 check 대상
					var checkrule =  checklist[k].split(":")[0];
					if (checkrule == "fromto" || checkrule == "fromtosmall" || checkrule == "comparebig" || checkrule == "comparesmall" || checkrule == "compareequal")
					{
						var compare1;
						var compare2;

						if( checklist[k].split(":").length == 3 ) {
							compare1 = dataset.getColumn(sCheckRow, checklist[k].split(":")[1]);
							compare2 = dataset.getColumn(sCheckRow, checklist[k].split(":")[2]);
						}
						else {
							compare1 = dataset.getColumn(sCheckRow, columid);
							compare2 = dataset.getColumn(sCheckRow, checklist[k].split(":")[1]);
						}
						msg = this.gfnValidationCheckRule(columname, columvalue, checklist[k], compare1, compare2);
					}
					// 컬럼의 한개 값을 이용해서 처리하는 check 대상
					else {
						msg = this.gfnValidationCheckRule(columname, columvalue, checklist[k]);
					}

					// 에러시
					if (!this.gfnIsNull(msg))
					{
						// row 이동 및 focus 저장
						dataset.set_rowposition(sCheckRow);
						this.validationObject = objVal;
						this.validationColumn = columid;

						// 메시지 처리 : {}
						this.gfnAlert("msg.err.validator", [msg], null, "gfnValidationCallback");
						
						return false;
					}
				}  // Rule에 따른 정합성 체크
			}  // 필수값이 아닌 경우는 체크할 값이 null이 아닌 경우에만 체크
		}  // Rule 만큼 처리
	}
	// 데이터셋의 row 만큼 정합성 체크
	else {
		for (var i=0;i<dataset.getRowCount();i++)
		{
			var rowtype = dataset.getRowType(i);
			// checkmode에 따른 체크 대상 구분
			if (checkmode == "U") {
				// 변경 안된 Row는 정합성 체크 SKIP
				if (rowtype == 1) {
					continue;
				}
				// 삭제 Row는 정합성 체크 SKIP
				else if (rowtype == 8) {
					continue;
				}
				// Group Row는 정합성 체크 SKIP
				else if (rowtype == 16) {
					continue;
				}

				// 추가, 수정은 정합성 체크
				if (rowtype == 2 || rowtype == 4) {
					++updatecount;
				}
			}
			// 전체 row
			else {
				// Group Row는 정합성 체크 SKIP
				if (rowtype == 16) {
					continue;
				}
				++updatecount;
			}

			// Rule 만큼 처리
			for(var j=0;j<validlist.length;j++)
			{
				var columid   = validlist[j].name;
				var columname = new String(validlist[j].title);
				var columvalue= dataset.getColumn(i, columid);
				var checklist = (""+validlist[j].value).split(",");
				var nullcheck = validlist[j].notnull;

				// 필수입력 체크
				if (nullcheck == true)
				{
					if (this.gfnIsNull((""+columvalue).trim()))
					{
						// row 이동 및 focus 저장
						dataset.set_rowposition(i);
						this.validationObject = objVal;
						this.validationColumn = columid;

						var titile = "";
						if (columname.indexOf("^_^") != -1) {
							titile = columname.split("^_^")[0];
						}
						else {
							titile = columname;
						}
						// {0} 항목은 필수입력사항입니다.
						this.gfnAlert("msg.err.validator.required", [titile], null, "gfnValidationCallback");
						
						return false;
					}
				}

				// 필수값이 아닌 경우는 체크할 값이 null이 아닌 경우에만 체크
				if (!this.gfnIsNull(columvalue))
				{
					// Rule에 따른 정합성 체크
					for(var k=0;k<checklist.length;k++)
					{
						var msg = "";

						// 컬럼의 두개의 값을 이용해서 처리하는 check 대상
						var checkrule =  checklist[k].split(":")[0];
						if (checkrule == "fromto" || checkrule == "fromtosmall" || checkrule == "comparebig" || checkrule == "comparesmall" || checkrule == "compareequal")
						{
							var compare1;
							var compare2;

							if( checklist[k].split(":").length == 3 ) {
								compare1 = dataset.getColumn(i, checklist[k].split(":")[1]);
								compare2 = dataset.getColumn(i, checklist[k].split(":")[2]);
							}
							else {
								compare1 = dataset.getColumn(i, columid);
								compare2 = dataset.getColumn(i, checklist[k].split(":")[1]);
							}
							msg = this.gfnValidationCheckRule(columname, columvalue, checklist[k], compare1, compare2);
						}
						// 컬럼의 한개 값을 이용해서 처리하는 check 대상
						else {
							msg = this.gfnValidationCheckRule(columname, columvalue, checklist[k]);
						}

						// 에러시
						if (!this.gfnIsNull(msg))
						{
							// row 이동 및 focus 저장
							dataset.set_rowposition(i);
							this.validationObject = objVal;
							this.validationColumn = columid;

							// 메시지 처리 : {}
							this.gfnAlert("msg.err.validator", [msg], "", "gfnValidationCallback");
							return false;
						}
					}  // Rule에 따른 정합성 체크
				}  // 필수값이 아닌 경우는 체크할 값이 null이 아닌 경우에만 체크
			}  // Rule 만큼 처리
		}  // 데이터셋의 row 만큼 정합성 체크
	}	// checkmode에 따라 row or 전체 정합성 체크
	
	// Validation ERROR class 사용 시 cssclass 원복
	if (this.useErrorClass) {
		this.gfnResetValidationCss(objVal);
	}

	// 정합성 체크 건수 확인
	if (updatecount == 0) trace("정합성 체크 대상이 없어 Validation 체크를 하지 않았습니다.");

	return true;
};

/**
 * @class 데이터의 정합성을 체크하여 그 결과를 리턴한다. 메세지가 "" 널이면.. 정상 널이 아니면 실패이다.
 * @param {String} itemName - Column title
 * @param {Stirng} itemValue - Column 값
 * @param {String} validationRuleSet - validation Rule
 * @return {Stirng} 정상이면 "" 실패이면 "XXX는 7자리입니다." 와 같은 완성형 에러 메세지
 */
pForm.gfnValidationCheckRule = function(itemName, itemValue, validationRuleSet, compare1, compare2)
{
	var titile     = "";
	var columname1 = "";
	var columname2 = "";
	if (itemName.indexOf("^_^") != -1) {
		titile     = itemName.split("^_^")[0];
		columname1 = itemName.split("^_^")[0];
		columname2 = itemName.split("^_^")[1];
	}
	else {
		titile = itemName;
	}
				
	var arrItem2  =  validationRuleSet.split(":");
	var checkrule =  arrItem2[0];

	checkrule = checkrule.toLowerCase();
	switch(checkrule)
	{
		// size 크기 지정 : length:7
		case "length":
			if( (itemValue+"").length != parseInt(arrItem2[1])) {
				// {0} 의 입력값은 {1} 자리이어야 합니다.
				return this.gfnGetMessage("msg.err.validator.length",[titile, arrItem2[1]]);
			}
			break;
		// 해당 숫자 이하 : max:7
		case "max":
			if (parseFloat(itemValue) > parseFloat(arrItem2[1])) {
				// {0} 은(는) {1} 보다 작아야 합니다.
				return this.gfnGetMessage("msg.err.validator.sizemax",[titile, arrItem2[1]]);
			}
			break;
		// 해당 숫자 이상 : min:7
		case "min":
			if (parseFloat(itemValue) < parseFloat(arrItem2[1])) {
				// {0} 은(는) {1} 보다 커야 합니다.
				return this.gfnGetMessage("msg.err.validator.sizemin",[titile, arrItem2[1]]);
			}
			break;
		// 최대 size 크기: maxlength:7
		case "maxlength":
			if (itemValue.toString().length > parseInt(arrItem2[1])) {
				// {0} 항목의 최대 입력글자수를 초과하였습니다. 최대길이 : {1}
				return this.gfnGetMessage("msg.err.validator.maxlength",[titile, arrItem2[1]]);
			}
			break;
		// 최대 size 크기(Byte) : maxlengthB:3
		case "maxlengthbyte":
			if (this.lookupFunc("gfnLengthByte").call(itemValue) > parseInt(arrItem2[1])) {
				// {0} 항목의 최대 입력글자수를 초과하였습니다. 최대길이 : {1} byte
				return this.gfnGetMessage("msg.err.validator.maxlengthB",[titile, arrItem2[1]]);
			}
			break;
		// Decimal의 값의 길이 체크 : maxlengthdec:8:4
		case "maxlengthdec":
			var arrLength = itemValue.toString().split(".");
			// 정수 자리수
			if ((arrLength[0].replace("-","")).length > parseInt(arrItem2[1])) {
				// {0} 은(는) {1} 보다 작아야 합니다.
				return this.gfnGetMessage("msg.err.validator.max",[titile + " 정수 자리수", arrItem2[1]+"자리"]);
			}
			// 소수 자리수
			if (arrLength.length > 1) {
				if (arrLength[1].length > parseInt(arrItem2[2])) {
					// {0} 은(는) {1} 보다 작아야 합니다.
					return this.gfnGetMessage("msg.err.validator.max",[titile + " 소수 자리수", arrItem2[2]+"자리"]);
				}
			}
			break;
		// 최소 size 크기: minlength:7
		case "minlength":
			if (itemValue.length < parseInt(arrItem2[1])) {
				// {0} 항목은 최소 입력글자수 이상 입력해야 합니다. 최소길이 : {1} 
				return this.gfnGetMessage("msg.err.validator.minlength",[titile, arrItem2[1]]);
			}
			break;
		// 최소 size 크기(Byte) : minlengthB:3
		case "minlengthbyte":
			if (this.lookupFunc("gfnLengthByte").call(itemValue) < parseInt(arrItem2[1])) {
				// {0} 항목은 최소 입력글자수 이상 입력해야 합니다. 최소길이 : {1} byte
				return this.gfnGetMessage("msg.err.validator.minlengthB",[titile, arrItem2[1]]);
			}
			break;
		// 날짜 from ~ to 비교 : comparedate:target칼럼명
		case "fromto":
			if (compare1 < compare2) {
				if (itemName.indexOf("^_^") > -1) {
					// {0} 항목은 {1} 보다 이후 날짜 이여야 합니다.
					return this.gfnGetMessage("msg.err.validator.fromtomax",[columname1,columname2]);
				}
				// 비교대상 칼럼의 title을 넘겨주지 않았을 경우 해당 값을 표시
				else {
					// {0} 항목은 {1} 보다 이후 날짜 이여야 합니다.
					return this.gfnGetMessage("msg.err.validator.fromtomax",[titile,compare2]);
				}
			}
			break;
		// 날짜 to ~ from 비교 : comparedate:target칼럼명
		case "fromtosmall":
			if (compare1 > compare2) {
				if (itemName.indexOf("^_^") > -1) {
					// {0} 항목은 {1} 보다 이전 날짜 이여야 합니다.
					return this.gfnGetMessage("msg.err.validator.fromtomin",[columname1,columname2]);
				}
				// 비교대상 칼럼의 title을 넘겨주지 않았을 경우 해당 값을 표시
				else {
					// {0} 항목은 {1} 보다 이전 날짜 이여야 합니다.
					return this.gfnGetMessage("msg.err.validator.fromtomin",[titile,compare2]);
				}
			}
			break;
		// 사이의 값인지 비교 - range:40:100
		case "range":
			if (parseInt(itemValue) < parseInt(arrItem2[1]) || parseInt(itemValue) > parseInt(arrItem2[2])) {
				// {0} 항목은 {1} 과 {2} 사이의 값이어야 합니다.
				return this.gfnGetMessage("msg.err.validator.range",[titile,arrItem2[1],arrItem2[2]]);
			}
			break;
		// 이메일 체크 - isemail
		case "isemail":
			if (!this.lookupFunc("gfnIsEmail").call(itemValue)) {
				// {0} 항목은 유효하지 않은 이메일 주소입니다.
				return this.gfnGetMessage("msg.err.validator.email",[titile]);
			}
			break;
		// 주민등록번호 체크 - isssn
		case "isssn":
			if (!this.lookupFunc("gfnIsSSN").call(itemValue)) {
				// {0} 항목은 유효하지 않은 주민등록번호입니다.
				return this.gfnGetMessage("msg.err.validator.ssn",[titile]);				
			}
			break;
		// 사업자등록번호 체크 - isbzid
		case "isbzid":
			if (!this.lookupFunc("gfnIsBzIdNo").call(itemValue)) {
				// {0} 항목은 유효하지 않은 사업자등록번호입니다.
				return this.gfnGetMessage("msg.err.validator.biznum",[titile]);
			}
			break;
		// 법인등록번호 체크 - isfirmid
		case "isfirmid":
			if (!this.lookupFunc("gfnIsFirmIdNo").call(itemValue)) {
				// {0} 항목은 유효하지 않은 법인등록번호입니다.
				return this.gfnGetMessage("msg.err.validator.bubin",[titile]);
			}
			break;			
		// 날짜 년월일 체크 : date
		case "date":
			if (!this.lookupFunc("gfnIsYMD").call(itemValue)) {
				// {0} 항목은 날짜 유형이 아닙니다.
				return this.gfnGetMessage("msg.err.validator.date",[titile]);
			}
			break;
		// 날짜 년월 체크 : dateym
		case "dateym":
			if (!this.lookupFunc("gfnIsYM").call(itemValue)) {
				// {0} 항목은 날짜 유형이 아닙니다.
				return this.gfnGetMessage("msg.err.validator.date",[titile]);
			}
			break;
		// 한글 여부 : korean
		case "korean":
			if (!this.lookupFunc("gfnIsKoreanChar").call(itemValue)) {
				// {0} 항목은 한글만 입력하셔야 합니다.
				return this.gfnGetMessage("msg.err.validator.hangle",[titile]);
			}
			break;
		// 숫자 여부 : digits
		case "digits":		
			if (!this.lookupFunc("gfnIsDigit").call(itemValue)) {
				// {0} 항목은 숫자만 입력하셔야 합니다.
				return this.gfnGetMessage("msg.err.validator.digits",[titile]);
			}
			break;
		// 영문+숫자 포함 여부 : engnum
		case "engnum":
			if (!this.lookupFunc("gfnIsEngNum").call(itemValue)) {
				// {0} 항목은 영문+숫자 조합으로 입력하셔야 합니다.
				return this.gfnGetMessage("msg.err.validator.engnum",[titile]);
			}
			break;
		// 특수문자 포함 여부 : special
		case "special":		
			if (this.lookupFunc("gfnIsSpecialChar").call(itemValue)) {
				// {0} 항목은 특수문자를 입력 할 수 없습니다.
				return this.gfnGetMessage("msg.err.validator.notspecialchar",[titile]);
			}
			break;
		// 타 칼럼값보다 큰값인지 비교 - comparebig:target칼럼명
		case "comparebig":
			if (parseFloat(compare1) > parseFloat(compare2)) {
				if (itemName.indexOf("^_^") != -1 ) {
					// {0} 은(는) {1} 보다 작아야 합니다.
					return this.gfnGetMessage("msg.err.validator.sizemax",[columname1,columname2]);
				}
				// 비교대상 칼럼의 title을 넘겨주지 않았을 경우 해당 값을 표시
				else {
					// {0} 은(는) {1} 보다 작아야 합니다.
					return this.gfnGetMessage("msg.err.validator.sizemax",[titile,compare2]);
				}
			}
			break;
		// 타 칼럼값과 작은값인지 비교 - comparesmall:comparetarget
		case "comparesmall":
			if (parseFloat(compare1) < parseFloat(compare2)) {
				if (itemName.indexOf("^_^") != -1 ) {
					// {0} 은(는) {1} 보다 커야 합니다.
					return this.gfnGetMessage("msg.err.validator.sizemin",[columname1,columname2]);
				}
				// 비교대상 칼럼의 title을 넘겨주지 않았을 경우 해당 값을 표시
				else {
					// {0} 은(는) {1} 보다 커야 합니다.
					return this.gfnGetMessage("msg.err.validator.sizemin",[titile,compare2]);
				}
			}
			break;
		// 타 칼럼값과 같은 값인지 비교 - compareequal:target칼럼명
		case "compareequal":
			if (compare1 == compare2) {
				if (itemName.indexOf("^_^") != -1 ) {
					// {0} 은(는) {1} 와(과) 값을 다르게 입력해야 합니다.
					return this.gfnGetMessage("msg.err.validator.notequalto",[columname1,columname2]);
				}
				// 비교대상 칼럼의 title을 넘겨주지 않았을 경우 해당 값을 표시
				else {
					// {0} 은(는) {1} 와(과) 값을 다르게 입력해야 합니다.
					return this.gfnGetMessage("msg.err.validator.notequalto",[titile,compare2]);
				}
			}
			break;
		// 전화번호 체크 - istel
		case "istel":
			if (!this.lookupFunc("gfnIsTelNum").call(itemValue)) {
				// {0} 항목은(는) 유효하지 않은 전화번호입니다.
				return this.gfnGetMessage("msg.err.validator.tel",[titile]);				
			}
			break;
		// 핸드폰 체크 - ismobile
		case "ismobile":
			if (!this.lookupFunc("gfnIsMobileNum").call(itemValue)) {
				// {0} 항목은(는) 유효하지 않은 핸드폰번호입니다.
				return this.gfnGetMessage("msg.err.validator.phone",[titile]);				
			}
			break;
		// 전화번호+핸드폰 체크 - isphone
		case "isphone":
			if (!this.lookupFunc("gfnIsPhoneNum").call(itemValue)) {
				// {0} 항목은(는) 유효하지 않은 전화번호입니다.
				return this.gfnGetMessage("msg.err.validator.phone",[titile]);				
			}
			break;
			
		default:
			return "";
			break;
	}
	return "";
};

/**
 * @class Validation 에러시 메세지 후 callBack함수
 * @param {String} sid - 팝업ID
 * @param {String} rtn - 전달값
 * @return N/A
 */
pForm.gfnValidationCallback = function(sid, rtn)
{
	// Validation 오류시 focus 처리
	this.gfnSetValidationFocus(this.validationObject, this.validationColumn);
};

/**
 * @class 정합성 체크 오류시 해당 콤포넌트의 ERROR 스타일 처리 및 포커스 처리
 * @param  {Object} obj - Grid 및 Dataset
 * @param  {String} bindcolumid - 입력오류항목 컬럼명
 * @return N/A
 */
pForm.gfnSetValidationFocus = function(obj, bindcolumid)
{
	var binddataset;

	if (obj instanceof Grid) {
		binddataset = obj.getBindDataset();
	}
	else {
		binddataset = obj;
	}

	// 그리드
	if (obj instanceof Grid) {
		obj.setCellPos(obj.getBindCellIndex("Body", bindcolumid));
		obj.showEditor(true);
		//obj.setFocus();
		return;
	}
	// 데이터셋
	else {
		if (!this.gfnIsNull(obj.bindgrid)) {
			var gridobj = obj.bindgrid;
			gridobj.setCellPos(gridobj.getBindCellIndex("Body", bindcolumid));
			gridobj.showEditor(true);
			gridobj.setFocus();
		}
	}
	
	// 바인딩된 Components
	var targetFirstObj;
	var nCheckCnt = 0;
	for (var j=0;j<this.binds.length;j++)
	{
		if (eval("this."+this.binds[j].datasetid) == binddataset && this.binds[j].columnid == bindcolumid)
		{
			var targetobj = eval("this."+this.binds[j].compid);

			// Validation ERROR class 사용 시(PROJECT의 CSS에 맞게 수정 필요)
			if (this.useErrorClass)
			{
				var objtype = targetobj.valueOf();
				if (objtype == "[object Edit]") {
					targetobj.orgcssclass = targetobj.cssclass;
					targetobj.set_cssclass("error");
				}
				else if (objtype == "[object MaskEdit]") {
					targetobj.orgcssclass = targetobj.cssclass;
					targetobj.set_cssclass("error");
				}
				else if (objtype == "[object Combo]") {
					targetobj.orgcssclass = targetobj.cssclass;
					targetobj.set_cssclass("error");
				}
				else if (objtype == "[object Calendar]") {
					targetobj.orgcssclass = targetobj.cssclass;
					targetobj.set_cssclass("error");
				}
				else if (objtype == "[object TextArea]") {
					targetobj.orgcssclass = targetobj.cssclass;
					targetobj.set_cssclass("error");
				}
				else if (objtype == "[object Spin]") {
					targetobj.orgcssclass = targetobj.cssclass;
					targetobj.set_cssclass("error");
				}
			}
			if (nCheckCnt == 0) {
				targetFirstObj = targetobj;
			}
			nCheckCnt++;
		}
	}

	if (nCheckCnt > 0) {
		targetFirstObj.setFocus();
		return;
	}
			
	
};

/**
 * @class 정합성 체크 오류시 변경된 ERROR 스타일 원복 처리
 * @param  {Object} objVal - Dataset/Grid
 * @return N/A
 */
pForm.gfnResetValidationCss = function(objVal)
{
	var dataset;

	// 데이터셋
	if (objVal instanceof Dataset)
	{
		dataset = objVal;
	}
	// 그리드
	else if (objVal instanceof Grid)
	{
		dataset = objVal.getBindDataset();
	}

	// 해당 데이터셋을 바인딩하는 Component에 대해 cssclassr값을 원래 값으로 복원
	for(var j=0;j<this.binds.length;j++)
	{
		var sBindDs = this.binds[j].datasetid;
		if(this.gfnIsNull(sBindDs)==true) continue;

		if (eval("this."+this.binds[j].datasetid) == dataset) {
			try
			{
				var targetobj  = eval("this."+this.binds[j].compid);
				if( targetobj.cssclass.indexOf("error") != -1 )
				{
					targetobj.set_cssclass(targetobj.orgcssclass);
					targetobj.orgcssclass = "";
				}
			}
			catch(e)
			{
			}
		}
	}
};

/**
 * @class dataSet의 해당 Row의 값과 같은 row가 있는 지 검사
 * @param {Object} objDs - 대상 Dataset
 * @param {String} sColumn - 검사할 칼럼 목록 "Column0,Column1,Column2"
 * @param {Number} nRow - 기준 Row
 * @return {Number} 중복된 첫번째 Row
 */   
pForm.gfnChkDuplicateData = function (objDs, sColumn, nRow)
{
	if (this.gfnIsNull(nRow)) nRow = objDs.rowposition;
	
	var sFindExpr = "";
	var arrColumn = sColumn.split(",");
 	for (var i=0; i<arrColumn.length; i++) {
 		sFindExpr += arrColumn[i].trim() + " == '" + objDs.getColumn(nRow, arrColumn[i].trim()) + "'";
 		if (i != arrColumn.length-1) {
 			sFindExpr += " && ";
 		}
 	}
	var rtnRow = objDs.findRowExpr(sFindExpr);
	// 첫 row부터 검색
	if (rtnRow > -1) {
		// 선택한 row가 현재 row면 다시 검색
		if (rtnRow == nRow) {
			rtnRow = objDs.findRowExpr(sFindExpr, nRow+1);
		}
	}	
	
	return rtnRow;
};

pForm = null;