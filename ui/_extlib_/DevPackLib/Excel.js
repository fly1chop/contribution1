/**
*  devPack Library
*  @FileName 	Excel.js 
*  @Creator 	TOBESOFT
*  @CreateDate 	2020.11.24
*  @Desction   
************** 소스 수정 이력 ***********************************************
*  date          		Modifier                Description
*******************************************************************************
* 2020.11.24			TOBESOFT				Excel Library
*******************************************************************************
*/

var pForm = nexacro.Form.prototype;

/**
 * @class excel export <br>
 * @param {Object|Array} objGrid - Grid Object	
 * @param {String|Array} [sSheetName] - sheet name
 * @param {String} [sFileName] - file name
 * @param {String} [sExportType] - export 프로그램 Type
 * @param {String} [strRemoveCol] - Grid에서 export 시 제거할 Column 예) "1,2"
 * @param {String} [strTitle] - Grid에 추가할 타이틀
 * @param {Boolean} [bWordwrap] - 엑셀 export시 wordwrap 여부(default-true)
 * @param {String} [strUnit] - Grid에 상단 좌측에 단위 표시
 * @return N/A
 * @example
 * this.gfnExcelExport(this.grdMessage, "메시지", "Message", this.cboExportType.value, "0,1,2", this.edtTitle.value);
 * this.gfnExcelExport([this.grdSuppress, this.grdMessage00], ["sheet!A1", "sheet!A"+nCnt], "1개sheet Export", null, ["0,1", "0,1,2,3"], ["메시지 목록", "과일별 색상 목록"]);
 * this.gfnExcelExport([this.grdMessage00, this.grdSuppress], ["메시지","suppress"], "2개sheet Export"); 
 */
