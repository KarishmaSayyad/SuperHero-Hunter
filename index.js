//initialization
const url = 'https://superheroapi.com/api.php/2928355607286861';
const search_bx=document.getElementById('search_box');
const searchResults = document.getElementById("searchResults");

//array for fav
var fav_btn=[];

eventListernerFunction();

//function for search using keyup event
function eventListernerFunction(){
    search_bx.addEventListener("keyup",searchFunction);
    console.log("key");
}


//funtion for search given data in search box
async function searchFunction(e){

  searchResults.style.textStyle=`display: inline-block;
  margin-left: 55%;
}`;

    let name=e.target.value.trim();
    // console.log(name.length);

    //check its enter key and  string

    if(e.keyCode == 13 && name.length > 0){
        // console.log(name);
        searchNameFunction(name);
    }
    if(name.length==0){ 
        await clearResults();
    }
    else
    {
        // console.log("url",url+"  name ", name);

           // fetch results
        let data = await fetchAsync(`${url}/search/${name}`);
        if(data && data.response === 'success'){

            searchResults.innerHTML = "";
            let favs = getFavs();

         // create a list of elements for search results and add event listeners
          for(let i = 0; i < data.results.length; i++){

            //create div for search-item
              let item = document.createElement('div');
              item.className = "search-item";                
              
              item.setAttribute('id', `${data.results[i].id}`);

              let label = document.createElement('div');
              label.innerHTML = data.results[i].name;
              label.addEventListener('click', viewHeroPage);
              item.appendChild(label);

              let option = document.createElement('div');
                  
              //add and remove inner text of fav 
                if(favs.includes(data.results[i].id)){
                    option.innerHTML = "Remove from favourites";
                    option.addEventListener('click', removeFromFavourites);  
                }
                else{
                    option.innerHTML = "Add to favourites";
                    option.addEventListener('click', addToFavourites);  
                }
                item.appendChild(option);
                searchResults.appendChild(item);
            }
        }
        else
        {
          await clearResults();
        }
    }
}

//async function for search hero and call api
async function searchNameFunction(name){
    // console.log("searchNameFunction : ",name + search_box);

    let data=await fetchAsync(`${url}/search/${name}`);
 
    if(data.response === 'success'){
        console.log(data);

        //set path
        let path=`${window.location.pathname} + /../superhero.html#id=${data.results[0].id}`;
        window.open(path);
    }
}

// fetch results from API
async function fetchAsync (url) {
    try{
      let response = await fetch(url);
      let data = await response.json();
      return data;  
    }catch(err){
      await clearResults();
    }
  }
  
  // clear search results
  async function clearResults(){
    let i = searchResults.childNodes.length;
    while(i--){
        searchResults.removeChild(searchResults.lastChild);
    }
  }

  
// redirect to a super hero page on same tab
async function viewHeroPage(e){
    let path = `${window.location.pathname} + /../superhero.html#id=${e.target.parentElement.id}`;
   // window.open(path);
   window.location.replace(path);
  }
  
  // add a hero to favourites
  async function addToFavourites(e){
    let id = e.target.parentElement.id;
    let favs = getFavs();

    if(!favs.includes(id)){
      //push into fav array
      favs.push(id);
    }

    //remove from fav and add to fav text
    localStorage.setItem('favHeros', JSON.stringify(favs));
    e.target.innerHTML = 'Remove from favourites';
    e.target.removeEventListener('click', addToFavourites);
    e.target.addEventListener('click', removeFromFavourites);
  }
  
  // remove a hero from favourites
  async function removeFromFavourites(e){
    let id = e.target.parentElement.id;
    let favs = getFavs();
  
    //update array
    let updatedFavs = favs.filter(function(val){
      return val != id;
    })

    localStorage.setItem('favHeros', JSON.stringify(updatedFavs));
    e.target.innerHTML = 'Add to favourites';

    //replace text Add to fav or remove from fav
    e.target.removeEventListener('click', removeFromFavourites);
    e.target.addEventListener('click', addToFavourites);
  }
  
  // retrieve a list of favourite hero id's from local storage
  function getFavs(){
    let favs;
    if(localStorage.getItem('favHeros') === null){
          favs = [];
    }
    else{
        favs = JSON.parse(localStorage.getItem('favHeros'));
    }
    return favs; 
  }
  