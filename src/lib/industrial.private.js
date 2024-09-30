
module.exports ={
    plugin:plugin
} 
    

function plugin() {

    return function(files, metalsmith) {
        for (var file in files) {
            if(files[file].private){
                delete files[file];
            }
            
        }
    };
}
