
args <- commandArgs(T)
if (!is.na(args[1])) {
	str <- as.character(args[1])
	#(str)
}


setwd('C:/Users/xwj/Desktop')
data <- read.table('ip_time.log', sep="\t")
head(data, 40)