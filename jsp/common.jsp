<%@ page contentType="Text/html; charset=EUC-KR" %>
<%@ page language="java"%>
<%@ page import="com.tobesoft.platform.*" %>
<%@ page import="com.tobesoft.platform.data.*" %>
<%@ page import="com.tobesoft.platform.util.*"%>
<%@ page import="java.io.*" %>
<%@ page import="java.util.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.math.*" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="javax.servlet.http.*"%>
<%@ page import="sun.misc.BASE64Encoder" %>
<%@ page import="sun.misc.BASE64Decoder" %>

<%

	PreparedStatement pstmt= null;
	ResultSet rs = null;
	int rvalue=-1;

	Connection conn = null; //connDB();

%>

<%!
String Insert_Sql = null;
String Update_Sql = null;
String Delete_Sql = null;

PlatformData in_data = null;

public String default_charset = "EUC-KR";
public int default_encode_method = PlatformRequest.XML;  // XML ZLIB_COMP

public VariableList in_vl = null;
public DatasetList  in_dl = null;

public VariableList out_vl = null;
public DatasetList  out_dl = null;


public Connection connDB_MSSQL()
{ 
	String db_driver, db_url;
	
	db_driver = "";
	db_url = "";
	
  db_driver= "org.mariadb.jdbc.Driver";
	db_url= "jdbc:mariadb://localhost:3306/contribution?autoReconnect=true";
	
  String db_user     = "contribution";
	String db_password = "tech@0701"; 

	Connection dbcon = null; 
	
	
	try{ 
		Class.forName(db_driver); 
		System.out.println("\nClass 체크 통과.... "); 
	}catch(ClassNotFoundException e){ 
	  dbcon = null;
		System.out.println("JDBC 드라이버를 찾을 수 없습니다." + e.toString()); 
		return dbcon;
	}
	
	try{ 
		dbcon = DriverManager.getConnection(db_url,db_user,db_password); 
		System.out.println("\n통과.... 1"); 
		System.out.println("ERP 연결성공"); 
	}catch(Exception e){ 
	  //System.out.println(e + "\n");
		System.out.println("MSSQL DB에 연결할 수 없습니다.\n" + e.toString()); 
		dbcon = null;
	}finally{ 
		return dbcon;
	} 
	
	//System.out.println("\n통과.... 2"); 

}


public void setResultMessage(int code, String msg) 
{ 
	if (this.out_vl == null)
	    this.out_vl = new VariableList();
	
	this.out_vl.addVariable("ErrorCode", new Variant(code));
	this.out_vl.addVariable("ErrorMsg", new Variant(msg));
}

public void setResultMessage2(String code, String msg) 
{ 
	if (this.out_vl == null)
	    this.out_vl = new VariableList();
	
	this.out_vl.addVariable("ErrorCode", new Variant(code));
	this.out_vl.addVariable("ErrorMsg", new Variant(msg));
}

//public void setUserResultMessage(String name, int code, String msg) 
public void setUserResultMessage(String name, String msg) 
{ 
	if (this.out_vl == null)
	    this.out_vl = new VariableList();
	
	this.out_vl.addVariable(name, new Variant(msg));
}

public void proc_input(HttpServletRequest request) throws ServletException, IOException 
{
	PlatformRequest platformRequest = new PlatformRequest(request, default_charset);
	
	platformRequest.receiveData();

	in_data = platformRequest.getPlatformData();
	
//System.out.println(in_data.toString());
	this.default_charset = platformRequest.getCharset();

	this.in_vl = platformRequest.getVariableList();
	this.in_dl = platformRequest.getDatasetList();
}

public void proc_output(HttpServletResponse response,JspWriter out)  throws ServletException, IOException 
{
	PlatformResponse platformResponse = new PlatformResponse(response, default_encode_method, default_charset);

	if (this.out_vl == null)
	    this.out_vl = new VariableList();

	if (this.out_dl == null)
	    this.out_dl = new DatasetList();

	out.clearBuffer();
	platformResponse.sendData(this.out_vl, this.out_dl);

}

