/**
*  devPack Library
*  @FileName 	Grid.js 
*  @Creator 	TOBESOFT
*  @CreateDate 	2020.11.24
*  @Desction   
************** 소스 수정 이력 ***********************************************
*  date          		Modifier                Description
*******************************************************************************
* 2020.11.24			TOBESOFT				Grid Library
*******************************************************************************
*/

var pForm = nexacro.Form.prototype;
pForm.GridConfig = {
	"popmenulist" : ["sort","colfix","rowfix","filter","find","colhide","scroll","select","cellcopypaste","initial"],	// 전체 메뉴
	"defaultmenulist" : ["sort","cellcopypaste"],	// default 메뉴	
	"filter" : 	{
					expandsize			: 20
				},
	"sort" : 	{
					sortTogleCancel		: true ,												// 헤더 클릭시 정렬 false= 오름/내림 true= 오름/내림/없음
					ascText  			: "▲"  ,												// ascending text
					descText 			: "▼"  ,												// descending text
					cellInfo			: []													// 내부용
				}
};

/**
 * @class Grid 생성시 호출됨 - CompOverride.js에서 호출
 * @param {Object} objGrid	- 대상그리드
 * @return N/A
 * @example
 * this.gfnGridOnload(this.grdMain);	
*/
pForm.gfnGridOnload = function(objGrid)
{
	this.gfnSetGrid(objGrid);
};

/**
 * @class Grid 파기시 호출됨 - CompOverride.js에서 호출 / 매달린 객체 제거 위함.
 * @param {Object} objGrid	- 대상그리드
 * @return N/A
 * @example
 * this.gfnGridOnload(this.grdMain);	
*/
pForm.gfnGridOnUnload = function(objGrid)
{
	if(objGrid.popupMenu)
	{
		var objDS = objGrid.popupMenu.getInnerDataset();
		if(objDS) 
		{
			try {
				this.removeChilde(objDS.name);
				objDS.destroy();
				objDS = null;
			} catch(e) {}				
		}
		objGrid.popupMenu.grid = null;
		try {
			this.removeChilde(objGrid.popupMenu.id);
			objGrid.popupMenu.destroy();
		} catch(e) {}
		objGrid.popupMenu = null;
	}
	if(objGrid.arrprop) objGrid.arrprop = null;
	if(objGrid.orgformat2) objGrid.orgformat2 = null;
};

/**
 * @class  그리드 설정 내부함수<br>
		   그리드에 유저프로퍼티를 Array형태로 반환한다.
 * @param  {Object}objGrid	- 대상그리드
 * @return {Array} user property
 * @example
 * this._getGridUserProperty(this.grdMain);	
 */
pForm._getGridUserProperty = function (objGrid)
{
	var sProp = objGrid.uFunction;
	
	var arrdefault = this.GridConfig.defaultmenulist.slice();
	var arrprop = [];
	
	if (!this.gfnIsNull(sProp)) {
		arrprop = sProp.split(",");
		for (var i=0; i<arrprop.length; i++) {
			if (arrprop[i].indexOf("!") == 0 ) {
				//DEFAULT에서 제거
				for (var j=0; j<arrdefault.length; j++){
					if (arrdefault[j] == arrprop[i].substr(1) ) {
						arrdefault[j] = "";
					}
				}
				arrprop[i] = "";
			}
		}
	}
	
	var arrmyprop = [];
	for (var i=0; i< arrdefault.length; i++) {
		if (!this.gfnIsNull(arrdefault[i])) {
			arrmyprop.push(arrdefault[i]);
		}
	}
	
	for (var i=0; i< arrprop.length; i++) {
		if (!this.gfnIsNull(arrprop[i])) {
			arrmyprop.push(arrprop[i]);
		}
	}
	
	//trace(objGrid.name + " - arrmyprop : " + arrmyprop);
	return arrmyprop;
};


/**
 * @class  그리드헤드클릭 이벤트 [Sort, Checkbox]
 * @param {Object} objGrid - 대상그리드
 * @param {Evnet}  e	   - 헤드클릭이벤트
 * @return  N/A
 * @example
 * objGrid.addEventHandler("onheadclick", 	 this.gfnGrid_onheadclick, 	 this);
 */
pForm.gfnGrid_onheadclick = function(objGrid, e)
{
	if (this.gfnGridSelectAllCheckbox(objGrid, e)) return;	// 체크박스인 경우
	
	// sort
	if (objGrid.uFun_sort === true) {
		if(objGrid._appendHeadRowIndex == e.subrow) return;	// find용 row

		var multiple = false;
		if (e.ctrlkey) multiple = true; // Ctrl 키
		var rtn = this._gfnGridSetSortStatus(objGrid, e.cell, multiple);
		if (rtn) {
			this._gfnGridExecuteSort(objGrid);
		}
	}
};

/**
 * @class 정렬가능여부리턴
 * @param {Object} grid - 대상그리드
 * @param {Number} headCellIndex - 대상셀INDEX
 * @param {Boolean}multiple - 멀티소트여부 
 * @param {Number} sortStatus - 소트상태  
 * @return{Boolean} sort 가능/불가능 여부
 * @example
 * this._gfnGridSetSortStatus(obj, e.cell, multiple);	
 */
pForm._gfnGridSetSortStatus = function(grid, headCellIndex, isMultiple, sortStatus, bodyCellIndex)
{
	// head cell index 에 해당하는 body cell index
	if( this.gfnIsNull(bodyCellIndex)){
		bodyCellIndex = this._gfnGridGetBodyCellIndex(grid, headCellIndex);
	}
	if ( bodyCellIndex < 0 ) return false;
	
	// body cell index 에 해당하는 바인드 컬럼명
	var columnName = this.gfnGetBindColName(grid, bodyCellIndex);
	if (this.gfnIsNull(columnName)) {
		trace("bind가 되지 않은 cell은 sort가 되지 않습니다.");
		return false;
	}
	
	if ( this.gfnIsNull(isMultiple) ) isMultiple = false;
	if ( this.gfnIsNull(sortStatus) ) sortStatus = -1;
	
	// 대상 grid 에 정렬정보를 가지는 사용자 속성 확인/추가
	if ( this.gfnIsNull(grid.sortInfos) ){
		grid.sortInfos = {};
	}
	
	// 정렬대상컬럼 (순서중요)
	if ( this.gfnIsNull(grid.sortItems) ){
		grid.sortItems = [];
	}
	
	var sortInfos = grid.sortInfos,
		sortItems = grid.sortItems,
		sortInfo = sortInfos[columnName],
		sortItem,
		status;
	
	if (this.gfnIsNull(sortInfo)) {
		var headText = grid.getCellText(-1, headCellIndex);
		
		// executeSort에서 정렬 표시를 위해 cell index 가 필요한데
		// cell moving 될 경우 index는 변하므로 cell object 를 참조하여 값을 얻어온다. 		
		var refCell = this._gfnGridGetGridCellObject(grid, "head", headCellIndex);
		sortInfo = sortInfos[columnName] = { status: 0, text: headText, refCell: refCell};
	}
	// set sort status
	if ( isMultiple ) {		
		status = sortInfo.status;
		if ( sortStatus == -1 ) {
			if ( status == 0 ) {
				sortInfo.status = 1;
			} 
			else if ( status == 1 ) {
				sortInfo.status = 2;
			} 
			else if ( status == 2 ) {
				sortInfo.status = ( this.GridConfig.sort.sortTogleCancel ? 0 : 1);
			}
		}
		else {
			sortInfo.status = sortStatus;
		}
	}
	else {
		for (var p in sortInfos) {
			if ( sortInfos.hasOwnProperty(p) )
			{
				sortInfo = sortInfos[p];
				if ( p == columnName ) {
					status = sortInfo.status;
					if ( sortStatus == -1 ) {
						if ( status == 0 ) {
							sortInfo.status = 1;
						} 
						else if ( status == 1 ) {
							sortInfo.status = 2;
						} 
						else if ( status == 2) {
							sortInfo.status = ( this.GridConfig.sort.sortTogleCancel ? 0 : 1);
						}
					}else {
						sortInfo.status = sortStatus;
					}
				}else {
					sortInfo.status = 0;
				}
				if ( sortInfo.status == 0 ){
					for (var j=0, len2=sortItems.length; j<len2; j++) {
						if ( sortItems[j] !== columnName ) {
							sortItems.splice(j, 1);
							break;
						}
					}
				}
			}
		}
	}
	
	// 컬럼정보 등록
	var hasItem = false;
	for (var i=0, len=sortItems.length; i<len; i++) {
		if ( sortItems[i] == columnName ) {
			hasItem = true;
			break;
		}
	}	
	if (!hasItem) {
		sortItems.push(columnName);
	}
	return true;
}; 

