<%@ include file = "./common.jsp" %>


<%
	this.proc_input(request);  
	
	this.out_vl = new VariableList();
	this.out_dl = new DatasetList();  
  
  Dataset ds_out = null;
  
  String strWorkGu = "";
  
  String strYear, strMonth;
  String strName, strbgu1, strbgu2;
  
  strYear = strMonth = strName = "";
  
  
  if(in_vl !=null){
  
    // 필수 구분자
    strWorkGu = in_vl.getValueAsString("workgu");
    
    // Query 조건 인자
  	//strYear   = in_vl.getValueAsString("bYear");
  	//strMonth   = in_vl.getValueAsString("bMonth");
  	strName   = in_vl.getValueAsString("bName");
  	strbgu1   = in_vl.getValueAsString("bGu1");
  	strbgu2   = in_vl.getValueAsString("bGu2");
    
  } else{
		//System.out.println("in_vl:"+in_vl);
		strYear = "";
		strName = "";
		strbgu1 = strbgu2 = strMonth = "";
	}
	
	strWorkGu = "find";
	
	try {	
	
	  conn = connDB_MSSQL();
	  
		if(conn!=null)
		{
			
			
			if ( strWorkGu.equals("find") )
      {
	      //System.out.println("function Query1 _____________ : "  + strSlipDate);
	      
	      ds_out = fn_list( conn, strName, strbgu1, strbgu2 );
	      this.out_dl.addDataset("DS_LIST", ds_out );
	      
	      //ds_out = col_dict_list( conn, strPrj );
	      //this.out_dl.addDataset("DS_COL_DICT", ds_out );
	      
	    } else if ( strWorkGu.equals("PRJ_SUB") )
      {
	      //System.out.println("function Query1 _____________ : "  + strSlipDate);
	      
	      //ds_out = prj_list( conn );
	      //this.out_dl.addDataset("DS_CODE_PRJ", ds_out );
	      //ds_out = prj_sub_list( conn, strPrj );
	      //this.out_dl.addDataset("DS_CODE_SUB", ds_out );
	      
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


// 테이블 리스트 조회
public Dataset fn_list(Connection conn, String strName, String strbgu1, String strbgu2 )
{
  PreparedStatement pstmt = null;
  ResultSet rs = null;
  Dataset ds = null;
  
	StringBuffer sbSql = new StringBuffer();
	
	//sbSql.append("SELECT '0' as chk, *   ");
	//sbSql.append("  FROM backer_member a  ");
	//sbSql.append(" WHERE a.b_gu LIKE '" + strbgu1 + "'  ");
	//sbSql.append("   AND a.b_name LIKE '" + strName + "%'  ");
  //sbSql.append(" ORDER BY a.b_no  ");


	sbSql.append("\n SELECT '0' chk,   ");
	sbSql.append("\n        substring(b_no,1,2) + '-' + substring(b_no,3,5) + case b_gu when '18' then ' L' else '' end as b_no,  ");
	sbSql.append("\n        b_name + CASE ifnull(baptismal_name,'') WHEN '' THEN '' ELSE '( ' + baptismal_name + ' )' END + '  님' as b_name,   ");
	sbSql.append("\n        substring(b_post,1,3) + ' - ' + SUBSTRING(b_post,4,3) as b_post,  ");
	sbSql.append("\n        b_address,  ");
	sbSql.append("\n        b_gu,  ");
	sbSql.append("\n        b_gu2,  ");
	sbSql.append("\n        b_address_new    ");
	/*
	sbSql.append("       --b_no,  ");
	sbSql.append("       --b_name,  ");
	sbSql.append("       --baptismal_name,  ");
	sbSql.append("       in_date,  ");
	sbSql.append("       out_date,  ");
	sbSql.append("       b_tel1,  ");
	sbSql.append("       b_tel2,  ");
	sbSql.append("       baptismal_date,  ");
	sbSql.append("       --b_post,  ");
	sbSql.append("       --b_address,  ");
	sbSql.append("       b_desc,  ");
	sbSql.append("       b_make_amt,  ");
	*/
	sbSql.append("  FROM backer_member  ");
	sbSql.append(" WHERE b_gu like '" + strbgu1 + "'  ");
	sbSql.append("   AND ifnull(b_gu2,'') like '" + strbgu2 + "'  ");
	sbSql.append("   AND b_name LIKE '%" + strName + "%'  ");
  sbSql.append(" ORDER BY b_no  ");
   
  System.out.println(sbSql.toString());
  
  try {	
  	pstmt = conn.prepareStatement(toKorean(sbSql.toString()));
  	rs = pstmt.executeQuery();
  	
    ds = makeDataSet(rs,"output");
  	
  } catch(Exception ex) {
    this.setResultMessage(-1, ex.toString());
  }
	  
  return ds;
}

%>