public Dataset makeDataSet(ResultSet rs,String strDataSet)  throws ServletException, Exception 
{
	Dataset ds = new Dataset(strDataSet,default_charset);
	ds.setUpdate(false);

	ResultSetMetaData rsmd = rs.getMetaData();
	int numberOfColumns = rsmd.getColumnCount();
	int ColSize, ColType;
	String Colnm;
	
/*
System.out.println(">>> NUMERIC " + Types.NUMERIC);
System.out.println(">>> DOUBLE " + Types.DOUBLE);
System.out.println(">>> VARCHAR " + Types.VARCHAR);
System.out.println(">>> DATE " + Types.DATE);
System.out.println(">>> INT " + Types.INTEGER);
*/
	for ( int j = 1 ; j <= numberOfColumns ; j++ )
	{
		//Colnm = rsmd.getColumnName(j);
		Colnm = rsmd.getColumnLabel(j);
		ColType = rsmd.getColumnType(j);
		ColSize = rsmd.getColumnDisplaySize(j);
		
		if ( ColType == Types.NUMERIC || ColType == Types.DOUBLE )
		{
			ds.addColumn(Colnm, ColumnInfo.CY_COLINFO_DECIMAL,ColSize);
		}
		else if ( ColType == Types.VARCHAR )
		{	
			ds.addColumn(Colnm, ColumnInfo.CY_COLINFO_STRING,ColSize);       
		}        
		else if ( ColType == Types.DATE )
		{
			//ds.addColumn(Colnm, ColumnInfo.CY_COLINFO_DATE,ColSize);       
			ds.addColumn(Colnm, ColumnInfo.CY_COLINFO_STRING,20);       
		}        
		else if ( ColType == Types.INTEGER )
		{
			ds.addColumn(Colnm, ColumnInfo.CY_COLINFO_INT,ColSize);       
		}        
	  //else if ( ColType == -1 )
		//{
		//	ds.addColumn(Colnm, ColumnInfo.CY_COLINFO_BLOB, 2000 );       
		//}
		else
		{
			ds.addColumn(Colnm, ColumnInfo.CY_COLINFO_STRING,ColSize);
		}        
		
		//System.out.println(">>> ColType " + Colnm + " : "  + ColType);
	}
	
	int Row = 0;
	int i;
	
	String Coldata;
	
	//try {	
	
  	while(rs.next()){
  	
  		Row = ds.appendRow();
  		
  		//System.out.println(">>> Row " + Row );
  		
  		for ( i = 0 ; i < numberOfColumns ; i++ )
  		{
  		  //Colnm = ds.getColumnID(i);
  		  Colnm = rsmd.getColumnName(i+1);
  		  ColType = rsmd.getColumnType(i+1);
  		  
  		  if ( ColType == Types.DATE )
  		  {
  		    //System.out.println(">>> i " + i + " : " + Colnm +"##data[" + rs.getDate(Colnm) +"]"  );
  		    //ds.setColumn(Row,Colnm, new Variant( rs.getDate(Colnm) ));
  		    ds.setColumn(Row,Colnm, new Variant( rs.getDate(Colnm).toString() ));
  		  } else
  		  {
  		    Coldata = rsGet(rs, Colnm);
  		    ds.setColumn(Row,Colnm, new Variant( Coldata ));
  		  }
  		  //System.out.println(">>> i " + i + " : " + Colnm +"##data[" + Coldata +"]"  );
    		//ds.setColumn(Row,Colnm, new Variant( Coldata ));
  		}
  	}
	//} catch(Exception ex) {
  //	System.out.println(">>> Exception " + ex.toString() );
  //  this.setResultMessage(-11, ex.toString());
  //}
	
	return ds;
}