pForm.gfnExcelExport = function(objGrid, sSheetName, sFileName, sExportType, strRemoveCol, strTitle, bWordwrap, strUnit)
{
	if (this.gfnIsNull(bWordwrap)) bWordwrap = true;
	
	// 파일명, 시트명에 엑셀에서 지원하지 않는 문자 목록
	var regExp = /[?*:\/\[\]]/g;
	
	// 여러개 Grid 일 경우
	if (objGrid instanceof Array) {
		if (objGrid.length != sSheetName.length) {
			alert("Grid와 Sheet명의 갯수가 다릅니다.");
			return;
		}

		// 삭제할 칼럼
		if (this.gfnIsNull(strRemoveCol)) {
			strRemoveCol = new Array(objGrid.length);
		}
		else {
			if (this.gfnIsString(strRemoveCol) || objGrid.length != strRemoveCol.length) {
				alert("Grid와 삭제할 칼럼의 갯수가 다릅니다. 배열로 지정해 주세요.");
				return;
			}
		}

		// Title
		if (this.gfnIsNull(strTitle)) {
			strTitle = new Array(objGrid.length);
		}
		else {
			if (this.gfnIsString(strTitle) || objGrid.length != strTitle.length) {
				alert("Grid와 Title의 갯수가 다릅니다. 배열로 지정해 주세요.");
				return;
			}
		}
		
		// 단위
		if (this.gfnIsNull(strUnit)) {
			strUnit = new Array(objGrid.length);
		}
		else {
			if (this.gfnIsString(strUnit) || objGrid.length != strUnit.length) {
				alert("Grid와 단위의 갯수가 다릅니다. 배열로 지정해 주세요.");
				return;
			}
		}
		
		var arrSheetName = new Array();
		for (var i=0; i<sSheetName.length; i++) {			
			// 시트명에 특수문자 제거
			sSheetName[i] = sSheetName[i].replace(regExp,"");
			
			// 시트명이 30 이상일 경우 기본 시트명
			if (String(sSheetName[i]).length > 30) {
				sSheetName[i] =  "sheet" + i;
			}
		
			// 시트명에 셀영역이 없을 경우 자동으로 !A1 추가
			if (sSheetName[i].indexOf("!") == -1) {
				arrSheetName[i] = sSheetName[i]+"!A1";
			}
			else {
				arrSheetName[i] = sSheetName[i];
			}			
		}	
	}
	// 1개 Grid 일 경우
	else {
		// Grid 여부 체크
		if (!(objGrid instanceof Grid)) {
			alert("Export 대상 Grid를 지정하세요.");
			return;
		}
		
		// 시트명에 특수문자 제거
		sSheetName = sSheetName.replace(regExp,"");		
		sSheetName = this.gfnIsNull(sSheetName) ? "sheet1" : sSheetName;
		
		// 시트명이 30 이상일 경우 기본 시트명
		if (String(sSheetName).length > 30) {
			sSheetName =  "sheet1";
		}
		
		// 시트명에 셀영역이 없을 경우 자동으로 !A1 추가
		if (sSheetName.indexOf("!") == -1) {
			sSheetName = sSheetName+"!A1";
		}	
	}
	
	// fileName check	
	sFileName  = sFileName.replace(regExp,"");	// 파일명에 특수문자 제거
	sFileName = this.gfnIsNull(sFileName) ? this.titletext + "_" + this.gfnGetDate() : sFileName;
	
	// 	// QuikView 일때 처리
	// 	if (nexacro.getEnvironmentVariable("evQuikView") == "Y") {
	// 		sFileName = this.gfnIsNull(sFileName) ? this.titletext + "_" + this.gfnGetDate() : sFileName;
	// 	}
	// 	else {
	// 		sFileName = this.gfnIsNull(sFileName) ? this.gfnGetArgument("menuNm") + "_" + this.gfnGetDate() : sFileName;
	// 	}
	
	var objExport = new nexacro.ExcelExportObject();
	objExport.set_exportfilename(sFileName);

	// Export Type 지정
	if (this.gfnIsNull(sExportType)) sExportType = "EXCEL97";
	var ExportType;
	switch(sExportType) {
		case "EXCEL":
			ExportType = nexacro.ExportTypes.EXCEL;
			break;
		case "EXCEL97":
			ExportType = nexacro.ExportTypes.EXCEL97;
			break;
		case "EXCEL2007":
			ExportType = nexacro.ExportTypes.EXCEL2007;
			break;
		case "HANCELL2010":
			ExportType = nexacro.ExportTypes.HANCELL2010;
			break;
		case "HANCELL2014":
			ExportType = nexacro.ExportTypes.HANCELL2014;
			break;
		case "CSV":
			ExportType = nexacro.ExportTypes.CSV;
			break;
	}	
 	objExport.set_exporttype(ExportType);
 	
  	objExport.set_exporteventtype("itemrecord");
  	objExport.set_exportuitype("none");
 	objExport.set_exportwordwrap(bWordwrap);
  	objExport.set_exportmessageprocess("");

  // Excel Export 시 데이터 사용량을 최소로 줄이고 패킷량도 최소로 할 수 있는 옵션
  //objExport.set_exporttype(nexacro.ExportTypes.CSV);
  //objExport.set_commdataformat("ssv"); // binary
  //objExport.set_transferrowcount( 1000 ); // 500~2000
  //objExport.addExportItem(nexacro.ExportItemTypes.GRID, objGrid_excel, sSheetName + "!A1", "allband", "allrecord", "nosuppress", "allstyle", "none", "align,background,color,font,border");

  // Excel Export시 progressbar 보이도록
  //objExport.set_exportuitype("exportprogress"); 가이드
 	
	objExport.addEventHandler("onsuccess", this.gfnExportOnsuccess, this);	
	objExport.addEventHandler("onerror",   this.gfnExportOnerror,   this);	

	// 생성한 Grid 삭제 처리용
	this.uCopyGrid = [];
	this.uGridName = ""+objGrid.name;
	
	// 여러개 Grid 일 경우
	if (objGrid instanceof Array) {
		var objGridCopy = [];
		for (var i=0; i<objGrid.length; i++) {
			// 삭제할 칼럼이 있을때, 타이틀을 추가할때는 export용 Grid 생성
			if (this.gfnIsNull(strRemoveCol[i]) == false || this.gfnIsNull(strTitle[i]) == false || this.gfnIsNull(strUnit[i]) == false) {	// this._gfnCheckRequiredStyle(objGrid[i]) || 
				// export용 Grid 생성
				objGridCopy[i] = this._gfnExportGrid(objGrid[i], strRemoveCol[i], strTitle[i], strUnit[i]);				
				this.uCopyGrid.push(objGridCopy[i]);
			}
			// Grid 그대로 export
			else {
				objGridCopy[i] = objGrid[i];
			}
			objExport.addExportItem(nexacro.ExportItemTypes.GRID, objGridCopy[i], arrSheetName[i],"allband","allrecord");
		}
	}
	// 1개 Grid 일 경우
	else {		
		// 삭제할 칼럼이 있을때, 타이틀을 추가할때는 export용 Grid 생성
		if (this.gfnIsNull(strRemoveCol) == false || this.gfnIsNull(strTitle) == false || this.gfnIsNull(strUnit) == false) {	// this._gfnCheckRequiredStyle(objGrid) || 
			// export용 Grid 생성
			var objGridCopy = this._gfnExportGrid(objGrid, strRemoveCol, strTitle, strUnit);
			this.uCopyGrid.push(objGridCopy);
			
			objExport.addExportItem(nexacro.ExportItemTypes.GRID, objGridCopy, sSheetName,"allband","allrecord");
		}
		// Grid 그대로 export
		else {
			objExport.addExportItem(nexacro.ExportItemTypes.GRID, objGrid, sSheetName,"allband","allrecord");
		}
	}
	
	// Xeni 서버 경로 설정
	var svcUrl = "svcUrl::XExportImport.do";
	objExport.set_exporturl(svcUrl);

	this.setWaitCursor(true);
	objExport.exportData();
};


