<%@ include file = "./common.jsp" %>


<%
	this.proc_input(request);
	
	this.out_vl = new VariableList();
	this.out_dl = new DatasetList();  
  
  Dataset ds_out = null;
  String strWorkGu = "";
  
  String strKind;
  
  
  if(in_vl !=null){
  
    // 필수 구분자
    strWorkGu = in_vl.getValueAsString("workgu");
    
    // Query 조건 인자
  	strKind   = in_vl.getValueAsString("kind");
  	
  	
  	System.out.println("getValueAsString : " + strWorkGu + " / " + strKind );
    
    //http://localhost/miplatform/jspSrc/TobeDemo_mdi1/m_codelist_s01.jsp?workgu=COM_CODE&kind=0000
    
    
  } else{
		System.out.println("in_vl:"+in_vl);
		
		strKind = "";
	}
	
	strWorkGu = "init";
	
	try {	
	
	  conn = connDB_MSSQL();
	  
		if(conn!=null){
			
			
			if ( strWorkGu.equals("init") )
      {
	      //System.out.println("function Query1 _____________ : "  + strSlipDate);
	      
	      ds_out = com_code( conn, strKind );
	      this.out_dl.addDataset("ds_Code", ds_out );
	      
  			
			} else
			{
	      System.out.println("작업 구분자가 없습니다. ____________" );
			  //this.setResultMessage(-5, "작업 구분자가 없습니다.");
			  //this.proc_output(response,out); 
			  //response.End;
			}
			
		}
		this.setResultMessage(0, "OK");
	
	} catch(Exception ex) {
    this.setResultMessage(-1, ex.toString());
	} finally {
		if(rs != null) {
			try {
				rs.close();
			}catch(Exception e) {}
		}
		if(pstmt != null) {
			try {
				pstmt.close();
			}catch(Exception e) {}
		}
		if(conn != null) {
			try {
				conn.close();
			}catch(Exception e) {}
		}
	}
    this.proc_output(response,out); 
%>



<%! 

// 공통 코드
public Dataset com_code(Connection conn, String strComCode )
{
  PreparedStatement pstmt = null;
  ResultSet rs = null;
  Dataset ds = null;
  
	StringBuffer sbSql = new StringBuffer();
	
	sbSql.append("SELECT * FROM pub_code   ");
  sbSql.append(" WHERE com_kind             = '" + strComCode + "' ");
    
  System.out.println(sbSql.toString());
  
  try {	
  	pstmt = conn.prepareStatement(sbSql.toString());
  	rs = pstmt.executeQuery();
  	
    ds = makeDataSet(rs,"output");
  	
  } catch(Exception ex) {
    this.setResultMessage(-1, ex.toString());
  }
	  
  return ds;
}

%>
