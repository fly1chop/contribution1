/**
*  devPack Library
*  @FileName 	File.js 
*  @Creator 	TOBESOFT
*  @CreateDate 	2020.11.24
*  @Desction   
************** 소스 수정 이력 ***********************************************
*  date          		Modifier                Description
*******************************************************************************
* 2020.11.24			TOBESOFT				File Library
*******************************************************************************
*/

var pForm = nexacro.Form.prototype;

pForm.gfnDownTempate = function (sFileId)
{
	var sFileId 	= sFileId;
	var sFileNm 	= sFileId;
	var sSaveFileNm = sFileId;
	
	var sFdt = "fdtCmmTemplate";
	var oFdt = this.objects[sFdt]; 
	if( this.gfnIsNull(oFdt)){
		oFdt = new nexacro.FileDownTransfer(sFdt, this);
		this.addChild(sFdt, oFdt);
	}
	oFdt.addEventHandler("onerror", this.fdtCmmTemplate_onerror, this);
	oFdt.addEventHandler("onsuccess", this.fdtCmmTemplate_onsuccess, this);
	
	
	if( !this.gfnIsNull(sFileId)){
		oFdt.setPostData("saveFileName"	, sSaveFileNm);
		oFdt.setPostData("orgFileName"	, sFileNm);
		
		oFdt.set_downloadfilename(sFileNm)
		oFdt.download("svcUrl::fileDownload.do");
	}else{
		this.gfnAlert("msg.err.nofile");
		return;
	}
};

//파일다운로드트랜스퍼 온에러
pForm.fdtCmmTemplate_onerror = function(obj,e)
{
	var oFdt = this.removeChild(obj.name);
	oFdt.destroy();
	oFdt = null;
	
	this.gfnAlert("msg.action.fail");
	
};

//파일다운로드트랜스퍼 온서세스
pForm.fdtCmmTemplate_onsuccess = function(obj,e)
{
	var oFdt = this.removeChild(obj.name);
	oFdt.destroy();
	oFdt = null;
};


pForm = null;