/**
 * @class Grid에 필수항목 표시 Header 삭제된 Grid 리턴 <br>
 * @param {Grid} Grid
 * @param {String} [strRemoveCol] - Grid에서 export 시 제거할 Column 예) "1,2"
 * @param {String} [strTitle] - Grid에 추가할 타이틀
 * @param {String} [strUnit] - Grid에 상단 좌측에 단위 표시
 * @return {Grid} Grid
 */
pForm._gfnExportGrid = function(objGrid, strRemoveCol, strTitle, strUnit)
{
	// Export용 Grid 생성
	var sGridName = objGrid.name + "_Excel";
	if (!this[sGridName]) {
		var objGridCopy = new Grid(sGridName, 0, 0, 0, 0, null, null);
		this.addChild(sGridName, objGridCopy);
		objGridCopy.show();
	}
	else {
		var objGridCopy = this[sGridName];
	}
	
	objGridCopy.set_formats(objGrid.getCurFormatString(false));
	objGridCopy.set_formatid(objGrid.formatid);    
	objGridCopy.set_binddataset(objGrid.binddataset);    
	objGridCopy.set_summarytype(objGrid.summarytype);
	objGridCopy.set_autofittype(objGrid.autofittype);
	objGridCopy.set_visible(false);

	var nCellCnt = objGridCopy.getCellCount("head");

	// Grid에 Column 칼럼 삭제
	if (this.gfnIsNull(strRemoveCol) == false) {
		arrColumn = strRemoveCol.split(",");
		for (var j=arrColumn.length-1; j>=0; j--) {
			objGridCopy.deleteContentsCol("body", nexacro.trim(arrColumn[j]));
		}
		nCellCnt = objGridCopy.getCellCount("head");
	}	
	
	// Grid에 제목 추가
	if (this.gfnIsNull(strTitle) == false) {
	
		var nColCnt = objGridCopy.getFormatColCount();
		
		// band를 body로 변경
		for (var i=0; i<=nColCnt; i++) {
			objGridCopy.setFormatColProperty(i, "band", "body");
		}
		
		// Title
		var nRow = objGridCopy.insertContentsRow("head", 0);	
		var nCell = objGridCopy.mergeContentsCell("head", 0, 0, 0, nColCnt-1, 0, false);
		objGridCopy.setCellProperty("head", nCell, "text", strTitle);

		// Title 밑 1줄 추가   
		var nRow2 = objGridCopy.insertContentsRow("head", 1);
		var nCell2 = objGridCopy.mergeContentsCell("head", 1, 0, 1, nColCnt-1, 1, false);
		
		// Grid에 단위 추가
		if(this.gfnIsNull(strUnit) == false){
			objGridCopy.setCellProperty("head", nCell2, "text", strUnit);
			objGridCopy.setCellProperty("head", nCell2, "color", "#000000");
			objGridCopy.setCellProperty("head", nCell2, "font", "normal 12px/normal Dotum");
			objGridCopy.setCellProperty("head", nCell2, "textAlign", "left");
		}
		
		objGridCopy.setCellProperty("head", nCell2, "background", "#ffffff");
		
	}else{
		// Grid에 단위 추가
		if(this.gfnIsNull(strUnit) == false){
			var nColCnt = objGridCopy.getFormatColCount();
		
			// band를 body로 변경
			for (var i=0; i<=nColCnt; i++) {
				objGridCopy.setFormatColProperty(i, "band", "body");
			}
			
			// 단위
			var nRow = objGridCopy.insertContentsRow("head", 0);	
			var nCell = objGridCopy.mergeContentsCell("head", 0, 0, 0, nColCnt-1, 0, false);
			
			objGridCopy.setCellProperty("head", nCell, "text", strUnit);
			objGridCopy.setCellProperty("head", nCell, "color", "#000000");
			objGridCopy.setCellProperty("head", nCell, "font", "normal 12px/normal Dotum");
			objGridCopy.setCellProperty("head", nCell, "textAlign", "left");
			objGridCopy.setCellProperty("head", nCell, "background", "#ffffff");
		}
	}
	
	return objGridCopy;
};


