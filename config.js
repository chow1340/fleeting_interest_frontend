const development = "android"

//This is set to the ip of which I am running the python server
/*RUN COMMAND: 

ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' 

TO GET YOUR PRIMARY ADDRESS.
*/
if(development=="android"){
    global.server = "http://192.168.2.40:5000" //primary address
}

global.s3Endpoint = "https://app-jeffrey-chow.s3.ca-central-1.amazonaws.com/"

//Styling
global.primaryColor = "#F78E1E"