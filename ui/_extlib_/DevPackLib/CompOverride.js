/**
*  devPack Library
*  @FileName 	Grid.js 
*  @Creator 	TOBESOFT
*  @CreateDate 	2021.3.31
*  @Desction   
************** 소스 수정 이력 ***********************************************
*  date          		Modifier                Description
*******************************************************************************
* 2021.3.31				TOBESOFT				Grid Library
*******************************************************************************
*/

/************************************************************************************************
 * Function Name: ChildFrame set_formurl
 * Description  : QuickView 실행 용도.
*************************************************************************************************/
var _pChildFrame = nexacro.ChildFrame.prototype;
_pChildFrame._orgSet_formurl = _pChildFrame.set_formurl;
_pChildFrame.set_formurl = function (url) {
	// nexacro.__previewform은 LOG에서 사용 : QUICKPREVIEW.HTML
	if(this.id == "QuickViewFrame" && nexacro._quickview_formurl && !nexacro.__previewform) {
		url = "frame::frmWork.xfdl";
	}
	return this._orgSet_formurl(url);
};	

/************************************************************************************************
 * Function Name: _common_fire_lbuttondown
 * Description  : 그리드 Filter 사용시 Header를 생성하여 처리하기 위함.
				: Grid.js에서 사용
*************************************************************************************************/
var pGridCell = nexacro._GridCellControl.prototype;
pGridCell._orgcommon_fire_lbuttondown = pGridCell._common_fire_lbuttondown;
pGridCell._common_fire_lbuttondown = function (from_comp) {
	var rtn = this._orgcommon_fire_lbuttondown(from_comp);
	var grid = this._grid;
	var datarow = grid._getDataRow(this._rowidx);
	if (!this._is_mergetemp) {
		// _common_fire_lbuttondown 소스 그대로이며 head 추가
		if (this._band.id == "head" && this._curDisplayType == "editcontrol") {
			var show = false;
			if ((datarow != grid._selectinfo.curdsrow) || (this._cellidx != grid._selectinfo.curcell)) {
				//if (grid.autoenter == "select") {
					show = true;
				//}
			} else {
				if (!grid._showEditing) {
					show = true;
				}
			}
			if (show) {
				// _common_fire_lbuttondown 소스 그대로이며 curdsrow, curcell 추가
				grid._selectinfo.curdsrow = datarow;
				grid._selectinfo.curcell = this._cellidx;
				//---------------------------------------------------------------
				grid._showEditorCell = true;
				grid._showEditRowIdx = datarow;
				grid._showEditCellIdx = this._cellidx;
			}
		}
	}
	return rtn;
};

var pCellControl = nexacro._CellControl.prototype;
pCellControl._orgdestroyEditor = pCellControl._destroyEditor;
pCellControl._destroyEditor = function () {
	if (this._editor) {
		if(this._band.id == "head" && this._curDisplayType == "editcontrol") {
			this._grid.setCellProperty("head", this._cellidx, "text", this._editor.value);
		}
	}
	return this._orgdestroyEditor();
};	

/************************************************************************************************
 * Function Name: Form on_fire_onload
 * Description  : Form Load시 공통함수 호출
				: Frame.js에서 사용
*************************************************************************************************/
// var pForm = nexacro.Form.prototype;
// pForm._orgon_destroy_contents = pForm.on_destroy_contents;
// pForm.on_destroy_contents = function () {
// 	if(this["gfnFormOnUnload"]) {
// 		this["gfnFormOnUnload"].call(this, this);
// 	}
// 	return this._orgon_destroy_contents();
// }
/*
pForm._orgon_fire_onload = pForm.on_fire_onload;
pForm.on_fire_onload = function (obj, url) {
	if(!this._is_fired_onload && this["gfnFormOnload"]) {
		this["gfnFormOnload"].call(this, this);
	}
	return this._orgon_fire_onload(obj, url);
};
*/
/************************************************************************************************
 * Function Name: Grid on_created_contents
 * Description  : Form Collection을 찾아 for문을 수행하는 것을 방지 하기 위함.
				: Grid.js에서 사용
*************************************************************************************************/
var pGrid = nexacro.Grid.prototype;
pGrid._orgon_attach_contents_handle = pGrid.on_attach_contents_handle;
pGrid.on_attach_contents_handle = function (win) {
	var rtn = this._orgon_attach_contents_handle(win);
	var frm = this._refform;
	if(frm["gfnGridOnload"]) {
		frm["gfnGridOnload"].call(frm, this);
	}
	return rtn;	
};
/************************************************************************************************
 * Function Name: Grid on_destroy_contents
 * Description  : Grid 파기시 처리하기 위함.
				: Grid.js에서 사용
*************************************************************************************************/
pGrid._orgon_destroy_contents = pGrid.on_destroy_contents;
pGrid.on_destroy_contents = function () {
	var frm = this._refform;
	if(frm["gfnGridOnUnload"]) {
		frm["gfnGridOnUnload"].call(frm, this);
	}
	return this._orgon_destroy_contents();
};
/************************************************************************************************
 * Function Name: set_uFunction
 * Description  : 그리드 우측버튼 공통기능 처리를 위함.
				: Grid.js에서 사용
*************************************************************************************************/
//pGrid.uFunction = "sort,colfix,filter,find,colhide,initial,userheader,!scroll,!selecttype";
pGrid.set_uFunction = function(v) {
	this.uFunction = v;
};

