<%@ include file = "./common.jsp" %>


<%
	this.proc_input(request);  
	
	this.out_vl = new VariableList();
	this.out_dl = new DatasetList();  
  
  Dataset ds_out = null;
  
  String strWorkGu = "";
  String strbgu1, strbgu2, strbgname;
  
  
  if(in_vl !=null){
  
    // 필수 구분자
    strWorkGu = in_vl.getValueAsString("workgu");
    
    // Query 조건 인자
  	strbgu1   = in_vl.getValueAsString("bGu1");
  	strbgu2   = in_vl.getValueAsString("bGu2");
  	strbgname   = in_vl.getValueAsString("bName");
    
  } else{
		//System.out.println("in_vl:"+in_vl);
		strbgu1 = strbgu2 = strbgname = "";
	}
	
	//strWorkGu = "init";
	
	try {	
	
	  conn = connDB_MSSQL();
	  
		if(conn!=null)
		{
			
			if ( strWorkGu.equals("find") )
      {
	      //System.out.println("function Query1 _____________ : "  + strSlipDate);
	      
	      ds_out = fn_list( conn, strbgu1, strbgu2, strbgname );
	      this.out_dl.addDataset("DS_LIST", ds_out );
	      
	    } else if ( strWorkGu.equals("init") )
      {
	      //System.out.println("function Query1 _____________ : "  + strSlipDate);
	      
	      ds_out = com_code(conn, "1002" );
	      this.out_dl.addDataset("ds_gu", ds_out );
	      ds_out = com_code(conn, "1003" );
	      this.out_dl.addDataset("ds_gu2", ds_out );
	      
	      ds_out = fn_notice(conn);
	      this.out_dl.addDataset("ds_notice", ds_out );
	      
	    } else if ( strWorkGu.equals("max") )
      {
	      //System.out.println("function Query1 _____________ : "  + strSlipDate);
	      
	      ds_out = fn_max_no( conn );
	      this.out_dl.addDataset("ds_no", ds_out );
	      
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


// 후원자 리스트 조회
public Dataset fn_list(Connection conn, String strbgu1, String strbgu2, String strbgname )
{
  PreparedStatement pstmt = null;
  ResultSet rs = null;
  Dataset ds = null;
  
	StringBuffer sbSql = new StringBuffer();
	
	sbSql.append("SELECT *   ");
	sbSql.append("  FROM backer_member  ");
	sbSql.append(" WHERE b_gu like '" + strbgu1 + "'  ");
	sbSql.append("   AND isNull(b_gu2) like '" + strbgu2 + "'  ");
	sbSql.append("   AND b_name LIKE '%" + strbgname + "%'  ");
  sbSql.append(" ORDER BY b_no  ");
    
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


// 후원자 Max 조회
public Dataset fn_max_no(Connection conn )
{
  PreparedStatement pstmt = null;
  ResultSet rs = null;
  Dataset ds = null;
  
	StringBuffer sbSql = new StringBuffer();
	
	sbSql.append("SELECT Max(b_no) as b_no  ");
	sbSql.append("  FROM backer_member  ");
	//sbSql.append(" GROUP BY b_no  ");
    
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


// 공지사항 조회
public Dataset fn_notice(Connection conn )
{
  PreparedStatement pstmt = null;
  ResultSet rs = null;
  Dataset ds = null;
  
	StringBuffer sbSql = new StringBuffer();
	
	sbSql.append("SELECT seq, notice, write_date, use_chk   ");
	sbSql.append("  FROM backer_notice a  ");
	sbSql.append(" WHERE a.use_chk = '1'  ");
  
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
