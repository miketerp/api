import org.apache.spark.sql.SparkSession

object ParseLogs {
  case class Logs(method:String, ipAddr:String, urlPath:String, queryParams:String, userAgent:String)
  
  def main(args: Array[String]) {
    if (args.length < 2) {
      System.err.println("Please check arguments!");
      System.exit(1);
    }

    val sparkSession = SparkSession.builder.getOrCreate()
    import sparkSession.implicits._
    sparkSession.sparkContext.setLogLevel("WARN")
    
    // val logs = spark.read.textFile(args(0))
    val logs = sparkSession.read.textFile("/Users/Kim/Desktop/github/api/log/route.log")
    val trimmed = logs.map((x) => x.split("\\|"))
    
    val tableDF = trimmed.map(x => Logs(x(1),x(2),x(3),x(4),x(5))).toDF
    tableDF.write.parquet("/Users/Kim/Desktop/github/api/datasets/web-traffic.parquet")

    sparkSession.stop()  
  }
}