/**
 * @class excel export on sucess <br>
 * @param {Object} obj	
 * @param {Event} e		
 * @return N/A
 * @example
 */
pForm.gfnExportOnsuccess = function(obj, e)
{
	this.setWaitCursor(false);

	// 복사한 Grid 삭제
	var arrGrid = this.uCopyGrid;
	for (var i=0; i < arrGrid.length; i++) {
		var obj = this.removeChild(arrGrid[i].name); 
		obj.destroy();
		obj = null;
	}
	this.uCopyGrid = null;

	// 화면의 callback 함수 호출
	var sCallBack = "fnExcellExportCallback";
	if (this.name == "commonExcel") {	
		if (this.parent.parent[sCallBack]) {
			this.parent.parent.lookupFunc(sCallBack).call(this.uGridName, e);
		}
	}
	else {
		if (this[sCallBack]) {
			this.lookupFunc(sCallBack).call(this.uGridName, e);
		}
	}
	this.uGridName = null;
};

/**
 * @class  excel export on error <br>
 * @param {Object} obj	
 * @param {Event} e		
 * @return N/A
 * @example
 */
pForm.gfnExportOnerror = function(obj,  e)
{
	this.setWaitCursor(false);
	
	// 복사한 Grid 삭제
	var arrGrid = this.uCopyGrid;
	for (var i=0; i < arrGrid.length; i++) {
		var obj = this.removeChild(arrGrid[i].name); 
		obj.destroy();
		obj = null;
	}
	this.uCopyGrid = null;	

	//this.alert("Excel Export Error : " + e.errormsg);
	// 메시지 처리
	this.gfnAlert("msg.err.validator", [e.errormsg]);
};



/**
 * @class excel import 할 엑셀에 칼럼명이 없을 경우 데이타셋의 칼럼 순번 기준으로 import <br>
 * @param {String|Array} sDataset - dataset	
 * @param {String|Array} [sSheet] - sheet name
 * @param {String|Array} [sBody] - body 영역지정	
 * @param {String} [sCallback] - callback 함수	
 * @param {String} [sImportId] - import id(callback호출시 필수)
 * @param {String} [sImportType] - import 프로그램 Type(defalut-EXCEL97)
 * @param {String|Array} [sHead] - head 영역지정(다중 sheet 없로드 시에는 필요)	
 * @return N/A
 * @example
 * this.gfnExcelImport("dsMsg","메시지","A2","fnImportCallback","ExcelImport");	// dsMsg 칼럼 순번대로 엑셀의 A2 영역부터 import
 * this.gfnExcelImport(["dsTitle","dsMsg"], ["sheet","sheet"], ["A2:D2","A13"], "fnImportCallback", "ExcelImportAll");
 */
