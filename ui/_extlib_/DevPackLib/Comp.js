/**
*  devPack Library
*  @FileName 	Comp.js 
*  @Creator 	TOBESOFT
*  @CreateDate 	2020.11.24
*  @Desction   
************** 소스 수정 이력 ***********************************************
*  date          		Modifier                Description
*******************************************************************************
* 2020.11.24			TOBESOFT				Component Library
*******************************************************************************
*/

var pForm = nexacro.Form.prototype;

/**
 * @class dataSet object에서 키에 해당되는 Row를 찾아서 rowpostion 전달
 * @param {Object} objDs - 대상 dataset
 * @param {String} sIdCol - 키칼럼
 * @param {String} sId - 키값
 * @param {String} sSubCol - 서브키칼럼
 * @param {String} sSubId - 서브 키값
 * @return {Number} rowpostion
 */ 
pForm.gfnFindData = function (objDs, sIdCol, sId, sSubCol, sSubId)
{
	var arrArgument = this.gfnFindData.arguments;
	
	if (this.gfnIsNull(sSubCol)) 
	{
		return objDs.findRow(sIdCol, sId);
	}
	
	return objDs.findRowExpr(sIdCol + " == '" + sId + "' && " + sSubCol + " == '" + sSubId + "'");
};

 /**
 * @class dataSet object에서 키에 해당되는 Row를 찾아서 칼럼값을 전달
 * @param {Object} objDs - 대상 dataset
 * @param {String} sIdCol - 키칼럼
 * @param {String} strId - 키값
 * @param {String} sInfo - dataSet 칼럼
 * @param {String} sSubCol - 서브키칼럼
 * @param {String} sSubId - 서브 키값
 * @return {Object} 칼럼값
 */ 
pForm.gfnGetLookupData = function (objDs, sIdCol, strId, sInfo, sSubCol, sSubId)
{
	var sVal;
	var nCurRow = this.gfnFindData(objDs, sIdCol, strId, sSubCol, sSubId);
	if (nCurRow < 0) 
	{
		return "";
	}
	
	sVal = objDs.getColumn(nCurRow, sInfo);
	if (this.gfnIsNull(sVal)) 
	{
		return "";
	}

	return sVal;
};

/**
 * @class text 넓이 및 높이를 구하는 함수
 * @param {String} sText - text
 * @return {Array} text 넓이 및 높이 배열
 */
pForm.gfnGetTextSize = function(sText) 
{
	var objStatic  = new nexacro.Static();
	objStatic.init("objStatic", 0, 0, 0, 0);
	this.addChild("objStatic", objStatic); 
	objStatic.set_text(sText);
	objStatic.set_fittocontents("both");
	objStatic.set_visible(false);
	objStatic.show(); 
	
	var width = 0, height = 0;
	
	width  = objStatic.getOffsetWidth();
	height = objStatic.getPixelHeight();
	
	this.removeChild("objStatic"); 
	objStatic.destroy();
	objStatic = null;
	
	return [width, height];
};