/**
 * @class 소트를 실행한다
 * @param {Object}  grid 대상 Grid Component
 * @return{String}  N/A
 * @example
 * this._gfnGridExecuteSort(obj);	
 */  
pForm._gfnGridExecuteSort = function(grid) 
{
	var sortInfo, 
		sortItem,
		sortInfos = grid.sortInfos,
		sortItems = grid.sortItems,
		columnName,
		status,
		cell,
		sortString = "";
		
	if ( this.gfnIsNull(sortInfos) || this.gfnIsNull(sortItems) ) return;

	// keystring 조합
	for (var i=0; i<sortItems.length; i++) {
		columnName = sortItems[i];
		sortInfo = sortInfos[columnName];
		status = sortInfo.status;
		cell = sortInfo.refCell;
		
		// 컬럼삭제 등으로 제거될 수 있으므로 실제 column 이 존재하는지
		// 확인하여 없으면 제거해 준다.
		if ( this.gfnIsNull(cell) || grid.getBindCellIndex("body", columnName) < 0 ){
			// 컬럼정보제거
			sortItems.splice(i, 1);
			sortInfos[columnName] = null;
			delete sortInfos[columnName];
			
			i--;
		}
		else if ( status > 0 ) {
			sortString += (status == 1 ? "+" : "-") + columnName;
		}
	}
	
	var ds = grid.getBindDataset();
	
	// keystring 확인
	var curKeyString = ds.keystring;
	var groupKeyString = "";
	
	if (curKeyString.length > 0 && curKeyString.indexOf(",") < 0) {
		var sIndex = curKeyString.indexOf("S:");
		var gIndex = curKeyString.indexOf("G:");

		if (sIndex > -1) {
			groupKeyString = "";
		}
		else {
			if (gIndex < 0) {
				groupKeyString = "G:"+curKeyString;
			}
			else {
				groupKeyString = curKeyString;
			}
		}
	}
	else {
		var temps = curKeyString.split(",");
		var temp;
		for (var i=0,len=temps.length; i<len; i++) {
			temp = temps[i];
			if (temp.length > 0 && temp.indexOf("S:") < 0) {
				if (temp.indexOf("G:") < 0) {
					groupKeyString = "G:"+temp;
				}
				else {
					groupKeyString = temp;
				}
			}
		}
	}
	
	grid.set_enableevent(false);
	grid.set_enableredraw(false);
	
	if (sortString.length > 0) {
		var sortKeyString = "S:"+sortString;
		
		if ( groupKeyString.length > 0 ) {
			ds.set_keystring(groupKeyString + "," +  sortKeyString);
		} 
		else {
			ds.set_keystring(sortKeyString);
		}
		
		grid.sortKeyString = sortKeyString;
	}
	else {
		ds.set_keystring(groupKeyString);
		grid.sortKeyString = "";
	}

	// 정렬표시
	var index, marker;
	for (var p in sortInfos) {
		if ( sortInfos.hasOwnProperty(p) )
		{
			sortInfo = sortInfos[p];			
			cell = sortInfo.refCell;
			if ( cell )
			{
				index = cell._cellidx;
				marker = this.gfnDecode(sortInfo.status, 1, this.GridConfig.sort.ascText, 2, this.GridConfig.sort.descText, "");
				grid.setCellProperty( "head", index, "text", sortInfo.text + marker);
			}
		}
	}
	
	ds.set_rowposition(0); // rowposition을 최상단으로 
	grid.set_enableevent(true);
	grid.set_enableredraw(true);
};

/**
 * @class  마우스 우클릭 이벤트
 * @param  {Object} objGrid	- 대상그리드
 * @param  {Event}  e		- 우클릭이벤트 
 * @return  N/A
 * @example
 * this._gfnGetHeadBodyIndex(this.grdMain, this.dsMain);	
 */
pForm.gfnGrid_onrbuttondown = function (objGrid, e)
{
	var objApp = nexacro.getApplication();
	if(!objGrid.popupMenu) return;
	// 대상 그리드와 셀 정보를 추가
	//objGrid.popupMenu.grid = objGrid;
	objGrid.popupMenu.cellindex = e.cell;
	objGrid.popupMenu.rowindex = e.row;
	
	var popDs = objGrid.popupMenu.getInnerDataset();
	if(e.row < 0) 
	{
		popDs.filter("enable=='true' && bandtype=='head'");
	} else {
		popDs.filter("enable=='true' && bandtype!='head'");
	}
	if(popDs.rowcount == 0) return;

	// trackPopupByComponent 이용
	var x = nexacro.toNumber(system.getCursorX()) - nexacro.toNumber(system.clientToScreenX(objGrid, 0));
	var y = nexacro.toNumber(system.getCursorY()) - nexacro.toNumber(system.clientToScreenY(objGrid, 0));
	
	// 스튜디오 사용시 팝업메뉴 위치 조정
	var sRunMode = objApp.gvRunMode;
	if (sRunMode == "S" || this.gfnIsNull(sRunMode)) {
		y += 83;
	}	
	objGrid.popupMenu.trackPopupByComponent(objGrid, x, y, null, false);
};

/**
 * @class  그리드 expand 다운 이벤트
 * @param  {Object} objGrid	- 대상그리드
 * @param  {Event}  e		- 우클릭이벤트 
 * @return  N/A
 * @example
 * this._gfnGrid_onexpanddown(this.grdMain, e);	
 */
pForm._gfnGrid_onexpanddown = function (objGrid, e)
{
	if(e.row >= 0) return;
	if(objGrid._appendHeadRowIndex < 0) return;
	nexacro._OnceCallbackTimer.callonce(this, function () {
		this._gfnHeadFindExecute(objGrid);
	}, 50);	
};

/**
 * @class  헤더에서검색 적용
 * @param  {Object} objGrid	- 대상그리드
 * @return  N/A
 * @example
 * this._gfnHeadFindExecute(this.grdMain);	
 */
pForm._gfnHeadFindExecute = function (objGrid)
{
	var headInfo = objGrid._headFilterInfo;
	var headTxt, cond;
	var filterstr = "";	
	for(var i=0;i<headInfo.length;i++) {
		if(!headInfo[i]) continue;
		headTxt = objGrid.getCellProperty("head", i, "text");
		if(headInfo[i].col && (headTxt && headTxt != "")) {
			if(filterstr!="") filterstr += "&&";
			filterstr += "(" + headInfo[i].col + ".indexOf('" + headTxt + "')>-1)";
		}
	}
	var dsGrd = objGrid.getBindDataset();
	dsGrd.filter(filterstr);
};

/**
 * @class  마우스우클릭시 표현될 팝업메뉴생성 / 그리드 이벤트 생성
 * @param  {Object} objGrid	- 대상그리드
 * @param  {Array} arrProp	- 제공 옵션 배열
 * @return  N/A
 * @example
 * this._gfnMakeGridPopupMenu(this.grdMain, arrProp);	
 */