public void makeDataSet_Csv(ResultSet rs, String strDataSet, JspWriter out)  throws ServletException, Exception 
{
	
	ResultSetMetaData rsmd = rs.getMetaData();
	int numberOfColumns = rsmd.getColumnCount();
		
	int i, j;
  
  String head = "";
  
  int ColSize, ColType;
	String Colnm, strSize = "";
	
	for ( j = 1 ; j <= numberOfColumns ; j++ )
	{
		
		Colnm = rsmd.getColumnName(j);
		ColType = rsmd.getColumnType(j);
		
		ColSize = rsmd.getColumnDisplaySize(j);
		//strSize = Integer.toString(rsmd.getColumnDisplaySize(j));
		
		if ( ColType == Types.NUMERIC || ColType == Types.DOUBLE )
		{
			head += Colnm + ":DECIMAL(" + ColSize + "),";
		}
		else if ( ColType == Types.VARCHAR )
		{	
			head += Colnm + ":STRING(" + ColSize + "),";
		}        
		else if ( ColType == Types.DATE )
		{
			//head += Colnm + ":DATE(" + ColSize + "),";
			head += Colnm + ":STRING(22),";
		}        
		else if ( ColType == Types.INTEGER )
		{
			head += Colnm + ":INT(" + ColSize + "),";
		}
		else
		{
			head += Colnm + ":STRING(" + ColSize + "),";
		}
		
	}
	
	out.write("CSV:euc-kr\n");
	out.write("Dataset:" + strDataSet + "\n");
	
	head += "\n";
	out.write(head);
	
	String Coldata;
	
	while(rs.next()) 
	{
		String data = "";

		for ( i = 1 ; i <= numberOfColumns ; i++)
		{
		  Colnm = rsmd.getColumnName(i);
		  ColType = rsmd.getColumnType(i);
		  
		  if ( ColType == Types.DATE )
		  {
		    //ds.setColumn(Row,Colnm, new Variant( rs.getDate(Colnm) ));
		    data += "\"" + rs.getDate(Colnm).toString() + "\",";
		  } else
		  {
		    Coldata = rsGet(rs, Colnm);
		    data += "\"" + Coldata + "\",";
		  }
		}
		data += "\n";
		
		
		out.write(data);
	}
	
	out.flush();
	out.close();
	
}

public String  rsGet(ResultSet rs, String id) throws Exception
{
  try{
		return rs.getString(id);
	}catch(Exception e){
		 return "";
	}
}

public String checkNullString(String str)  
{
	//if ( str == null || str == "") str = "null";
	if ( str == null || str == "") str = "''";
	else str = "'" + str + "'";
	return str;
}

public String checkNullNumber(String str)  
{
	if ( str == null || str == "") str = "null";
	
	return str;
}

/*
		for ( int j = 0 ; j < in_ds.getColumnCount() ; j++ ) 
		{
System.out.println(in_ds.getColumnID(j) + " : " + in_ds.getColumn(i,in_ds.getColumnID(j)).getString());			
		}	
*/


public void procSql(String strInDs,Connection conn,PreparedStatement pstmt)  throws ServletException, Exception 
{
  /*
	Dataset in_ds = in_dl.getDataset(strInDs);

	int RowCnt = in_ds.getRowCount();
	int i;
	String RowStatus;
	
	RowCnt = in_ds.getDeleteRowCount();

	for ( i = 0 ; i < RowCnt ; i++ )
	{
		pstmt = DefaultService.createStatementFromOrg(conn, in_data, Delete_Sql, strInDs, i);
		pstmt.executeUpdate();
	}

	RowCnt = in_ds.getRowCount();

	for ( i = 0 ; i < RowCnt ; i++ )
	{
		RowStatus = in_ds.getRowStatus(i);
		
		if ( RowStatus.equals("insert") )
		{ 
				pstmt = DefaultService.createStatement(conn, in_data, Insert_Sql,strInDs, i);
				pstmt.executeUpdate();
		}
		else if ( RowStatus.equals("update") )
		{
				pstmt = DefaultService.createStatement(conn, in_data, Update_Sql,strInDs, i);
				pstmt.executeUpdate();
		}
		
	}
	*/
}


public static String toKorean(String str) { 
   try { 
       return new String(str.getBytes("Cp1252"), "EUC_KR"); 
   } catch (UnsupportedEncodingException e) { 
       return null; 
   } 
} 

public static String toKorean1(String str) { 
   try { 
       return new String(str.getBytes("UTF8"), "UTF8"); 
   } catch (UnsupportedEncodingException e) { 
       return null; 
   } 
} 

%>
