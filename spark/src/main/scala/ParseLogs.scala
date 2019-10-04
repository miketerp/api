import org.apache.spark.sql.SparkSession

object ParseLogs {
  case class Logs(
    method:String, 
    ipAddr:String, 
    urlPath:String, 
    queryParams:String, 
    userAgent:String
  )
  
  def main(args: Array[String]) {
    if (args.length < 2) {
      System.err.println("Please check arguments!");
      System.exit(1);
    }

    val sparkSession = SparkSession.builder.getOrCreate()
    import sparkSession.implicits._
    sparkSession.sparkContext.setLogLevel("WARN")
    
    val logs = sparkSession.read.textFile(args(0))
    val trimmed = logs.filter(x => !x.isEmpty)
      .map((x) => x.split("\\|"))
      .map(x => Logs(x(1),x(2),x(3),x(4),x(5))).toDF
      .write.parquet(args(1))
    
    sparkSession.stop()
  }
}
