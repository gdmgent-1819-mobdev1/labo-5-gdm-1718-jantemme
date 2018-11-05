  function signup(e) {
    e.preventDefault();
  
    let email = document.getElementById("signup_email").value;
    let password = document.getElementById("signup_password").value;
  
    firebase.auth().createUserWithEmailAndPassword(email, password)
       .then(function (response) {
       document.getElementById("login_email").value = "";
       document.getElementById("login_password").value = "";
       sendNotification('Thanks for signing up to our website! Check your e-mail for account verification!');
       sendVerificationEmail(response.user);
    })
      .catch(function (error) {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
  
      console.log(errorCode, errorMessage);
      document.getElementById('signup_error').innerHTML = errorCode + " - " + errorMessage;
    });
  }

  function showPost(post) {
    let elem = document.createElement('div');
    elem.className = 'blogpost';
    elem.innerHTML = "<h2 class=\"title\">" + post.title + "</h2>" + "<p>Published on " + post.publishedOn + " by " + post.user + "</p> <hr>" + post.content + "<button> Bewerk </button>"
  
    document.getElementById("blogposts").appendChild(elem);
  }

  function loggedIn(){
      document.getElementById('posts').style.display = "inline-block";
      document.getElementById('editor').style.display = "inline-block";
      document.getElementById('blogposts').style.display = "inline-block";
      document.getElementById('posts').innerHTML = '<div class="welcome"><p>Welkom '+ firebase.auth().currentUser.email + '</p> <button id="btn_logout" >Log out</button></div>';
      document.getElementById('forms').style.display = "none";
      document.getElementById("btn_logout").addEventListener('click', logout, false);

      CKEDITOR.replace('editor1');
      document.getElementById('btn_publish').addEventListener('click', publishPost, false);
  }
      
    function publishPost(e) {
        e.preventDefault();
        if(document.getElementById('title').value != "")
        {
            let title = document.getElementById("title").value;
            let content = CKEDITOR.instances.editor1.getData();
            let datetime = new Date().toLocaleString();
            let user = firebase.auth().currentUser.email;
        
            firebase.database().ref('posts/').push({
            title: title,
            content: content,
            publishedOn: datetime,
            user: user
            });
            document.getElementById('title').style.borderColor = 'black';
            sendNotification('Bericht geplaatst!');
        }
        else
        document.getElementById('title').style.borderColor = 'red';
    }
  
  function login(e) {
    e.preventDefault();
  
    let email = document.getElementById("login_email").value;
    let password = document.getElementById("login_password").value;
  
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function (response) {
      sendNotification('You are now logged in successfully!');
      document.getElementById("login_email").value = "";
      document.getElementById("login_password").value = "";
      loggedIn();
    })
      .catch(function (error) {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
  
      console.log(errorCode, errorMessage);
      document.getElementById('login_error').innerHTML = errorCode + " - " + errorMessage;
    });
  }

  function logout(e){
    firebase.auth().signOut()
    .then(function() {
        document.getElementById('posts').style.display = "none";
        document.getElementById('editor').style.display = "none";
        document.getElementById('forms').style.display = "flex";

    })
    .catch(function(error) {
        let errorCode = error.code;
        let errorMessage = error.message;
  
        console.log(errorCode, errorMessage);
      });
  }
  
  function sendVerificationEmail(user) {
    user.sendEmailVerification()
      .then(function () {
      // Email sent.
    }).catch(function (error) {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
  
      console.log(errorCode, errorMessage);
    });
  }
  
  function sendNotification(msg) {
    let notif = new Notification(msg);
  }
  
  function requestNotificationPermission() {
    if (Notification && Notification.permission === 'default') {
      Notification.requestPermission(function (permission) {
        if (!('permission' in Notification)) {
          Notification.permission = permission;
        }
      });
    }
  }

requestNotificationPermission();
document.getElementById("btn_signup").addEventListener('click', signup, false);
document.getElementById("btn_login").addEventListener('click', login, false);

let blogpostRef = firebase.database().ref('posts/');
      blogpostRef.on('value', function (snapshot) {
      document.getElementById("blogposts").innerHTML = '';
      snapshot.forEach(function (data) {
      showPost(data.val());
      });
    });
