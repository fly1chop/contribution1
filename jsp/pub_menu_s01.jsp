<%@ include file = "./common.jsp" %>


<%
	this.proc_input(request);  
	
	this.out_vl = new VariableList();
	this.out_dl = new DatasetList();  

  Dataset ds_out = null;

  String strWorkGu = "";
  
  if(in_vl !=null){
  
    // 필수 구분자
    strWorkGu = in_vl.getValueAsString("workgu");
    
  } else{
		//System.out.println("in_vl:"+in_vl);
		strWorkGu = "";
	}
	
	try {	
	
	  conn = connDB_MSSQL();
	  
	  //strWorkGu = "menu";
	  
		if(conn!=null){
			
			
			if ( strWorkGu.equals("find") )
      {
	      //System.out.println("function Query1 _____________ : "  + strSlipDate);
	      ds_out = menu_list( conn );
	      this.out_dl.addDataset("DS_MENU", ds_out );
	      
	      
	    } else if ( strWorkGu.equals("menu") )
			{
			  ds_out = fn_main_menu( conn );
	      this.out_dl.addDataset("DS_MENU", ds_out );
	      
	      
	      //System.out.println("작업 구분자가 없습니다. ____________" );
			  //this.setResultMessage(-5, "작업 구분자가 없습니다.");
			  //this.proc_output(response,out); 
			  //response.End;
			}
			this.setResultMessage(0, "OK");
		} else
		{
		  this.setResultMessage(-1, "Connect fail....");
		}
		
	
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

// 메뉴 조회
public Dataset menu_list(Connection conn)
{
  PreparedStatement pstmt = null;
  ResultSet rs = null;
  Dataset ds = null;
  
	StringBuffer sbSql = new StringBuffer();
	
	
	sbSql.append("\n SELECT m_id, m_id as m_id_org, m_level, m_name, m_desc, m_pageid, m_prefix, ");
	sbSql.append("\n        m_enable, m_icon, m_useyn, m_date, m_gu, m_sort,  ");
	sbSql.append("\n        m_word, m_preid,                           ");
	sbSql.append("\n        ifnull(m_btn_auth,'0000000') as m_btn_auth,       ");
	sbSql.append("\n        ifnull(substring(m_btn_auth,1,1),'0') as m_btn1,  ");
	sbSql.append("\n        ifnull(substring(m_btn_auth,2,1),'0') as m_btn2,  ");
	sbSql.append("\n        ifnull(substring(m_btn_auth,3,1),'0') as m_btn3,  ");
	sbSql.append("\n        ifnull(substring(m_btn_auth,4,1),'0') as m_btn4,  ");
	sbSql.append("\n        ifnull(substring(m_btn_auth,5,1),'0') as m_btn5,  ");
	sbSql.append("\n        ifnull(substring(m_btn_auth,6,1),'0') as m_btn6,  ");
	sbSql.append("\n        ifnull(substring(m_btn_auth,7,1),'0') as m_btn7   ");
	sbSql.append("\n   FROM pub_menu  ");
  sbSql.append("\n  ORDER BY m_id    ");
  
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


// 사용 메뉴 조회
public Dataset fn_main_menu(Connection conn)
{
  PreparedStatement pstmt = null;
  ResultSet rs = null;
  Dataset ds = null;
  
	StringBuffer sbSql = new StringBuffer();
	
	
	sbSql.append("\n SELECT m_id, m_id as m_id_org, m_level, m_name, m_desc, m_pageid, m_prefix, ");
	sbSql.append("\n        m_enable, m_icon, m_useyn, m_date, m_gu, m_sort,  ");
	sbSql.append("\n        m_word, m_preid,                                  ");
	sbSql.append("\n        ifnull(m_btn_auth,'0000000') as m_btn_auth        ");
	sbSql.append("\n   FROM pub_menu  ");
	sbSql.append("\n  WHERE m_useyn = '1' ");
  sbSql.append("\n  ORDER BY m_id    ");
  
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