pForm._gfnMakeGridPopupMenu = function (objGrid, arrProp)
{
	var objApp 		 = nexacro.getApplication();
	var objMenuDs 	 = objApp.gdsGridPopupMenu;
	var objParentForm= objGrid.parent;
	
	objGrid.orgformat2 = objGrid.getFormatString();
	
	// 팝업메뉴 생성용 데이터셋 추가
	var sPopupDsMenu = "dsPopupMenu_" + objGrid.name + "_" + this.name;
	var objPopupDs 	 = this[sPopupDsMenu];
	if(!objPopupDs)
	{
		objPopupDs = new Dataset(sPopupDsMenu);
		this.addChild(sPopupDsMenu, objPopupDs); 
	}
	objPopupDs.set_updatecontrol(false);
	objPopupDs.set_enableevent(false);
	objPopupDs.filter("");
	objPopupDs.copyData(objApp.gdsGridPopupMenu);
	var sMenu;
	for (var i=0; i<arrProp.length; i++) 
	{
		if(arrProp[i] == "colfix" && objGrid.autofittype == "col") continue;
		
		for (var j=0; j<objPopupDs.rowcount; j++)
		{
			sMenu = objPopupDs.getColumn(j, "grp");
			if (sMenu == arrProp[i])
			{
				objPopupDs.setColumn(j, "enable", "true");
			}
		}
	}
	objPopupDs.filter("enable=='true'");
	var sPopMenu = "popMenu_"+objGrid.name+"_"+this.name;
	var objPopMenu 	 = this[sPopMenu];
	if(!objPopMenu) {
		objPopMenu = new PopupMenu(sPopMenu, 0, 0, 100, 100);
		this.addChild(sPopMenu, objPopMenu);
		objPopMenu.set_innerdataset(sPopupDsMenu);
		objPopMenu.set_captioncolumn("caption");
		objPopMenu.set_enablecolumn("enable");
		objPopMenu.set_idcolumn("id");
		objPopMenu.set_levelcolumn("level");
		objPopMenu.addEventHandler("onmenuclick", this.gfnPopupmenu_onmenuclick, this);
		objPopMenu.show();
		objPopMenu.set_itemheight(29);
	}
	
	objPopMenu.grid = objGrid;
	objGrid.popupMenu = objPopMenu;
	objPopupDs.set_enableevent(true);
	
	if(objPopupDs.findRow("bandtype", "head")>=0)
	{
		objGrid.addEventHandler("onheadclick", this.gfnGrid_onheadclick, this);
	}

	objGrid.addEventHandler("onrbuttondown", this.gfnGrid_onrbuttondown, this);
	var nFindRow = objPopupDs.findRow("id", "filterhead");
	if(nFindRow>=0) {
		var nCnt = objGrid.getFormatRowCount();
		var nBodyCnt = 0;
		for(var i=0;i<nCnt;i++) {
			if(objGrid.getFormatRowProperty(i, "band") == "body") {
				nBodyCnt++;
				objGrid._bodyrowsize = objGrid.getFormatRowProperty(i, "size");
			}
		}
		objGrid._bodyrowcnt = nBodyCnt;
		if(nBodyCnt == 1) {
			objGrid.addEventHandler("onexpanddown", this._gfnGrid_onexpanddown, this);
		} else {
			objPopupDs.setColumn(nFindRow, "enable", "false");
		}
	}
};

/**
 * @class Grid에 기능 추가
 * @param {Object} objGrid	- 대상그리드
 * @return N/A
 * @example
 * this.gfnSetGrid(this.grdMain);	
*/
pForm.gfnSetGrid = function(objGrid)
{
	var objApp = nexacro.getApplication();
	if(objApp.gvUseGridContextMenu != true) return;
	
	// Grid의 UserProperty 설정
	var arrProp = this._getGridUserProperty(objGrid);
	// 설정할 속성이 없을땐 리턴
	if(this.gfnIsNull(arrProp)) return;
	
	objGrid.arrprop = arrProp;
	if(arrProp.indexOf("sort")>=0) objGrid.uFun_sort = true;
	
	// 복사&붙여넣기 여부에 따라 관련 셋팅
	if(arrProp.indexOf("cellcopypaste")>=0) this.gfnSetGridCopyPaste(this, objGrid);
	
	// popupmenu 생성 및 Event 생성 : 성능을 위해 timer로 처리
	nexacro._OnceCallbackTimer.callonce(this, function () {
		this._gfnMakeGridPopupMenu(objGrid, arrProp);
	}, 10);
};	


pForm.gfnClearSortMark = function (objGrid, nCell) {
	var nColCnt = objGrid.getCellCount("head");
	var sText , sRepText;
	
	if(nCell === null || nCell === undefined) this._issortmark = false;

	for(var ii=0; ii<nColCnt; ii++) {
		//if (nCell == ii) continue;	// 선택한 Cell을 제외하고 처리
		if (objGrid.getCellProperty("head", ii, "displaytype") == "checkboxcontrol" ||
			objGrid.getCellProperty("head", ii, "edittype") == "checkbox") continue;
	
		if(this._filtershowrow && this._filtershowrow == this.getCellProperty("head", ii, "row")) continue;	// filtered row
		
		sText = objGrid.getCellProperty("head", ii, "text");
		if(sText) {
			sRepText = objGrid.getCellProperty("head",ii,"text").replace(this.GridConfig.sort.ascText,"").replace(this.GridConfig.sort.descText, "");
			objGrid.setCellProperty("head", ii, "text", sRepText);
		}
	}
};

/**
 * @class  그리드헤드클릭시 체크박스인 경우 전체 선택
 * @param {Object} objGrid - 대상그리드
 * @param {Evnet}  e	   - 헤드클릭이벤트
 * @return  N/A
 * @example
 * objGrid.gfnGridSelectAllCheckbox(obj, e);
 */
pForm.gfnGridSelectAllCheckbox = function(objGrid, e)
{
	if (objGrid.readonly == true) return true;
	var nCell = e.cell;
	var nCol = e.col;
	if (objGrid.getCellProperty("head", nCell, "edittype") != "checkbox") return false;
	if (objGrid.getCellProperty("body", nCol, "edittype") != "checkbox") return false;
	
	var dsObj = objGrid.getBindDataset();
	var strChkCol = objGrid.getCellProperty("body", nCol, "text");
	if(!strChkCol || strChkCol == "" || (strChkCol.indexOf("bind:") < 0)) return false;
	strChkCol = strChkCol.split("bind:").join("");
	
	var strVal;
	var sTxt = objGrid.getCellProperty("head", nCell, "text");
	if(	!sTxt || sTxt == "" || sTxt == "0" ) {
		strVal = "1";
	} else {
		strVal = "0";
	}
	objGrid.setCellProperty( "head", nCell, "text", strVal);
	dsObj.set_enableevent(false); 
	for ( var r = 0 ; r < dsObj.getRowCount() ; r++ ) {
		dsObj.setColumn(r, strChkCol, strVal);  
	}
	/*
	if(!dsObj._ischeckevent) {
		// check column이 uncheck되면 head check도 변경한다.	- check box는 1개만 있다는 가정임
		dsObj._ischeckevent = true;
		dsObj.addEventHandler("oncolumnchanged",
								function(obj,e) {
									if(e.columnid == strChkCol && e.newvalue!="1") {
										objGrid.setCellProperty( "head", nCell, "text", e.newvalue);
									}
								},
								this);
	}
	*/
	dsObj.set_enableevent(true);	
	dsObj = null;
	
	return true;
};