/**
* @class 공통코드콤보설정(Combo/Grid) <br>
* @param {Array} param - 콤보 파라미터
* @param {String} [sLocale] - 언어(KO, EN)
* @param {String} [sLocalGubun] - 로컬코드 사용 여부 
* @return N/A
* @example 
* var param = [
		  {biztype:"Combo", code:"0000",  objid: this.divSearch.cboSys} 		//시스템구분
		, {biztype:"Radio", code:"0228",  objid: this.rdoVtMenuYn} 			//가상메뉴여부 
		, {biztype:"Combo", code:"0288", selecttype:"A",  objid: this.div_Search.cbo_UseYn} 	//사용여부
    ];
    
	this.gfn_getCommonCode(param);
*/  
pForm.gfnGetCommonCode = function(param, sLocale)
{
    var objApp = nexacro.getApplication();
	var objDs =  objApp.gdsCommCode;	// 서버 조회 데이터;

	// 다국어 처리
	var v_sLang = "ko";
    for (var idx in param){

        if (!this.gfnIsNull(param[idx].objid)) {
            // 여기는 무조건 단일값
            var bizType 	 = param[idx].biztype;
            var code 		 = param[idx].code;
			
			// Code Column 추가
            var codecol		 = param[idx].codecol==undefined?"SSC_CD":param[idx].codecol;
            var data 		 = param[idx].data==undefined?"SSC_CD_KORN_NM":param[idx].data;
            var selecttype   = param[idx].selecttype==undefined?"":param[idx].selecttype;
            var bindcolumn   = param[idx].bindcolumn;
            var edit		 = param[idx].edit;
            var sortcolumn	 = param[idx].sortcolumn==undefined ? "SORT_ORDR" : param[idx].sortcolumn;
            var sortmethod	 = param[idx].sortmethod==undefined ? "asc" : param[idx].sortmethod;
            var filterstring = param[idx].filterstring==undefined ? "" : param[idx].filterstring;
            var direction    = param[idx].direction==undefined ? "horizontal" : param[idx].direction;
            var align 		 = param[idx].align==undefined?"center":param[idx].align;
            
            var componentName = this._gfnGetComponentFullName(param[idx].objid);

            if (this.gfnIsNull(componentName)){
                return;
            }
            var dsName = "ds_"+componentName+"_"+code;
            var dsComboName = this._gfnGetDataSet(dsName);

            //값복사 시작
            if (this.gfnIsNull(filterstring)){
				objDs.filter("HCL_CD == '"+code+"'");
            }
            else {
				objDs.filter("HCL_CD == '"+code+"' && ("+filterstring + ")");
            }

			var nRowCnt = dsComboName.copyData(objDs,true);

			//2016.07.14 아래에서 전체에 % 가 추가됐다는 구분을 하기 위해서 별도의 컬럼을 추가한다. (TYPE)
			//			 TYPE = 0 = false, 1 = true
			var sColNm = "SEL_TYPE";
			dsComboName.addColumn(sColNm, "string");
            //alert("nRowCnt : "+nRowCnt);
			objDs.filter(filterstring);
            if (dsComboName.rowcount == 0){
                continue;
            }
            //정렬
            if (!this.gfnIsNull(sortcolumn)){
                if (!this.gfnIsNull(sortmethod)){
                    sortmethod = "asc";
                }
                dsComboName.keystring = "S:"+(sortmethod=="asc"?"+":"-")+sortcolumn;
                dsComboName.updateSortGroup();
            }
			
            //초기값 설정
            if (!this.gfnIsNull(selecttype)){
                switch (selecttype){
                    case "A": 
						if(param[idx].objid instanceof Radio){
							this._gfnInsertDefaultRow(dsComboName, "전체", data, selecttype, codecol);
						}else{
							this._gfnInsertDefaultRow(dsComboName, "- 전체 -", data, selecttype, codecol, "");
						}
                        break;
                    case "S": 
						this._gfnInsertDefaultRow(dsComboName, "- 선택 -", data, selecttype, codecol);
                        break;
                    case "N": 
                        if (param[idx].objid instanceof Combo){
                            this._gfnInsertDefaultRow(dsComboName, "", data, selecttype, codecol);
                        }
                        break;
                }
            }
            if (param[idx].objid instanceof Combo){
                param[idx].objid.set_innerdataset(dsComboName);
				param[idx].objid.set_codecolumn(codecol);

                if (this.gfnIsNull(param[idx].data)){
					param[idx].objid.set_datacolumn("SSC_CD_KORN_NM");
				} else {
					param[idx].objid.set_datacolumn(param[idx].data);
				}
				//2016.08.04 공통코드 셋팅이전에 값이 없을 경우에 index=0 을 반영한다.
				if(this.gfnIsNull(param[idx].objid.value))
					param[idx].objid.set_index(0);

            } else if (param[idx].objid instanceof Radio){
				var bEnabe = param[idx].objid.enable;
				param[idx].objid.set_enable(true);
                param[idx].objid.set_innerdataset(dsComboName);
                //2016.08.11 KSK 잠금처리되어있던 부분 다시 활성화 처리함
				param[idx].objid.set_codecolumn(codecol);
//                param[idx].objid.set_codecolumn("COMM_CODE");
                if (this.gfnIsNull(param[idx].data)){
					param[idx].objid.set_datacolumn("SSC_CD_KORN_NM");
				} else {
					param[idx].objid.set_datacolumn(param[idx].data);
				}
				
                if (direction == "horizontal"){
					param[idx].objid.set_columncount(dsComboName.rowcount);
                } else if (direction == "vertical"){
					param[idx].objid.set_direction("vertical");            
                }
                if(!bEnabe)
					param[idx].objid.set_enable(bEnabe);
            } else if (param[idx].objid instanceof Grid){
                var nCellIdx = this._gfnGetCellIdx(param[idx].objid, bindcolumn);
                if (this.gfnIsNull(bindcolumn) || nCellIdx == -1){
                    return;
                }
                //실제로 해당되는 컬럼 display, edit type 변경 및 Dataset 바인딩
                if (!this.gfnIsNull(edit) && edit == "true"){
					var sDisplay = param[idx].objid.getCellProperty("body", nCellIdx, "displaytype");
					var sEdit = param[idx].objid.getCellProperty("body", nCellIdx, "edittype");
					if( this.gfnIsNull(sDisplay) || sDisplay=="normal") sDisplay = "combocontrol";
					if( this.gfnIsNull(sEdit) || sEdit=="none") sEdit = "combo";
					
					param[idx].objid.setCellProperty("body", nCellIdx, "displaytype", sDisplay);
                    param[idx].objid.setCellProperty("body", nCellIdx, "edittype", sEdit);
                }else{
					param[idx].objid.setCellProperty("body", nCellIdx, "displaytype", "combotext");
				}
				
                param[idx].objid.setCellProperty("body", nCellIdx, "combodataset", dsComboName.name);
                param[idx].objid.setCellProperty("body", nCellIdx, "combocodecol", codecol);
				
                if (this.gfnIsNull(param[idx].data)){
					param[idx].objid.setCellProperty("body", nCellIdx, "combodatacol", "SSC_CD_KORN_NM");
				} else {
					param[idx].objid.setCellProperty("body", nCellIdx, "combodatacol", param[idx].data);
				}
                param[idx].objid.setCellProperty("body", nCellIdx, "textAlign", align);
            } 
        }
		else {
			trace(param[idx].objid.name + " ==> 전달된 Component가 유효하지 않습니다");
		}
    }
	try{
		if (typeof(this.afterCommCodeLoad) == "function"){
			this.afterCommCodeLoad();
		}
	} catch(e) {
	
	}
};