/************************************************************************************************
 * Function Name: Grid Expr 확장
 * Description  : 툴에서 속성처리를 위해서는 메타인포 추가 필요
				: 오픈하지 않기 위해 메터인포는 추가치 않음
*************************************************************************************************/

pGrid.usecustomexpr = false;
pGrid.set_usecustomexpr = function(v) {
	this.usecustomexpr = nexacro._toBoolean(v);
};	
//-------------------------------------------------------
// tree usedecorate
//-------------------------------------------------------
//-------------------------------------------------------	
pCellControl._orgCreateTreeDisplayer = pCellControl._createTreeDisplayer;
pCellControl._createTreeDisplayer = function (doc, target) {
	var rtn = this._orgCreateTreeDisplayer(doc, target);
	if(this._grid.usecustomexpr && this._subComp && this._subComp._text_ctrl) {
		var datarow = this._getDataRow();
		var usedecorate = this._refinfo._getTreeUseDecorate(datarow);
		this._subComp._text_ctrl.set_usedecorate(usedecorate);
	}
	return rtn;
};
//-------------------------------------------------------	
var _pGridBandInfo = nexacro.GridBandInfo.prototype;
_pGridBandInfo.set_treeusedecorate = function (val) {
	this.treeusedecorate = val;

	if (this._bandctrl) {
		this._bandctrl.set_treeusedecorate(val);
	}
};

var _pCellInfo = nexacro.CellInfo.prototype;
_pCellInfo._property_map_readtext = [["treeusedecorate", "treeusedecorate", false, null, true], ["exprtextbackgroundcolor", null, true, undefined, false], ["exprtextcolor", null, true, undefined, false], ["exprtextfont", null, true, undefined, false], ["exprbuttonbackgroundcolor", null, true, undefined, false], ["exprbuttonborder", null, true, undefined, false]
];	

_pCellInfo._getTreeUseDecorate = function (rowidx) {
	var treeusedecorate = this._getAttrValue(this.treeusedecorate, rowidx);
	return treeusedecorate;
};
_pCellInfo._getReadTextBackColor = function (rowidx) {
	var color = this._getAttrValue(this.exprtextbackgroundcolor, rowidx);
	return color;
};	

_pCellInfo._getReadTextColor = function (rowidx) {
	var color = this._getAttrValue(this.exprtextcolor, rowidx);
	return color;
};	

_pCellInfo._getReadTextFont = function (rowidx) {
	var font = this._getAttrValue(this.exprtextfont, rowidx);
	return font;
};	

_pCellInfo._getButtonBackColor = function (rowidx) {
	var color = this._getAttrValue(this.exprbuttonbackgroundcolor, rowidx);
	return color;
};
_pCellInfo._getButtonBorder = function (rowidx) {
	var border = this._getAttrValue(this.exprbuttonborder, rowidx);
	return border;
};
var _pGridCellInfo = nexacro.GridCellInfo.prototype;
_pGridCellInfo._addPropertyMap("_pGridCellInfo", _pCellInfo._property_map_readtext);

pCellControl.originalOn_apply_text = pCellControl.on_apply_text;
pCellControl.on_apply_text = function () {
	this.originalOn_apply_text();
	if(this._grid){
		if(this._grid.usecustomexpr) {
			var text_elem = this._text_elem;
			if (text_elem && text_elem.handle) {
				var cellinfo = this._refinfo;
				var datarow = this._getDataRow();
				var bkcolor = cellinfo._getReadTextBackColor(datarow);
				if(bkcolor) {
					this.set_background(bkcolor);
				}
				var color = cellinfo._getReadTextColor(datarow);
				if(color) {
					this.set_color(color);
				}
				var font = cellinfo._getReadTextFont(datarow);
				if(font) {
					this.set_font(font);
				}
			}
		}
	}
};
var _pCellButton = nexacro._CellButtonControl.prototype;
_pCellButton._originalSetProperty = _pCellButton._setProperty;
_pCellButton._setProperty = function (onlycontrolprop) {
	var rtn = this._originalSetProperty(onlycontrolprop);
	if(this._grid){
		if(this._grid.usecustomexpr) {
			var cellinfo = this._cellinfo;
			if(cellinfo && this.parent._getDataRow) {
				var datarow = this.parent._getDataRow();
				var bkcolor = cellinfo._getButtonBackColor(datarow);
				if(bkcolor) {
					this.set_background(bkcolor);
				}
				var border = cellinfo._getButtonBorder(datarow);
				if(border) {
					this.set_border(border);
				}
			}
		}
	}
	return rtn;
};

pGrid = null;