/**
 * @class  gfnCreatePopupMenu 내부함수로 팝업메뉴 클릭 시 발생하는 이벤트
 * @param {Object} objGrid	- 대상그리드
 * @param {Evnet}  e 		- 팝업메뉴클릭이벤트
 * @return N/A
 * @example
 * this.gfnPopupmenu_onmenuclick(this.grdMain, nexacro.MenuClickEventInfo);	
 */
pForm.gfnPopupmenu_onmenuclick = function (objMenu, e)
{
	var sSelectId   = e.id;
	var objGrid 	= objMenu.grid;
	var nCellIndex 	= objMenu.cellindex;	
	var nRowIndex  	= objMenu.rowindex;

	switch(sSelectId) 
	{
		case "sort"://sort
			objGrid.uFun_sort = true;
			break;	
		case "colfix"://틀고정 열
			this._gfnGridcellFix(objGrid, nCellIndex, nRowIndex);
			break;
		case "colfixfree"://틀고정 열 해제
			this._gfnGridCellFree(objGrid);
			break;
		case "rowfix"://틀고정 행
			if(nRowIndex >=0) {
				objGrid.setFixedRow(nRowIndex);
			}
			break;
		case "rowfixfree"://틀고정 행 해제
			objGrid.setFixedRow(-1);
			break;
		case "filter"://필터팝업
			this._gfnGridFilter(objGrid);
			break;
		case "filterhead"://필터 헤더
			this._gfnGridFilterHeader(objGrid);
			break;		
		case "filterfree"://필터해제
			this._gfnGridCellFilterFree(objGrid);
			break;
		case "find"://데이터찾기
			this._gfnGridDataFind(objGrid, nCellIndex, nRowIndex);
			break;
		case "colhide"://컬럼숨기기
			this._gfnGridColHideShow(objGrid, nRowIndex);
			break;	
		case "scrolldefault"://스크롤기본
			objGrid.set_fastvscrolltype("default");
			break;	
		case "scrollmiddle"://스크롤 중앙
			objGrid.set_fastvscrolltype("centerdisplay");
			break;	
		case "scrollall"://스크롤 top,center,bottom
			objGrid.set_fastvscrolltype("topcenterbottomdisplay");
			break;	
		case "scrollpos"://스크롤 top,center,bottom
			objGrid.set_fastvscrolltype("trackbarfollow");
			break;	
		case "sortfree"://cell 선택
			objGrid.uFun_sort = false;
			this.gfnClearSortMark(objGrid, nCellIndex);
			break;	
		case "selectrow"://cell 선택
			objGrid.set_selecttype("row");
			break;	
		case "selectcell"://cell 선택
			objGrid.set_selecttype("cell");
			break;	
		case "selectmultirow"://cell 선택
			objGrid.set_selecttype("multirow");
			break;	
		case "selectarea"://cell 선택
			objGrid.set_selecttype("area");
			break;	
		case "initial"://초기화
			objGrid.set_formats("<Formats>" + objGrid.orgformat2 + "</Formats>");
			this.gfnSetGrid(objGrid);
			break;
		default: break;
	}
};

/**
 * @class body cell index로 binding 된 컬럼명을 얻어온다.
 * @param {Object}  objGrid - 대상 Grid Component
 * @param {Number}  nIndex - grid cell index
 * @return{String} column id
 * @example
 * this.gfnGetBindColName(obj, e.cell);	
 */  
