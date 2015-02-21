
$(document).ready(function(){

  // This variable defines the active feed
  var activeUser = 'general';



  // Captures the click handler's value and define which feed will be displayed 
  function routerFeed(chosenFeed) {
   
    // Define the variables and creates the fragment object;
    var feed,
        result = document.createDocumentFragment();

    // Define which feed will be displayed    
    chosenFeed === 'general' ? 
                                feed = streams.home : 
                                                      feed = streams.users[chosenFeed];
    
    // If the feed is undefined it creates an empty array;
    if (feed === undefined) feed = [];

    // Clean the Feed HTML
    $('#feedTweets').html('');
    
    // Verify if the feed is not empty
    if (feed.length > 0) {       
      
      // Interact over the feed and create the tweet sets
      for (var i = feed.length -1; i >= 0; i--) {
        
        // create the main block div
        var tweet = genElement('div', null, 'class', 'clearfix tweetBlock');
        
        // call the function createTweet and it returns an complete tweet block with it's 
        // attributes already setted
        tweet.appendChild(createTweet(feed[i]['user'], feed[i]['message'], feed[i]['createdAt']));
        
        // append the tweet set into the Fragment
        result.appendChild(tweet);
      }
    }

    // append the tweet's set into the DOM once.
    $('#feedTweets').append(result);
    
    // Update the click handlers to handle the new DOM elements
    updateEventHandlers(); 
  }

  
  // Updates the event handlers
  function updateEventHandlers(){
    
    /* ========== Event Handler ============
    ======================================*/

    $('.anchor, .profile.name, #logo').on('click', function(e){
      e.preventDefault();
      e.stopImmediatePropagation();
      
      activeUser = $(this).data('feed');
      console.log(activeUser);
      routerFeed(activeUser);
    });        

    /* ======================================*/
  }
  
  // Creates the tweet element block
  function createTweet(user, message, createdAt){

    var momTime = moment(createdAt).fromNow();

    var avatar = genTweetAvatar(user),
        nameParent = genElement('span', null, 'class', 'tweet name'),
        nameChild1 = genElement('a', user, 'href', '#', 'class', 'anchor', 'data-feed', user),
        contact = genElement('span', '@' + user + ' - ', 'class', 'tweet contact'),
        time = genElement('span', momTime, 'class', 'tweet time'),
        lineBreak = genElement('br'),
        message = genElement('span', message, 'class', 'tweet message');
    
    // Insert the name's child element into the name element
    nameParent.appendChild(nameChild1);
    
    var fragment = document.createDocumentFragment();
    // Append the element's into a frament to interact with the DOM once.
    fragment.appendChild(avatar);
    fragment.appendChild(nameParent);
    fragment.appendChild(contact);
    fragment.appendChild(time);
    fragment.appendChild(lineBreak);
    fragment.appendChild(message);
    
    return fragment;
  }

  // Define the feed's update time
  var scheduleFeedUpdate = function(){
    routerFeed(activeUser);
    setTimeout(scheduleFeedUpdate, Math.random() * 2000);
  }
        
  // generate random tweets on a random schedule
  var generateNewTweet = function(user, message){
    if (!streams.users[user]) streams.users[user] = [];
    var tweet = {};
    tweet.user = user;
    tweet.message = message;
    tweet.created_at = new Date();
    streams.users[user].push(tweet);
    streams.home.push(tweet);
  };

  // This function returns the tweet's avatar picture;
  function genTweetAvatar(user){        
    
    var result,
        avatarString,
        parser,
        doc,
        defaultPhotoLink = 'http://lorempixel.com/50/50/people/',
        personalPhotolink = 'profile-pic.jpg';
    
    switch(user){
      case 'shawndrost': result = defaultPhotoLink + 1; break;
      case 'sharksforcheap': result = defaultPhotoLink + 2; break;
      case 'mracus': result = defaultPhotoLink + 3; break;
      case 'douglascalhoun': result = defaultPhotoLink + 4; break;
      case 'elviocb': result = personalPhotolink; break;
      default: console.log('something is wrong: user not found');
    }

    avatarString = "<img src=" + result + " class='avatar'> ";

    //create new DOM Parser
    parser = new DOMParser();
    //Convert the string in HTML using the DOM parser
    doc = parser.parseFromString(avatarString, "text/html");
    // Filter the element
    result = doc.getElementsByTagName("img")[0];
    
    return result;
  }

  // This function creates tag elements with unlimited attributes
  function genElement(elemName, text) {        
    //Define the variables
    var element, text = text || '';

    // Checks if the user passed the element's argument, 
    // otherwise the function returns false;
    if(elemName) {
      
      //Create the element
      element = document.createElement(elemName);

      // Create the element's text
      if (text) element.innerHTML = String(text);

      // Set the element's attributes
      for (var i = 2; i < arguments.length; i+=2) {         
        if (arguments[i] && arguments[i+1]) 
          element.setAttribute(arguments[i], arguments[i+1]);           
      }
      return element;
    }
    return false;
  }

  // Create New tweets on the timeline
  $('.newTweet > input').keypress(function(e){
    if(e.charCode === 13) {
      generateNewTweet("elviocb", e.target.value);
      // Clean the input value; 
      e.target.value = "";
    }

  })

  // The init of the app
  var init = function(){
    // Render the actual feed
    scheduleFeedUpdate();
    // Update the event handlers
    updateEventHandlers();
  }();
  // End Script
});