pForm.gfnExcelImport = function(sDataset, sSheet, sBody, sCallback, sImportId, sImportType, sHead, objGrid)
{
	if (this.gfnIsNull(sSheet)) sSheet = "sheet1";
	if (this.gfnIsNull(sBody))  sBody  = "A2";

	// 여러개 Grid 일 경우
	if (sDataset instanceof Array) {
		if (sDataset.length != sSheet.length) {
			alert("Dataset과 Sheet명의 갯수가 다릅니다.");
			return;
		}
		
		if (sDataset.length != sBody.length) {
			alert("Dataset과 Import Body 영역의 갯수가 다릅니다.");
			return;
		}
	}

	var objImport;
	if (this.gfnIsNull(this.objects[sImportId + "_ExcelImport"])) {	
		objImport = new nexacro.ExcelImportObject(sImportId + "_ExcelImport", this);
		this.addChild(sImportId + "_ExcelImport", objImport);
	}
	else {
		objImport = this.objects[sImportId + "_ExcelImport"];
	}
	objImport.outds = sDataset;
	objImport.uGrid = objGrid;
	// Import Type 지정
	if (this.gfnIsNull(sImportType)) sImportType = "EXCEL97";
	var ImportType;
	switch(sImportType) {
		case "EXCEL":
			ImportType = nexacro.ImportTypes.EXCEL;
			break;
		case "EXCEL97":
			ImportType = nexacro.ImportTypes.EXCEL97;
			break;
		case "EXCEL2007":
			ImportType = nexacro.ImportTypes.EXCEL2007;
			break;
		case "HANCELL2010":
			ImportType = nexacro.ImportTypes.EXCEL2007;
			break;
		case "HANCELL2014":
			ImportType = nexacro.ImportTypes.HANCELL2014;
			break;
		case "CSV":
			ImportType = nexacro.ImportTypes.CSV;
			break;
	}
	objImport.set_importtype(ImportType);
	objImport.set_filefilter("Excel Files(*.xlsx)|*.xls;*.xlsx");
	
	if (!this.gfnIsNull(sCallback)) {
		objImport.callback = sCallback;
		objImport.importid = sImportId;
	}
	
	objImport.addEventHandler("onsuccess", this.gfnImportOnsuccess, this);
	objImport.addEventHandler("onerror",   this.gfnImportOnerror,   this);	

	// 여러개 Dataset 일 경우
	if (sDataset instanceof Array) {
		// 여러개의 Dataset으로 import 예제
 		//var sParam  = "[command=getsheetdata;output=outDs0;body=sheet!A2:D2][command=getsheetdata;output=outDs1;body=sheet!A13]";
 		//var sParam2 = "[dsTitle_outds=outDs0, dsMsg_outds=outDs1]";		
 		var sParam  = "";
 		var sParam2 = "[";
 		for (var i=0; i<sDataset.length; i++) {
			//out dataset 생성(차후 onsucess 함수에서 헤더 생성하기 위한)
			var sOutDsName  = sDataset[i]+"_outds";
			if (this.isValidObject(sOutDsName)) {
				var obj = this.removeChild(sOutDsName);
				obj.destroy();
				obj = null;
			}
			var objOutDs = new Dataset();
			objOutDs.name = sOutDsName;
			this.addChild(objOutDs.name, objOutDs);

			if (this.gfnIsNull(sHead)) {
				sParam  += "[command=getsheetdata;output=outDs"+ i + ";body=" + sSheet[i] + "!" + sBody[i] +"]";
			}
			else {
				sParam  += "[command=getsheetdata;output=outDs"+ i + ";head=" + sSheet[i] + "!" + sHead[i] +";body=" + sSheet[i] + "!" + sBody[i] +"]";
			}
			if (i == 0) {
				sParam2 += (sOutDsName + "=outDs" + i);
			}
			else {
				sParam2 += (", " + sOutDsName + "=outDs" + i);
			}
 		}
 		sParam2 += "]";		
	}
	else {
		//out dataset 생성(차후 onsucess 함수에서 헤더 생성하기 위한)
		var sOutDsName  = sDataset+"_outds";
		if (this.isValidObject(sOutDsName)) {
			var obj = this.removeChild(sOutDsName);
			obj.destroy();
			obj = null;
		}
		var objOutDs = new Dataset();
		objOutDs.name = sOutDsName;
		this.addChild(objOutDs.name, objOutDs);

		if (this.gfnIsNull(sHead)) {
			var sParam  = "[command=getsheetdata;output=outDs;body=" + sSheet + "!" + sBody +"]";
		}
		else {
			var sParam  = "[command=getsheetdata;output=outDs;head=" + sSheet + "!" + sHead +";body=" + sSheet + "!" + sBody +"]";
		}
		var sParam2 = "[" + sOutDsName + "=outDs]";
	}
	// Xeni 서버 경로 설정
	var svcUrl = "svcUrl::XExportImport.do";
	objImport.set_importurl(svcUrl);
	
	this.setWaitCursor(true); 	
	objImport.importData("", sParam, sParam2);
	trace("sParam : " + sParam + " sParam2 : " + sParam2);
	// 파일 선택창에서 창닫기시 WaitCursor 안사라짐 방지
	this.setWaitCursor(false);
};