pForm.gfnGetBindColName = function(objGrid, nIndex) 
{
	var text = "";
	var columnid = "";
	var subCell = objGrid.getCellProperty("body", nIndex, "subcell");
	if ( subCell > 0 )
	{
		text = objGrid.getSubCellProperty("body", nIndex, 0, "text");
	} else 
	{
		text = objGrid.getCellProperty("body", nIndex, "text");
	}
	
	if (!this.gfnIsNull(text) )
	{
		if ( text.search(/^BIND\(/) > -1 ) 
		{	
			columnid = text.replace(/^BIND\(/, "");
			columnid = columnid.substr(0, columnid.length-1);
		} else if ( text.search(/^bind:/) > -1 ) 
		{
			columnid = text.replace(/^bind:/, "");
		}
	}
	return columnid;
};

/**
 * @class 유저헤더사용여부반환
 * @param {Object} objGrid - 대상그리드
 * @return 유저헤더사용여부 true/false
 * @example
 * this._gfnGridUserHeaderFlg(this.grdMain);
 */
pForm._gfnGridUserHeaderFlg = function (objGrid)
{
	var arr = objGrid.arrprop;
	var bUserHeader = false;
	for (var i=0; i<arr.length; i++) 
	{
		if (arr[i] == "userheader") 
		{
			bUserHeader = true;
		}
	}
	return bUserHeader;
};

//////////////////////////////////////////////////////////////////////////Popupmenu//////////////////////////////////////////////////////////////////////////
/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br>
		  셀고정(colfix)
 * @param {Object} objGrid  - 대상그리드
 * @param {Number} nCellIdx - 셀고정 셀인덱스
 * @param {Number} nRowIdx  - 셀고정 로우 인덱스
 * @return N/A
 * @example
 * this._gfnGridcellFix(this.grdMain, 1, 2);	
 */
pForm._gfnGridcellFix = function (objGrid, nCellIdx, nRowIdx)
{
	var sBandType;
	
	if(nRowIdx == -1) sBandType = "Head";
	else if(nRowIdx == -2) sBandType = "Summary";
	else sBandType = "Body";
	
	var nCol 	 = nexacro.toNumber(objGrid.getCellProperty(sBandType, nCellIdx, "col"));
	var nColSpan = nexacro.toNumber(objGrid.getCellProperty(sBandType, nCellIdx, "colspan"));
	var nRowSpan = nexacro.toNumber(objGrid.getCellProperty(sBandType, nCellIdx, "rowspan"));

	var nMaxCol = 0;
	var i;
	var nRealCol;
	var nRealColSpan;
	var nRealCol_end;
	
	objGrid.set_enableredraw(false);
	
	objGrid.setFormatColProperty(0, "band", "body");	
	
	for (i=0; i<objGrid.getCellCount("Head"); i++)
	{
		nRealCol = nexacro.toNumber(objGrid.getCellProperty("Head", i, "col"));
		nRealColSpan = nexacro.toNumber(objGrid.getCellProperty("Head", i, "colspan"));
		nRealCol_end = nRealCol+nRealColSpan-1;
		if ( nRealCol == nCol||nRealCol_end==nCol)
		{
			if(nRealColSpan>1)
			{
				//objGrid.setCellProperty("Head", i, "line", "1 solid #dcdbdaff,2 solid #919191ff");
				nCol = nRealCol_end;
			} else
			{
				//objGrid.setCellProperty("Head", i, "line", "1 solid #dcdbdaff,2 solid #919191ff");
				nCol = nRealCol_end;
			}
		} else
		{
			objGrid.setCellProperty("Head", i, "line", "");
		}
	}
	
	for (i=0; i<objGrid.getCellCount("Body"); i++)
	{
		if (objGrid.getCellProperty("Body", i, "col") == nCol)
		{
			//objGrid.setCellProperty("Body", i, "line", "1 solid #dcdbdaff,2 solid #919191ff");
			objGrid.setCellProperty("Body", i, "border", "1px solid #dbdee2 , 2px solid aqua , 1px solid #dbdee2 , 1px solid #dbdee2");
		}
		else
		{
			//objGrid.setCellProperty("Body", i, "line", "");
			objGrid.setCellProperty("Body", i, "border", "");
		}
	}	
	
	objGrid.setFormatColProperty(nCol, "band", "left");	
	objGrid.set_enableredraw(true);
};

/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br>
		  셀고정해제(colfree)
 * @param {Object} objGrid - 대상그리드
 * @return N/A
 * @example
 * this._gfnGridCellFree(this.grdMain);	
 */
pForm._gfnGridCellFree = function(objGrid)
{
	for(i=0; i< objGrid.getFormatColCount(); i++)
	{		
		objGrid.setFormatColProperty(i, "band", "body");	
	}
		
	for (i=0; i<objGrid.getCellCount("Body"); i++)
	{
		objGrid.setCellProperty("Body", i, "border", "");
	}	
};

/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br>
          셀필터(cellFilter)
 * @param {Object} objGrid - 대상그리드	
 * @param {Number} nCell - 셀필터 셀 인덱스
 * @return N/A
 * @example
 * this._gfnGridFilter(this.grdMain);	
 */
pForm._gfnGridFilter = function(objGrid)
{
	var sTitle = "그리드 필터 설정 팝업";
	var objArg = {pvGrid:objGrid};
	
	var objOption = {title:sTitle,
					titlebar:true};
	var sPopupCallBack = "gfnGridFilterCallback";
	this.gfnOpenPopup( "cmmGridFilter", "common::cmmGridFilter.xfdl", objArg, sPopupCallBack, objOption);	
};


/**
 * @class 그리드 우클릭 Filter 헤더행 추가함수<br>
          셀필터(cellFilter)
 * @param {Object} objGrid - 대상그리드	
 * @return N/A
 * @example
 * this._gfnGridFilter(this.grdMain);	
 */
pForm._gfnGridFilterHeader = function(objGrid)
{
	objGrid.set_enableredraw(false);
    var rowIdx = objGrid.appendContentsRow("head");
	objGrid.setFormatRowProperty( rowIdx, "size", (objGrid._bodyrowsize?objGrid._bodyrowsize:30) );
    // 추가된 head row index를 담아두자.    
    objGrid._appendHeadRowIndex = rowIdx;
	objGrid._headFilterInfo = [];
	
	var nHeadCnt = objGrid.getCellCount("head");
	var nCol, sDispType, headInfo, colText;
	for(var i=0;i<nHeadCnt;i++) {
		if (objGrid.getCellProperty("head", i, "row") == rowIdx) {
			nCol = objGrid.getCellProperty("head", i, "col");
			sDispType = objGrid.getCellProperty("body", nCol, "displaytype");
			switch(sDispType) {
				case "progressbarcontrol" :
				case "buttoncontrol" :
				case "imagecontrol" :
				case "treeitemcontrol" :
						break;
				default :
					objGrid.setCellProperty("head", i, "displaytype", "editcontrol");
					objGrid.setCellProperty("head", i, "edittype", "text");
					objGrid.setCellProperty("head", i, "expandshow", "show");
					objGrid.setCellProperty("head", i, "expandsize", this.GridConfig.filter.expandsize);
					//objGrid.setCellProperty("head", i, "expandimage", this.GridConfig.filter.filterImage);
					
					if(!objGrid._headFilterInfo[i]) objGrid._headFilterInfo[i] = {};
					headInfo = objGrid._headFilterInfo[i];
					colText = objGrid.getCellProperty("body", nCol, "text");
					if(colText && colText.indexOf("bind:")>=0) {
						colText = colText.split("bind:").join("");
						headInfo.col = colText;
					}
					break;
			}
		}
	}
	objGrid.set_enableredraw(true);
};

/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br>
          셀필터해제(cellfilterfree)
 * @param {Object} objGrid - 대상그리드	
 * @return N/A
 * @example
 * this._gfnGridCellFilterFree(this.grdMain);	
 */
pForm._gfnGridCellFilterFree = function(objGrid)
{
    if(objGrid._appendHeadRowIndex >=0) {
        objGrid.deleteContentsRow("head", objGrid._appendHeadRowIndex);
		objGrid._appendHeadRowIndex = null;
	}
	var objDs = objGrid.getBindDataset();
	objDs.set_filterstr("");
};

/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br>
          컬럼 숨기기/보이기
 * @param {Object} objGrid - 대상그리드	
 * @return N/A
 * @example
 * this._gfnGridColHideShow(this.grdMain);	
 */
pForm._gfnGridColHideShow = function(objGrid)
{
	var sTitle = "그리드 컬럼 숨기기/보이기";
	
	var objArg = {pvGrid:objGrid};
	var objOption = {title:sTitle,
					titlebar:true};
	var sPopupCallBack = "gfnColumnHidCallback";
	this.gfnOpenPopup( "cmmColumnHide","common::cmmColumnHide.xfdl", objArg, sPopupCallBack, objOption);	
};

/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br>
          데이터 찾기
 * @param {Object} objGrid - 대상그리드	
 * @return N/A
 * @example
 * this._gfnGridColHideShow(this.grdMain);	
 */
pForm._gfnGridDataFind = function (objGrid, nCellIdx, nRowIdx)
{
	var sTitle = "그리드 데이터 찾기";
	var orgselecttype = objGrid.selecttype;
	
	var oArg = {pvGrid:objGrid, pvStrartRow:nRowIdx, pvSelectCell:nCellIdx, pvSelectType:orgselecttype};
	
	var objOption = {title:sTitle,
					titlebar:true};
	var sPopupCallBack = "gfnDataFindCallback";
	this.gfnOpenPopup( "cmmFindData","common::cmmFindData.xfdl", oArg, sPopupCallBack, objOption);
};

//////////////////////////////////////////////////////////////////////////POPUPMENU CALLBACK///////////////////////////////////////////////////////////
/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br>
          그리드 필터 팝업 콜백
 * @param {String} sId - popupid	
 * @param {String} sReturn - return value	 
 * @return N/A	
 */
pForm.gfnGridFilterCallback = function (sId, sReturn)
{
	//TODO
};

/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br>
          그리드 컬럼숨기기/보이기
 * @param {String} sId - popupid	
 * @param {String} sReturn - return value	 
 * @return N/A	
 */
pForm.gfnColumnHidCallback = function (sId, sReturn)
{
	//TODO
};

/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br>
         그리드 데이터 찾기 콜백
 * @param {String} sId - popupid	
 * @param {String} sReturn - return value	 
 * @return N/A	
 */
pForm.gfnDataFindCallback = function (sId, sReturn)
{
	//TODO
};

/**
 * @class head cell에 match되는 body cell을 얻어온다
 * @param {Object}  objGrid - 대상 Grid Component
 * @param {Number} nHeadCellIndex - head cell index
 * @param {Number} bUseColspan - Colsapn 사용여부
 * @return{Number}  body cell index
 */ 
pForm._gfnGridGetBodyCellIndex = function(objGrid, nHeadCellIndex, bUseColspan) 
{
	if (this.gfnIsNull(bUseColspan)) bUseColspan=false;
	
	// Max Head Row Index
	var nMaxHeadRow = 0;
	for (var i=0, len=objGrid.getCellCount("head"); i<len; i++) 
	{
		var row = objGrid.getCellProperty("head", i, "row");
		if (nMaxHeadRow < row) 
		{
			nMaxHeadRow = row;
		}
	}
	
	// Max Body Row Index
	var nMaxBodyRow = 0;
	for (var i=0, len=objGrid.getCellCount("body"); i<len; i++) 
	{
		var row = objGrid.getCellProperty("body", i, "row");
		if (nMaxBodyRow < row) 
		{
			nMaxBodyRow = row;
		}
	}
	
	if (nMaxHeadRow == 0 && nMaxBodyRow == 0) 
	{
		bUseColspan = true;
	}
	
	// Body Row 가 1개 이상일 경우
	// Head의 row 가 Body의 row 보다 클 경우 차이 row 를 뺀 것을 대상으로 찾고
	// Body의 row 가 Head의 row 보다 크거나 같을 경우 row index가 같은 대상을 찾는다.			
	var nCellIndex = -1;
	var sRow = -1;
	var nRow = parseInt(objGrid.getCellProperty("head", nHeadCellIndex, "row"));
	var nCol = parseInt(objGrid.getCellProperty("head", nHeadCellIndex, "col"));
	var nColspan = parseInt(objGrid.getCellProperty("head", nHeadCellIndex, "colspan"));				
	
	if (nMaxHeadRow > nMaxBodyRow) 
	{
		sRow = nRow - (nMaxHeadRow - nMaxBodyRow);
		sRow = (sRow < 0 ? 0 : sRow);
	} else 
	{
		sRow = nRow;
	}
	
	var cRow, cCol, cColspan, cRowspan;
	
	for (var i=0, len=objGrid.getCellCount("body"); i<len; i++) 
	{
		cRow = parseInt(objGrid.getCellProperty("body", i, "row"));
		cCol = parseInt(objGrid.getCellProperty("body", i, "col"));	
		cColspan = parseInt(objGrid.getCellProperty("body", i, "colspan"));					
		cRowspan = parseInt(objGrid.getCellProperty("body", i, "rowspan"));
		if( cRowspan > 1 ) 
		{
			if (bUseColspan) 
			{
				if (sRow >= cRow && nCol <= cCol && cCol < (nCol + nColspan)) 
				{		
					nCellIndex = i;
					break;
				}		
			} else 
			{
				if (sRow >= cRow && nCol == cCol && nColspan == cColspan) 
				{		
					nCellIndex = i;
					break;
				}
			}
		} else 
		{	
			if (bUseColspan) 
			{
				if (sRow == cRow && nCol <= cCol && cCol < (nCol + nColspan)) 
				{		
					nCellIndex = i;
					break;
				}		
			} else 
			{
				if (sRow == cRow && nCol == cCol && nColspan == cColspan) 
				{		
					nCellIndex = i;
					break;
				}
			}
		}
	}
	return nCellIndex;
};

/**
 * Cell object 를 반환 (Grid 내부 속성이므로 get 용도로만 사용)
 * @param {Object} objGrid - 대상 Grid Component
 * @param {String} sBand - 얻고자 하는 cell 의 band (head/body/summ);
 * @param {Number} nIndex - 얻고자 하는 cell 의 index
 * @return {Object} cell object
 */
pForm._gfnGridGetGridCellObject = function(objGrid, sBand, nIndex)
{
	// 내부속성을 통해 얻어온다.
	var objCell;
	
	var format = objGrid._curFormat;
	if (format) 
	{
		if (sBand == "head") 
		{
			objCell = format._headcells[nIndex];
		} else if (sBand == "body") 
		{
			objCell = format._bodycells[nIndex];
		} else if (sBand == "summ" || sBand == "summary") 
		{
			objCell = format._summcells[nIndex];
		}
	}
	return objCell;
};

/************************************************************************************************
*  Grid CELL COPY AND PASTE 처리
************************************************************************************************/
/**
* @desc  form no_onload : gfn_setGridCopyPaste --> set copy paste grid component
* @param objForm : form,
*   objConfig : {objGrid}
*/
pForm.gfnSetGridCopyPaste = function (objForm, objGrid)
{
	var objConfig = {objGrid : objGrid};
	objForm.config = objConfig;

	if (system.navigatorname == "nexacro" || system.navigatorname == "IE" && system.navigatorversion < 12) 
	{
		objForm.config.colSeperator = "\t"; 

		objForm.config.objGrid.addEventHandler("onkeydown", this._gfnGrdCopyPasteStateChk, objForm);
		objForm.config.objGrid.addEventHandler("onkeyup"  , this._gfnGrdCopyPaste        , objForm);  
	} else
	{
		objForm.config.colSeperator = "\t";  
		objForm.config.targetGrid  = undefined;
		objForm.config.targetEvent = undefined;

		objForm.addEventHandler("ontimer", this._gfnBlinkTimerHandler, objForm); 
		objForm.config.objGrid.addEventHandler("onkeydown", this._gfnGrdCopyPasteEtc, objForm);
	}
}

/**
* @desc  paste data : setPasteData --> set copy paste grid component
* @param clipText
*/
pForm.gfnSetPasteData =  function(objForm, clipText)
{
	var obj = objForm.config.targetGrid;
	var e = objForm.config.targetEvent;

	obj.set_enableevent(false);
	obj.set_enableredraw(false); 

	var ds = obj.getBindDataset();
	ds.set_enableevent(false); 

	var grdCellCount = obj.getCellCount("body");
	var rowCount = ds.getRowCount();

	var objRowCol = this.gfnGetGridSelRowCol(obj);
	var startrow = objRowCol.selectstartrow;
	var endrow   = objRowCol.selectendrow;
	var startcol = objRowCol.selectstartcol;
	var endcol   = objRowCol.selectendcol; 

	var currRow = startrow;
	var cellIndex = startcol;

	copyData = clipText;
	var seperator = objForm.config.colSeperator;

	var rowData = copyData.split(/[\n\f\r]/); 
	var rowDataCount = rowData.length - 1;
	var checkIndex = {}; 

	for (var i = 0; i < rowDataCount; i++) 
	{
		if(rowCount <= currRow)
		{
			ds.addRow();
		}

		var columnData = rowData[i].split(seperator);
		var columnLoopCount = cellIndex + columnData.length;

		if(columnLoopCount > grdCellCount) 
		{
			columnLoopCount = grdCellCount;
		}

		var k = 0;
		for(var j = cellIndex; j < columnLoopCount; j++)
		{
			var colid = obj.getCellProperty("body", j, "text").substr(5);
			var tempValue = columnData[k];
			
			if(!this.gfnIsNull(tempValue))
			{
				ds.setColumn(currRow, colid, tempValue);
			}

			k++;         
		}

		currRow++;
	}         

	ds.rowposition = currRow; 

	endrow = endrow + rowDataCount - 1;
	endcol = columnLoopCount - 1;  
		 
	obj.set_enableredraw(true);
	obj.set_enableevent(true);
	ds.set_enableevent(true); 

	obj.selectArea(startrow, startcol, endrow, endcol);
		 
	objForm.config.targetEvent = undefined;   
}

/**
* @desc  create textarea : gfnCreateElementTextarea --> create document innerhtml : textarea
* @param clipText
*/
pForm.gfnCreateElementTextarea = function(innerText)
{
	var txtValue = document.createElement('textarea');
	
	txtValue.style.position = 'absolute';
	txtValue.style.left = '-1000px';
	txtValue.style.top = document.body.scrollTop + 'px';
	txtValue.value = innerText;
	document.body.appendChild(txtValue);
	txtValue.select();

	return txtValue;
}

/**
* @desc  init blink data : gfnInitBlinkData --> empty target grid 
* @param objFrom
*/
pForm.gfnInitBlinkData = function(objFrom)
{
	var grid = objFrom.config.targetGrid; 
	grid.targetGrid = null;
}


/**
 * @class   주어진 문자열을 그리드에서 찾는다.
 * @param {Object} grid - 대상그리드	
 * @param {String} findText - 찾을 문자열	
 * @param {Object} option - 찾기옵션	
 * @return {Object} 찾은 열과행
 * @example
 * this.gfnFindGridText(this.fv_grid, txt, option);
 */
pForm.gfnFindGridText = function (grid, findText, option)
{
	grid.lastFindText = findText;
	grid.lastFindOption = option;

	// 찾을 옵션
	var direction = option.direction;
	var position = option.position;
	var scope = option.scope;
	var condition = option.condition;
	var strict = option.strict;

	var dataset = grid.getBindDataset();
	if(this.gfnIsNull(grid.lastFindRow)) grid.lastFindRow = 0;
	if(this.gfnIsNull(grid.lastFindCell)) grid.lastFindCell = option.cell;
	
	var startCell = ( position == "current" ? grid.currentcell : grid.lastFindCell );
	var startRow = ( position == "current" ? grid.currentrow : grid.lastFindRow );
	
	// 바꾸기에서 호출시 (option.cell 은 바꾸기에서만 지정)
	if ( scope == "col" && !this.gfnIsNull(option.cell) )
	{
		startCell = option.cell;
	}
	
	var findRow = findCell = -1;
	var rowCnt = dataset.rowcount;
	var bodyCellCnt = grid.getCellCount("body");
			
	// 대소문자 구분
	if ( !strict )
	{
		findText = findText.toUpperCase();			
	}
		
	if ( direction == "prev" )
	{
		startRow -= 1;	
		if ( startRow < 0 )
		{
			startRow = rowCnt-1;
		}
	}
	else
	{
		startRow += 1;
		if ( startRow >= rowCnt )
		{
			startRow = 0;
		}
	}
	
	var loopCnt = rowCnt;
	while ( loopCnt > 0 )
	{
		// 문자열 비교
		if ( this._compareFindText(grid, startRow, startCell, findText, condition, strict) )
		{
			findRow = startRow;
			findCell = startCell;
			break;
		}
		
		// 방향 (이전, 다음)
		if ( direction == "prev" )
		{
			startRow -= 1;
			if ( startRow < 0 )
			{
				startRow = rowCnt-1;
			}				
		}
		else
		{
			startRow += 1;
			if ( startRow > (rowCnt-1) )
			{
				startRow = 0;
			}
		}
		
		loopCnt--;
	}
	// 마지막 찾은 위치 지정
	// 팝업에서 찾을 방향을 "처음부터" 로 변경 시 초기화
	if ( findRow > -1 && findCell > -1 )
	{
		grid.lastFindRow = findRow;
		grid.lastFindCell = findCell;
	}
	
	return [findRow, findCell];
};

/**
 * @class   주어진 행, 셀 인덱스에 해당하는 그리드 데이터와 <br>
 * 문자열을 비교하여 찾아진 결과를 반환
 * @param {Object} grid - 대상 Grid Component
 * @param {Number} row - 찾을 행 인덱스
 * @param {Number} cell - 찾을 셀 인덱스
 * @param {String} findText - 찾을 문자열
 * @param {String} condition - 찾을 조건(equal/inclusion)
 * @param {Boolean} strict - 대소문자 구분 (true/false)
 * @return {Boolean} - 찾기 성공.
 * @example
 * this._compareFindText(grid, startRow, startCell, findText, condition, strict) 
 */
pForm._compareFindText = function(grid, row, cell, findText, condition, strict)
{
	var cellText = grid.getCellText(row, cell);
	if( this.gfnIsNull(cellText))return;
	var displayType = grid.getCellProperty("body", cell, "displaytype");
		
	// displayType 이 normal일 경우
	// dataType 을 체크하여 displayType 을 변경
	if ( this.gfnIsNull(displayType) || displayType == "normal" )
	{
		var dataType = this.gfnGetBindColumnType(grid, cell);
		switch(dataType)
		{
			case 'INT' :
			case 'FLOAT' :
			case 'BIGDECIMAL' :
				displayType = "number";
				break;
			case 'DATE' :
			case 'DATETIME' :
			case 'TIME' :
				displayType = "date";
				break;
			default :
				displayType = "string";
		}
	}
	
	// currency 의 경우 원(￦) 표시와 역슬레시(\) 다르므로 제거 후 비교
	if ( displayType == "currency" )
	{
		var code = cellText.charCodeAt(0);
		if ( code == 65510 || code == 92 )
		{
			cellText = cellText.substr(1);
		}
		
		code = findText.charCodeAt(0);
		if ( code == 65510 || code == 92 )
		{
			findText = findText.substr(1);
		}
	}

	// 대소문자 구분
	if ( !strict )
	{
		cellText = cellText.toUpperCase();
	}
	// 일치/포함
	if ( condition == "equal" )
	{
		if ( findText == cellText )
		{
			return true;
		}
	}
	else 
	{
		if ( cellText.indexOf(findText) > -1 )
		{			
			return true;
		}
	}

	return false;
};

 /**
 * @class   데이터의 타입반환
 * @param {Object} grid - 대상 Grid Component
 * @param {Number} cell - 찾을 셀 
 * @return {Object} - 찾기 성공.
 * @example
 *  this.gfnGetBindColumnType(grid, cell);
 */
pForm.gfnGetBindColumnType = function(grid, cell)
{
	var dataType = null;
	var dataset = grid.getBindDataset();//this.gfnLookup(grid.parent, grid.binddataset);
	var bindColid = grid.getCellProperty("body", cell, "text");
		bindColid = bindColid.replace("bind:", "");
	
	if ( !this.gfnIsNull(bindColid) )
	{
		var colInfo = dataset.getColumnInfo(bindColid);
		if ( !this.gfnIsNull(colInfo) )
		{
			dataType = colInfo.type;
		}
	}
	
	return dataType;
};

/**************************************************************************
* 각 COMPONENT 별 EVENT 영역
**************************************************************************/
/**
* @desc  grid onkeydown event --> ctrl and c or v key down check  ( for nexacro & less than ie 11 )
* @param obj - nexacro.Grid
* @param e   - nexacro.KeyEventInfo
*/
pForm._gfnGrdCopyPasteStateChk = function(obj,e)
{
	var keycode = e.keycode;
	// MacOS 에서는 command로 변경
	var keyCtrl = system.osversion.indexOf("Mac") > -1 ? e.metakey : e.ctrlkey;
	//only ctrl key down
	if(keyCtrl && !e.shiftkey && !e.altkey)
	{
		//ctrl + c
		if(keycode == 67)
		{
			obj.bGridCopy = true;
		//ctrl + v
		} else if(keycode == 86)
		{
			obj.bGridPaste = true;
		}
	}
};

/**
* @desc  grid onkeyup event --> ctrl and c or v key down excute  ( for nexacro & less than ie 11 )
* @param obj - nexacro.Grid
* @param e   - nexacro.KeyEventInfo
*/
pForm._gfnGrdCopyPaste = function(obj,e)
{
	var objForm = obj.parent;
	var keycode = e.keycode;
	
	//ctrl + c
	if(obj.bGridCopy == true)
	{
		obj.bGridCopy = false;

		var objRowCol = this.gfnGetGridSelRowCol(obj);
		var startrow = objRowCol.selectstartrow;
		var endrow   = objRowCol.selectendrow;
		var startcol = objRowCol.selectstartcol;
		var endcol   = objRowCol.selectendcol;   

		var copyData = "";
		var colSeperator = objForm.config.colSeperator;

		objForm.config.targetGrid = null;
			  
		for (var i = startrow; i <= endrow; i++) 
		{
			for (var j = startcol; j <= endcol; j++) 
			{       
				var value = obj.getCellValue(i,j);

				if(!this.gfnIsNull(value))
				{
					if (j < endcol) 
					{
						copyData += obj.getCellValue(i,j) + colSeperator;
					} else 
					{
						copyData += obj.getCellValue(i,j);
					}
				}
			}

			if (i < obj.selectendrow)
			{
				copyData += "\r\n";
			}
		}

		copyData += "\r\n";

		//clipboard
		system.clearClipboard();
		system.setClipboard("CF_TEXT",copyData);

		objForm.config.targetGrid = obj;
	
	//ctrl + v
	} else if(obj.bGridPaste == true)
	{
		obj.bGridPaste = false;
		//clipboard
		var copyData = system.getClipboard("CF_TEXT");
		copyData = new String(copyData);
		var colSeperator = objForm.config.colSeperator;
		var rowData = copyData.split("\r\n");
		var rowDataCount = rowData.length - 1;

		if(rowDataCount < 1)
		{
			e.stopPropagation();
			return;
		}

		obj.set_enableevent(false);
		obj.set_enableredraw(false); 
		  
		var ds = obj.getBindDataset();
		ds.set_enableevent(false); 

		var grdCellCount = obj.getCellCount("body");
		var rowCount = ds.getRowCount();

		var objRowCol = this.gfnGetGridSelRowCol(obj);
		var startrow = objRowCol.selectstartrow;
		var endrow   = objRowCol.selectendrow;
		var startcol = objRowCol.selectstartcol;
		var endcol   = 0; //objRowCol.selectendcol;

		var currRow = startrow;
		var cellIndex = startcol;
		var maxColumnCount = 0;
		  
		//check current cell editType 
		for (var i = 0; i < rowDataCount; i++)
		{
			if(rowCount <= currRow)
			{
				ds.addRow();
			}

			var columnData = rowData[i].split(colSeperator);
			var columnLoopCount = cellIndex + columnData.length;

			if(columnLoopCount > grdCellCount) 
			{
				columnLoopCount = grdCellCount;
			}

			if(maxColumnCount < columnLoopCount)
			{
				maxColumnCount = columnLoopCount;
			}

			var k = 0;
			for(var j = cellIndex; j < columnLoopCount; j++)
			{           
				var colid = obj.getCellProperty("body", j, "text").substr(5);      
				var tempValue = columnData[k];

				if(!this.gfnIsNull(tempValue))
				{
					ds.setColumn(currRow, colid, tempValue);
				}

				k++;         
			}
	
			currRow++;
		}         

		ds.rowposition = currRow; 

		endrow = endrow + rowDataCount - 1;
		endcol = maxColumnCount - 1;

		//system.clearClipboard();
			  
		obj.set_enableredraw(true);
		obj.set_enableevent(true);
		ds.set_enableevent(true); 

		obj.selectArea(startrow, startcol, endrow, endcol);    

		objForm.config.targetGrid = obj;
			  
		//grid enableredraw가 false일 경우 
		//event 전파과정에서 error발생을 막기위한 처리.2015.02.25 버전.
		e.stopPropagation(); 
	} 
};

/**
* @desc  grid onkeydown event --> ctrl and c or v key down check  ( for edge : more than ie 12 & chrome, firefox .. )
* @param obj - nexacro.Grid
* @param e   - nexacro.KeyEventInfo
*/
pForm._gfnGrdCopyPasteEtc = function(obj,e)
{
	var objForm = obj.parent;
	var keycode = e.keycode;
	
	// MacOS 에서는 command로 변경
	var keyCtrl = system.osversion.indexOf("Mac") > -1 ? e.metakey : e.ctrlkey;
	
	//ctrl + c
	if(keyCtrl && !e.shiftkey && !e.altkey)
	{
		if(keycode == 67)
		{
			var objRowCol = this.gfnGetGridSelRowCol(obj);
			var startrow = objRowCol.selectstartrow;
			var endrow   = objRowCol.selectendrow;
			var startcol = objRowCol.selectstartcol;
			var endcol   = objRowCol.selectendcol;

			objForm.config.targetGrid = undefined;

			var clipText = "";
			var colSeperator = objForm.config.colSeperator;
			for (var i = startrow; i <= endrow; i++) 
			{
				var copyData = [];
				var styleData = [];

				for (var j = startcol; j <= endcol; j++)
				{
					 var value = obj.getCellValue(i,j);
					 copyData.push(value);
					 
					 if (j < endcol) 
					 {
						clipText += value + colSeperator;
					 } else 
					 {
						clipText += value;
					 }      
				}

				clipText += "\r\n";
			}

			objForm.config.targetGrid = obj;  

			var ta = this.gfnCreateElementTextarea(clipText);        
			objForm.config.targetGrid["ta"] = ta;  
			   
			objForm.setTimer(777, 100);

			if(!this.gfnIsNull(clipText)) 
			{
				objForm.setTimer(1000, 110);
			}
				   
			e.stopPropagation();    
        //ctrl + v
		} else if(keycode == 86)
		{
			objForm.config.targetGrid = obj;
			objForm.config.targetEvent = e;

			var ta = this.gfnCreateElementTextarea('');
			objForm.config.targetGrid["ta"] = ta;  
			   
			objForm.setTimer(888, 100);  

			e.stopPropagation();   
		}
	}
}

/**
* @desc  form ontimer event --> delay processing data time
* @param obj - nexacro.Form
* @param e   - nexacro.TimerEventInfo
*/
pForm._gfnBlinkTimerHandler = function(obj,e)
{
	var timerid = e.timerid;
	obj.killTimer(timerid);

	if(timerid >= 1000) 
	{
		var remainder = timerid%1000;   
		if(remainder > 8) 
		{
			this.gfnInitBlinkData(obj);
		}
	} else 
	{
		//after copy 
		if(timerid == 777) 
		{   
			var ta = obj.config.targetGrid["ta"];
			if(!ta)
			{
				return; 
			}

			document.body.removeChild(ta);
			obj.config.targetGrid["ta"] = undefined;    
		//after paste
		} else if(timerid == 888)
		{ 
			var ta = obj.config.targetGrid["ta"];    
			if(!ta)
			{
				return; 
			}

			var clipText = ta.value;
			document.body.removeChild(ta);
			this.gfnSetPasteData(obj,clipText);
			obj.config.targetGrid["ta"] = undefined;
		}
	}  
}

/**************************************************************************
*  공통 함수 처리 영역
해당 함수의 경우 프로젝트 사용 시 프로젝트 공통함수로 전환을 권장 드립니다.
**************************************************************************/
/**
* @desc   copy 및 paste할 row, col 값 얻기
* @param  obj - nexacro.Grid
* @return json object(row, col)
*/
pForm.gfnGetGridSelRowCol = function(obj)
{
	var selecttype = obj.selecttype;
	var objRowCol  = {};
	
	if (selecttype == "row") 
	{
		objRowCol.selectstartrow = nexacro.toNumber(obj.currentrow);
		objRowCol.selectendrow   = nexacro.toNumber(obj.currentrow);
		objRowCol.selectstartcol = 0;
		objRowCol.selectendcol   = nexacro.toNumber(obj.getCellCount("body")-1);
	} else if (selecttype == "multirow")
	{
		objRowCol.selectstartrow = nexacro.toNumber(obj.selectstartrow);
		objRowCol.selectendrow   = nexacro.toNumber(obj.selectendrow);
		objRowCol.selectstartcol = 0;
		objRowCol.selectendcol   = nexacro.toNumber(obj.getCellCount("body")-1);
	} else if (selecttype == "cell")
	{
		objRowCol.selectstartrow = nexacro.toNumber(obj.currentrow);
		objRowCol.selectendrow   = nexacro.toNumber(obj.currentrow);
		objRowCol.selectstartcol = nexacro.toNumber(obj.currentcol);
		objRowCol.selectendcol   = nexacro.toNumber(obj.currentcol);
	} else if (selecttype == "area")
	{
		objRowCol.selectstartrow = nexacro.toNumber(obj.selectstartrow);
		objRowCol.selectendrow   = nexacro.toNumber(obj.selectendrow);
		objRowCol.selectstartcol = nexacro.toNumber(obj.selectstartcol);
		objRowCol.selectendcol   = nexacro.toNumber(obj.selectendcol);
	} else if (selecttype == "multiarea")
	{
		trace("grid.selecttype=multiarea 기능에서는 copy & paste를 사용할 수 없습니다");
		objRowCol.selectstartrow = -1;
		objRowCol.selectendrow   = -1;
		objRowCol.selectstartcol = -1;
		objRowCol.selectendcol   = -1;
	}
	return objRowCol;
}

pForm = null;