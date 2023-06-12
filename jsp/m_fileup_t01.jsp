<%@ page contentType="Text/html; charset=EUC-KR" %>
<%@ include file = "./common.jsp" %>


<%	

  this.proc_input(request);  
	this.out_vl = new VariableList();
	this.out_dl = new DatasetList();  

  Dataset ds_out = null;
  Dataset ds_in_file = null;
  String strWorkGu = "";
  String strFileName;
  
  if(in_vl != null){
  
    // 필수 구분자
    strWorkGu = in_vl.getValueAsString("workgu");
    ds_in_file = in_data.getDatasetList().getDataset("ds_file");
    
    if (ds_in_file == null)
  	{
  		//out_vl.addStr("ErrorCode", "-1");
  		//out_vl.addStr("ErrorMsg","이러시면 곤란합니다. 입력 Dataset을 찾을 수 없습니다.[input]");
  		//platformResponse.sendData(out_vl, out_dl);
  		
  		this.setResultMessage(-1, "이러시면 곤란합니다. 입력 Dataset을 찾을 수 없습니다.[ds_file]");
      this.proc_output(response,out); 
  		return;
  	}
    
  } else{
		//System.out.println("in_vl:"+in_vl);
		strFileName = "";
	}
	
	int irow = ds_in_file.getRowCount();

	int nrow = 0;
	
	/* 기본 설정 */
	
	for (int i = 0 ; i < irow ; i++)
	{
		String filename, prefix;
		//int nRowIdx = dsOut.appendRow();
		
		
		Variant aa;
    System.out.println("filename:" + ds_in_file.getColumn(i, "file_nm") + ", path:" + ds_in_file.getColumn(i, "file_path") + 
	", filesize:" + ds_in_file.getColumn(i, "file_size"));
	
    //		byte[] file = inds.getColumn(i, "content").getBinary();
		byte[] file		= ds_in_file.getColumn(i, "file_obj").getBinary();

    prefix   = ds_in_file.getColumn(i, "menu_prefix").toString();
		filename = ds_in_file.getColumn(i, "file_nm").toString();
    
    System.out.println(">>>>>>>>>>" + file);		
    
		ByteArrayInputStream is = new ByteArrayInputStream(file);

		String filePath = ".";
		
		String confPath = config.getServletContext().getRealPath("/");
		//path = getServletContext().getRealPath("/");
		//filename = path + "AppSrc/Sample2/" + strFileName; //"C:\\TraceLog_MiPlatform.txt";	
		
		filePath = confPath + "AppSrc/Sample2/" + prefix + "/" + filename;
		
		FileOutputStream s = new FileOutputStream(filePath);
    
    System.out.println(filePath);

    //		dsOut.setColumn(nRowIdx, "contents", new String(file));
		
		byte[] in = new byte[(int)file.length];  
		
		int len = 0;  
		int byteData = 0;
		int offset = 0;
		int ch;
		while ((len = is.read(in, offset, in.length)) != -1 );
		len = is.read(in, offset, in.length);
		
		s.write(in);			//서버로 파일 write
		is.close();
		s.close();
	}	
  
  
  this.setResultMessage(0, "OK");
  this.proc_output(response,out); 
%>