/**
 * @class excel import on success <br>
 * @param {Object} obj	
 * @param {Event} e		
 * @return N/A
 * @example
 */
pForm.gfnImportOnsuccess = function(obj, e)
{			
	this.setWaitCursor(false);
	
	var sCallback = obj.callback;
	var sImportId = obj.importid;
	var objOut    = obj.outds;
	var oGrid 	  = obj.uGrid;
	
	var objOrgDs = null;
	var objOutDs = null;
	var sColumnId = "";
	
	// 여러개 Dataset 일 경우
	if (objOut instanceof Array) {
 		for (var k=0; k<objOut.length; k++) {
			objOrgDs = this.objects[objOut[k]];
			objOutDs = this.objects[objOut[k]+"_outds"];
			
			objOrgDs.set_enableevent(false);
			// out 데이타셋의 칼럼명 org 데이터셋의 칼럼명으로 변경
			sColumnId ="";
			for (var i=0; i<objOrgDs.getColCount(); i++) {
				sColumnId = "Column"+i;
				if (sColumnId != objOrgDs.getColID(i)) {
					objOutDs.updateColID(sColumnId, objOrgDs.getColID(i))
				}
			}	
			//objOrgDs.clearData();	
			//objOrgDs.appendData(objOutDs,true,false);
			for( var n=0; n<objOutDs.getRowCount();n++){
				var nRow = objOrgDs.addRow();
				objOrgDs.copyRow(nRow, objOutDs, n);
			}
			objOrgDs.set_enableevent(true);
 		}	
	}
	else {
		objOrgDs = this.objects[objOut];
		objOutDs = this.objects[objOut+"_outds"];
		
		objOrgDs.set_enableevent(false);

		// out 데이타셋의 칼럼명 org 데이터셋의 칼럼명으로 변경
		sColumnId	  = "";
		var sChangeId = "";
		var colIdx    = -1;
		var rtn       = "";
		var nRow	  = -1;
		//20210705 무조건 데이터셋 기준으로 변경
		//그리드 기준으로 할 경우 아래 주석 제거
// 		if(oGrid.getCellPropertyValue(0,0,"displaytype") != "treeitemcontrol") {
// 			for (var i=0; i<objOutDs.getColCount(); i++) {
// 				sColumnId = objOutDs.getColumnInfo(i).name;
// 				//그리드 순서대로 
// 				colIdx = oGrid.getFormatColCount();
// 				for( var j=i; j<colIdx; j++){
// 					sChangeId = oGrid.getCellProperty("body", j, "text");
// 					if(sChangeId.indexOf("bind:") < 0 ) continue; //바인딩이 안되어 잇을 경우 건너띄기
// 					
// 					sChangeId = sChangeId.replace("bind:","");
// 					break;
// 				}
// 				if (sColumnId != sChangeId) {
// 					var rtn = objOutDs.updateColID(sColumnId, sChangeId)
// 				}
// 			}	
// 			//objOrgDs.clearData();	
// 			for( var n=0; n<objOutDs.getRowCount();n++){
// 				nRow = objOrgDs.addRow();
// 				objOrgDs.copyRow(nRow, objOutDs, n);
// 			}
// 		} else {
// 			objOrgDs.clearData();
// 			for (var i=0; i<objOutDs.getRowCount(); i++) {
// 				var nRow = objOrgDs.addRow();
// 				objOrgDs.copyRow(nRow, objOutDs, nRow);
// 			}
// 			
// 		}
		objOrgDs.clearData();
		for (var i=0; i<objOutDs.getRowCount(); i++) {
			var nRow = objOrgDs.addRow();
			objOrgDs.copyRow(nRow, objOutDs, nRow);
		}
		//objOrgDs.appendData(objOutDs,true,false);
		//objOrgDs.copyData(objOutDs);
		
		objOrgDs.set_enableevent(true);
	}
	
	// 화면의 callback 함수 호출
	if (!this.gfnIsNull(sCallback)) {
		if (this[sCallback]) this.lookupFunc(sCallback).call(sImportId, e);
	}
};


/**
 * @class  excel import on error <br>
 * @param {Object} obj	
 * @param {Event} e		
 * @return N/A
 * @example
 */
pForm.gfnImportOnerror = function(obj,  e)
{
	this.setWaitCursor(false);	
	this.gfnAlert("msg.err.validator", [e.errormsg]);
};

pForm = null;