/**
* @class  바인드되어 있는 Dataset에 해당되는 ColumnId 를 가지고 있는 Cell의 Index 반환 <br>
* @param {Object} objGrid - 그리드 Object
* @param {String} strCompColumnId - 컴포넌트 컬럼 ID
* @return {int} i - 컬럼 Index (못찾는 경우 -1)
* @example 
* this._gfnGetCellIdx(param[idx].objid, bindcolumn);
*/  
pForm._gfnGetCellIdx = function(objGrid, strCompColumnId) 
{
    var nCellCnt = objGrid.getCellCount("body");
    for (var i=0; i<nCellCnt; i++){
		var strTemp = objGrid.getCellProperty("body",i,"text");
		var nIdx = strTemp.indexOf(":");
		var strColumnId = strTemp.substr(nIdx+1, strTemp.length);
        if (strColumnId == strCompColumnId){
            return i;
        }
    }
    return -1;
};

/**
* @class DataSet이 존재하면 그대로 리턴하고 없으면 생성해서 리턴함 <br>
* @param {String} sDatasetNm - DataSet Name
* @return {Object} 생성된 데이터셋
* @example 
* this._gfnGetDataSet("dsName");
*/ 
pForm._gfnGetDataSet = function(sDatasetNm)
{
	var objDataset;
	if (!this.isValidObject(sDatasetNm)){
		objDataset = new Dataset(sDatasetNm);
		objDataset.name = sDatasetNm;
		this.addChild(sDatasetNm, objDataset);
	} else {
		//objDataset = eval(strDatasetNm);
		objDataset = this.objects[sDatasetNm];
	}
	
	return objDataset;
};

/**
* @class  현재 컴포넌트 전체이름(경로)을 반환 <br>
* @param {String} objComp - Component Object id
* @return {String} Object Component 전체 경로
* @example 
* this._gfnGetComponentFullName(objId);
*/ 
pForm._gfnGetComponentFullName = function(objComp)
{
    var sFullName = "";
    while(!this.gfnIsNull(objComp.parent.name) 
       && (objComp.parent.toString().toUpperCase() != "[OBJECT CHILDFRAME]")) 
    {
        sFullName = objComp.name + (this.gfnIsNull(sFullName)?"":"_") + sFullName;
        objComp = objComp.parent;
    }
    return sFullName;
};

/**
* @class  첫번째 Row 행추가 <br>
* @param {Object} Object - 추가할 데이터셋 Object
* @param {String} value - 추가할 데이터 값
* @param {Dataset} datacolumn - 추가할 데이터셋 데이터 컬럼
* @param {String} selecttype - 추가하는 Type
* @param {String} [codecolumn] - 추가할 데이터셋 코드 컬럼
* @param {String} [sCodeVal] - 추가할 데이터셋 코드 값
* @return {String} value - cn
* @example 
* this._gfnInsertDefaultRow(dsComboName, "전체", data, selecttype);
*/  
pForm._gfnInsertDefaultRow = function(ds, value, datacolumn, selecttype, codecolumn, sCodeVal)
{
	if(this.gfnIsNull(codecolumn))
		codecolumn = "SSC_CD";
	
    if (ds.insertRow(0) != -1){
		ds.setColumn(0, "SEL_TYPE", selecttype);
		
		switch(selecttype){
			case "A":
				if(this.gfnIsNull(sCodeVal)){
					sCodeVal = "%";
				}
				
				ds.setColumn(0, codecolumn, sCodeVal);
				
			break;
			case "S":
			case "N":
			case "":
				if(this.gfnIsNull(sCodeVal)){
					sCodeVal = "";
				}
				
				ds.setColumn(0, codecolumn, sCodeVal);
			break;
		}

		if (this.gfnIsNull(datacolumn)){
			ds.setColumn(0,"SSC_CD_KORN_NM",value);
		}else {
			ds.setColumn(0,datacolumn,value);
		}
    }
};
pForm = null;