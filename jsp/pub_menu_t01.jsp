<%@ include file = "./common.jsp" %>
<%
	this.proc_input(request);
	
	this.out_vl = new VariableList();
	this.out_dl = new DatasetList();
  
	//Dataset inds_menu = in_dl.getDataset("ds_menu");
	//Dataset inds_menu = in_dl.getDataset("ds_menu");
	Dataset inds_menu = in_dl.getDataset("ds_menu");
	
	//Statement stmt =  conn.createStatement();
	
	Statement stmt = null;
  
	try 
	{	
		int RowCnt;
		int i;
	  
		String RowStatus;
		String sql          = "";
		StringBuffer sbSql  = null;
		
		//dataset dump ..
		inds_menu.dump();
		
		conn = connDB_MSSQL();
		if(conn!=null){
		  System.out.println("m_menulist_t01.jsp - Conn Success...");
		  stmt =  conn.createStatement();
		  
		  RowCnt = inds_menu.getDeleteRowCount();
  		for ( i = 0 ; i < RowCnt ; i++ )
  		{
  			sql  = "DELETE FROM pub_menu ";
  			sql += "      WHERE M_ID   = " + checkNullString(inds_menu.getDeleteColumn(i,"m_id").getString());
  			stmt.execute(sql);
  		}
      
  		RowCnt = inds_menu.getRowCount();
      
  		for ( i = 0 ; i < RowCnt ; i++ )
  		{
  			RowStatus = inds_menu.getRowStatus(i);
  			sbSql = new StringBuffer();
  			
  			if ( RowStatus.equals("insert") )
  			{
  			
  			  System.out.println("m_menulist_t01.jsp - insert...");
  			
  				sbSql.append("\n INSERT INTO pub_menu ( m_id, m_level, m_name, m_desc, m_pageid, m_prefix, m_enable, m_icon, m_useyn, m_date, m_gu, m_sort, m_word, m_preid, m_btn_auth ) ");
  				sbSql.append("\n      VALUES ( " + checkNullString(inds_menu.getColumn(i,"m_id").getString())  + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_menu.getColumn(i,"m_level").getString())  + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_menu.getColumn(i,"m_name").getString())   + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_menu.getColumn(i,"m_desc").getString())   + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_menu.getColumn(i,"m_pageid").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_menu.getColumn(i,"m_prefix").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_menu.getColumn(i,"m_enable").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_menu.getColumn(i,"m_icon").getString())   + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_menu.getColumn(i,"m_useyn").getString())  + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_menu.getColumn(i,"m_date").getString())  + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_menu.getColumn(i,"m_gu").getString())  + ",    ");
  				sbSql.append("\n               " + inds_menu.getColumn(i,"m_sort").getInteger()  + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_menu.getColumn(i,"m_word").getString())   + ",     ");
  				sbSql.append("\n               " + checkNullString(inds_menu.getColumn(i,"m_preid").getString())   + ",     ");
  				sbSql.append("\n               " + checkNullString(inds_menu.getColumn(i,"m_btn_auth").getString())   + "     ");
  				//sbSql.append("\n               " + checkNullString(inds_menu.getColumn(i,"m_wide").getString())  + "    ");
  				sbSql.append("\n             )                                                                            ");
  				
  			}
  			else if ( RowStatus.equals("update") )
  			{
  				sbSql.append("\n UPDATE pub_menu                                                                              ");
  				sbSql.append("\n    SET m_id   = " + checkNullString(inds_menu.getColumn(i,"m_id").getString())  + ",    ");
  				sbSql.append("\n        m_level   = " + checkNullString(inds_menu.getColumn(i,"m_level").getString())  + ",    ");
  				sbSql.append("\n        m_name    = " + checkNullString(inds_menu.getColumn(i,"m_name").getString())   + ",    ");
  				sbSql.append("\n        m_desc    = " + checkNullString(inds_menu.getColumn(i,"m_desc").getString())   + ",    ");
  				sbSql.append("\n        m_pageid  = " + checkNullString(inds_menu.getColumn(i,"m_pageid").getString()) + ",    ");
  				sbSql.append("\n        m_prefix  = " + checkNullString(inds_menu.getColumn(i,"m_prefix").getString()) + ",    ");
  				sbSql.append("\n        m_enable  = " + checkNullString(inds_menu.getColumn(i,"m_enable").getString()) + ",    ");
  				sbSql.append("\n        m_icon    = " + checkNullString(inds_menu.getColumn(i,"m_icon").getString())   + ",    ");
  				sbSql.append("\n        m_useyn   = " + checkNullString(inds_menu.getColumn(i,"m_useyn").getString())  + ",    ");
  				sbSql.append("\n        m_date    = " + checkNullString(inds_menu.getColumn(i,"m_date").getString())  + ",    ");
  				sbSql.append("\n        m_gu      = " + checkNullString(inds_menu.getColumn(i,"m_gu").getString())  + ",    ");
  				sbSql.append("\n        m_sort    = " + inds_menu.getColumn(i,"m_sort").getInteger()  + ",    ");
  				sbSql.append("\n        m_word    = " + checkNullString(inds_menu.getColumn(i,"m_word").getString())   + ",     ");
  				sbSql.append("\n        m_preid    = " + checkNullString(inds_menu.getColumn(i,"m_preid").getString())   + ",     ");
  				sbSql.append("\n        m_btn_auth = " + checkNullString(inds_menu.getColumn(i,"m_btn_auth").getString())   + "     ");
  				//sbSql.append("\n        m_wide     = " + checkNullString(inds_menu.getColumn(i,"m_wide").getString())   + "     ");
  				sbSql.append("\n  WHERE m_id      = " + checkNullString(inds_menu.getColumn(i,"m_id_org").getString())     + "     ");
  			}
  			
        System.out.println(sbSql.toString());
        
  			stmt.execute(sbSql.toString());
  		}
  		
		}
    
		
	  this.setResultMessage(0, "OK");
		
	} catch(Exception ex) {
      // System.out.println(ex.toString());
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
		if(stmt != null) {
			try {
				stmt.close();
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
