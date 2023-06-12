<%@ include file = "./common.jsp" %>


<%
	this.proc_input(request);  
	
	this.out_vl = new VariableList();
	this.out_dl = new DatasetList();  
  
  Dataset ds_out = null;
  
  String strWorkGu = "";
  String strname = "";
  String strid, strpw;
  
  if(in_vl !=null){
  
    // 필수 구분자
    strWorkGu = in_vl.getValueAsString("workgu");
    
    // Query 조건 인자
  	strid   = in_vl.getValueAsString("bId");
  	strpw   = in_vl.getValueAsString("bPw");
  	strname   = in_vl.getValueAsString("bName");
    
  } else{
		//System.out.println("in_vl:"+in_vl);
		strid = strpw = strname = "";
	}
	
	//strWorkGu = "find";
	
	try {	
	
	  conn = connDB_MSSQL();
	  
		if(conn!=null)
		{
			
			if ( strWorkGu.equals("find") )
      {
	      //System.out.println("function Query1 _____________ : "  + strSlipDate);
	      
	      ds_out = fn_list( conn, strname );
	      this.out_dl.addDataset("ds_member", ds_out );
	      
	      
	    } else if ( strWorkGu.equals("login") )
      {
	      //System.out.println("function Query1 _____________ : "  + strSlipDate);
	      
	      ds_out = fn_login( conn, strid, strpw );
	      this.out_dl.addDataset("ds_login", ds_out );
	      
	      
	    } else if ( strWorkGu.equals("init") )
      {
	      //System.out.println("function Query1 _____________ : "  + strSlipDate);
	      
	      ds_out = com_code(conn, "1004" );
	      this.out_dl.addDataset("ds_role", ds_out );
	      
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


// 멤버 리스트 조회
public Dataset fn_list(Connection conn, String strName )
{
  PreparedStatement pstmt = null;
  ResultSet rs = null;
  Dataset ds = null;
  
	StringBuffer sbSql = new StringBuffer();
	
	sbSql.append("\n SELECT *   ");
	sbSql.append("\n   FROM pub_member  ");
	sbSql.append("\n  WHERE l_name like '%" + strName + "%'  ");
  sbSql.append("\n  ORDER BY l_id  ");
    
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

// 로그인
public Dataset fn_login(Connection conn, String strId, String strPw )
{
  PreparedStatement pstmt = null;
  ResultSet rs = null;
  Dataset ds = null;
  
	StringBuffer sbSql = new StringBuffer();
	
	sbSql.append("\n SELECT *   ");
	sbSql.append("\n   FROM pub_member  ");
	sbSql.append("\n  WHERE l_id = '" + strId + "'  ");
	sbSql.append("\n    AND l_pw = '" + strPw + "'  ");
    
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
