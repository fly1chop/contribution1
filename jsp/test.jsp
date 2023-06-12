<%@ page language="java"%>
<%@ page import="com.nexacro.java.xapi.data.*" %>
<%@ page import="com.nexacro.java.xapi.tx.*" %>
<%@ page import="java.io.*" %>
<%@ page import="java.util.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.math.*" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="javax.servlet.http.*"%>
<%@ page import="sun.misc.BASE64Encoder" %>
<%@ page import="sun.misc.BASE64Decoder" %>

<%@ page contentType="text/xml; charset=UTF-8" %>

<% 
out.clearBuffer();

HttpPlatformRequest req = new HttpPlatformRequest(request);

req.receiveData();

PlatformData reqData = req.getData();
VariableList reqVarList = reqData.getVariableList();

String strWorkGu = reqVarList.getString("workgu");

PlatformData resData = new PlatformData();
VariableList resVarList = resData.getVariableList();
DataSet ds_out = null;

Connection conn = null;
strWorkGu = "find";

int nErrorCode = 0;
String strErrorMsg = "START";

try {
	conn = connDB_MariaDB();
	
	if(conn != null){
		ds_out = fn_notice(conn);
		resData.addDataSet(ds_out);
		nErrorCode = 0;
		strErrorMsg = "SUCCESS";
	}
	
} catch(Exception e) {
    nErrorCode = -1;
    strErrorMsg = e.getMessage();
}

/******** JDBC Close *******/
if ( conn != null ) try { conn.close(); } catch (Exception e) {}

resVarList.add("ErrorCode", nErrorCode);
resVarList.add("ErrorMsg", strErrorMsg);

HttpPlatformResponse res = new HttpPlatformResponse(response, PlatformType.CONTENT_TYPE_XML,"UTF-8");
res.setData(resData);

// 데이터 송신
res.sendData();


%>

<%!
public Connection connDB_MariaDB()  throws Exception 
{ 
	String db_driver= "org.mariadb.jdbc.Driver";
	String db_url= "jdbc:mariadb://localhost:3306/contribution?autoReconnect=true";
	
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
		System.out.println("DB에 연결할 수 없습니다.\n" + e.toString());
		dbcon = null;
		throw e;
	}finally{ 
		return dbcon;
	} 

}

public DataSet fn_notice(Connection conn )
{
	PreparedStatement pstmt = null;
	ResultSet rs = null;
	DataSet ds = null;
	  
	StringBuffer sbSql = new StringBuffer();
	
	sbSql.append("SELECT seq, title, notice, write_date, use_chk   ");
	sbSql.append("  FROM backer_notice a  ");
	
	System.out.println(sbSql.toString());
  
  try {	
  	pstmt = conn.prepareStatement(sbSql.toString());
  	rs = pstmt.executeQuery();
  	
    ds = makeDataSet(rs,"ds_notice");
  	
  } catch(Exception ex) {
    // this.setResultMessage(-1, ex.toString());
  }
  
  if ( pstmt != null ) try { pstmt.close(); } catch (Exception e) {}
  return ds;
	  
}


public DataSet makeDataSet(ResultSet rs, String strDsId) throws ServletException, Exception 
{
	DataSet ds = new DataSet(strDsId);
	
	ResultSetMetaData rsmd = rs.getMetaData();
	int numberOfColumns = rsmd.getColumnCount();
	int ColSize, ColType;
	String Colnm;
	
	// column 추가
	for(int i=1; i<=numberOfColumns; i++){
		Colnm = rsmd.getColumnLabel(i);
		ColType = rsmd.getColumnType(i);
		ColSize = rsmd.getColumnDisplaySize(i);
		
		if ( ColType == Types.NUMERIC || ColType == Types.DOUBLE )
		{
			ds.addColumn(Colnm, DataTypes.DOUBLE, ColSize);
		}
		else if ( ColType == Types.VARCHAR )
		{	
			ds.addColumn(Colnm, DataTypes.STRING, ColSize);       
		}        
		else if ( ColType == Types.DATE )
		{   
			ds.addColumn(Colnm, DataTypes.STRING, 20);       
		}        
		else if ( ColType == Types.INTEGER )
		{
			ds.addColumn(Colnm, DataTypes.INT, ColSize);       
		}        
		else
		{
			ds.addColumn(Colnm, DataTypes.STRING, ColSize);
		}     
	}
	
	int Row;
	int i;
	
	String Coldata;
	
  	while(rs.next()){
  	
  		Row = ds.newRow();
  		
  		for ( i = 0 ; i < numberOfColumns ; i++ )
  		{
  		  Colnm = rsmd.getColumnName(i+1);
  		  ColType = rsmd.getColumnType(i+1);
  		  
  		  if ( ColType == Types.DATE )
  		  {
  		    ds.set(Row,Colnm, rs.getDate(Colnm).toString());
  		  } else
  		  {
  		    ds.set(Row,Colnm, rs.getString(Colnm));
  		  }
  		}
  	}
	
	return ds;
}
%>