<%@ include file = "./common.jsp" %>
<%
	this.proc_input(request);
	
	this.out_vl = new VariableList();
	this.out_dl = new DatasetList();
  
	Dataset inds_menu = in_dl.getDataset("ds_notice");
	
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
  			sql  = "DELETE FROM backer_notice ";
  			sql += "      WHERE seq   = " + checkNullString(inds_menu.getDeleteColumn(i,"seq").getString());
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
  			
  				sbSql.append("\n INSERT INTO backer_notice ( title, notice, write_date, use_chk ) ");
  				sbSql.append("\n      VALUES ( " + checkNullString(inds_menu.getColumn(i,"title").getString())  + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_menu.getColumn(i,"notice").getString())  + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_menu.getColumn(i,"write_date").getString())  + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_menu.getColumn(i,"use_chk").getString())   + "    ");
  				sbSql.append("\n             )                                                                            ");
  				
  			}
  			else if ( RowStatus.equals("update") )
  			{
  				sbSql.append("\n UPDATE backer_notice                                                                              ");
  				sbSql.append("\n    SET title     = " + checkNullString(inds_menu.getColumn(i,"title").getString())  + ",    ");
  				sbSql.append("\n        notice    = " + checkNullString(inds_menu.getColumn(i,"notice").getString())  + ",    ");
  				sbSql.append("\n        write_date   = " + checkNullString(inds_menu.getColumn(i,"write_date").getString())  + ",    ");
  				sbSql.append("\n        use_chk    = " + checkNullString(inds_menu.getColumn(i,"use_chk").getString())   + "    ");
  				sbSql.append("\n  WHERE seq      = " + checkNullString(inds_menu.getColumnAsString(i,"seq"))     + "     ");
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
