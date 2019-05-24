  #Usage: heroku app name as parameter, if no parameter given -> exit 
  #Call:   .\deploy2heroku.sh laakkti

  if [ "$1" == "" ];then
    echo "parameter missing"
    read -n 1 -p "Press any key to continue..."
    exit 1
  fi
  # poistetaan .git poista myös App Herokusta
  rm -rfv \.git
  git init
  git add -A
  git commit -m "ok"
  # POISTETAAN Herokusta App
  appName="$1"
  heroku apps:destroy $appName --confirm $appName
  heroku create $appName  
  heroku config:set MONGODB_URI=mongodb+srv://laakkti:Savonia19@cluster0-sqqvc.mongodb.net/data-app?retryWrites=true
  heroku config:set SECRET=kuopio
  git push heroku master
  heroku logs -t
  read -n 1 -p "Press any key to continue..."