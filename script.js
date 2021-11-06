const dataSet = [ { postcode : "TN9" , delOps : "Delivery from Warehouse"} , 
                  { postcode : 'TN9 1AP' , delOps : "No Deliveries"} ,
                  { postcode : 'TN8' , delOps : "Delivery from Warehouse"} , 
                  { postcode : 'TN11' , delOps : "Delivery from Warehouse"} ,
                  { postcode : 'TN1' , delOps : "Van Delivery, Collect from Tunbridge Wells"} , 
                  { postcode : 'TN2' , delOps : "Van Delivery, Collect from Tunbridge Wells"} ,
                  { postcode : 'TN10' , delOps : "Van Delivery"} ,
                  { postcode : 'TN13' , delOps : "Delivery from Sevenoaks, Collect from Sevenoaks"} ,
                  { postcode : 'TN14' , delOps : "Delivery from Sevenoaks, Collect from Sevenoaks"} ,
                  { postcode : 'TN15' , delOps : "Collect from Sevenoaks"} ,
                  { postcode : 'ME' , delOps : "No Deliveries"} ,
                  { postcode : 'ME10' , delOps : "Collect from Kitchen"} ,
                  { postcode : 'ME10 3' , delOps : "Collect from Kitchen, Delivery from Sittingbourne"} ,
                  { postcode : 'IV' , delOps : "No Deliveries"} ,
                  { postcode : 'Others' , delOps : "Delivery by Courier"} ] ;
const apiUrl = "https://api.postcodes.io/" ; 
const postcode = "postcodes/" ;
const outcode = "outcodes/"
let rgx = /[a-z]?[a-z]?/gi ;
const button = document.getElementById('submit');
button.onclick =  async function getData() {
    const userInput = document.getElementById("postcode").value ;
    //convert user input to string      
    let userPC = userInput.toString().replace(/\s/g, "") ; 
    let reqUrl  ; 
    let byPC = false ; 
    //check if the length of postcode is valid ;
    if( userPC.length <= 1 || userPC.length > 8 ) {
        console.log("Invalid PostCode");
        return ; 
    }
    //cheking if it's an outcode 
    else if ( userPC.length <= 4) { 
        reqUrl = apiUrl + outcode + userPC ; 
    } 
    else {
        reqUrl = apiUrl + postcode + userPC ;
        byPC = true ;  
    }
    const request = await fetch(reqUrl) ; 
    const response = await request.json() ;
    if ( byPC && response.status === 200) {
        userPC = response.result.postcode ; 
    }
    //check if the postcode exist 
    if ( response.status === 200 ) {
        let results = [] ;    
        for (i in dataSet){
            let re = new RegExp( dataSet[i].postcode , "gi" )
            let expresion = new RegExp ( re.source + rgx.source ) ;
            const found = userPC.match(expresion) ; 
            if (found) {
                results.push(found[0]) ; 
            }
        }
        let option = "" ; 
        if ( results.length > 0) {        
            for( i in results ) {
                if ( results[i].length > option.length) {
                    option = results[i] ; 
                }
            }
            option = dataSet.find( element => element.postcode === option) ; 
            option = option.delOps ;
           document.getElementById('option').style.display = 'block' ;
           document.getElementById('deliveryOptions').innerHTML = option
        }
        else {
            option = dataSet[dataSet.length - 1].delOps ; 
            document.getElementById('invalid').style.display = 'none' ;
            document.getElementById('option').style.display = 'block' ;
            document.getElementById('deliveryOptions').innerHTML = option
        }
    }
    else if (response.status === 404) { 
        document.getElementById('option').style.display = 'none' ;
        document.getElementById('invalid').style.display = 'block' ;
    }
} 